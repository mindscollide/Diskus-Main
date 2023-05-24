import React from 'react'
import { Row, Col } from 'react-bootstrap'
import styles from './GridViewDataRoom.module.css'
import folder_icon_gridview from '../../../assets/images/folder_icon_gridview.svg'
import file_image from '../../../assets/images/file_image.svg'
const GridViewDataRoom = ({ data }) => {
    console.log(data, "datadatadata")
    return (<>
        <Row><Col sm={12} lg={12} md={12} className={styles["FolderHeading"]}>{"Folders"}</Col></Row>
        <Row>
            {data?.length > 0 ?
                data.map((fileData, index) => {
                    if (fileData.isFolder) {
                        return <>
                            <Col sm={12} md={2} lg={2} >
                                <div className={styles["gridViewFolder__name"]}>
                                    <span className={styles["folderName__text"]}><img src={folder_icon_gridview} /> {fileData.name}</span>
                                </div>
                            </Col>
                        </>
                    }
                })
                : null}
        </Row>
        <Row><Col sm={12} lg={12} md={12} className={styles["FolderHeading"]}>{"Files"}</Col></Row>
        <Row>
            {data?.length > 0 ?
                data.map((fileData, index) => {
                    if (!fileData.isFolder) {
                        return <>
                            <Col sm={12} md={2} lg={2} className={styles["gridViewFolder"]}>

                                <div className={styles["fileview__Box"]}>
                                    <Row >
                                        <Col sm={12} md={12} lg={12} >
                                            <img src={file_image} width={"100%"} />
                                        </Col>
                                        <Col sm={12} md={12} lg={12}>
                                            <div className={styles["gridViewFile__name"]}>
                                                <span className={styles["folderFile__text"]}><img src={folder_icon_gridview} /> {fileData.name}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>


                            </Col>
                        </>
                    }

                })
                : null}
        </Row>
    </>
    )
}

export default GridViewDataRoom