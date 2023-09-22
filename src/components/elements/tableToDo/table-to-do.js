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
        locale={locale}
        rowSelection={rowSelection}
        size={size}
        pagination={pagination}
        // filterDropdown={(filterProps) => (
        //   <div>
        //     {/* filter dropdown content */}
        //     <Button onClick={filterProps.confirmFilter}>Custom OK Text</Button>
        //   </div>
        // )}
        // scroll={scroll}
      />
    </>
  );
};

export default CustomTableToDo;
