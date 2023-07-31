import React from 'react'
import styles from './Pagination.module.css'
import { Pagination } from 'antd'
const PaginationElement = ({ showSizeChanger, current, showTotal, pageSize, pageSizeOptions, onChange, locale }) => {
    return (
        <>
            <Pagination showSizeChanger={showSizeChanger} pageSize={pageSize} className={styles["PaginationStyle"]} current={current} showTotal={showTotal} pageSizeOptions={pageSizeOptions} onChange={onChange} locale={locale} />
        </>
    )
}

export default PaginationElement