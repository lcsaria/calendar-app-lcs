import React from "react";
import { useTable } from "react-table";

export const Table = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  console.log(columns);
  return (
    <div class="overflow-x-auto">
    <table {...getTableProps()} className="table-auto w-full sm:table-fixed">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                className="px-4 py-2 text-left text-gray-600 font-bold"
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
        {rows.length === 0 ? (
          <>
            <tr>
            <div className="">No Data</div>
            </tr>
            
          </>
        ) : (
          rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-100">
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="px-4 py-2">
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
    </div>
  );
};
