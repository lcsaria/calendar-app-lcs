import React from 'react'
import { useTable } from 'react-table'


export const Table = ({ columns, data }) => {


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = 
  useTable ({
    columns,
    data
  })

  console.log(columns);
  return (
    <table {...getTableProps()} className="table-auto w-full">
    <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
          {headerGroup.headers.map(column => (
            <th
              {...column.getHeaderProps()}
              className="p-3 text-left text-gray-600 font-bold"
            >
              {column.render('Header')}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
      {rows.map(row => {
        prepareRow(row);
        return (
          <tr {...row.getRowProps()} className="hover:bg-gray-100">
            {row.cells.map(cell => {
              return (
                <td {...cell.getCellProps()} className="p-3">
                  {cell.render('Cell')}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  </table>
  
  )
}