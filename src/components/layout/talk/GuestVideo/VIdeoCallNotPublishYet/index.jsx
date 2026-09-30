import React from 'react'
import styles from './VideoCallNotStarted.module.css'
import MeetingNotStaredHandRaiseImage from '@/assets/images/VideoCall/MeetingNotStartedHandRaise.png'
import { useTranslation } from 'react-i18next'

const VideoCallNotPublishedYet = () => {
    const { t } = useTranslation()


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
                    {t('The-meeting-has-not-published-yet')}
                </p>
            </div>

            {/* <div className='mb-3' style={{ minWidth: "28%" }}>
                <p className={styles.Title_tagline}>
                    {t(
                        'Waiting-for-organizer-to-start-the-meeting-please-try-again-shortly'
                    )}
                </p>
            </div> */}
            {/* <div>
                <CustomButton className={styles.CloseButton} onClick={handleClose} text={t("Close-modal")} />
            </div> */}
        </section>
    )
}

export default VideoCallNotPublishedYet