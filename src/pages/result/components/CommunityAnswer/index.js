import React,{useState} from 'react';
import Link from 'umi/link'
import {Modal} from 'antd';
import Evaluate from '../Evaluate';
import styles from './index.less';
import RestTools from '../../../../utils/RestTools';

const CommunityAnswer = (props) => {
  const { question, prepared_ANSWER, user_NAME,answer_ID, time, qid, evaluate } = props.data;
  const {good, bad, isevalute} = evaluate;
  const answer = prepared_ANSWER ?
  prepared_ANSWER.length > 300 ? prepared_ANSWER.substr(0,300) + '<a class="showMore"> 更多>></a>': prepared_ANSWER: ''
  const [visible, setVisible] = useState(false);
  const [initialText, setText] = useState('');
  function showMore(text) {
    setVisible(true);
    setText(text);
  }
 
  function handleShowMore(e, str) {
    if (e.target.className === 'showMore') {
      showMore(str.substr(300, str.length));
    }
  }
  return (
    <div className={styles.CommunityAnswer}>
      <Link to={`/reply?q=${encodeURIComponent(question)}&QID=${qid}`} target="_blank" className={styles.CommunityAnswer_question}>{question + '_网友回答'}</Link>
      <div
        onClick={(e) => handleShowMore(e, prepared_ANSWER)}
        className={styles.CommunityAnswer_answer}
        dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(answer) }}
      />
     
      <div className={styles.CommunityAnswer_more}>
        <span style={{ marginRight: 20 }}>网友：{user_NAME ? user_NAME : '-'}</span>{' '}
        <span>{time ? time : '-'}</span>
      </div>
      <div>
        <Evaluate id={answer_ID} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
      <Modal
        visible={visible}
        footer={null}
        style={{ top: 40, left: '29%' }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div
          style={{
            paddingTop: 10,
            color: '#333',
            letterSpacing: '2px',
            lineHeight: '27.2px',
            textIndent: '2em'
          }}
          dangerouslySetInnerHTML={{
            __html: RestTools.translateToRed(RestTools.formatText(initialText))
          }}
        />
      </Modal>
    </div>
  );
};

export default CommunityAnswer;
