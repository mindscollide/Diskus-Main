import React from 'react'
import styles from './Pagination.module.css'
import { Pagination } from 'antd'

/**
 * @component PaginationElement
 * @description A thin wrapper around the Ant Design `Pagination` component that
 * applies the platform-wide pagination CSS class and forwards all necessary
 * control props. Centralising the component ensures consistent styling and makes
 * it easy to swap out the underlying pagination library in the future.
 *
 * @param {boolean}        showSizeChanger  - Whether to render the page-size selector dropdown.
 * @param {number}         current          - The currently active page number (1-indexed).
 * @param {Function}       showTotal        - Function `(total, range) => string` that renders the total-count label.
 * @param {number}         pageSize         - Number of items displayed per page.
 * @param {Array<number>}  pageSizeOptions  - List of page-size choices shown in the size-changer dropdown.
 * @param {Function}       onChange         - Callback `(page, pageSize) => void` fired when page or page-size changes.
 * @param {object}         locale           - Ant Design locale object for internationalising pagination labels.
 *
 * @example
 * <PaginationElement
 *   current={currentPage}
 *   pageSize={10}
 *   showSizeChanger={true}
 *   pageSizeOptions={[10, 25, 50]}
 *   showTotal={(total) => `Total ${total} items`}
 *   onChange={handlePageChange}
 * />
 */
const PaginationElement = ({ showSizeChanger, current, showTotal, pageSize, pageSizeOptions, onChange, locale }) => {
    return (
        <>
            <Pagination showSizeChanger={showSizeChanger} pageSize={pageSize} className={styles["PaginationStyle"]} current={current} showTotal={showTotal} pageSizeOptions={pageSizeOptions} onChange={onChange} locale={locale} />
        </>
    )
}

export default PaginationElement