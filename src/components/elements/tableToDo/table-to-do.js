import React from "react";
import { Table, Typography } from "antd";
import "./TableToDo.css";

/**
 * @component CustomTableToDo
 * @description A fully-configurable Ant Design table wrapper for the To-Do module.
 * Renders an optional label above the table and forwards all standard Ant Design
 * Table props. The table is always rendered without borders and with a fixed table
 * layout. Row class names are driven by the `id` prop via `rowClassName`, enabling
 * per-row conditional styling from the parent.
 *
 * @param {Array<Object>} props.column - Column definitions for the Ant Design Table.
 * @param {Array<Object>} props.rows - Data source array; each object represents a table row.
 * @param {string} [props.className] - Additional CSS class applied to the Table element.
 * @param {Object|boolean} [props.pagination] - Ant Design pagination config or false to disable.
 * @param {boolean} [props.loading] - When true, renders a loading spinner over the table.
 * @param {Function} [props.onChange] - Callback fired on pagination, filter, or sort change.
 * @param {Object} [props.locale] - Locale object for empty-state text and other i18n strings.
 * @param {string} [props.id] - String applied as the row class name via `rowClassName`,
 *   useful for targeting specific rows with CSS.
 * @param {Object} [props.scroll] - Scroll configuration, e.g. `{ x: 1000, y: 400 }`.
 * @param {string} [props.labelTitle] - Optional text label rendered above the table
 *   using Ant Design's Typography.Text component.
 * @param {string} [props.size] - Table size: "small", "middle", or "large".
 * @param {Object} [props.rowSelection] - Row selection config for checkbox/radio selection.
 * @param {Function} [props.onRow] - Handler returning props to apply to each row element.
 * @param {Array<string>} [props.sortDirections] - Allowed sort directions, e.g. ["ascend", "descend"].
 * @param {string} [props.prefClassName] - Custom prefix class overriding Ant Design's default
 *   `prefixCls`, enabling deep style customisation without specificity conflicts.
 * @param {string} [props.rowHoverBg] - Background color applied on row hover (passed through
 *   to the Table; support depends on the Ant Design version in use).
 * @param {Function} [props.summary] - Render function for a summary/footer row inside the table body.
 * @param {boolean} [props.sticky] - When true, the table header sticks to the top while scrolling.
 * @param {Object} [props.style] - Inline style object applied to the Table element.
 * @param {boolean} [props.showHeader] - When false, hides the column header row.
 * @param {Function} [props.footer] - Render function for a footer section beneath the table.
 *
 * @example
 * <CustomTableToDo
 *   column={columns}
 *   rows={todoItems}
 *   labelTitle="My Tasks"
 *   pagination={{ pageSize: 10 }}
 *   loading={isFetching}
 *   onChange={handleTableChange}
 * />
 */
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
  style,
  showHeader,
  footer
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
        style={style}
        bordered={false}
        footer={footer}
        tableLayout="fixed"
      />
    </>
  );
};

export default CustomTableToDo;
