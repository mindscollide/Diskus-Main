import React from 'react'
import styles from './AttendeesCardGroupAndCommittee.module.css'
import { Checkbox } from 'antd'
const GroupAndCommitteeMembersCard = ({ members, isExists, handleChange, index }) => {
    return (
        <>
            <section className='d-flex justify-content-between  pe-4' style={{ width: '100%' }}>
                <div className='d-flex align-items-center gap-2'>
                    <div >
                        <img
                            src={`data:image/jpeg;base64,${members?.displayProfilePictureName}`}
                            width={50}
                            height={50}
                            alt=''
                            draggable='false'
                        />
                    </div>
                    <div className={styles["MembersBox"]}>
                        <span
                            className={
                                styles[
                                "name-create-Committee"
                                ]
                            }>
                            {members.name}
                        </span>
                        <span
                            className={
                                styles[
                                "Designation-create-Committee"
                                ]
                            }>
                            {members.designation}
                        </span>
                        <span
                            className={
                                styles[
                                "email-create-Committee"
                                ]
                            }>
                            {members.emailAddress}
                        </span>
                    </div>
                </div>
                <div className='d-flex align-items-start justify-content-start' >
                    <Checkbox
                        checked={isExists
                        }
                        classNameDiv=""
                        onChange={handleChange
                        }
                        className={
                            styles["RememberEmail"]
                        }
                    />
                </div>
            </section>
        </>
    )
}

export default GroupAndCommitteeMembersCard