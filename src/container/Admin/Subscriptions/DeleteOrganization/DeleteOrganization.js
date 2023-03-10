import React, { useEffect, useState } from 'react'
import styles from './DeleteOrganization.module.css'
import { Row, Col, Container } from 'react-bootstrap'
import { Button, Loader, Modal, Notification } from '../../../../components/elements'
import deleteOrganizationAction from '../../../../store/actions/Delete_Organization'
import { useDispatch, useSelector } from 'react-redux'
import FailedIcon from "../../../../assets/images/failed.png";
import DeletedIcon from "../../../../assets/images/Deleted-Icon.png";
import { FaLaptopHouse } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import { cleareMessage } from '../../../../store/actions/Admin_PackageUpgrade'
const DeleteOrganization = () => {
    const [open, setOpen] = useState({
        open: false,
        message: ""
    })
    const { adminReducer } = useSelector(state => state)
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [deleteSuccessModal, setDeleteSuccesModal] = useState(false);
    let createrID = localStorage.getItem("userID");
    let OrganizationID = localStorage.getItem("organizationID")
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleDeleteOrganization = () => {
        setDeleteConfirmModal(true)
        setDeleteModal(false)
        setDeleteSuccesModal(false)
    }
    const cancelModalDelete = () => {
        setDeleteModal(false)
        setDeleteConfirmModal(false)
        setDeleteSuccesModal(false)
    }
    const openDeleteSuccess = () => {
        let Data = { OrganizationID: JSON.parse(OrganizationID), RequestingUserID: JSON.parse(createrID) }
        localStorage.setItem("deleteContent", true)
        dispatch(deleteOrganizationAction(Data, t, setDeleteSuccesModal, setDeleteModal, setDeleteConfirmModal, navigate))
    }
    console.log("adminReduceradminReduceradminReducer", adminReducer)
    useEffect(() => {
        if (adminReducer.DeleteOrganizationResponseMessage !== "") {
            setOpen({
                open: true,
                message: adminReducer.DeleteOrganizationResponseMessage
            })
            setTimeout(() => {
                setOpen({
                    open: false,
                    message: ""
                })
            }, 4000)
            dispatch(cleareMessage())
        }
    }, [adminReducer.DeleteOrganizationResponseMessage])
    return (
        <>
            <Container>
                <Row>
                    <Col sm={12} md={12} lg={12} className="mx-auto" >
                        <Row >
                            <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={`${"MontserratSemiBold-600 fs-4 mt-4 mb-2"} ${styles["DeleteOrganization_box_heading"]}`} >
                                Delete Organization
                            </Col>
                            <Col sm={12} lg={12} md={12} className={styles["DeleteOrganization_content"]}>
                                <img src={FailedIcon} />
                                <p>
                                    Opting to <span className={styles["title"]}>DELETE THE ORGANIZATION</span> will delete and remove all relevant data including but not limited to Users, Meetings, Documents related to your organization account. Please make sure that we do not retain any backup of data and will not be able to entertain backup recovery request.
                                    <br />
                                    <br />
                                    It is requested that you please make backup of all your data before proceeding to delete the account. Please proceed with caution and at your own risk.

                                </p>
                                <Button className={styles["deleteOrganization_btn"]} onClick={openDeleteSuccess} text="Proceed to Deletion " />
                            </Col>
                        </Row>
                    </Col>
                </Row>
               
            </Container>
            {adminReducer.Loading ? <Loader /> : null}
            <Notification open={open.open} setOpen={open.open} message={open.message} />
        </>
    )
}

export default DeleteOrganization