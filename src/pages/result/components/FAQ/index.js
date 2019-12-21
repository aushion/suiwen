import { connect } from 'dva';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

function FAQ(props) {
  const { question, answer } = props.data;

  return (
    <div className={styles.FAQ}>
      <div className={styles.wrapper}>
        <div className={styles.icon}>Q</div>
        <div
          className={styles.text}
          style={{ color: '#0079FF' }}
          dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(question) }}
        />
      </div>
      <div className={styles.wrapper}>
        <div
          className={styles.icon}
          style={{
            background:
              'linear-gradient(180deg,rgba(123,214,255,1),rgba(9,168,255,1))'
          }}
        >
          A
        </div>
        <div
          className={styles.text}
          style={{ color: '#5C5D5E' }}
          dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(answer) }}
        />
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
