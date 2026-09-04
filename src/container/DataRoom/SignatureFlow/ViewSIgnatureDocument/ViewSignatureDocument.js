import React, { useRef, useEffect, useState } from "react";
import WebViewer from "@pdftron/webviewer";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ClearMessageAnnotations } from "../../../../store/actions/webVieverApi_actions";
import { useTranslation } from "react-i18next";
import { Notification } from "../../../../components/elements/index";
import {
  declineReasonApi,
  getWorkFlowByWorkFlowIdwApi,
  clearSignatureViewerData,
} from "../../../../store/actions/workflow_actions";
import DeclineReasonModal from "../SignatureModals/DeclineReasonModal/DeclineReasonModal";
import DeclineReasonCloseModal from "../SignatureModals/DeclineReasonCloseModal/DeclineReasonCloseModal";
import {
  deriveHiddenUsers,
  handleBlobFiles,
  hideFreetextElements,
  processXmlForReadOnly,
  processXmlToHideFields,
  readOnlyFreetextElements,
} from "../pendingSignature/pendingSIgnatureFunctions";
import useSnackbar from "../../../../components/elements/snack_bar/useSnackbar";
import { useApryseDocument } from "../../../../context/DocumentContext";

/**
 * Async: strip only <apref> elements whose referenced PDF object does NOT exist
 * in the document's XRef table.
 *
 * When <apref> nodes reference PDF objects that have been removed or were never
 * embedded (e.g. after server-side re-processing), Apryse logs:
 *   "Error in Promise.all for appearanceReference N on page M"
 *   {type: 'PDFWorkerError', message: '…Can not find any annotation…'}
 * followed by a cascade TypeError (reading 'children').
 *
 * Valid appearance references are preserved (they resolve successfully against
 * the XRef table). That matters here: this screen now renders every signer's
 * filled fields, and an <apref> is the only thing a signed Sig widget has to
 * draw itself with — so stripping one blanks a signature.
 *
 * @param {string} xfdfStr - processed XFDF string
 * @param {object} pdfDoc  - Apryse PDFDoc (requires fullAPI: true)
 * @returns {Promise<string>}
 */
const stripInvalidAppearanceRefs = async (xfdfStr, pdfDoc) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xfdfStr, "text/xml");
    const aprefs = Array.from(doc.querySelectorAll("apref"));

    if (!aprefs.length) return xfdfStr;

    if (pdfDoc) {
      for (const apref of aprefs) {
        const objnum = parseInt(apref.getAttribute("objnum") ?? "0", 10);

        // PDF object 0 is the null/free object — never a valid appearance stream
        if (objnum === 0) {
          apref.remove();
          continue;
        }

        try {
          const obj = await pdfDoc.getXRefTableEntry(objnum);
          const missing =
            !obj || (typeof obj.isNull === "function" && (await obj.isNull()));
          if (missing) apref.remove();
        } catch {
          // Object unreachable — strip defensively
          apref.remove();
        }
      }
    } else {
      // No pdfDoc available — strip <apref> from non-Sig widgets only.
      // Stripping all of them (the previous fallback) was safe while Sig
      // widgets were being removed from the XFDF entirely; now that they are
      // shown, it would blank every signature on this screen. Apryse can
      // regenerate text/checkbox/radio appearances from their field values,
      // so dropping theirs costs nothing.
      const sigFieldNames = new Set(
        Array.from(doc.querySelectorAll('ffield[type="Sig"]'))
          .map((f) => f.getAttribute("name"))
          .filter(Boolean),
      );
      doc.querySelectorAll("widget").forEach((widget) => {
        if (!sigFieldNames.has(widget.getAttribute("field"))) {
          widget.querySelectorAll("apref").forEach((node) => node.remove());
        }
      });
    }

    return new XMLSerializer().serializeToString(doc);
  } catch {
    return xfdfStr; // parsing failed — return original unchanged
  }
};

const getCurrentUserID = () =>
  localStorage.getItem("userID") !== null
    ? Number(localStorage.getItem("userID"))
    : 0;

