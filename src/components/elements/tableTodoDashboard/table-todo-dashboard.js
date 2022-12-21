import React from "react";
import { Table, Typography} from "antd";
import "./TableTodoDashboard.css";
const CustomTableToDoDashboard = ({
  column,
  rows,
  className,
  pagination,
  loading,
  onChange,
  id,
  labelTitle,
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
        loading={loading}
        onChange={onChange}
        pagination={pagination}
      />
    </>
  );
};

export default CustomTableToDoDashboard;
