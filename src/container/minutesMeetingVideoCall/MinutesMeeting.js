import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import TextField from '../../components/elements/input_field/Input_field';
import { ChevronRight } from 'react-bootstrap-icons'

import styles from './MinutesMeeting.module.css'
import { useSelector, useDispatch } from 'react-redux';

const MinuteMinutesCom = () => {
    const { assignees } = useSelector((state) => state)
    const [isMeetingofMinutes, setMeetingOfMinutes] = useState([]);
    const dispatch = useDispatch()

    console.log("isMeetingofMinutesisMeetingofMinutesisMeetingofMinutes", isMeetingofMinutes)
    useEffect(() => {
        let minutesArr = []
        if (assignees.ViewMeetingDetails !== "" && assignees.ViewMeetingDetails !== null && assignees.ViewMeetingDetails !== undefined) {
            assignees.ViewMeetingDetails.minutesOfMeeting?.map((data, index) => {
                console.log("datadatadataminutesArr", data)
                minutesArr.push({
                    pK_MOMID: data.pK_MOMID,
                    description: data.description,
                    creationDate: data.creationDate,
                    creationTime: data.creationTime,
                    fK_MDID: data.fK_MDID
                })
            })
            setMeetingOfMinutes([...minutesArr])
        }
    }, [assignees.ViewMeetingDetails])

    return (
        <Container className={styles['minutes-container']}>
            <Row> <Col className={styles['minutes_meeting_heading']}>Meeting Minutes</Col></Row>
            <Row className={styles["minutes-records"]}>
                {isMeetingofMinutes.length > 0 ? isMeetingofMinutes.map((data, index) => {
                    return <>
                        <Col key={data.pK_MOMID} sm={12} className="border my-2 py-1 d-flex justify-content-start flex-column">
                            <Row>
                                <Col sm={1}>
                                    <span className={styles["agendaIndex"]}>
                                        {index + 1}
                                    </span>
                                </Col>
                                <Col sm={11}>
                                    <p className={styles['minutesDescription']}  >
                                        {data.description}
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </>
                }) : null}
            </Row>
            <Row>
                <Col sm={11} md={11} lg={11} className={styles["minutes-input"]}>
                    <TextField placeholder="Type as" width="480" />
                </Col>
                <Col sm={1} md={1} lg={1} className={styles["arrow-icon"]} ><ChevronRight width={25} height={35} color={"white"} className={styles["arrow-style"]} /></Col>
            </Row>
        </Container >

    )
}

export default MinuteMinutesCom