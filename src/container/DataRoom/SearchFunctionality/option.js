// options.js
import audioIcon from "../../../assets/images/audioICon.svg";
import ShareIcon from "../../../assets/images/ShareIcon.svg";
import sitesIcon from "../../../assets/images/sitesIcon.svg";
import documentIcon from "../../../assets/images/color document.svg";
import pdf from "../../../assets/images/color pdf.svg";
import video from "../../../assets/images/color video.svg";
import spreadsheet from "../../../assets/images/color spreadsheet.svg";
import forms from "../../../assets/images/color forms.svg";
import folderColor from "../../../assets/images/folder_color.svg";
import images from "../../../assets/images/Imagesandphotos.svg";
import PDFICON from "../../../assets/images/pdf_icon.svg";
import PowerPointIcon from "../../../assets/images/AttachmentIcons/ppt.svg";
import { Row } from "react-bootstrap";
import { Col } from "rsuite";
import styles from "../DataRoom.module.css";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";

export const OptionsDocument2 = (t) => [
  {
    value: 2,
    imgSrc: documentIcon,
    label: t("Document"),
  },
  {
    value: 3,
    imgSrc: spreadsheet,
    label: t("Spreadsheets"),
  },
  {
    value: 4,
    imgSrc: video,
    label: t("Presentaion"),
  },
  {
    value: 5,
    imgSrc: forms,
    label: t("Forms"),
  },
  {
    value: 6,
    imgSrc: images,
    label: t("Photos"),
  },
  {
    value: 7,
    imgSrc: pdf,
    label: t("PDFs"),
  },
  {
    value: 8,
    imgSrc: video,
    label: t("Videos"),
  },
  {
    value: 9,
    imgSrc: ShareIcon,
    label: t("Share"),
  },
  {
    value: 10,
    imgSrc: folderColor,
    label: t("Folder"),
  },
  {
    value: 11,
    imgSrc: sitesIcon,
    label: t("Sites"),
  },
  {
    value: 12,
    imgSrc: audioIcon,
    label: t("Audio"),
  },
];

export const OptionsDocument = (t) => [
  {
    value: 1,
    label: (
      <>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex align-items-center gap-2"
          >
            <img draggable="false" src={""} alt="" height="17px" width="17px" />
            <span className={styles["Option_Document_button"]}>{t("Any")}</span>
          </Col>
        </Row>
      </>
    ),
  },
  {
    value: 2,
    label: (
      <>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex align-items-center gap-2"
          >
            <img
              draggable="false"
              src={documentIcon}
              alt=""
              height="17px"
              width="17px"
            />
            <span className={styles["Option_Document_button"]}>
              {t("Document")}
            </span>
          </Col>
        </Row>
      </>
    ),
  },
  {
    value: 3,
    label: (
      <>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex align-items-center gap-2"
          >
            <img
              draggable="false"
              src={spreadsheet}
              alt=""
              height="17px"
              width="17px"
            />
            <span className={styles["Option_Document_button"]}>
              {t("Spreadsheets")}
            </span>
          </Col>
        </Row>
      </>
    ),
  },
  {
    value: 4,
    label: (
      <>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex align-items-center gap-2"
          >
            <img
              draggable="false"
              src={video}
              alt=""
              height="17px"
              width="17px"
            />
            <span className={styles["Option_Document_button"]}>
              {t("Presentaion")}
            </span>
          </Col>
        </Row>
      </>
    ),
  },
  {
    value: 5,
    label: (
      <>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex align-items-center gap-2"
          >
            <img
              draggable="false"
              src={forms}
              alt=""
              height="17px"
              width="17px"
            />
            <span className={styles["Option_Document_button"]}>
              {t("Forms")}
            </span>
          </Col>
        </Row>
      </>
    ),
  },
  {
    value: 6,
    label: (
      <>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex align-items-center gap-2"
          >
            <img
              draggable="false"
              src={images}
              alt=""
              height="17px"
              width="17px"
            />
            <span className={styles["Option_Document_button"]}>
              {t("Images")}
            </span>
          </Col>
        </Row>
      </>
    ),
  },
  {
    value: 7,
    label: (
      <>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex align-items-center gap-2"
          >
            <img
              draggable="false"
              src={pdf}
              alt=""
              height="17px"
              width="17px"
            />
            <span className={styles["Option_Document_button"]}>
              {t("PDFs")}
            </span>
          </Col>
        </Row>
      </>
    ),
  },
  {
    value: 8,
    label: (
      <>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex align-items-center gap-2"
          >
            <img
              draggable="false"
              src={video}
              alt=""
              height="17px"
              width="17px"
            />
            <span className={styles["Option_Document_button"]}>
              {t("Videos")}
            </span>
          </Col>
        </Row>
      </>
    ),
  },
  {
    value: 9,
    label: (
      <>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex align-items-center gap-2"
          >
            <img
              draggable="false"
              src={ShareIcon}
              alt=""
              height="17px"
              width="17px"
            />
            <span className={styles["Option_Document_button"]}>
              {t("Share")}
            </span>
          </Col>
        </Row>
      </>
    ),
  },
  {
    value: 10,
    label: (
      <>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex align-items-center gap-2"
          >
            <img
              draggable="false"
              src={folderColor}
              alt=""
              height="17px"
              width="17px"
            />
            <span className={styles["Option_Document_button"]}>
              {t("Folder")}
            </span>
          </Col>
        </Row>
      </>
    ),
  },
  {
    value: 11,
    label: (
      <>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex align-items-center gap-2"
          >
            <img
              draggable="false"
              src={sitesIcon}
              alt=""
              height="17px"
              width="17px"
            />
            <span className={styles["Option_Document_button"]}>
              {t("Sites")}
            </span>
          </Col>
        </Row>
      </>
    ),
  },
  {
    value: 12,
    label: (
      <>
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex align-items-center gap-2"
          >
            <img
              draggable="false"
              src={audioIcon}
              alt=""
              height="17px"
              width="17px"
            />
            <span className={styles["Option_Document_button"]}>
              {t("Audio")}
            </span>
          </Col>
        </Row>
      </>
    ),
  },
];

