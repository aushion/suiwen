import { connect } from 'dva';
import RestTools from '../../../utils/RestTools';

function FAQ(props) {
  const { question, answer } = props.data;

  return (
    <div
      style={{ padding: 20, boxShadow: 'rgb(165, 165, 165) 0px 0px 10.8px 0px', marginBottom: 10 }}
    >
      <div style={{ overflow: 'hidden', marginBottom: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            fontSize: 20,
            marginRight: 10,
            lineHeight: '32px',
            borderRadius: '50%',
            backgroundColor: '#FFBB0E',
            color: '#fff',
            float: 'left',
            textAlign: 'center'
          }}
        >
          Q
        </div>
        <div
          style={{ fontSize: 16, color: '#0079FF', fontWeight: 400 }}
          dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(question) }}
        />
      </div>
      <div
        style={{
          overflow: 'hidden',
          background: 'rgba(238,249,255,1)',
          boxShadow: '0px 0px 21px 0px rgba(1,123,254,0.13)'
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            fontSize: 20,
            marginRight: 10,
            lineHeight: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(180deg,rgba(123,214,255,1),rgba(9,168,255,1))',
            color: '#fff',
            float: 'left',
            textAlign: 'center'
          }}
        >
          A
        </div>
        <div
          style={{ fontSize: 14, fontWeight: 400, color: '#5C5D5E' }}
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
