import React from 'react'
import styles from './ConfirmationModal.module.css'
import CustomModal from '../modal/Modal'
import { Row, Col } from 'react-bootstrap'



const ConfirmationModal = ({ showModal, setShowModal, onHide, closeBtnClick }) => {
    return (
        <CustomModal show={showModal} setShow={setShowModal} onHide={onHide}
            ModalBody={
                <>
                    <Row>
                        <Col>
                            Are you sure? If you click on close button the data will reset and modal close.
                        </Col>
                    </Row>
                </>
            }
            ModalFooter={
                <>
                    <Row>
                        <Col sm={12} md={6} lg={6}>Cancel</Col>
                        <Col sm={12} md={6} lg={6} onClick={closeBtnClick}>Close</Col>
                    </Row>
                </>
            }
        />

    )
}

export default ConfirmationModal