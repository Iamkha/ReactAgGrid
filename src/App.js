import './App.css';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';

import Test from './Test';

import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import React from 'react';
import YearFilter from './YearFilter';

const MyComp = (params) => {
  const renderRef = useRef(1);
  return (
    <div>
      <b>({renderRef.current++})</b>
      {params.value}
    </div>
  );
};

const PushComp = (p) => {
  const onCellClicked = (e) => {
    alert(p.value + ' tau dep trai');
  };
  return (
    <div>
      <div className="flex items-center ">
        <button
          onClick={onCellClicked}
          className="border-[1px] border-orange-600 w-[60px] h-[30px] text-center  cursor-pointer rounded-md bg-slate-700 text-white font-semibold "
        >
          push
        </button>
        {p.value}
      </div>
    </div>
  );
};

class PullComp extends Component {
  render() {
    return (
      <>
        <button
          onClick={() => alert(this.props.value)}
          className="border-[1px] border-orange-600 w-[60px] h-[30px] text-center  cursor-pointer rounded-md bg-orange-400 text-white font-semibold "
        >
          Pull
        </button>
        {this.props.value}
      </>
    );
  }
}
function App() {
  const girdRef = useRef({ name: 'lua', age: '22', height: 1.5 });
  const [data, setData] = useState([]);
  const [page, setPage] = useState(10);
  const items = Math.max(10, page);

  const [columDefs, setColumDefs] = useState([
    {
      field: 'athlete',
      cellRenderer: PushComp,
      filter: 'agTextColumnFilter',
      floatingFilter: true,

      // filterParams: {
      //   buttons: ['apply', 'clear', 'cancel', 'reset'],
      // },
    },
    {
      field: 'age',
      cellRenderer: (p) => (
        <>
          <p>is age: {p.value}</p>
        </>
      ),
      filter: 'agNumberColumnFilter',
    },
    {
      field: 'country',
      cellRenderer: PullComp,
      filter: 'agMultiColumnFilter',
    },
    {
      field: 'year',
      cellRendererSelector: (p) => {
        if (p.value == 2012) {
          return { component: PushComp };
        }
        if (p.value == 2008) {
          return { component: PullComp };
        }
      },
      // filter: 'agSetColumnFilter',
      filter: YearFilter,
      filterParams: {
        title: '  kha',
        values: [2004, 2008, 2012],
      },
    },
    {
      field: 'date',
      cellRenderer: MyComp,
      // filter: 'agDateColumnFilter',
      // filterParams: {
      //   comparator: (dateFromFilter, cellValue) => {
      //     if (cellValue == null) {
      //       return 0;
      //     }
      //     const dateParts = cellValue.split('/');
      //     const day = Number(dateParts[0]);
      //     const month = Number(dateParts[1]) - 1;
      //     const year = Number(dateParts[2]);
      //     const cellDate = new Date(year, month, day);
      //     if (cellDate < dateFromFilter) {
      //       return -1;
      //     } else if (cellDate > dateFromFilter) {
      //       return 1;
      //     }
      //     return 0;
      //   },
      // },
    },
    { field: 'sport', cellRenderer: MyComp },
    { field: 'gold', cellRenderer: MyComp },
    { field: 'silver', cellRenderer: MyComp },
    { field: 'bronze', cellRenderer: MyComp },
    { field: 'total', cellRenderer: MyComp },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      enableRowGroup: true,
    }),
    []
  );
  const onCellClicked = (e) => {
    alert(e.value);
  };
  const onFirstDataRendered = (params) => {
    params.api.paginationGoToPage(page);
  };

  const pushMeClick = useCallback((e) => {
    girdRef.current.api.deselectAll();
  });
  useEffect(() => {
    fetch(
      'https://www.ag-grid.com/example-assets/olympic-winners.json'
    )
      .then((result) => result.json())
      .then((data) => setData(data));
  }, []);

  const savedFilterState = useRef();

  const onBtSave = useCallback(() => {
    const filterModel = girdRef.current.api.getFilterModel();
    console.log('save', filterModel);
    savedFilterState.current = filterModel;
  });

  const onBtApply = useCallback(() => {
    const filterModel = savedFilterState.current;
    console.log('apply', filterModel);
    girdRef.current.api.setFilterModel(filterModel);
  });
  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <div>
        <button onClick={onBtSave}>Save</button>
        <button onClick={onBtApply}>Apply</button>
        <input
          id="page-size"
          value={page}
          onChange={(e) => setPage(e.target.value)}
        />
      </div>
      <button onClick={pushMeClick}>Click Me!</button>
      <AgGridReact
        paginationPageSize={items}
        suppressScrollOnNewData={true}
        pagination={true}
        rowData={data}
        ref={girdRef}
        defaultColDef={defaultColDef}
        columnDefs={columDefs}
        rowSelection="multiple"
        animateRows={true}
        rowGroupPanelShow="always"
      />
      <Test />
    </div>
  );
}

export default App;
