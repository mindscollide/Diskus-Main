import React, { useEffect, useState } from 'react'
import styles from './PackageUpgradeDetail.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card } from 'react-bootstrap'
import './../../../../i18n'
import { useTranslation } from 'react-i18next'
import UpgradePackageDetail from '../../../../components/elements/upgradePackageDetail/UpgradePackageDetail'
import { Button, Loader, Notification } from '../../../../components/elements'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateSubscribePackage,
  cleareMessage,
} from '../../../../store/actions/Admin_PackageUpgrade'
import SilverPackage from './../../../../assets/images/Silver-Package.png'
import GoldPackage from './../../../../assets/images/Gold-Package.png'
import PremiumPackage from './../../../../assets/images/Premium-Package.png'

const PackageUpgradeDetail = () => {
  const Data = useSelector((state) => state)
  const { GetSubscriptionPackage } = Data
  console.log('GetSubscriptionPackage', GetSubscriptionPackage)
  const [open, setOpen] = useState({
    open: false,
    message: '',
  })
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { state } = location
  //for Translation
  const upgradePackage = (id) => {
    dispatch(updateSubscribePackage(id, navigate, t))
  }
  const { t } = useTranslation()

  useEffect(() => {
    if (
      GetSubscriptionPackage.upgradeSubscriptionPackageResponseMessage !== '' &&
      GetSubscriptionPackage.upgradeSubscriptionPackageResponseMessage !==
        t('Organization-subscription-update')
    ) {
      setOpen({
        ...open,
        open: true,
        message:
          GetSubscriptionPackage.upgradeSubscriptionPackageResponseMessage,
      })
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: '',
        })
      }, 3000)
      dispatch(cleareMessage())
    } else {
      dispatch(cleareMessage())
    }
  }, [GetSubscriptionPackage.upgradeSubscriptionPackageResponseMessage])

  return (
    <>
      <Container className="py-4">
        <Row>
          <Col
            sm={12}
            md={12}
            lg={12}
            className={styles['upgradePackageDetailTitle']}
          >
            {t('Upgrade-your-package')}
          </Col>
        </Row>
        <Row>
          <Col sm={12} lg={12} md={12} className="mb-4">
            <Card className={styles['UpgradePackageCard']}>
              <Row>
                <Col sm={12} md={12} lg={12}>
                  {state !== null &&
                  state !== undefined &&
                  state.PackageTitle === 'gold' ? (
                    <>
                      {/* <img
                        className={styles["package-icon"]}
                        src={GoldPackage}
                        alt=""
                      /> */}
                      <span class="icon-star package-icon-style">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </span>
                    </>
                  ) : state !== null &&
                    state !== undefined &&
                    state.PackageTitle === 'basic' ? (
                    <>
                      {' '}
                      {/* <img
                        className={styles["package-icon"]}
                        src={SilverPackage}
                        alt=""
                      /> */}
                      <span class="icon-star package-icon-style">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </span>
                    </>
                  ) : state !== null &&
                    state !== undefined &&
                    state.PackageTitle === 'premium' ? (
                    <>
                      {/* <img
                        className={styles["package-icon"]}
                        src={PremiumPackage}
                        alt=""
                      /> */}
                      <span class="icon-star package-icon-style">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </span>
                    </>
                  ) : null}
                </Col>
              </Row>
              <Row className={styles['cardHeight']}>
                <Col
                  sm={12}
                  md={4}
                  lg={4}
                  className="border-right-0 position-relative"
                >
                  <h3 className={styles['packageheading']}>
                    {state.PackageTitle}
                  </h3>
                  <h4 className={styles['packageheading_amount']}>
                    ${state.PackageAmount}/
                    <span className="fs-6">{t('Month')}</span>
                  </h4>
                  <p className={styles['packageheading_desciprtion']}>
                    {t('Annually-subscription')}
                  </p>
                  <div className={styles['packageDetails']}>
                    <p>{t('Get-more-users')}</p>
                    <p className="text-center">
                      {state.UsersRangeBoardMembers} {t('Board-members')}
                      <br />
                      {state.UsersRangeAdmin} {t('Executives')} {t('And')}
                      <br /> {state.OtherUsersRange} {t('Other-users')}
                    </p>
                  </div>
                  <span className={styles['lineBar']}></span>
                </Col>
                <Col sm={12} md={8} lg={8}>
                  <Row>
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className={styles['upgradePackageAmoutnandList']}
                    >
                      <h4>{t('Included-features')}</h4>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s
                      </p>
                      <ul>
                        <li>{t('Get-more-users')}</li>
                        <li>{t('Theme-customization')}</li>
                        <li>{t('Marketing-tools')}</li>
                        <li>{t('Analytics')}</li>
                      </ul>
                    </Col>
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        text={t('Proceed-to-payment')}
                        className={styles['UpgradeBtnCard']}
                        onClick={() => upgradePackage(state.PackageID)}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col
            sm={12}
            md={12}
            lg={12}
            className="d-flex justify-content-center text-decoration-underline"
          >
            <Link
              className={styles['goBackLink']}
              to="/Diskus/Admin/UpgradePackage"
            >
              {t('Go-back')}
            </Link>
          </Col>
        </Row>
      </Container>
      {Data.GetSubscriptionPackage.Loading ? <Loader /> : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  )
}

export default PackageUpgradeDetail
