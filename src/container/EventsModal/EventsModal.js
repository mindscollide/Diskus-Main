import React from 'react'
import styles from './EventModal.module.css'

import { Modal } from '../../components/elements'
import { Row, Col } from 'react-bootstrap'
import { _justShowDateformat, newTimeFormaterAsPerUTC } from '../../commen/functions/date_formater'

const EventsModal = ({ eventModal, setEventsModal, events }) => {
    console.log(events, "setEventsModalsetEventsModalsetEventsModal")
    let diskusEventColor = localStorage.getItem("diskusEventColor");
    let googleEventColor = localStorage.getItem("googleEventColor");
    let officeEventColor = localStorage.getItem("officeEventColor");
    return (
        <Modal show={eventModal} setShow={setEventsModal}
            closeButton={true}
            onHide={() => setEventsModal(false)}
            ModalBody={(
                <>
                    <Row>
                        <Col sm={12} md={12} lg={12}  >
                            <span className={styles["dateHeading_events__Modal"]}>{_justShowDateformat(events[0].eventDate + events[0].endTime)}</span>
                        </Col>
                        <Col sm={12} lg={12} md={12} className={styles["eventsBox"]}>
                            {events.length > 0 && (
                                events.map((eventData, index) => {
                                    return (
                                        <section key={index} style={{ border: eventData.calenderEventSource === "Diskus" ? `1px solid ${diskusEventColor}` : eventData.calenderEventSource === "Google" ? `1px solid ${googleEventColor}` : eventData.calenderEventSource === "Office" ? `1px solid ${officeEventColor}` : `1px solid #000` }} className={styles["eventBox"]}>
                                            <Row>
                                                <Col sm={12} md={10} lg={10} className='d-flex flex-column '>
                                                    <span className={styles["event__title"]}>{eventData.title}</span><span className={styles["event_time"]}>{newTimeFormaterAsPerUTC(eventData.eventDate + eventData.startTime)}</span></Col>
                                                <Col sm={12} md={2} lg={2} className='d-flex justify-content-end align-items-center'>
                                                    <p className={styles["event__type"]}>{eventData.calenderEventType}</p>
                                                </Col>
                                            </Row>
                                        </section>
                                    )
                                })

                            )}

                        </Col>
                    </Row>
                    <section></section>

                </>
            )} />
    )
}

export default EventsModal