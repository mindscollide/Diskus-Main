import React from 'react'
import styles from './GroupAndCommitteeMembers.module.css'
import CrossIcon from "../../../assets/images/CrossIcon.svg";

const GroupAndCommitteeMembers = ({ data, handleClickRemoveMember, isRemove = true }) => {
    return (
        <section
            className={styles["Outer_Border-Line"]}>
            <div className="d-flex gap-2 ">
                <div>
                    <img
                        src={`data:image/jpeg;base64,${data?.data?.displayProfilePictureName}`}
                        width={50}
                        height={50}
                        alt=''
                        draggable='false'
                    />
                </div>
                <div>
                    <p
                        className={
                            styles["name-create-Committee"]
                        }>
                        {data.data.name}
                    </p>
                    <p
                        className={
                            styles[
                            "Designation-create-Committee"
                            ]
                        }>
                        {data.data.designation}
                    </p>

                    <p
                        className={
                            styles["email-create-Committee"]
                        }>
                        <a>{data.data.emailAddress}</a>
                    </p>
                </div>
            </div>
            <div>
                {isRemove && <img
                    src={CrossIcon}
                    width={18}
                    className={`${styles["CrossIcon"]} ${"cursor-pointer"}`}
                    onClick={handleClickRemoveMember}
                    draggable='false'
                    alt=''
                />}

            </div>
        </section>
    )
}

export default GroupAndCommitteeMembers