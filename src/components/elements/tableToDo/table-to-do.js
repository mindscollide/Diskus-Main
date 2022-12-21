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
  labelTitle,
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
        // bordered
        locale={Locale}
        
  
        pagination={pagination}
        // scroll={scroll}
      />
    </>
  );
};

export default CustomTableToDo;
