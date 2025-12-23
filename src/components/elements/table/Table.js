import React from "react";
import { Table } from "antd";
import "./Table.css";
const CustomTable = ({
  column,
  rows,
  className,
  pagination,
  loading,
  id,
  labelTitle,
  expandable,
  onChange,
  locale,
  scroll,
  footer,
  prefixClassName,
  size,
  ref,
}) => {
  return (
    <>
      {labelTitle && <h4 className="labelTitle">{labelTitle}</h4>}
      <Table
        rowClassName={id}
        columns={column}
        dataSource={rows}
        className={className}
        loading={loading}
        onChange={onChange}
        pagination={pagination}
        expandable={expandable}
        footer={footer}
        locale={locale}
        prefixCls={prefixClassName}
        scroll={scroll}
        ref={ref}
        size={size}
        showSorterTooltip={false}
      />
    </>
  );
};

export default CustomTable;
