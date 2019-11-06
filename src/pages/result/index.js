import { connect } from 'dva';
import styles from './index.less';

function ResultPage(props) {
  const question = props.location.query.question;
  return <div className={styles.result}>{question}</div>;
}

function mapStateToProps(state) {
  return { ...state.result, ...state.global };
}
export default connect(mapStateToProps)(ResultPage);
