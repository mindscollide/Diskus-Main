import React from 'react'
import { Modal } from '../../../components/elements'
import { Container, Row, Col } from 'react-bootstrap'

const CreatePolling = ({ showPollingModal, setShowPollingModal }) => {
    return (
        <>
            <Container >
                <Modal
                    show={showPollingModal}
                    setShow={setShowPollingModal}
                    onHide={() => {
                        setShowPollingModal(false)
                    }}
                    ModalTitle={"Create Polling"}
                    ModalFooter={""}
                    ModalBody={""}
                    size={"md"}
                />
            </Container>
        </>
    )
}

export default CreatePolling