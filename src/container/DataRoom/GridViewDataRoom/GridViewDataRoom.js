import React, { useEffect, useState } from 'react'
import { Row, Col, NavDropdown, MenuItem, Dropdown } from 'react-bootstrap'
import styles from './GridViewDataRoom.module.css'
import folder_icon_gridview from '../../../assets/images/folder_icon_gridview.svg'
import file_image from '../../../assets/images/file_image.svg'
import { getFolderDocumentsApi } from '../../../store/actions/DataRoom_actions'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import ArrowUp from '../../../assets/images/Icon awesome-arrow-up.svg'
import threedots_dataroom from '../../../assets/images/threedots_dataroom.svg'
import ModalShareFolder from '../ModalShareFolder/ModalShareFolder'
import ModalRenameFolder from '../ModalRenameFolder/ModalRenameFolder'
import ModalShareFile from '../ModalShareFile/ModalShareFile'
import ModalRenameFile from '../ModalRenameFile/ModalRenameFile'


const GridViewDataRoom = ({ data, optionsforFolder, optionsforFile }) => {
  console.log(
    optionsforFolder,
    optionsforFile,
    'optionsforFileoptionsforFileoptionsforFile',
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [sharefoldermodal, setSharefoldermodal] = useState(false);
  const currentView = JSON.parse(localStorage.getItem("setTableView"));
  const [showrenameFile, setShowRenameFile] = useState(false)
  const [shareFileModal, setShareFileModal] = useState(false);
  const [sortIon, setSortIcon] = useState(false)
  const [showrenameFolder, setShowreanmeFolder] = useState(false);
  const [folderId, setFolderId] = useState(0);
  const [fileName, setFileName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [isDataforGrid, setDataForGrid] = useState(null)
  const [isRenameFolderData, setRenameFolderData] = useState(null)
  const [filterValue, setFilterValue] = useState({
    label: t('Name'),
    value: 1
  })
  const [filterShareTabValue, setFilteShareTabrValue] = useState({
    label: t('Name'),
    value: 2
  })
  const filterOptionsValues = [
    { label: t('Name'), value: 1 },
    { label: t('Last-modifed'), value: 2 },
    { label: t('Last-modified-by-me'), value: 3 },
    { label: t('Last-open-by-me'), value: 4 },
  ]
  const filterOptionsShareTab = [
    { label: t('Share-date'), value: 1 },
    { label: t('Name'), value: 2 },
    { label: t('Last-modifed'), value: 3 },
    { label: t('Last-modified-by-me'), value: 4 },
    { label: t('Last-open-by-me'), value: 5 },
  ]
  const getFolderDocuments = (folderid) => {
    console.log(folderid, 'folderidfolderidfolderidfolderid')
    localStorage.setItem('folderID', folderid)
    dispatch(getFolderDocumentsApi(navigate, folderid, t))
  }
  const handleClickFilter = (filterValue) => {
    console.log(filterValue, "filterValuefilterValuefilterValue")
    setFilterValue({
      label: filterValue.label,
      value: filterValue.value
    })
    if (filterValue.value === 1) {
      let SortData = data && data.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase());
      setDataForGrid(SortData)
      console.log(SortData, "datadatadatadata")
      console.log(data, "datadatadatadata")
    }
  }

  const handleShareTabFilter = (filterValue) => {
    setFilteShareTabrValue({
      label: filterValue.label,
      value: filterValue.value
    })
  }

  const handleClickforFolder = (dataId, record) => {
    setFolderId(dataId.value)
    if (dataId.value === 2) {
      setShowreanmeFolder(true)
      setRenameFolderData(record)
    } else if (dataId.value === 1) {
      setSharefoldermodal(true)
      setFolderName(record.name)
    }
    console.log(dataId)
  }

  const handleClickforFile = (dataId, record) => {
    setFolderId(dataId.value)
    if (dataId.value === 3) {
      setShowRenameFile(true)
      setRenameFolderData(record)
    } else if (dataId.value === 2) {
      setFileName(record.name);
      setShareFileModal(true)
    }
    console.log(dataId)
  }
  useEffect(() => {
    if (data !== null && data !== undefined) {
      setDataForGrid(data)
    }
  }, [data])
  return (
    <>
      <Row>
        <Col sm={12} lg={12} md={12} className={styles['folderContainer']}>
          <Row>
            <Col sm={12} md={12} lg={12} className="d-flex gap-2 align-items-center justify-content-start" >
              {/* <span className={styles['Name_heading__gridView']}>
                {t('Name')}{' '}
              </span> */}
              {currentView === 1 ? <>
                <Dropdown
                  drop="down"
                  align="start"
                  className={`${styles['options_dropdown']
                    } ${'dataroom_options'}`}
                >
                  <Dropdown.Toggle id="dropdown-autoclose-true">
                    <span className={styles['Name_heading__gridView']}>
                      {filterValue.label}
                    </span>
                    {/* {filterValue.label} */}

                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {filterOptionsValues.map((data, index) => {
                      return (
                        <Dropdown.Item
                          key={index}
                          onClick={() =>
                            handleClickFilter(data)
                          }
                        >
                          {data.label}
                        </Dropdown.Item>
                      )
                    })}
                  </Dropdown.Menu>
                </Dropdown>
                {sortIon ? <img
                  src={ArrowUp}
                  width="15.02px"
                  height="10.71px"
                /> : <img
                  src={ArrowUp}
                  width="15.02px"
                  height="10.71px"
                />}</> : <>
                <Dropdown
                  drop="down"
                  align="start"
                  className={`${styles['options_dropdown']
                    } ${'dataroom_options'}`}
                >
                  <Dropdown.Toggle id="dropdown-autoclose-true">
                    <span className={styles['Name_heading__gridView']}>
                      {filterShareTabValue.label}
                    </span>
                    {/* {filterValue.label} */}

                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {filterOptionsShareTab.map((data, index) => {
                      return (
                        <Dropdown.Item
                          key={index}
                          onClick={() =>
                            handleShareTabFilter(data)
                          }
                        >
                          {data.label}
                        </Dropdown.Item>
                      )
                    })}
                  </Dropdown.Menu>
                </Dropdown>
                {sortIon ? <img
                  src={ArrowUp}
                  width="15.02px"
                  height="10.71px"
                /> : <img
                  src={ArrowUp}
                  width="15.02px"
                  height="10.71px"
                />}</>}




            </Col>
            <Col sm={12} md={12} lg={12}>
              <span className={styles['border_bottom__gridView']}></span>
            </Col>
          </Row>
          <Row>
            <Col sm={12} lg={12} md={12} className={styles['FolderHeading']}>
              {t('Folders')}
            </Col>
          </Row>
          <Row>
            {isDataforGrid?.length > 0
              ? isDataforGrid.map((fileData, index) => {
                if (fileData.isFolder) {
                  return (
                    <>
                      <Col sm={12} md={2} lg={2}>
                        <div className={styles['gridViewFolder__name']}>
                          <span
                            className={styles['folderName__text']}
                            onClick={() => getFolderDocuments(fileData.id)}
                          >
                            <img src={folder_icon_gridview} /> {fileData.name}
                          </span>
                          {!fileData.isShared && <span className={styles['three_dot__gridView']}>
                            <Dropdown
                              drop="down"
                              align="start"
                              className={`${styles['options_dropdown']
                                } ${'dataroom_options'}`}
                            >

                              <Dropdown.Toggle id="dropdown-autoclose-true">
                                <img
                                  src={threedots_dataroom}
                                  width="15.02px"
                                  height="10.71px"
                                />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {optionsforFolder.map((data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        handleClickforFolder(data, fileData)
                                      }
                                    >
                                      {data.label}
                                    </Dropdown.Item>
                                  )
                                })}
                              </Dropdown.Menu>
                            </Dropdown>
                          </span>}

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
              {t('Files')}
            </Col>
          </Row>
          <Row>
            {isDataforGrid?.length > 0
              ? isDataforGrid.map((fileData, index) => {
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
                                {!fileData.isShared && <span
                                  className={styles['three_dot__gridView']}
                                >
                                  <Dropdown
                                    drop="down"
                                    align="start"
                                    className={`${styles['options_dropdown']
                                      } ${'dataroom_options'}`}
                                  >
                                    <Dropdown.Toggle id="dropdown-autoclose-true">
                                      <img
                                        src={threedots_dataroom}
                                        width="15.02px"
                                        height="10.71px"
                                      />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      {optionsforFile.map((data, index) => {
                                        return (
                                          <Dropdown.Item
                                            key={index}
                                            onClick={() =>
                                              handleClickforFile(data, fileData)
                                            }
                                          >
                                            {data.label}
                                          </Dropdown.Item>
                                        )
                                      })}
                                    </Dropdown.Menu>
                                  </Dropdown>
                                  {/* <img src={threedots_dataroom} onClick={() => handleClickforFile(fileData.id)} /> */}
                                </span>}

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
      {sharefoldermodal && <ModalShareFolder folderName={folderName} folderId={folderId} sharefolder={sharefoldermodal} setSharefolder={setSharefoldermodal} />}
      {shareFileModal && <ModalShareFile fileName={fileName} folderId={folderId} shareFile={shareFileModal} setShareFile={setShareFileModal} />}
      {showrenameFile && <ModalRenameFile isRenameFileData={isRenameFolderData} showrenameFile={showrenameFile} setShowRenameFile={setShowRenameFile} />}
      {showrenameFolder && <ModalRenameFolder isRenameFolderData={isRenameFolderData} renamefolder={showrenameFolder} setRenamefolder={setShowreanmeFolder} />}
    </>
  )
}

export default GridViewDataRoom
