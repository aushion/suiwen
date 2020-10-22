import React, { useState } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import Evaluate from '../Evaluate';
import styles from './index.less';
import RestTools from '../../../../utils/RestTools';
import arrow_down from '../../../../assets/arrow_down.png';
import arrow_up from '../../../../assets/arrow_up.png';
// import CaAvatar from '../../../../components/CaAvatar';

const CommunityAnswer = (props) => {
  const { question, prepared_ANSWER, user_NAME, answer_ID, time, qid, evaluate } = props.data;
  const { good, bad, isevalute } = evaluate;

  const [answer, updateAnswer] = useState(
    prepared_ANSWER.length > 500
      ? RestTools.removeHtmlTag(prepared_ANSWER).substr(0, 500) +
          `<a class="showMore" style="color:#2090E3"> 更多<img class="showMore" style="width:14px;height:8px;margin-bottom:3px" src="${arrow_down}" alt=""/></a>`
      : prepared_ANSWER
  );

  function handleClick(e) {
    if (e.target.className === 'showMore') {
      updateAnswer(
        prepared_ANSWER +
          `<a class="up" style="color:#2090E3;float:right;display:block;"> 收起<img class="up" style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_up}" alt=""/></a>`
      );
    } else if (e.target.className === 'up') {
      updateAnswer(
        RestTools.removeHtmlTag(prepared_ANSWER).substr(0, 500) +
          `<a class="showMore" style="color:#2090E3"> 更多<img class="showMore" style="width:14px;height:8px;margin-bottom:3px" src="${arrow_down}" alt=""/></a>`
      );
    }
  }

  return (
    <div className={styles.CommunityAnswer}>
      <h2>
        <Link
          to={`/reply?q=${encodeURIComponent(question)}&QID=${qid}`}
          target="_blank"
          // className={styles.CommunityAnswer_question}
        >
          {props.q}
        </Link>
        <span> - 随问社区</span>
      </h2>
      <div
        // to={`/reply?q=${encodeURIComponent(question)}&QID=${qid}`}
        // target="_blank"
        style={{
          display: 'block',
          fontSize: 17,
          paddingBottom: 10,
          fontWeight: '400',
          // textIndent: '1em'
        }}
      >
        <Icon type="question-circle" style={{ color: '#1890ff', marginRight: 4 }} />
        {question}
      </div>

      <div
        onClick={(e) => handleClick(e, prepared_ANSWER)}
        className={styles.CommunityAnswer_answer}
        dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(answer) }}
      />

      <div className={styles.CommunityAnswer_more}>
        <span style={{ marginRight: 20 }}>
          网友：
          {RestTools.formatPhoneNumber(user_NAME)}
        </span>
        <span>{time ? time : '-'}</span>
      </div>
      <div>
        <Evaluate id={answer_ID} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
    </div>
  );
};

export default CommunityAnswer;
