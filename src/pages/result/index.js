
import { connect } from 'dva';

function Result(props) {
  const question = props.location.query.question;
  return <div>{question}</div>;
}

function mapStateToProps(state) {
  return { ...state.result };
}
export default connect(mapStateToProps)(Result);
