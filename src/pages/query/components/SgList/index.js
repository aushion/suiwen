import React, { useRef, useEffect } from 'react';

import styles from './index.less';
import SgListView from '../../../../components/SgListView';
// let nameIndex = 0; //计数点击分页是在那个类目下面
function SgList(props) {
  const { data, q, dispatch } = props;

  const sgRef = useRef(null);
  useEffect(() => {
    const sgTop = window.localStorage.getItem('sgTop');
    if (sgTop) {
      document.body.scrollTop = document.documentElement.scrollTop = Number(sgTop); //页面滚动到记忆位置
    }
    return () => {};
  }, []);

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
        <SgListView data={data} q={q} needEvaluate dispatch={dispatch} />
      </div>
    </div>
  );
}

export default React.memo(SgList);
