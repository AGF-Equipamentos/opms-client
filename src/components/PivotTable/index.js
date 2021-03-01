import React, { useState } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';

const PivotTable = ({ data, ...rest }) => {
  const [state, setState] = useState(rest);

    return (
      <PivotTableUI
        data={data}
        onChange={s => setState(s)}
        {...state}
      />
    );
}

export default PivotTable;