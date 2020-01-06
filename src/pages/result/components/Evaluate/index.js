import { useState } from 'react';
import { Icon, message } from 'antd';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import { setEvaluate } from '../../service/result';
import styles from './index.less';

let timer = null;
function Evaluate(props) {
  const { goodCount, badCount, id, q, isevalute } = props;
  let [good, setGood] = useState(goodCount);
  let [bad, setBad] = useState(badCount);
  let [isevaluate, setIsevaluate] = useState(isevalute);

  const userId = Cookies.get('cnki_qa_uuid');

  //函数节流
  function clickLike(flag) {
    clearTimeout(timer);
    timer = setTimeout(function() {
      handleEvaluate(flag);
    }, 300);
  }

  function handleEvaluate(flag) {
    if (flag === 0 && isevaluate === '1') {
      message.warning('您已经评价过了');
      return;
    }
    if (flag === 1 && isevaluate === '0') {
      message.warning('您已经评价过了');
      return;
    }
    //点赞
    if (flag === 1 && isevaluate !== '0') {
      setEvaluate({ q, id, userId, isgood: flag });
      setGood(isevaluate === '1' ? good - 1 : good + 1);
      setIsevaluate(isevaluate === '1' ? '' : '1');
    }
    //反对
    if (flag === 0 && isevaluate !== '1') {
      setEvaluate({ q, id, userId, isgood: flag });
      setBad(isevaluate === '0' ? bad - 1 : bad + 1);
      setIsevaluate(isevaluate === '0' ? '' : '0');
    }
  }

  return (
    <div className={styles.Evaluate}>
      <span
        className={styles.Evaluate_action}
        onClick={clickLike.bind(this, 1)}
        style={
          isevaluate === '1'
            ? { marginRight: 40, color: '#e54020' }
            : { marginRight: 40, color: '#848484' }
        }
      >
        <Icon
          type="like"
          style={isevaluate === '1' ? { color: '#e54020' } : { color: '#848484' }}
        ></Icon>
        {good}
      </span>
      <span
        style={isevaluate === '0' ? { color: '#e54020' } : { color: '#848484' }}
        className={styles.Evaluate_action}
        onClick={clickLike.bind(this, 0)}
      >
        <Icon
          type="dislike"
          style={isevaluate === '0' ? { color: '#e54020' } : { color: '#848484' }}
        ></Icon>
        {bad}
      </span>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.result,
    ...state.global
  };
}

export default connect(mapStateToProps)(Evaluate);
