import React, { useRef } from 'react';

import styles from './index.less';
import SgListView from '../../../../components/SgListView';

function SgList(props) {
  const { data, q, dispatch, loading } = props;

  const sgRef = useRef(null);

  function handlePageChange(params) {
    const top = document.getElementById('sg').offsetTop;
    window.localStorage.setItem('sgTop', top);
    dispatch({
      type: 'result/getSG',
      payload: { ...params, q: encodeURIComponent(q) }
    });
  }

  return (
    <div className={`${styles.SgList} copy`} id="sg" ref={sgRef}>
      <h2>
        <a
          href={`https://kns.cnki.net/KNS8/DefaultResult/Index?dbcode=CJFQ&kw=${q}&korder=FT`}
          rel="noreferrer"
          target="_blank"
        >
          <span>知网文献</span>
        </a>{' '}
        - 片段重组
      </h2>
      <div>
        <SgListView
          data={data}
          q={q}
          loading={loading}
          needEvaluate
          dispatch={dispatch}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default React.memo(SgList);
