import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";

import {
  Modal,
  Button,
  TextField,
  Checkbox,
} from "../../../../components/elements/index";

import PlusSignSignatureFlow from "../../../../assets/images/plus-sign-signatureflow.svg";
import DragIcon from "../../../../assets/images/DragIcon_SignatureFlow.png";
import DeleteIcon from "../../../../assets/images/Icon material-delete.svg";

import { showMessage } from "../../../../components/elements/snack_bar/utill";

// ─── Constants ───────────────────────────────────────────────────────────────

const EMPTY_FORM = { Name: "", EmailAddress: "", UserID: 0 };
const EMPTY_DROPDOWN = { value: 0, label: "", name: "" };

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * ParticipantsModal
 *
 * Props:
 *   show                  {boolean}   — controls modal visibility
 *   onHide                {function}  — called when the modal should close
 *   userList              {array}     — react-select option list from API
 *   signerData            {array}     — current list of signers
 *   setSignerData         {function}  — state setter for signerData
 *   orderCheckBox         {boolean}   — whether signing order is enforced
 *   setOrderCheckBox      {function}  — state setter for orderCheckBox
 *   onSave                {function}  — called after validation passes (Save btn)
 *   hasExistingParticipants {boolean} — drives Cancel vs Close label
 *   setNotification       {function}  — snack-bar notification setter
 */
