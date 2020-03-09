import React from 'react';
import Link from 'umi/link'
import Evaluate from '../Evaluate';
import styles from './index.less';
import RestTools from '../../../../utils/RestTools';

const CommunityAnswer = (props) => {
  const { question, prepared_ANSWER, user_NAME,answer_ID, time, qid, evaluate } = props.data;
  const {good, bad, isevalute} = evaluate;
  return (
    <div className={styles.CommunityAnswer}>
      <Link to={`/reply?question=${question}&QID=${qid}`} target="_blank" className={styles.CommunityAnswer_question}>{question + '_网友回答'}</Link>
      <div
        className={styles.CommunityAnswer_answer}
        dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(prepared_ANSWER) }}
      />
     
      <div className={styles.CommunityAnswer_more}>
        <span style={{ marginRight: 20 }}>网友：{user_NAME ? user_NAME : '-'}</span>{' '}
        <span>{time ? time : '-'}</span>
      </div>
      <div>
        <Evaluate id={answer_ID} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
    </div>
  );
};

export default CommunityAnswer;
