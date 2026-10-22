import React from 'react'
import { Row, Col } from 'react-bootstrap'
import styles from './deleteNotification.module.css'
import { useTranslation } from 'react-i18next';
const DeleteNotificationBox = () => {
    const { t } = useTranslation();
    return (
        <Row>
            <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["Delete_notification_bar"]}
            >
                <Row>
                    <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center mt-2"
                    >
                        <span className={styles["Folder_removed_heading"]}>
                            {t("Folder-removed")}
                        </span>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default DeleteNotificationBox