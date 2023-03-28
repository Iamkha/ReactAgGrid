import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

export default forwardRef((props, ref) => {
  console.log(props, 'props');
  const [filterState, setFilterState] = useState('off');

  useImperativeHandle(ref, () => {
    return {
      isFilterActive() {
        return filterState != 'off';
      },
      doesFilterPass(params) {
        const field = props.colDef.field;
        return params.data[field] == filterState;
      },
      getMode() {
        return false;
      },
      setModel() {},
    };
  });
  useEffect(() => {
    props.filterChangedCallback();
  }, [filterState]);

  const onListener = useCallback(() => setFilterState('on'), []);
  const offListener = useCallback(() => setFilterState('off'), []);

  return (
    <div>
      <p>{props.title}</p>
      <label>
        Filter Off
        <input
          type={'radio'}
          name="fbYearFilter"
          onChange={offListener}
          checked={filterState == 'off'}
        />
      </label>
      {props.values.map((value) => (
        <div className="">
          <button key={value} onClick={() => setFilterState(value)}>
            {value}
          </button>
        </div>
      ))}
    </div>
  );
});
