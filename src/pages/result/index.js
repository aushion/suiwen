import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';
import styles from './index.less';
import SgList from './components/SgList/index';
import FAQ from './components/FAQ/index';
import RelatedLiterature from './components/RelatedLiterature';

function ResultPage(props) {
  // const q = props.location.query.q;
  const { sgData, faqData, reposityData, q, relatedData, loading } = props;

  return (
    <div className={styles.result}>
      <Spin spinning={loading}>
        <Row gutter={24}>
          <Col span={18}>
            {faqData.length ? (
              <div>
                {faqData.map((item) => (
                  <FAQ data={item} />
                ))}
              </div>
            ) : null}
            {sgData.length ? <SgList data={sgData}></SgList> : null}
          </Col>
          <Col span={6}>
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
