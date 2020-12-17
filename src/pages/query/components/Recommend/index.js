import React from 'react';
import { Link } from 'umi';
import styles from './index.less';

function Recommend({ data, q }) {
  return (
    <div className={styles.recommend}>
      <label className={styles.label} htmlFor="相关搜索">
        拓展问题：
      </label>
      <div className={styles.wrap}>
        {data.length
          ? data
              .filter((item) => item !== q)
              .map((item) => (
                <Link
                  title={item}
                  className={styles.item}
                  key={item}
                  to={`/query?q=${encodeURIComponent(item)}`}
                >
                  {item}
                </Link>
              ))
          : null}
      </div>
    </div>
  );
}

export default Recommend;
