import React from "react";
import { Table, Typography } from "antd";
import "./TableTodoDashboard.css";

/**
 * @component CustomTableToDoDashboard
 * @description A lightweight Ant Design table wrapper tailored for the Dashboard's
 * To-Do summary view. Renders an optional label above the table and exposes a focused
 * subset of Ant Design Table props sufficient for the dashboard context. Unlike the
 * full To-Do table (CustomTableToDo), this variant omits advanced options such as row
 * selection, sort directions, sticky headers, and custom footers, keeping the dashboard
 * widget lean.
 *
 * @param {Array<Object>} props.column - Column definitions for the Ant Design Table.
 * @param {Array<Object>} props.rows - Data source array; each object represents a table row.
 * @param {string} [props.className] - Additional CSS class applied to the Table element.
 * @param {Object|boolean} [props.pagination] - Ant Design pagination config or false to disable.
 * @param {boolean} [props.loading] - When true, renders a loading spinner over the table.
 * @param {Function} [props.onChange] - Callback fired on pagination, filter, or sort change.
 * @param {string} [props.id] - String applied as the row class name via `rowClassName`.
 * @param {Object} [props.locale] - Locale object for empty-state text and other i18n strings.
 * @param {string} [props.labelTitle] - Optional text label rendered above the table
 *   using Ant Design's Typography.Text component.
 * @param {Object} [props.scroll] - Scroll configuration, e.g. `{ x: 800 }`.
 * @param {Function} [props.onRow] - Handler returning props to apply to each row element.
 * @param {string} [props.prefClassName] - Custom prefix class overriding Ant Design's default
 *   `prefixCls` for deep style customisation.
 *
 * @example
 * <CustomTableToDoDashboard
 *   column={dashboardColumns}
 *   rows={recentTodos}
 *   labelTitle="Recent Tasks"
 *   pagination={false}
 *   loading={isLoading}
 * />
 */
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
