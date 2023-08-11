import { useDispatch } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { securityEncryptionStatus } from '../../../../../store/actions/Talk_Feature_actions'
import CrossIcon from '../../../../../assets/images/Cross-Icon.png'
import SecurityIconMessasgeBox from '../../../../../assets/images/SecurityIcon-MessasgeBox.png'

const SecurityEncryption = () => {
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
              <p className="level-heading">Crypto Level:</p>
            </Col>
            <Col lg={5} md={5} sm={12} className="positionRelative">
              <p className="level">NIAP + PQC</p>
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
              <p>
                We realize & understand that privacy & security of data is of
                pivotal requirement for any organization and its users. It is of
                utmost importance that data flowing between the end user device
                and the Talk Server is immune to data breaches, data exposure &
                data leakages. That’s why at Diskus we practice protecting
                digital information throughout its lifecycle by utilizing
                multilayered security approach.
              </p>
              <p>
                {' '}
                Following the NIAP benchmark, that requires outermost layer of
                all communicating devices must be secured by TLS using NIST
                validated algorithms (i.e. ECC-384 & AES-256) we make sure that
                the data in motion is protected to the classification level of
                Official Top Secret. Securing the communicating endpoints only
                is not sufficient and doesn’t guarantee end-to-end privacy and
                authentication and that’s where we utilize Post Quantum
                Cryptography (PQC) “Crystals - Kyber” for end-to-end encryption
                of data.
              </p>{' '}
              <p>
                PQC are the advanced form of encryption & cryptography
                algorithms that ensure security and reliability against any
                threat/attack conducted using any available Quantum Computer A
                NIST compliant Key agreement along with PQC key agreement
                generates a unique once per session key and ensures data
                encrypted using these keys can only be decrypted by intended
                recipient thus ensuring mutual authentication of a
                per session basis.
              </p>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default SecurityEncryption
