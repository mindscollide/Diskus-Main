import React from 'react'
import { Row, Col } from 'react-bootstrap'
import styles from './GridViewDataRoom.module.css'
import folder_icon_gridview from '../../../assets/images/folder_icon_gridview.svg'
import file_image from '../../../assets/images/file_image.svg'
import { getFolderDocumentsApi } from '../../../store/actions/DataRoom_actions'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
const GridViewDataRoom = ({ data }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const getFolderDocuments = (folderid) => {
    console.log(folderid, 'folderidfolderidfolderidfolderid')
    localStorage.setItem('folderID', folderid)
    dispatch(getFolderDocumentsApi(navigate, folderid, t))
  }
  console.log(data, 'datadatadata')
  return (
    <>
      <Row>
        <Col sm={12} lg={12} md={12} className={styles['folderContainer']}>
          <Row>
            <Col sm={12} lg={12} md={12} className={styles['FolderHeading']}>
              {'Folders'}
            </Col>
          </Row>
          <Row>
            {data?.length > 0
              ? data.map((fileData, index) => {
                  if (fileData.isFolder) {
                    return (
                      <>
                        <Col
                          sm={12}
                          md={2}
                          lg={2}
                          onClick={() => getFolderDocuments(fileData.id)}
                        >
                          <div className={styles['gridViewFolder__name']}>
                            <span className={styles['folderName__text']}>
                              <img src={folder_icon_gridview} /> {fileData.name}
                            </span>
                          </div>
                        </Col>
                      </>
                    )
                  }
                })
              : null}
          </Row>
          <Row>
            <Col sm={12} lg={12} md={12} className={styles['FolderHeading']}>
              {'Files'}
            </Col>
          </Row>
          <Row>
            {data?.length > 0
              ? data.map((fileData, index) => {
                  if (!fileData.isFolder) {
                    return (
                      <>
                        <Col
                          sm={12}
                          md={2}
                          lg={2}
                          className={styles['gridViewFolder']}
                        >
                          <div className={styles['fileview__Box']}>
                            <Row>
                              <Col sm={12} md={12} lg={12}>
                                <img src={file_image} width={'100%'} />
                              </Col>
                              <Col sm={12} md={12} lg={12}>
                                <div className={styles['gridViewFile__name']}>
                                  <span className={styles['folderFile__text']}>
                                    <img src={folder_icon_gridview} />{' '}
                                    {fileData.name}
                                  </span>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </>
                    )
                  }
                })
              : null}
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default GridViewDataRoom
