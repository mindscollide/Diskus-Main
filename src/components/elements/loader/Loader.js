import React, { useEffect, useState } from 'react'
import Logo from '../../../assets/images/newElements/Diskus_newLogo.svg'
import { Container, Row, Col } from 'react-bootstrap'
import styles from './Loader.module.css'
import { useTranslation } from 'react-i18next'
import newlogo from '../../../assets/images/Newlogo.svg'

const Loader = () => {
  const { t } = useTranslation()
  const messages = [
    t('Securing-your-session-one-step-at-a-time'),
    t('Deploying-multiple-encryption-layers'),
    t('Obfuscating-network'),
    t('Containing-&-encrypting-network'),
    t('Securing-your-data'),
    t('Generating-new-key-for-security'),
    t('Encrypting-your-data'),
    t('Authenticating-your-credentials'),
    t('Generating-secure-token'),
    t('Authenticating-identity'),
    t('Containing-&-encrypting-network'),
  ]

  const [randomIndex, setRandomIndex] = useState(0)

  useEffect(() => {
    // // Get the last displayed index from local storage or start from 0
    // const lastDisplayedIndex = localStorage.getItem("lastDisplayedIndex") || 0;

    // // Calculate the next index based on the last displayed index
    // const nextIndex = (parseInt(lastDisplayedIndex) + 1) % messages.length;

    // // Save the next index in local storage
    // localStorage.setItem("lastDisplayedIndex", nextIndex);

    // // Update the state with the new index
    // setRandomIndex(nextIndex);

    // Generate a random index
    const randomIdx = Math.floor(Math.random() * messages.length)

    // Update the state with the new random index
    setRandomIndex(randomIdx)
  }, [])

  return (
    <Container className={styles['main-container']} data-tut="welcomescreen">
      <Row className={styles['overlay-box']}>
        <Col className={styles['overlay']}></Col>
        <Col className={styles['overlay-content']}>
          <img src={Logo} widt={100} height={100} />
          {localStorage.getItem('deleteContent') && (
            <p className={styles['deleteOrganizationContent']}>
              Please wait while we delete your organization relevant data…
            </p>
          )}

          <img src={newlogo} widt="269.97px" height="259.69px" />
          {localStorage.getItem('deleteContent') && (
            <p className={styles['deleteOrganizationContent']}>
              {t('Please-wait-loader')}
            </p>
          )}

          <div className={styles['loader-line']}></div>
        </Col>
      </Row>
    </Container>
  )
}

export default Loader
