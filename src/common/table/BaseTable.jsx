import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import PropTypes from "prop-types";
import FixedRow from "./FixedRow";
import Pagination from "./Pagination";
import Loading from "../Loading";

const usePagination = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const next = useCallback(() => setPage((prev) => prev + 1), []);
  const previous = useCallback(() => setPage((prev) => prev - 1), []);
  const first = useCallback(() => setPage(1), []);
  const last = useCallback(() => setPage(totalPages), [totalPages]);
  const gotoPage = useCallback((page) => setPage(page), []);

  return {
    page,
    totalPages,
    setTotalPages,
    next,
    previous,
    first,
    last,
    gotoPage,
  };
};

const BaseTable = ({
  columns,
  data,
  id,
  className,
  style,
  headerClassName,
  bodyClassName,
  pagination,
  pageSize,
  paginationType,
  serverSidePaginationConfig,
  isExpandable,
  isDefaultExpanded,
  renderSubRow,
}) => {
  const [rowData, setRowData] = useState([]);
  const [isAllExpanded, setIsAllExpanded] = useState(isDefaultExpanded);

  const paginate = usePagination();
  const { page, setTotalPages } = paginate;

  useEffect(() => {
    if (!pagination) {
      setRowData(data);
    }
  }, [pagination, data]);

  useEffect(() => {
    if (pagination && paginationType === "clientSide") {
      setTotalPages(Math.ceil(data.length / pageSize));
      const rowData = data.slice(pageSize * (page - 1), pageSize * page);
      setRowData(rowData);
    }
  }, [page, pageSize, paginationType, data, pagination, setTotalPages]);

  useEffect(() => {
    if (
      pagination &&
      paginationType === "serverSide" &&
      serverSidePaginationConfig.endpoint
    ) {
    }
  }, [pagination, paginationType, serverSidePaginationConfig.endpoint]);

  return (
    <div className="overflow-x-auto overflow-y-auto">
      <Loading isLoading={false} />

      <Table
        id={id}
        className={`rounded-md ${className}`}
        sx={{ backgroundColor: "#2E2E32", ...style }}
      >
        <TableHead className={headerClassName}>
          <TableRow>
            {isExpandable && !!rowData.length && (
              <TableCell sx={{ width: "10px" }}>
                <IconButton
                  className="text-white"
                  onClick={() => setIsAllExpanded((prev) => !prev)}
                >
                  {isAllExpanded ? "-" : "+"}
                </IconButton>
              </TableCell>
            )}
            {columns.map((column, index) => (
              <TableCell
                className="!text-white !text-center !text-sm"
                key={column.field || index}
                {...(column.columnProps ?? {})}
              >
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className={bodyClassName}>
          {rowData.length ? (
            rowData.map((item, rowIndex) => (
              <FixedRow
                key={`${item.id}-${page}-${rowIndex}`}
                rowIndex={rowIndex}
                columns={columns}
                page={page}
                pageSize={pageSize}
                item={item}
                isExpandable={isExpandable}
                isAllExpanded={isAllExpanded}
                renderSubRow={renderSubRow}
              />
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="!text-center !text-white !text-lg !border-none"
              >
                No Data Available !
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && <Pagination paginate={paginate} style={style} />}
    </div>
  );
};

BaseTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.shape({}),
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  pagination: PropTypes.bool,
  pageSize: PropTypes.number,
  paginationType: PropTypes.oneOf(["serverSide", "clientSide"]),
  serverSidePaginationConfig: PropTypes.shape({
    endpoint: PropTypes.string,
  }),
  isExpandable: PropTypes.bool,
  isDefaultExpanded: PropTypes.bool,
  renderSubRow: PropTypes.func,
};

BaseTable.defaultProps = {
  columns: [],
  data: [],
  id: "",
  className: "",
  style: {},
  headerClassName: "",
  bodyClassName: "",
  pagination: false,
  pageSize: 20,
  paginationType: "clientSide",
  serverSidePaginationConfig: {
    endpoint: "",
  },
  isExpandable: false,
  isDefaultExpanded: false,
  renderSubRow: () => null,
};

export default BaseTable;
