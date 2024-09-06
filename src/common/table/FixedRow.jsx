import React, { useRef, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import { IconButton, TableCell, TableRow } from "@mui/material";

const FixedRow = ({
  columns,
  rowIndex,
  page,
  pageSize,
  item,
  isExpandable,
  isAllExpanded,
  renderSubRow,
}) => {
  const ref = useRef();
  const [isExpanded, setIsExpanded] = useState(isAllExpanded);

  useEffect(() => {
    setIsExpanded(isAllExpanded);
  }, [isAllExpanded]);

  const subRow = useMemo(() => renderSubRow(item), [item, renderSubRow]);

  const rowProps = item.id ? { id: item.id } : {};

  return (
    <>
      <TableRow {...rowProps}>
        {isExpandable && subRow && (
          <TableCell>
            <IconButton
              className="text-dark"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded ? "-" : "+"}
            </IconButton>
          </TableCell>
        )}

        {columns.map((column, index) => (
          <TableCell
            key={column.field || index}
            className="!text-center !text-white !border-none !text-sm"
          >
            {column.field
              ? get(item, column.field) ?? "--"
              : column.renderCell &&
                column.renderCell(item, rowIndex, page, pageSize, ref)}
          </TableCell>
        ))}
      </TableRow>

      {isExpanded && subRow && (
        <TableRow>
          <TableCell colSpan={columns.length + 1}>{subRow}</TableCell>
        </TableRow>
      )}
    </>
  );
};

FixedRow.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rowIndex: PropTypes.number,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  item: PropTypes.object,
  isExpandable: PropTypes.bool,
  isAllExpanded: PropTypes.bool,
  renderSubRow: PropTypes.func,
};

export default FixedRow;
