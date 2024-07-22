import React from "react";
import { Table, Typography } from "antd";
import "./TableToDo.css";
const CustomTableToDo = ({
  column,
  rows,
  className,
  pagination,
  loading,
  onChange,
  locale,
  id,
  scroll,
  labelTitle,
  size,
  rowSelection,
  onRow,
  sortDirections,
  prefClassName,
  rowHoverBg,
  summary,
  sticky,
  showHeader
}) => {
  const { Text } = Typography;

  return (
    <>
      <Text className="labelTitle">{labelTitle}</Text>
      <Table
        rowClassName={id}
        prefixCls={prefClassName}
        columns={column}
        dataSource={rows}
        className={className}
        loading={loading}
        onChange={onChange}
        onRow={onRow}
        scroll={scroll}
        locale={locale}
        rowSelection={rowSelection}
        size={size}
        sortDirections={sortDirections}
        pagination={pagination}
        rowHoverBg={rowHoverBg}
        sticky={sticky}
        showHeader={showHeader}
      />
    </>
  );
};

export default CustomTableToDo;