const ViewSignatureDocument = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { SignedDocumentViewer } = useApryseDocument();
  const { t, i18n } = useTranslation();
  const { webViewer } = useSelector((state) => state);
  const {
    getAllFieldsByWorkflowID,
    getWorkfFlowByFileId,
    getSignatureFileAnnotationResponse,
    ResponseMessage,
  } = useSelector((state) => state.SignatureWorkFlowReducer);

  console.log(
    getAllFieldsByWorkflowID,
    getWorkfFlowByFileId,
    getSignatureFileAnnotationResponse,
    "getSignatureFileAnnotationResponse",
  );

  // Parse the URL parameters to get the data
  const docWorkflowID = new URLSearchParams(location.search).get("documentID");
  const viewer = useRef(null);
  // Guards against a second WebViewer instance being created if
  // attachmentBlob changes again after the first bootstrap.
  const viewerInitialized = useRef(false);
  const [signerData, setSignerData] = useState([]);
  const [FieldsData, setFieldsData] = useState([]);
  const [reasonModal, setReasonModal] = useState(false);
  const [declineConfirmationModal, setDeclineConfirmationModal] =
    useState(false);
  const [declineReasonMessage, setDeclineReasonMessage] = useState("");
  const [declineErrorMessage, setDeclineErrorMessage] = useState(false);

  const [show, SnackBar] = useSnackbar();
  const [pdfResponceData, setPdfResponceData] = useState({
    xfdfData: "",
    attachmentBlob: "",
    removedAnnotations: "",
    workFlowID: 0,
    documentID: 0,
    title: "",
    description: "",
    creationDateTime: "",
    isDeadline: "",
    deadlineDatetime: "",
    creatorID: "",
    isCreator: 0,
  });

  const [userAnnotationsCopy, setUserAnnotationsCopy] = useState([]);
  const [userAnnotations, setUserAnnotations] = useState([]);
  const [hiddenUsers, setHiddenUsers] = useState([]);
  const [Instance, setInstance] = useState(null);
  const [readOnlyUsers, setReadOnlyUsers] = useState([]);

  const userAnnotationsCopyData = useRef(userAnnotationsCopy);
  const signerDataRef = useRef(signerData);
  const userAnnotationsRef = useRef(userAnnotations);
  const pdfResponceDataRef = useRef(pdfResponceData.xfdfData);
  const hiddenUsersRef = useRef(hiddenUsers);
  const readOnlyUsersRef = useRef(readOnlyUsers);
  /**
   * Field names belonging to signers whose turn has not come. Read by the
   * documentLoaded handler, which has to hide the widgets the PDF supplies
   * regardless of what was stripped from the XFDF.
   */
  const hiddenFieldNamesRef = useRef(new Set());

  // ===== this use for current state update get =====//

  useEffect(() => {
    userAnnotationsCopyData.current = userAnnotationsCopy;
  }, [userAnnotationsCopy]);

  useEffect(() => {
    readOnlyUsersRef.current = readOnlyUsers;
  }, [readOnlyUsers]);
  useEffect(() => {
    hiddenUsersRef.current = hiddenUsers;
  }, [hiddenUsers]);
  useEffect(() => {
    userAnnotationsRef.current = userAnnotations;
  }, [userAnnotations]);

  useEffect(() => {
    pdfResponceDataRef.current = pdfResponceData.xfdfData;
  }, [pdfResponceData]);

  useEffect(() => {
    signerDataRef.current = signerData;
  }, [signerData]);

  // === End === //

  // ── Suppress Apryse internal appearance-stream crash ──────────────────────
  // Apryse's appearance-loading runs in an un-caught internal Promise; when an
  // <apref> object is missing from the PDF it rejects with a TypeError reading
  // 'children'.  The rejection is unhandled inside webviewer-core.min.js —
  // our try/catch around importAnnotations never sees it.  This handler
  // silences only that specific internal rejection; all other unhandled
  // rejections are left untouched.
  useEffect(() => {
    const suppressApryseChildrenError = (event) => {
      const reason = event?.reason;
      if (
        reason instanceof TypeError &&
        typeof reason.message === "string" &&
        reason.message.includes("children") &&
        typeof reason.stack === "string" &&
        reason.stack.includes("webviewer-core.min.js")
      ) {
        event.preventDefault();
      }
    };
    window.addEventListener("unhandledrejection", suppressApryseChildrenError);
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        suppressApryseChildrenError,
      );
    };
  }, []);

  // === Api calling === //
  async function apiCall(Data) {
    await dispatch(getWorkFlowByWorkFlowIdwApi(Data, navigate, t, 1));
  }

  useEffect(() => {
    const fetchData = async () => {
      if (docWorkflowID !== null && docWorkflowID !== undefined) {
        let Data = {
          FileID: Number(docWorkflowID),
        };
        apiCall(Data);
      }
    };

    fetchData();
  }, []);
  // === End === //

  // === checker for null array === //
  function containsNull(arr) {
    return arr.some((element) => element === null);
  }
  // === End === //

  // === this is responce of GetAllFieldsByWorkFlowID ===//
  useEffect(() => {
    if (getAllFieldsByWorkflowID !== null) {
      try {
        let newFieldsData = [];
        let AllUserIDs = [];
        let revertedData;
        if (
          getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails.bundleDetails
            .length > 0
        ) {
          getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails.bundleDetails.forEach(
            (fieldsData) => {
              AllUserIDs.push(fieldsData.userID);
              newFieldsData.push({
                pK_WorkFlowActionableBundle_ID:
                  fieldsData.pK_WorkFlowActionableBundle_ID,
                titles: fieldsData.titles,
                bundleDeadline: fieldsData.bundleDeadline,
                fK_ActionAbleBundleStatusState:
                  fieldsData.fK_ActionAbleBundleStatusState,
                bundleAssignedDate: fieldsData.bundleAssignedDate,
                bundleDependenceID: fieldsData.bundleDependenceID,
                actor_ID: fieldsData.actor_ID,
                userID: fieldsData.userID,
                actorName: fieldsData.actorName,
                actorDesignation: fieldsData.actorDesignation,
                actorEmail: fieldsData.actorEmail,
                actorColor: fieldsData.actorColor,
              });
            },
          );
          // Signers whose turn has not come. This screen is view-only, but the
          // ordering rule still applies to what may be SEEN: a signer may look
          // at their own and earlier signers' fields, never at a later one's.
          // Hardcoding [] here meant every signer's fields were shown to
          // everybody. Derived from the bundle dependency graph — see
          // deriveHiddenUsers.
          setHiddenUsers(
            deriveHiddenUsers(
              getWorkfFlowByFileId?.workFlow?.bundleModels ?? [],
              getCurrentUserID(),
            ),
          );
          setReadOnlyUsers(AllUserIDs);
          function revert(data) {
            return data.map((item) => {
              const xmlField = item.xmlField
                ? item.xmlField.split("_#_").map((str) => {
                    try {
                      return JSON.parse(str);
                    } catch (error) {
                      return null; // or handle the error as needed
                    }
                  })
                : [];
              return {
                actorID: item.actorID,
                userID: item.userID,
                actorColor: item.actorColor,
                xml: xmlField,
              };
            });
          }
          // this is using if we are getting null value for anotations
          if (
            containsNull(
              getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails
                .listOfFields,
            )
          ) {
            let bundleModels = getWorkfFlowByFileId.workFlow.bundleModels;

            if (bundleModels?.length > 0) {
              let listOfUsers = [];
              bundleModels.forEach((users, index) => {
                users.actors.forEach((usersData, index) => {
                  listOfUsers.push({
                    actorID: usersData.fK_WorkFlowActor_ID,
                    userID: usersData.pK_UID,
                    actorColor: usersData.actorColor,
                    xml: [],
                  });
                });
              });
              setUserAnnotations(listOfUsers);
            }
          } else {
            revertedData = revert(
              getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails
                .listOfFields,
            );
            setUserAnnotations(revertedData);
            setUserAnnotationsCopy(revertedData);
          }
          setFieldsData(newFieldsData);
        }
      } catch {}
    }
  }, [getAllFieldsByWorkflowID]);
  // === End === //

  // === Get Workflow by FileID Api responce Update Also trigger when FieldsDatavalues update its contain color of users===//
  useEffect(() => {
    if (getWorkfFlowByFileId !== null && getWorkfFlowByFileId !== undefined) {
      try {
        let bundleModels = getWorkfFlowByFileId.workFlow.bundleModels;
        if (bundleModels?.length > 0) {
          let listOfUsers = [];
          let signersData = [];
          bundleModels.forEach((users, index) => {
            users.actors.forEach((usersData, index) => {
              listOfUsers.push({
                name: usersData.name,
                pk_UID: usersData.pK_UID,
              });
              signersData.push({
                Name: usersData.name,
                EmailAddress: usersData.emailAddress,
                userID: usersData.pK_UID,
              });
            });
          });
          setSignerData(signersData);
          // this is using if we are getting null value for anotations
          if (
            getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails.bundleDetails
              .length > 0
          ) {
            if (
              containsNull(
                getAllFieldsByWorkflowID.signatureWorkFlowFieldDetails
                  .listOfFields,
              )
            ) {
              let bundleModels = getWorkfFlowByFileId.workFlow.bundleModels;

              if (bundleModels?.length > 0) {
                let listOfUsers = [];
                bundleModels.forEach((users, index) => {
                  users.actors.forEach((usersData, index) => {
                    listOfUsers.push({
                      actorID: usersData.fK_WorkFlowActor_ID,
                      userID: usersData.pK_UID,
                      actorColor: usersData.actorColor,
                      xml: [],
                    });
                  });
                });
                setUserAnnotations(listOfUsers);
              }
            }
          }
        } else {
          // setOpenAddParticipentModal(true);
        }

        setPdfResponceData((prevData) => ({
          ...prevData,
          // xfdfData: "",
          // attachmentBlob: webViewer.attachmentBlob,
          removedAnnotations: "",
          workFlowID: getWorkfFlowByFileId?.workFlow?.workFlow.pK_WorkFlow_ID,
          documentID: Number(docWorkflowID),
          title: getWorkfFlowByFileId?.workFlow?.workFlow.title,
          description: getWorkfFlowByFileId?.workFlow?.workFlow.description,
          creationDateTime:
            getWorkfFlowByFileId?.workFlow?.workFlow.creationDateTime,
          isDeadline: getWorkfFlowByFileId?.workFlow?.workFlow.isDeadline,
          deadlineDatetime:
            getWorkfFlowByFileId?.workFlow?.workFlow.deadlineDatetime,
          creatorID: getWorkfFlowByFileId?.workFlow?.workFlow.creatorID,
          isCreator: getWorkfFlowByFileId?.workFlow?.workFlow.isCreator,
        }));
      } catch (error) {}
    }
  }, [getWorkfFlowByFileId, FieldsData]);
  // === End === //

  // === Get  the file details by Id from API and Set it === //

  // Process the XFDF for VIEW ONLY: show everything, edit nothing.
  //
  // This screen used to run processXmlToHideFields over EVERY field name, which
  // physically removes the <field>, <ffield> and <widget> elements from the
  // XFDF. That is why nothing showed up here: with no widgets left in the
  // imported XFDF, the signatures, typed text, checkboxes and radios that other
  // signers had actually filled in were never rendered — the screen showed a
  // bare PDF. The intent behind it was only to stop "Sign Here" placeholders
  // being clickable, which read-only flags achieve without deleting the data.
  //
  // Instead every ffield is flagged ReadOnly in the XFDF itself, so the widgets
  // are built read-only at import time rather than being retro-fitted after.
  // The runtime pass in documentLoaded still locks each annotation and field as
  // a second layer.
  useEffect(() => {
    try {
      if (
        getSignatureFileAnnotationResponse !== null &&
        getSignatureFileAnnotationResponse !== undefined
      ) {
        // Split every field name in the document into the ones this viewer may
        // see (their own and earlier signers') and the ones they may not (later
        // signers, in an ordered workflow).
        const visibleFieldNames = [];
        const hiddenFieldNames = [];
        userAnnotationsRef.current.forEach((obj) => {
          const isHidden = hiddenUsersRef.current.includes(obj.userID);
          obj.xml.forEach((item) => {
            const matches =
              item.ffield?.match(/<ffield[^>]*\sname="([^"]+)"/g) ?? [];
            matches.forEach((match) => {
              const name = match.match(/name="([^"]+)"/)?.[1];
              if (!name) return;
              (isHidden ? hiddenFieldNames : visibleFieldNames).push(name);
            });
          });
        });

        // STEP 1: flag the visible form fields ReadOnly (kept visible and filled).
        const readonlyXmlString = processXmlForReadOnly(
          getSignatureFileAnnotationResponse.annotationString,
          visibleFieldNames,
        );

        // STEP 2: strip later signers' fields out of the XFDF entirely.
        // Not sufficient on its own — the same widgets are baked into the stored
        // PDF, and Apryse's import only deletes document widgets that the
        // imported XFDF also contains, so one that is absent survives and renders
        // from the file. hiddenFieldNamesRef carries the names to the
        // documentLoaded pass, which finishes the job on the live annotations.
        const { updatedXmlString } = processXmlToHideFields(
          readonlyXmlString,
          hiddenFieldNames,
        );
        hiddenFieldNamesRef.current = new Set(hiddenFieldNames);

        // STEP 3: make the remaining freetext labels read-only (kept visible).
        const readonlyFreetextXmlString = readOnlyFreetextElements(
          updatedXmlString,
          readOnlyUsersRef.current,
        );

        // STEP 4: drop later signers' freetext labels.
        const { hideFreetextXmlString } = hideFreetextElements(
          readonlyFreetextXmlString,
          hiddenUsersRef.current,
        );

        setPdfResponceData((prevData) => ({
          ...prevData,
          xfdfData: hideFreetextXmlString,
          attachmentBlob: getSignatureFileAnnotationResponse.attachmentBlob,
        }));
      }
    } catch (error) {}
  }, [getSignatureFileAnnotationResponse]);
  // === End === //

  // ── Close button in the header ────────────────────────────────────────────
  //
  // Apryse's CustomButton/GroupedItems are plain JS UI objects created once,
  // not React — label/title text is whatever t() returned AT CREATION TIME
  // and never updates on its own. Extracted so it can be re-invoked whenever
  // the language changes, to actually refresh the button text.
  const renderCloseButton = (inst) => {
    const { UI } = inst;
    const closeButton = new UI.Components.CustomButton({
      dataElement: "closeTabButton",
      label: t("Close"),
      title: t("Close"),
      onClick: () => window.close(),
      style: {
        background: "#fff",
        border: "1px solid #e1e1e1",
        color: "#5a5a5a",
        padding: "8px 30px",
        borderRadius: "4px",
        outline: "none",
      },
    });

    const topHeader = UI.getModularHeader("default-top-header");
    const existingHeaderItems = topHeader
      .getItems()
      .filter(
        (item) => item.dataElement !== "viewSignatureDocumentActionButtons",
      );
    const closeButtonGroup = new UI.Components.GroupedItems({
      dataElement: "viewSignatureDocumentActionButtons",
      grow: 0,
      gap: 8,
      position: "end",
      alwaysVisible: true,
      items: [closeButton],
    });
    topHeader.setItems([...existingHeaderItems, closeButtonGroup]);
  };

  // Re-render the close button whenever the language changes, since
  // renderCloseButton only bakes in the current t() text at call time.
  useEffect(() => {
    if (!Instance) return;
    renderCloseButton(Instance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Instance, i18n.language]);

  // === It's triggered when we update the blob file in our local state ===
  useEffect(() => {
    if (pdfResponceData.attachmentBlob !== "" && !viewerInitialized.current) {
      viewerInitialized.current = true;
      WebViewer(
        {
          path: "/webviewer/lib",
          showLocalFilePicker: true,
          fullAPI: true,
          licenseKey: process.env.REACT_APP_APRYSEKEY, // sign up to get a free trial key at https://dev.apryse.com
        },
        viewer.current,
      ).then(async (instance) => {
        SignedDocumentViewer.current = instance;
        setInstance(instance);
        const UI = instance.UI;

        UI.loadDocument(handleBlobFiles(pdfResponceData.attachmentBlob), {
          filename: pdfResponceData.title,
        });

        const { documentViewer, annotationManager } = instance.Core;

        renderCloseButton(instance);

        // ── Hide all toolbar groups and UI panels ─────────────────────────
        UI.disableElements([
          "toolbarGroup-Annotate",
          "toolbarGroup-Shapes",
          "toolbarGroup-Edit",
          "toolbarGroup-Insert",
          "toolbarGroup-Forms",
          "toolbarGroup-FillAndSign",
          "toolbarGroup-Measure",
          "toolbarGroup-Redact",
          "toolbarGroup-View",
          "toolsOverlay",
          "menuButton",
          "leftPanelButton",
          "searchButton",
          "toggleNotesButton",
          "viewControlsButton",
          "viewControlsOverlay",
          "signaturePanelButton",
          "notesPanel",
          "outlinesPanelButton",
          "annotationPopup",
          "contextMenuPopup",
          "richTextPopup",
          "textPopup",
          "tools-header",
          "searchPanelToggle",
          "notesPanelToggle",
        ]);

        // ── Document loaded ───────────────────────────────────────────────
        documentViewer.addEventListener("documentLoaded", async () => {
          await documentViewer.getAnnotationsLoadedPromise();
          UI.setFitMode(UI.FitMode.FitWidth);

          if (pdfResponceDataRef.current && annotationManager) {
            try {
              // Validate each <apref> objnum against the PDF XRef table;
              // strip references to missing objects (they cause the
              // PDFWorkerError "Can not find any annotation") while keeping
              // any valid appearance references intact.
              const pdfDoc = await documentViewer.getDocument().getPDFDoc();
              const cleanedXFDF = await stripInvalidAppearanceRefs(
                pdfResponceDataRef.current,
                pdfDoc,
              );
              await annotationManager.importAnnotations(cleanedXFDF);

              // Lock every annotation object.
              //
              // NoRotate is deliberately NOT set, and the rest are set under
              // `isImporting`. NoRotate's setter calls Apryse's invalidate hook
              // in its destructive form (`delete this.appearances; delete
              // this.ye`), and `ye` is the only place a signature imported from
              // XFDF lives — so setting it here, right after importAnnotations,
              // blanked every signature on this read-only screen while text and
              // checkbox values (which render from <fields><value>) survived.
              // Locked + NoResize + NoMove already make the document inert.
              const hiddenFields = hiddenFieldNamesRef.current;
              const hiddenUserIDs = new Set(hiddenUsersRef.current);
              const currentUserID = getCurrentUserID();

              annotationManager.getAnnotationsList().forEach((annot) => {
                const wasImporting = !!annot.isImporting;
                annot.isImporting = true;
                try {
                  annot.Locked = true;
                  annot.ReadOnly = true;
                  annot.NoResize = true;
                  annot.NoMove = true;

                  // ── Later signers stay out of sight ─────────────────────
                  //
                  // Stripping their fields from the XFDF is not enough: the
                  // same widgets are baked into the stored PDF, and Apryse's
                  // import only deletes document widgets that the imported
                  // XFDF also contains — one that is absent is never looked
                  // up, so it survives and renders straight from the file.
                  // That is why a viewer could still see the next signer's
                  // fields on this screen.
                  try {
                    const field = annot.getField?.();
                    const fieldName = field?.name;
                    if (fieldName) {
                      if (hiddenFields.has(fieldName)) field.hide?.();
                    } else {
                      // Freetext label — owner is the id in its Subject.
                      const subject = annot.Subject ?? "";
                      const dash = subject.lastIndexOf("-");
                      const ownerID =
                        dash === -1 ? NaN : Number(subject.substring(dash + 1));
                      if (
                        Number.isFinite(ownerID) &&
                        ownerID !== currentUserID &&
                        hiddenUserIDs.has(ownerID)
                      ) {
                        annot.Hidden = true;
                        annot.NoView = true;
                      }
                    }
                  } catch {
                    /* one annotation failing must not stop the rest */
                  }
                } finally {
                  annot.isImporting = wasImporting;
                }
                annotationManager.updateAnnotation(annot);
              });

              // Lock every PDF form field (Sig / Tx / Btn / Ch)
              annotationManager.getFieldManager().forEachField((field) => {
                field.flags.set("ReadOnly", true);
              });
            } catch (error) {}
          }

          documentViewer.refreshAll();
          documentViewer.updateView();
        });
      });
    }
  }, [pdfResponceData.attachmentBlob]);

  // ─── Unmount teardown ──────────────────────────────────────────────────────
  //
  // Without this the screen left behind an undisposed WebViewer instance (a
  // large WASM heap plus its workers) and the previous document's Redux state,
  // which the next signature screen's `if (!x) return;` guards would accept
  // immediately as though it were its own data.
  useEffect(() => {
    return () => {
      try {
        SignedDocumentViewer.current?.UI?.dispose?.();
      } catch {
        /* disposal is best-effort */
      }
      SignedDocumentViewer.current = null;

      // Allow a remount to bootstrap a fresh viewer.
      viewerInitialized.current = false;

      dispatch(clearSignatureViewerData());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="documnetviewer">
        <div className="webviewer" ref={viewer}></div>
      </div>

      {SnackBar}
    </>
  );
};

export default ViewSignatureDocument;
