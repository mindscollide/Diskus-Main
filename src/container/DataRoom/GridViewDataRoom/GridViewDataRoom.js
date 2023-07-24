import React, { useState } from 'react'
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

const GridViewDataRoom = ({ data, optionsforFolder, optionsforFile }) => {
  console.log(
    optionsforFolder,
    optionsforFile,
    'optionsforFileoptionsforFileoptionsforFile',
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [filterOptions, setFiltersOptions] = useState(false)
  const [filterOptionsValues, setFilterOptionValues] = useState([
    { label: 'Name', value: 1 },
    { label: 'Last Modifed', value: 2 },
    { label: 'Last Modified by Me', value: 3 },
    { label: 'Last opened by me', value: 4 },
  ])
  const getFolderDocuments = (folderid) => {
    console.log(folderid, 'folderidfolderidfolderidfolderid')
    localStorage.setItem('folderID', folderid)
    dispatch(getFolderDocumentsApi(navigate, folderid, t))
  }
  const handleClickFilter = (filterValue) => {
    setFiltersOptions(false)
  }

  const handleClickforFolder = (dataId) => {
    console.log(dataId)
  }

  const handleClickforFile = (dataId) => {
    console.log(dataId)
  }

  return (
    <>
      <Row>
        <Col sm={12} lg={12} md={12} className={styles['folderContainer']}>
          <Row>
            <Col sm={12} md={12} lg={12} className="position-relative">
              <span className={styles['Name_heading__gridView']}>
                {t('Name')}{' '}
                <img
                  src={ArrowUp}
                  className="cursor-pointer"
                  onClick={() => setFiltersOptions(!filterOptions)}
                />
              </span>
              {filterOptions && (
                <Row>
                  <Col className={styles['FilterDropDown_GridView']}>
                    {filterOptionsValues.map((navlink, index) => {
                      return (
                        <NavLink
                          key={index}
                          onClick={() => handleClickFilter(navlink.value)}
                          className={styles['NavLink__filter']}
                        >
                          {navlink.label}
                        </NavLink>
                      )
                    })}
                  </Col>
                </Row>
              )}
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
            {data?.length > 0
              ? data.map((fileData, index) => {
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
                          <span className={styles['three_dot__gridView']}>
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
                                        handleClickforFolder(data)
                                      }
                                    >
                                      {data.label}
                                    </Dropdown.Item>
                                  )
                                })}
                              </Dropdown.Menu>
                            </Dropdown>
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
              {t('Files')}
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
                                <span
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
                                              handleClickforFile(data)
                                            }
                                          >
                                            {data.label}
                                          </Dropdown.Item>
                                        )
                                      })}
                                    </Dropdown.Menu>
                                  </Dropdown>
                                  {/* <img src={threedots_dataroom} onClick={() => handleClickforFile(fileData.id)} /> */}
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
