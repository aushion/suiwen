import { useState } from 'react';
import { connect } from 'dva';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';
import styles from './index.less';
import arrow_up from '../../../../assets/arrow_up.png';
import arrow_down from '../../../../assets/arrow_down.png';

function FAQ(props) {
  const { question, answer, id, evaluate, domain } = props.data;
  const { good, bad, isevalute } = evaluate;
  const [showAnswer, updateAnswer] = useState(
    answer.length > 500
      ? RestTools.subHtml(answer, 500, false) +
          `<a class="showMore"> 更多<img class="showMore" style="width:14px;height:8px;margin-bottom:3px" src="${arrow_down}" alt=""/></a>`
      : answer
  );

  function handleClick(e, str) {
    if (e.target.className === 'showMore') {
      updateAnswer(
        answer +
          `<a class="up" style="color:#2090E3;float:right;margin-top:20px">  收起<img class="up" style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_up}" alt=""/></a>`
      );
    } else if (e.target.className === 'up') {
      updateAnswer(
        RestTools.subHtml(answer, 500, false) +
          `<a class="showMore" style="color:#2090E3">  更多<img class="showMore" style="width:14px;height:8px;margin-bottom:3px" src="${arrow_down}" alt=""/></a>`
      );
    }
  }
  return (
    <div className={styles.FAQ}>
      <div className={styles.wrapper}>
        <div className={styles.icon}>Q</div>
        <div
          className={styles.text}
          style={{ color: '#0079FF', fontSize: 16 }}
          dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(question) }}
        />
      </div>
      <div className={styles.wrapper}>
        <div
          className={styles.icon}
          style={{
            background: 'linear-gradient(180deg,rgba(123,214,255,1),rgba(9,168,255,1))'
          }}
        >
          A
        </div>
        <div
          className={styles.text}
          onClick={(e) => handleClick(e, answer)}
          dangerouslySetInnerHTML={{
            __html: RestTools.translateToRed(showAnswer)
          }}
        />
        <div className={styles.source}>{domain} 常见问题集</div>
        <div className={styles.faq_evaluate}>
          <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.result,
    ...state.global,
    loading: state.loading.models.result
  };
}
export default connect(mapStateToProps)(FAQ);