export const optionsLocations = (t) => [
  { value: 3, label: t("Any-where-in-dataRoom") },
  { value: 1, label: t("My-documents") },
  { value: 2, label: t("Shared-with-me") },
];

export const OptionsOwner = (t) => [
  { value: 1, label: t("Anyone") },
  { value: 2, label: t("Owned-by-me") },
  { value: 3, label: t("Not-owned-by-me") },
  // { value: 4, label: t("Specific-person") },
];

export const optionsLastmodified = (t) => [
  { value: 1, label: t("Any-time") },
  { value: 2, label: t("Today") },
  { value: 3, label: t("Last-7-days") },
  { value: 4, label: t("Last-30-days") },
  { value: 5, label: t("This-year-(2023)") },
  { value: 6, label: t("Last-year-(2022)") },
  { value: 7, label: t("Custome-range") },
];

// Options is My Document Tab
export const optionsforFolder = (t) => [
  { label: t("Share"), value: 2 },
  { label: t("Rename"), value: 3 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
  { label: t("Delete"), value: 6 },
  { label: t("Analytics"), value: 7 },
];

// Viewer Options and Permission Id is 01
export const optionsforFolderViewer = (t) => [
  { label: t("Rename"), value: 3 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
  { label: t("Remove"), value: 9 },
];

// Editor Options and Permission Id is 02
export const optionsforFolderEditor = (t) => [
  { label: t("Share"), value: 2 },
  { label: t("Rename"), value: 3 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
  { label: t("Analytics"), value: 7 },
  { label: t("Remove"), value: 9 },
];

// Non Shareable Editor Options and Permission Id is 03
export const optionsforFolderEditableNonShareable = (t) => [
  { label: t("Rename"), value: 3 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
  { label: t("Analytics"), value: 7 },
];

// Options is My Document Tab
export const optionsforFile = (t) => [
  { label: t("Open"), value: 1 },
  { label: t("Share"), value: 2 },
  { label: t("Rename"), value: 3 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
  { label: t("Delete"), value: 6 },
  { label: t("Analytics"), value: 7 },
];
// Options for Signature Flow
export const optionsforPDFandSignatureFlow = (t) => {
  const options = [
    { label: t("Open"), value: 1 },
    { label: t("Share"), value: 2 },
    { label: t("Rename"), value: 3 },
    { label: t("View-detail"), value: 4 },
    { label: t("Download"), value: 5 },
    { label: t("Delete"), value: 6 },
    { label: t("Analytics"), value: 7 },
  ];

  if (
    checkFeatureIDAvailability(19) &&
    checkFeatureIDAvailability(20) &&
    checkFeatureIDAvailability(21)
  ) {
    options.push({ label: t("Signature"), value: 8 });
  }

  return options;
};

// Viewer Options and Permission Id is 01
export const optionsforFileViewer = (t) => [
  { label: t("Open"), value: 1 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
  { label: t("Analytics"), value: 7 },
  { label: t("Remove"), value: 9 },
];

// Editor Options and Permission Id is 02
export const optionsforFileEditor = (t) => [
  { label: t("Open"), value: 1 },
  { label: t("Share"), value: 2 },
  { label: t("Rename"), value: 3 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
  { label: t("Analytics"), value: 7 },
  { label: t("Remove"), value: 9 },
];

// Non Shareable Editor Options and Permission Id is 03
export const optionsforFileEditableNonShareable = (t) => [
  { label: t("Open"), value: 1 },
  { label: t("Rename"), value: 3 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
  { label: t("Analytics"), value: 7 },
];

export const getIconSource = (extension) => {
  switch (extension) {
    case "pdf":
      return PDFICON;
    case "doc":
    case "docx":
    case "odt":
      return documentIcon;
    case "xls":
    case "xlsx":
    case "csv":
      return spreadsheet;
    case "html":
    case "htm":
      return sitesIcon;
    case "txt":
      return documentIcon;
    case "gif":
    case "jpeg":
    case "jpg":
    case "png":
    case "svg":
      return images;
    case "aif":
    case "iff":
    case "m3u":
    case "m4a":
    case "mid":
    case "mp3":
    case "mpa":
    case "wav":
      return audioIcon;
    case "3g2":
    case "3gp":
    case "asf":
    case "avi":
    case "flv":
    case "m4v":
    case "mov":
    case "mp4":
    case "mpg":
    case "rm":
    case "srt":
    case "swf":
    case "vob":
    case "wmv":
      return video;
    case "ppt":
    case "pptx":
    case "pptm":
    case "potx":
    case "potm":
    case "ppam":
    case "ppsx":
    case "ppsm":
    case "sldx":
    case "sldm":
    case "pa":
      return PowerPointIcon;
    default:
      return null;
  }
};

export const getFileExtension = (fileName) => {
  const lowercaseExtension = fileName?.toLowerCase().split(".").pop();
  return lowercaseExtension;
};

// Viewer Permission will should be a 2
export const optionShareTabForEditorRole = (t) => [
  // { label: t("Open"), value: 1 },
  { label: t("Share"), value: 2 },
  { label: t("Rename"), value: 3 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
  { label: t("Remove"), value: 6 },
  // { label: t("Analytics"), value: 7 },
];
// Viewer Permission will should be a 1
export const optionShareTabForViewerRole = (t) => [
  // { label: t("Open"), value: 1 },
  { label: t("Share"), value: 2 },
  // { label: t("Rename"), value: 3 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
  // { label: t("Remove"), value: 6 },
  // { label: t("Analytics"), value: 7 },
];

export const optionMyDocumentsTab = (t) => [
  { label: t("Open"), value: 1 },
  { label: t("Share"), value: 2 },
  { label: t("Rename"), value: 3 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
  { label: t("Remove"), value: 6 },
  { label: t("Analytics"), value: 7 },
];

export const optionMyDocumentsTabForSignature = (t) => {
  const options = [
    { label: t("Open"), value: 1 },
    { label: t("Share"), value: 2 },
    { label: t("Rename"), value: 3 },
    { label: t("View-detail"), value: 4 },
    { label: t("Download"), value: 5 },
    { label: t("Remove"), value: 6 },
    { label: t("Analytics"), value: 7 },
  ];

  if (
    checkFeatureIDAvailability(19) &&
    checkFeatureIDAvailability(20) &&
    checkFeatureIDAvailability(21)
  ) {
    options.push({ label: t("Signature"), value: 8 });
  }

  return options;
};

// Permission ID 1 = Viewer , 2 = Editor, 3 = Not share , 4 =
