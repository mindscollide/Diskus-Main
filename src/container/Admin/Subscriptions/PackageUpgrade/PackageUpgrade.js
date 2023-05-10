import React, { useState, useEffect } from 'react'
import { Container, Col, Row, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {
  UpgradePackageCard,
  Button,
  Loader,
} from '../../../../components/elements'
import SilverPackage from './../../../../assets/images/Silver-Package.png'
import GoldPackage from './../../../../assets/images/Gold-Package.png'
import PremiumPackage from './../../../../assets/images/Premium-Package.png'
import './../../../../i18n'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import styles from '../PackageUpgrade/PackageUpgrade.module.css'
import { packagesforUpgrade } from '../../../../store/actions/Admin_PackageUpgrade'

const PackageUpgrade = () => {
  const dispatch = useDispatch()
  const { GetSubscriptionPackage } = useSelector((state) => state)

  const [currentPackageId, setCurrentPackageId] = useState(0)
  console.log(GetSubscriptionPackage, 'GetSubscriptionPackage')
  const [monthlyPackageShow, setMonthlyPackageShow] = useState(true)
  const [upgradePackage, setUpgradePackage] = useState([
    {
      PackageID: 0,
      PackageTitle: '',
      PackageExpiryDate: '',
      PackageSubscriptionDate: '',
      PackageAmount: '',
      PackageDescription: '',
      UsersRangeAdmin: 0,
      UsersRangeBoardMembers: 0,
      OtherUsersRange: 0,
      FirstYearDiscountCharges: 0,
      PackageAnuallyDiscountAmount: 0,
    },
  ])
  //for translation
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [annualPackageShow, setAnnualPackageShow] = useState(false)

  const handleManualPackage = (packageId) => {
    setCurrentPackageId(packageId)
    setAnnualPackageShow(false)
    setMonthlyPackageShow(true)
  }
  const handleAnnualPackage = (packageId) => {
    setCurrentPackageId(packageId)
    console.log(packageId)
    setAnnualPackageShow(true)
    setMonthlyPackageShow(false)
  }
  const selectUpgrade = (data) => {
    console.log(data, 'updatedata')
    navigate('/Diskus/Admin/UpgradePackageDetail', { state: data })
  }
  const calculateAnnuallyPrice = (ActualPrice, YearlyDiscountPercentage) => {
    let calculateAnnuallyPerAmount =
      (ActualPrice * 12 * YearlyDiscountPercentage) / 100
    let calculateActualYearlyAmount = ActualPrice * 12
    let annuallyAmount =
      calculateActualYearlyAmount - calculateAnnuallyPerAmount
    return annuallyAmount.toFixed() / 12
  }
  useEffect(() => {
    dispatch(packagesforUpgrade(t))
  }, [])
  useEffect(() => {
    if (
      GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse.length >
        0 &&
      GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse !==
        null &&
      GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse !==
        undefined
    ) {
      let data = []
      GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse.map(
        (packagedetails, index) => {
          data.push({
            PackageTitle: packagedetails.packageName,
            PackageExpiryDate: '',
            PackageSubscriptionDate: '',
            PackageAmount: packagedetails.packageActualPrice,
            PackageDescription: '',
            UsersRangeAdmin: packagedetails.packageAllowedAdminUsers,
            UsersRangeBoardMembers:
              packagedetails.packageAllowedBoardMemberUsers,
            OtherUsersRange: packagedetails.packageAllowedOtherUsers,
            FirstYearDiscountCharges:
              packagedetails.yearlyPurchaseDiscountPercentage,
            PackageID: packagedetails.pK_SubscriptionPackageID,
            PackageAnuallyDiscountAmount: calculateAnnuallyPrice(
              packagedetails.packageActualPrice,
              packagedetails.yearlyPurchaseDiscountPercentage,
            ).toFixed(2),
          })
        },
      )
      setUpgradePackage(data)
    }
  }, [GetSubscriptionPackage.getSubscriptionPackageforUpgradeResponse])
  return (
    <>
      <Container className="py-4">
        <Row>
          <Col
            sm={12}
            md={12}
            lg={12}
            className={styles['UpgradeYourPackageTitle']}
          >
            {t('Upgrade-your-package')}
          </Col>
        </Row>
        <Row>
          {upgradePackage.map((data, index) => {
            console.log('datadata', data)
            return (
              <>
                <Col
                  sm={12}
                  lg={12}
                  md={12}
                  className="mb-4"
                  key={data.PackageID}
                >
                  <Card className={styles['UpgradePackageCard']}>
                    <Row>
                      <Col sm={12} md={12} lg={12}>
                        {data !== null &&
                        data !== undefined &&
                        data.PackageTitle === 'gold' ? (
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
                        ) : data !== null &&
                          data !== undefined &&
                          data.PackageTitle === 'basic' ? (
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
                        ) : data !== null &&
                          data !== undefined &&
                          data.PackageTitle === 'premium' ? (
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
                    <Row>
                      <Col
                        sm={12}
                        md={4}
                        lg={4}
                        className="border-right-0 position-relative"
                      >
                        <h3 className={styles['packageheading']}>
                          {data.PackageTitle}
                        </h3>
                        <div className={styles['packageDetails']}>
                          <p className={styles['packageDetails_P']}>
                            {t('Get-more-users')}
                          </p>
                          <p className="text-center">
                            {data.UsersRangeBoardMembers} {t('Board-members')}
                            <br />
                            {data.UsersRangeAdmin} {t('Executives')} {t('And')}
                            <br /> {data.OtherUsersRange} {t('Other-users')}
                          </p>
                        </div>
                        <span className={styles['lineBar']}></span>
                      </Col>
                      <Col
                        sm={12}
                        md={4}
                        lg={4}
                        className={styles['upgradePackageAmoutnandList']}
                      >
                        {annualPackageShow ? (
                          <h2 className={styles['crossicon1']}>
                            <del>${data.PackageAmount}/</del>
                            <span className="fs-6">{t('Month')}</span>
                          </h2>
                        ) : (
                          <h2 className={styles['crossicon']}>
                            {' '}
                            ${data.PackageAmount}/
                            <span className="fs-6">{t('Month')}</span>
                          </h2>
                        )}
                        <ul>
                          <li>{t('Get-more-users')}</li>
                          <li>{t('Theme-customization')}</li>
                          <li>{t('Marketing-tools')}</li>
                          <li>{t('Analytics')}</li>
                        </ul>
                      </Col>
                      <Col sm={12} md={4} lg={4}>
                        <div
                          className={`${styles['packagecard_priceBox_container']}`}
                        >
                          <Row>
                            <Col sm={false} md={2} lg={2}></Col>
                            <Col sm={12} md={8} lg={8} className={'m-1'}>
                              <div className="d-flex">
                                <span
                                  className={
                                    monthlyPackageShow
                                      ? `${styles['spanActive']}`
                                      : monthlyPackageShow &&
                                        currentPackageId === data.PackageID
                                      ? `${styles['spanActive']}`
                                      : monthlyPackageShow &&
                                        currentPackageId === data.PackageID
                                      ? `${styles['spanActive']}`
                                      : `${styles['span-formontly']}`
                                  }
                                  onClick={() =>
                                    handleManualPackage(data.PackageID)
                                  }
                                >
                                  {t('Monthly')}
                                </span>
                                <span
                                  className={
                                    annualPackageShow &&
                                    currentPackageId === data.PackageID
                                      ? `${styles['spanActive']}`
                                      : `${styles['span-foranually']}`
                                  }
                                  onClick={() =>
                                    handleAnnualPackage(data.PackageID)
                                  }
                                >
                                  {t('Annually')}
                                </span>
                              </div>
                            </Col>
                            <Col sm={false} md={2} lg={2}></Col>
                          </Row>
                          <Row>
                            <Col sm={12} md={12} lg={12} className="mt-4">
                              <div
                                className={
                                  annualPackageShow &&
                                  currentPackageId === data.PackageID
                                    ? `${styles['packagecard_two']} `
                                    : ` ${styles['packagecard_two_visible']} `
                                }
                              >
                                <Col
                                  className={
                                    styles['packagecard_disoucntprice']
                                  }
                                >
                                  <p
                                    className={
                                      styles['packagecard_disoucntprice_text']
                                    }
                                  >
                                    Pay only{' '}
                                    <b
                                      className={
                                        styles[
                                          'packagecard_disoucntprice_amount'
                                        ]
                                      }
                                    >
                                      ${data.PackageAnuallyDiscountAmount}/
                                    </b>{' '}
                                    month <br /> for First Year
                                  </p>
                                </Col>
                              </div>
                            </Col>
                          </Row>

                          <Button
                            text={t('Upgrade')}
                            onClick={() => selectUpgrade(data)}
                            className={styles['UpgradeBtnCard']}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </>
            )
          })}
        </Row>
      </Container>
      {GetSubscriptionPackage.Loading ? <Loader /> : null}
    </>
  )
}

export default PackageUpgrade
