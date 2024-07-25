import React from "react";
import { Table, Typography } from "antd";
import "./TableTodoDashboard.css";
const CustomTableToDoDashboard = ({
  column,
  rows,
  className,
  pagination,
  loading,
  onChange,
  id,
  locale,
  labelTitle,
  scroll,
  onRow,
  prefClassName,
}) => {
  const { Text } = Typography;

  return (
    <>
      <Text className="labelTitle">{labelTitle}</Text>

      <Table
        rowClassName={id}
        columns={column}
        dataSource={rows}
        className={className}
        locale={locale}
        loading={loading}
        onChange={onChange}
        pagination={pagination}
        scroll={scroll}
        onRow={onRow}
        prefixCls={prefClassName}
      />
    </>
  );
};

export default CustomTableToDoDashboard;
