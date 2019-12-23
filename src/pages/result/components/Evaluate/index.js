import {useState} from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import {setEvaluate} from '../../service/result'
import styles from './index.less';

let timer = null
function Evaluate(props) {
  const { dispatch, goodCount, badCount, id, q } = props;
  const [good, setGood] = useState(goodCount);
  const [bad, setBad] = useState(badCount);

  const userId = Cookies.get('cnki_qa_uuid');

  function clickLike(flag){
    clearTimeout(timer);
    timer = setTimeout(function(){
      handleEvaluate(flag)
    },300)
  }

  function handleEvaluate(flag) {
    console.log(flag, q, id);
    // dispatch({
    //   type: 'result/setEvaluate',
    //   payload: {
    //     q,
    //     id,
    //     userId,
    //     isgood: flag
    //   }
    // });
    setEvaluate({q,id,userId, isgood: flag}).then(res => {
      console.log(27,res)
    })
    setGood(goodCount+1)
  }

  return (
    <div className={styles.Evaluate}>
      <span className={styles.Evaluate_action} onClick={clickLike.bind(this, 1)} style={{marginRight: 20}}>
        <Icon type="like" style={{color: '#e54020'}}></Icon>
        {good}
      </span>
      <span className={styles.Evaluate_action} onClick={clickLike.bind(this, 0)}>
        <Icon type="dislike" style={{color: '#848484'}}></Icon>
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
