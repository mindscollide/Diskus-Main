import React from 'react'
import styles from './VideoCallNotStarted.module.css'
import MeetingNotStaredHandRaiseImage from '@/assets/images/VideoCall/MeetingNotStartedHandRaise.png'
import { useTranslation } from 'react-i18next'
import CustomButton from '../../../../elements/button/Button'

const VideoCallNotStarted = () => {
    const { t } = useTranslation()

    const handleClose = () => {
        console.log('Close clicked')
        console.log('window.opener:', window.opener)

        window.close()
    }

    return (
        <section className={styles.Wrapper}>

            <div className={styles.handRoundBox}>
                <img
                    src={MeetingNotStaredHandRaiseImage}
                    width={50}
                    alt=""
                />
            </div>

            <div className='my-3' >
                <p className={styles.Title}>
                    {t('The-meeting-has-not-started-yet')}
                </p>
            </div>

            <div className='mb-3' style={{ minWidth: "28%" }}>
                <p className={styles.Title_tagline}>
                    {t(
                        'Waiting-for-organizer-to-start-the-meeting-please-try-again-shortly'
                    )}
                </p>
            </div>
            <div>
                <CustomButton className={styles.CloseButton} onClick={handleClose} text={t("Close-modal")} />
            </div>
        </section>
    )
}

export default VideoCallNotStarted