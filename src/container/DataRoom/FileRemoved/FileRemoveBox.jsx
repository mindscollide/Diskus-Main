import React from 'react'
import { Row, Col } from 'react-bootstrap'
import styles from './FileRemoveBox.module.css'
import { useTranslation } from 'react-i18next';
const FileRemoveBox = () => {
    const { t } = useTranslation()
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
                            {t("File-removed")}
                        </span>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default FileRemoveBox