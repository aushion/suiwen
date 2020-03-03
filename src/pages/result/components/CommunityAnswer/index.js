import React from 'react';
import Link from 'umi/link'
import styles from './index.less';
import RestTools from '../../../../utils/RestTools';

const CommunityAnswer = (props) => {
  const { question, prepared_ANSWER, user_NAME, time, qid } = props.data;
  return (
    <div className={styles.CommunityAnswer}>
      <Link to={`/reply?question=${question}&QID=${qid}`} target="_blank" className={styles.CommunityAnswer_question}>{question + '_网友回答'}</Link>
      <div
        className={styles.CommunityAnswer_answer}
        dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(prepared_ANSWER) }}
      />
      {/* {extra.resource?<div style={{ padding: '20px 0 10px' }}>参考文献：</div>:null}
      {extra.resource?<div
        dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(extra.resource ? extra.resource : '-') }}
      />:null} */}
      <div className={styles.CommunityAnswer_more}>
        <span style={{ marginRight: 20 }}>网友：{user_NAME ? user_NAME : '-'}</span>{' '}
        <span>{time ? time : '-'}</span>
      </div>
    </div>
  );
};

export default CommunityAnswer;
