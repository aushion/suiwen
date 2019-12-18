import { connect } from 'dva';
import RestTools from '../../../utils/RestTools';

function Graphic(props) {
  const { 介绍, TITLE, 工具书名称 } = props.dataNode;
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(TITLE) }} />
      <div dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(介绍) }}></div>
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
export default connect(mapStateToProps)(Graphic);
