import { useDispatch } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { securityEncryptionStatus } from '../../../../../store/actions/Talk_Feature_actions'
import CrossIcon from '../../../../../assets/images/Cross-Icon.png'
import SecurityIconMessasgeBox from '../../../../../assets/images/SecurityIcon-MessasgeBox.png'
import { useTranslation } from 'react-i18next'

const SecurityEncryption = () => {
  //Translation
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const closeSecurityDialogue = () => {
    dispatch(securityEncryptionStatus(false))
  }

  return (
    <Row className="encryption-box">
      <Col lg={12} md={12} sm={12} className="text-end">
        <span style={{ cursor: 'pointer' }} onClick={closeSecurityDialogue}>
          <img src={CrossIcon} style={{ width: '10px' }} />
        </span>
      </Col>
      <Col lg={12} md={12} sm={12}>
        <div className="encryption-level">
          <Row>
            <Col lg={7} md={7} sm={12}>
              <p className="level-heading">{t('Crypto-Level')}</p>
            </Col>
            <Col lg={5} md={5} sm={12} className="positionRelative">
              <p className="level">{t('NIAP-+-PQC')}</p>
              <span className="securityicon-box">
                {' '}
                <img src={SecurityIconMessasgeBox} style={{ width: '17px' }} />
              </span>
            </Col>
          </Row>
        </div>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <div className="encryption-message">
              <p>{t('Crypto-Level-Text-Para-1')}</p>
              <p> {t('Crypto-Level-Text-Para-2')}</p>{' '}
              <p>{t('Crypto-Level-Text-Para-3')}</p>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default SecurityEncryption
