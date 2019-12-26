import React from 'react';

import styles from './index.less';
import RestTools from '../../../../utils/RestTools';

const CommunityAnswer = (props) => {
  const { question, answer, extra } = props.data;
  return (
    <div className={styles.CommunityAnswer}>
      <div className={styles.CommunityAnswer_question}>{question + '_网友回答'}</div>
      <div
        className={styles.CommunityAnswer_answer}
        dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(answer) }}
      />
      {extra.resource?<div style={{ padding: '20px 0 10px' }}>参考文献：</div>:null}
      {extra.resource?<div
        dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(extra.resource ? extra.resource : '-') }}
      />:null}
      <div className={styles.CommunityAnswer_more}>
        <span style={{ marginRight: 20 }}>网友：{extra ? extra.userName : '-'}</span>{' '}
        <span>{extra ? extra.opTime : '-'}</span>
      </div>
    </div>
  );
};

export default CommunityAnswer;
