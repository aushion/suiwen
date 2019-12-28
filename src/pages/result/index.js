import { connect } from 'dva';
import { Spin, Row, Col, Icon, Divider } from 'antd';
import styles from './index.less';
import SgList from './components/SgList';
import FAQ from './components/FAQ';
import RelatedLiterature from './components/RelatedLiterature';
import ReferenceBook from './components/ReferenceBook';
import Journal from './components/Journal';
import Literature from './components/Literature';
import Scholar from './components/Scholar';
import NewHelp from './components/NewHelp';
import CommunityAnswer from './components/CommunityAnswer';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
function ResultPage(props) {
  const {
    sgData,
    faqData,
    repositoryData,
    q,
    relatedData,
    loading,
    helpList,
    communityAnswer
  } = props;
  const referenceBookData = repositoryData.filter((item) => item.dataNode[0].工具书编号);
  const JournalData = repositoryData.filter((item) => item.domain === '期刊');
  const literatureData = repositoryData.filter((item) => item.domain === '文献');
  const scholarData = repositoryData.filter((item) => item.domain === '学者');

  const resultLength =
    sgData.length +
    faqData.length +
    referenceBookData.length +
    JournalData.length +
    literatureData.length +
    scholarData.length;
  return (
    <div className={styles.result}>
      <Spin spinning={loading} indicator={antIcon}>
        <div className={styles.result_tips}>为您找到{resultLength}条结果</div>
        <Row gutter={24}>
          <Col span={18}>
            {faqData.length ? (
              <div>
                {faqData.map((item) => (
                  <FAQ key={item.id} data={item} />
                ))}
              </div>
            ) : null}
            {communityAnswer ? <CommunityAnswer data = {communityAnswer}></CommunityAnswer> : null}
            {scholarData.length
              ? scholarData.map((item) => (
                  <Scholar
                    key={item.id}
                    id={item.id}
                    evaluate={item.evaluate}
                    title={item.title}
                    data={item.dataNode}
                  />
                ))
              : null}
            {literatureData.length
              ? literatureData.map((item) => (
                  <Literature
                    key={item.id}
                    id={item.id}
                    evaluate={item.evaluate}
                    data={item.dataNode}
                  />
                ))
              : null}
            {Journal.length
              ? JournalData.map((item) => (
                  <Journal
                    key={item.id}
                    id={item.id}
                    evaluate={item.evaluate}
                    data={item.dataNode}
                  />
                ))
              : null}
            {referenceBookData.length
              ? referenceBookData.map((item) => (
                  <ReferenceBook
                    key={item.id}
                    id={item.id}
                    domain={item.domain}
                    evaluate={item.evaluate}
                    title={item.title}
                    data={item.dataNode}
                  />
                ))
              : null}
            {sgData.length ? <SgList data={sgData} /> : null}
          </Col>
          <Col span={6} style={{ boxShadow: '#a5a5a5 0 0 10.8px 0', padding: 20 }}>
            {relatedData.length ? <RelatedLiterature q={q} data={relatedData} /> : null}
            {relatedData.length && helpList.length ? <Divider dashed></Divider> : null}
            {helpList.length ? <NewHelp data={helpList} /> : null}
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
