import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FileIcon, { defaultStyles } from "react-file-icon";
import './AttachmentFiles.css'
import { meetingModalAttachment, getMeetingAttachments } from "../../store/actions/VideoChat_actions";
import MeetingAttachmentModal from '../meetingAttachmentModal/MeetingAttachmentModal';


const AttachmentFiles = ({ openModal }) => {
  const { VideoChatReducer } = useSelector(state => state)
  const [attachmentFiles, setAttachmentFiles] = useState([])

  const dispatch = useDispatch()
  const handleClick = () => {
    dispatch(meetingModalAttachment(true))
  }
  console.log("VideoChatReducerVideoChatReducerVideoChatReducer", VideoChatReducer)
  useEffect(() => {
    let attachmentFiles = VideoChatReducer.MeetingAttachmentsResponse

    let attachmentFileArr = []
    if (attachmentFiles.length > 0 && attachmentFiles.length !== null && attachmentFiles.length !== undefined) {
      attachmentFiles.map((data, index) => {
        attachmentFileArr.push({
          pK_MAAID: data.pK_MAAID,
          displayAttachmentName: data.displayAttachmentName,
          originalAttachmentName: data.originalAttachmentName,
          creationDate: data.creationDate,
          fK_MAID: data.fK_MAID,
          creationDate: data.creationDate,
          creationTime: data.creationTime
        })
        console.log("attachmentFileArrattachmentFileArrattachmentFileArrattachmentFileArr", attachmentFiles)
        setAttachmentFiles([...attachmentFileArr])
      })
    }
    console.log("attachmentFilesattachmentFiles", attachmentFiles)
  }, [])
  useEffect(() => {
    let meetingID = localStorage.getItem("MeetingId")
    let Data = {
      "MeetingID": JSON.parse(meetingID)
    }
    dispatch(getMeetingAttachments(navigate, Data, t))
  }, [])
  console.log("VideoChatReducerVideoChatReducerVideoChatReducerAttachment", VideoChatReducer)
  return (
    <Container className='attachment-popover'>
      <Row><Col sm={12} className="text-primary fw-bold text-uppercase"><span className='mx-2'>Attachments</span></Col></Row>
      <Row>
        <Col sm={10} className="meetingAttachments">
          <Row>
            {attachmentFiles.length > 0 ? attachmentFiles.map((attachmentData, index) => {
              var ext =
                attachmentData.displayAttachmentName.split(
                  "."
                ).pop();
              const first =
                attachmentData.displayAttachmentName.split(
                  " "
                )[0];
              return <> <Col sm={2} className="fileicon-attachmentVideoChat">
                {ext === "doc" ? <FileIcon
                  extension={"docx"}
                  size={78}
                  type={"document"}

                  labelColor={"rgba(44, 88, 152)"}
                /> :
                  ext === "docx" ? <FileIcon
                    extension={"docx"}
                    size={78}
                    type={"font"}

                    labelColor={"rgba(44, 88, 152)"}
                  /> :
                    ext === "xls" ? <FileIcon
                      extension={"xls"}
                      type={"spreadsheet"}

                      size={78}

                      labelColor={"rgba(16, 121, 63)"}
                    /> :
                      ext === "xlsx" ? <FileIcon
                        extension={"xls"}
                        type={"spreadsheet"}

                        size={78}

                        labelColor={"rgba(16, 121, 63)"}
                      /> :
                        ext === "pdf" ? <FileIcon
                          extension={"pdf"}
                          size={78}
                          {...defaultStyles.pdf}
                        /> :
                          ext === "png" ? <FileIcon
                            extension={"png"}
                            size={78}
                            type={"image"}

                            labelColor={"rgba(102, 102, 224)"}
                          /> :
                            ext === "txt" ? <FileIcon
                              extension={"txt"}
                              size={78}
                              type={"document"}

                              labelColor={"rgba(52, 120, 199)"}
                            /> :
                              ext === "jpg" ? <FileIcon
                                extension={"jpg"}
                                size={78}
                                type={"image"}

                                labelColor={"rgba(102, 102, 224)"}
                              /> :
                                ext === "jpeg" ? <FileIcon
                                  extension={"jpeg"}
                                  size={78}
                                  type={"image"}

                                  labelColor={"rgba(102, 102, 224)"}
                                /> :
                                  ext === "gif" ? <FileIcon
                                    extension={"gif"}
                                    size={78}

                                    {...defaultStyles.gif}
                                  /> : null}
                <p className="todoModalFileAttach">
                  {first}
                </p>
              </Col>
              </>
            }) : null}
          </Row>
        </Col>
        <Col sm={2} className="d-flex align-items-center">
          <span className='icon-add-square' onClick={handleClick}></span>
        </Col>
      </Row>
      <MeetingAttachmentModal />
    </Container>
  )
}

export default AttachmentFiles