const ParticipantsModal = ({
  show,
  onHide,
  userList,
  signerData,
  setSignerData,
  orderCheckBox,
  setOrderCheckBox,
  onSave,
  hasExistingParticipants,
  setNotification,
}) => {
  const { t } = useTranslation();

  const [signerForm, setSignerForm] = useState(EMPTY_FORM);
  const [signerDropdown, setSignerDropdown] = useState(EMPTY_DROPDOWN);

  // ── Internal helpers ──────────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    setSignerForm(EMPTY_FORM);
    setSignerDropdown(EMPTY_DROPDOWN);
  }, []);

  /** Filter react-select options by the user's name (case-insensitive). */
  const filterFunc = useCallback(
    (option, searchText) =>
      option.data.name.toLowerCase().includes(searchText.toLowerCase()),
    [],
  );

  // ── Event handlers ────────────────────────────────────────────────────────

  const handleDropdownChange = useCallback((val) => {
    setSignerDropdown(val);
    setSignerForm({
      Name: val.name,
      EmailAddress: val.email,
      UserID: val.value,
    });
  }, []);

  const handleAddSigner = useCallback(() => {
    const { EmailAddress, Name, UserID } = signerForm;
    if (!EmailAddress || !Name) return;

    const alreadyExists = signerData.some(
      (d) => d.EmailAddress.toLowerCase() === EmailAddress.toLowerCase(),
    );

    if (alreadyExists) {
      showMessage(t("User-already-is-in-list"), "error", setNotification);
    } else {
      setSignerData((prev) => [...prev, { Name, EmailAddress, userID: UserID }]);
    }

    resetForm();
  }, [signerForm, signerData, t, setNotification, setSignerData, resetForm]);

  const handleRemoveSigner = useCallback(
    (index) => setSignerData((prev) => prev.filter((_, i) => i !== index)),
    [setSignerData],
  );

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;
      setSignerData((prev) => {
        const items = [...prev];
        const [moved] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, moved);
        return items;
      });
    },
    [setSignerData],
  );

  const handleSave = useCallback(() => {
    if (!signerData.length) {
      showMessage(
        t("Atleast-one-signatory-is-required"),
        "error",
        setNotification,
      );
      return;
    }
    resetForm();
    onSave();
  }, [signerData.length, t, setNotification, resetForm, onSave]);

  const handleClose = useCallback(() => {
    resetForm();
    onHide();
  }, [resetForm, onHide]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Modal
      show={show}
      onHide={handleClose}
      setShow={() => {}}
      centered
      closeButton
      size="md"
      modalFooterClassName="d-block"
      modalBodyClassName="Signers_modal_body"
      modalHeaderClassName="Signers_modal_header"
      ModalBody={
        <Row className="mb-1">
          {/* Title */}
          <Col lg={12}>
            <span className="Signers_heading">{t("Signers")}</span>
          </Col>

          {/* Subtitle */}
          <Col lg={12} className="mt-4 mb-3">
            <span className="Signers_tagLine">
              {t("Add-the-people-who-need-to-sign-this-document")}
            </span>
          </Col>

          <Col lg={12}>
            {/* ── Add new signer row ── */}
            <Row>
              <Col sm={6}>
                <p className="pb-1 m-0 inputlabel_style">{t("Name")}</p>
                <Select
                  placeholder={t("Name")}
                  onChange={handleDropdownChange}
                  options={userList}
                  filterOption={filterFunc}
                  value={signerDropdown.value !== 0 ? signerDropdown : null}
                />
              </Col>
              <Col sm={6}>
                <TextField
                  width="100%"
                  name="EmailAddress"
                  type="email"
                  disable
                  labelclass="inputlabel_style"
                  applyClass="signatureflow_input"
                  placeholder={t("Email")}
                  value={signerForm.EmailAddress}
                  label="Email"
                />
              </Col>
            </Row>

            {/* ── Draggable signer list ── */}
            <Row className="d-flex align-items-center">
              <Col sm={12} className="signersList">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="signers">
                    {(provided) => (
                      <Row
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {signerData.map((signer, index) => (
                          <Draggable
                            key={index}
                            draggableId={String(index)}
                            index={index}
                          >
                            {(prov) => (
                              <>
                                {/* Drag handle */}
                                <Col
                                  sm={1}
                                  className="my-1 d-flex align-items-end mb-2"
                                >
                                  <img
                                    alt="drag"
                                    src={DragIcon}
                                    width={20}
                                    ref={prov.innerRef}
                                    {...prov.draggableProps}
                                    {...prov.dragHandleProps}
                                  />
                                </Col>

                                {/* Name + Email fields */}
                                <Col sm={10} className="my-1">
                                  <Row>
                                    <Col sm={6}>
                                      <TextField
                                        width="100%"
                                        name="Name"
                                        type="text"
                                        disable
                                        labelclass="inputlabel_style"
                                        applyClass="signatureflow_input"
                                        placeholder={t("Name")}
                                        value={signer.Name}
                                        label="Name"
                                      />
                                    </Col>
                                    <Col sm={6}>
                                      <TextField
                                        width="100%"
                                        name="EmailAddress"
                                        type="email"
                                        disable
                                        labelclass="inputlabel_style"
                                        applyClass="signatureflow_input"
                                        placeholder={t("Email")}
                                        value={signer.EmailAddress}
                                        label="Email"
                                      />
                                    </Col>
                                  </Row>
                                </Col>

                                {/* Delete button */}
                                <Col
                                  sm={1}
                                  className="my-1 d-flex align-items-end mb-3"
                                >
                                  <img
                                    alt="delete"
                                    src={DeleteIcon}
                                    className="cursor-pointer"
                                    width={20}
                                    onClick={() => handleRemoveSigner(index)}
                                  />
                                </Col>
                              </>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Row>
                    )}
                  </Droppable>
                </DragDropContext>
              </Col>
            </Row>

            {/* ── Add another signer button ── */}
            <Col lg={12}>
              <Button
                className="addOther_field"
                text={t("Add-another-signer")}
                onClick={handleAddSigner}
                icon={<img src={PlusSignSignatureFlow} alt="" />}
              />
            </Col>
          </Col>
        </Row>
      }
      ModalFooter={
        <Row>
          {/* Set signing order checkbox */}
          <Col sm={6} className="d-flex justify-content-start px-0">
            <Checkbox
              label2={t("Set-signer-order")}
              checked={orderCheckBox}
              onChange={(e) => setOrderCheckBox(e.target.checked)}
              classNameDiv="d-flex gap-2"
            />
          </Col>

          {/* Cancel / Save */}
          <Col sm={6} className="d-flex justify-content-end gap-2 px-0">
            <Button
              className="CancelBtn"
              text={hasExistingParticipants ? t("Cancel") : t("Close")}
              onClick={handleClose}
            />
            <Button className="Add" text={t("Save")} onClick={handleSave} />
          </Col>
        </Row>
      }
    />
  );
};

export default ParticipantsModal;
