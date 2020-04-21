import { connect } from 'dva';
import RestTools from '../../../utils/RestTools';

function Periodical(props) {
  const { question, answer, extra } = props.data;
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(question) }} />
      <div dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(answer) }}></div>
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
export default connect(mapStateToProps)(Periodical);
