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
  Locale,
  id,
  scroll,
  labelTitle,
  size,
  rowSelection,
  onRow
}) => {
  console.log("CustomTableToDO", className);

  const { Text } = Typography;

  return (
    <>
      <Text className="labelTitle">{labelTitle}</Text>
      <Table
        rowClassName={id}
        // rowSelection={rowSelection}
        columns={column}
        dataSource={rows}
        className={className}
        loading={loading}
        onChange={onChange}
        onRow={onRow}
        // bordered
        scroll={scroll}
        locale={Locale}
        rowSelection={rowSelection}
        size={size}
        pagination={pagination}
      // scroll={scroll}
      />
    </>
  );
};

export default CustomTableToDo;
