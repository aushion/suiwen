import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';
import styles from './index.less';
import SgList from './components/SgList/index';
import FAQ from './components/FAQ/index';
import RelatedLiterature from './components/RelatedLiterature';
import ReferenceBook from './components/ReferenceBook';
import Journal from './components/Journal';
import Literature from './components/Literature'

function ResultPage(props) {
  // const q = props.location.query.q;
  const { sgData, faqData, repositoryData, q, relatedData, loading } = props;
  const referenceBookData = repositoryData.filter((item) => item.dataNode[0].工具书编号);
  const JournalData = repositoryData.filter((item => item.domain === '期刊'));
  const literatureData = repositoryData.filter((item => item.domain === '文献'));


  return (
    <div className={styles.result}>
      <Spin spinning={loading}>
        <Row gutter={24}>
          <Col span={18}>
            {faqData.length ? (
              <div>
                {faqData.map((item) => (
                  <FAQ key={item.id} data={item} />
                ))}
              </div>
            ) : null}
            {literatureData.length ? <Literature data={literatureData[0].dataNode}></Literature>:null}
            {Journal.length? JournalData.map(item => <Journal data={item.dataNode}></Journal>): null}
            {referenceBookData.length
              ? referenceBookData.map((item) => <ReferenceBook key={item.id} title={item.title} data={item.dataNode} />)
              : null}
            {sgData.length ? <SgList data={sgData}></SgList> : null}
          </Col>
          <Col span={6} style={{ boxShadow: '0px 0px 21px 0px rgba(1,123,254,0.22)', padding: 20 }}>
            {relatedData.length ? <RelatedLiterature q={q} data={relatedData} /> : null}
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.result, ...state.global, loading: state.loading.models.result };
}
export default connect(mapStateToProps)(ResultPage);
