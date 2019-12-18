import { connect } from 'dva';
import styles from './index.less';

function ResultPage(props) {
  const q = props.location.query.q;
  return <div className={styles.result}>{q}</div>;
}

function mapStateToProps(state) {
  return { ...state.result, ...state.global, loading: state.loading.models.result };
}
export default connect(mapStateToProps)(ResultPage);
