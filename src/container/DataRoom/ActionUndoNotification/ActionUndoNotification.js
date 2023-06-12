import React from 'react'
import { Row, Col } from 'react-bootstrap'
import styles from './ActionUndoNotification.module.css'
import { useTranslation } from 'react-i18next';
const ActionUndoNotification = () => {
    const { t } = useTranslation()
    return (
        <Row>
            <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["background_action_unDone"]}
            >
                <Row>
                    <Col lg={12} md={12} sm={12}>
                        <span className={styles["Action_undone_notification"]}>
                            {t("Action-undone")}
                        </span>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default ActionUndoNotification