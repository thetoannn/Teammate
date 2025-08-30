import React from "react";
import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

interface AgentTableProps {
  data: any[];
  columns: ColumnsType<any>;
  loading?: boolean;
  pagination?: boolean | TablePaginationConfig;
  onRowClick?: (record: any) => void;
  className?: string;
}

const AgentTable: React.FC<AgentTableProps> = ({
  data,
  columns,
  loading = false,
  pagination = true,
  onRowClick,
  className = "",
}) => {
  const handleRowClick = (record: any) => {
    if (onRowClick) {
      onRowClick(record);
    }
  };

  const paginationConfig = pagination === true ? {} : pagination;

  return (
    <div className={`agent-table-container ${className}`}>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={paginationConfig}
        rowKey={(record) => record.id || record.key || Math.random().toString()}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: onRowClick ? "pointer" : "default" },
        })}
        className="agent-table"
        scroll={{ x: "max-content" }}
        size="small"
      />
    </div>
  );
};

export default AgentTable;
