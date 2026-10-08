// options.js
import audioIcon from "../../../assets/images/AttachmentIcons/mp3.png";
import ShareIcon from "../../../assets/images/AttachmentIcons/ShortCuts.png";
import sitesIcon from "../../../assets/images/AttachmentIcons/html.png";
import documentIcon from "../../../assets/images/AttachmentIcons/doc.png";
import pdf from "../../../assets/images/AttachmentIcons/PDF.png";
import video from "../../../assets/images/AttachmentIcons/mov.png";
import spreadsheet from "../../../assets/images/AttachmentIcons/xls.png";
import forms from "../../../assets/images/AttachmentIcons/Forms.png"
import folderColor from "../../../assets/images/folder_color.svg";
import images from "../../../assets/images/AttachmentIcons/jpg.png";
import PDFICON from "../../../assets/images/AttachmentIcons/PDF.png";
import PowerPointIcon from "../../../assets/images/AttachmentIcons/PPT.png";
import datIcon from "../../../assets/images/AttachmentIcons/dat.png";
import txtIcon from "../../../assets/images/AttachmentIcons/txt.png";
import htmlIcon from "../../../assets/images/AttachmentIcons/html.png";
import cssIcon from "../../../assets/images/AttachmentIcons/css.png";
import jsIcon from "../../../assets/images/AttachmentIcons/js.png";
import jsxIcon from "../../../assets/images/AttachmentIcons/jsx.png";
import phpIcon from "../../../assets/images/AttachmentIcons/php.png";
import sqlIcon from "../../../assets/images/AttachmentIcons/sql.png";
import xmlIcon from "../../../assets/images/AttachmentIcons/xml.png";
import zipIcon from "../../../assets/images/AttachmentIcons/zip.png";
import gifIcon from "../../../assets/images/AttachmentIcons/gif.png";
import jpgIcon from "../../../assets/images/AttachmentIcons/jpg.png";
import pngIcon from "../../../assets/images/AttachmentIcons/png.png";
import svgIcon from "../../../assets/images/AttachmentIcons/svg.png";
import bmpIcon from "../../../assets/images/AttachmentIcons/bmp.png";
import tifIcon from "../../../assets/images/AttachmentIcons/tif.png";
import mp3Icon from "../../../assets/images/AttachmentIcons/mp3.png";
import aacIcon from "../../../assets/images/AttachmentIcons/aac.png";
import midiIcon from "../../../assets/images/AttachmentIcons/midi.png";
import aviIcon from "../../../assets/images/AttachmentIcons/avi.png";
import movIcon from "../../../assets/images/AttachmentIcons/mov.png";
import mpgIcon from "../../../assets/images/AttachmentIcons/mpg.png";
import wmvIcon from "../../../assets/images/AttachmentIcons/wmv.png";
import flvIcon from "../../../assets/images/AttachmentIcons/flv.png";
import psdIcon from "../../../assets/images/AttachmentIcons/psd.png";
import aiIcon from "../../../assets/images/AttachmentIcons/ai.png";
import epsIcon from "../../../assets/images/AttachmentIcons/eps.png";
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
    imgSrc: PowerPointIcon,
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
              src={PowerPointIcon}
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
];

export const optionsLastmodified = (t) => [
  { value: 1, label: t("Any-time") },
  { value: 2, label: t("Today") },
  { value: 3, label: t("Last-7-days") },
  { value: 4, label: t("Last-30-days") },
  {
    value: 5,
    label: t("This-year", { year: new Date().getFullYear() }),
  },
  {
    value: 6,
    label: t("Last-year", { year: new Date().getFullYear() - 1 }),
  },
  {
    value: 7,
    label: t("Custom-date-range"),
  },
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

  if (checkFeatureIDAvailability(19) || checkFeatureIDAvailability(21)) {
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
      return htmlIcon;
    case "css":
      return cssIcon;
    case "js":
      return jsIcon;
    case "jsx":
      return jsxIcon;
    case "php":
      return phpIcon;
    case "sql":
      return sqlIcon;
    case "xml":
      return xmlIcon;
    case "zip":
      return zipIcon;
    case "txt":
      return txtIcon;
    case "gif":
      return gifIcon;
    case "jpeg":
    case "jpg":
      return jpgIcon;
    case "png":
      return pngIcon;
    case "svg":
      return svgIcon;
    case "bmp":
      return bmpIcon;
    case "tif":
    case "tiff":
      return tifIcon;
    case "psd":
      return psdIcon;
    case "ai":
      return aiIcon;
    case "eps":
      return epsIcon;
    case "mp3":
      return mp3Icon;
    case "aac":
      return aacIcon;
    case "mid":
    case "midi":
      return midiIcon;
    case "aif":
    case "iff":
    case "m3u":
    case "m4a":
    case "mpa":
    case "wav":
      return audioIcon;
    case "avi":
      return aviIcon;
    case "mov":
      return movIcon;
    case "mpg":
      return mpgIcon;
    case "wmv":
      return wmvIcon;
    case "flv":
      return flvIcon;
    case "3g2":
    case "3gp":
    case "asf":
    case "m4v":
    case "mp4":
    case "rm":
    case "srt":
    case "swf":
    case "vob":
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
      return datIcon;
  }
};

export const getFileExtension = (fileName) => {
  const lowercaseExtension = fileName?.toLowerCase().split(".").pop();
  return lowercaseExtension;
};

// Viewer Permission will should be a 2
export const optionShareTabForEditorRole = (t) => [
  { label: t("Share"), value: 2 },
  { label: t("Rename"), value: 3 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
  { label: t("Remove"), value: 6 },
];
// Viewer Permission will should be a 1
export const optionShareTabForViewerRole = (t) => [
  { label: t("Share"), value: 2 },
  { label: t("View-detail"), value: 4 },
  { label: t("Download"), value: 5 },
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

  if (checkFeatureIDAvailability(19) || checkFeatureIDAvailability(21)) {
    options.push({ label: t("Signature"), value: 8 });
  }

  return options;
};

// Permission ID 1 = Viewer , 2 = Editor, 3 = Not share , 4 =
