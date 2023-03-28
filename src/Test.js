import { AgGridReact } from 'ag-grid-react';
import React from 'react';

export default function Test() {
  const rowData = [{ name: 'kha' }];
  const columnDefs = [{ field: 'name' }];
  return (
    <div>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
}
