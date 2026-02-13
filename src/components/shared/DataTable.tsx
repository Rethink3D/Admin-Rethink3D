import React from "react";
import "./DataTable.css";

interface Column<T> {
  key: string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  title?: React.ReactNode;
}

import { ChevronDown, ChevronUp } from "lucide-react";

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = "Nenhum dado encontrado",
  title,
}: DataTableProps<T>) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (loading) {
    return (
      <div className="data-table-container loading">
        <div className="data-table-loading">
          <div className="spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-wrapper">
      {title && (
        <div
          className="data-table-header"
          onClick={() => {
            if (window.innerWidth <= 768) {
              setIsExpanded(!isExpanded);
            }
          }}
        >
          {title}
          <div className="mobile-toggle mobile-only">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      )}

      {data.length === 0 ? (
        <div className="data-table-container empty">
          <div className="data-table-empty">
            <p>{emptyMessage}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="data-table-container desktop-only">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column) => (
                      <td key={column.key}>
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={`data-table-mobile mobile-only ${isExpanded ? "expanded" : "collapsed"}`}
          >
            {data.map((row, rowIndex) => (
              <div key={rowIndex} className="data-card-mobile">
                <div className="data-card-header">
                  {columns[0].render
                    ? columns[0].render(row[columns[0].key], row)
                    : row[columns[0].key]}
                </div>

                <div className="data-card-body">
                  {columns.slice(1).map((column) => (
                    <div key={column.key} className="data-card-row">
                      <span className="data-card-label">{column.label}</span>
                      <span className="data-card-value">
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default DataTable;
