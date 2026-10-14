import React from 'react'
import styles from './VideoCallNotStarted.module.css'
import MeetingNotStaredHandRaiseImage from '@/assets/images/VideoCall/MeetingNotStartedHandRaise.png'
import { useTranslation } from 'react-i18next'
import CustomButton from '../../../../elements/button/Button'
import { useDispatch } from 'react-redux'
import { guestVideoNavigationScreen } from '../../../../../store/actions/Guest_Video'

const VideoCallNotStarted = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(guestVideoNavigationScreen(1))
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
            {/* <div>
                <CustomButton className={styles.CloseButton} onClick={handleClose} text={t("Close-modal")} />
            </div> */}
        </section>
    )
}

export default VideoCallNotStarted