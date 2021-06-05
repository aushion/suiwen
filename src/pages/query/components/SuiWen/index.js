import React from 'react';
import styles from './index.less';

function SuiWen(props) {
  return (
    <div className={styles.suiwen}>
      <h4>{props.q}</h4>
      <h2>我是知网随问</h2>
    </div>
  );
}

export default SuiWen;
