import React, { useState } from 'react'
import styles from './VideoMeeting.module.css'
import { Container, Row, Col } from 'react-bootstrap'
import { ChevronRight } from 'react-bootstrap-icons'
import { useSelector } from 'react-redux'
import { TextField, Button } from '../../components/elements'
const VideoMeeting = () => {
    const { VideoChatReducer } = useSelector((state) => state)
    const [minutes, setMinutes] = useState("")
    return (
        <Container>
            <Row>
                <Col sm={12} md={12} lg={12}>
                    <Row>
                        <Col className={styles['videocalling']} >
                            <h1>Video Call will be there</h1>
                        </Col>
                    </Row>
                    <Row >
                        <Col sm={12} className="d-flex justify-content-center" >
                            <div className={styles["video-buttons"]}>
                                 <div className={`${styles["video-icons"]} ${"icon-video"}`}></div>
                                 <div className={`${styles["video-icons"]} ${"icon-mic-off"}`}></div>
                                 <div className={`${styles["video-icons"]} ${"icon-info"}`}></div>
                                 <div className={`${styles["video-icons"]} ${"icon-desktop"}`}></div>
                                 <div className={`${styles["video-icons"]} ${"icon-logout"}`}></div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row >
        </Container>
    )
}

export default VideoMeeting