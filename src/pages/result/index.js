import { connect } from 'dva';
import { Spin, Row, Col, Icon, Divider } from 'antd';
import styles from './index.less';
import SgList from './components/SgList';
import FAQ from './components/FAQ';
import RelatedList from './components/RelatedList';
import ReferenceBook from './components/ReferenceBook';
import Journal from './components/Journal';
import Literature from './components/Literature';
import Scholar from './components/Scholar';
import NewHelp from './components/NewHelp';
import CommunityAnswer from './components/CommunityAnswer';
import Graphic from './components/Graphic';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
function ResultPage(props) {
  const {
    sgData,
    faqData,
    repositoryData,
    q,
    relatedData,
    dispatch,
    loading,
    helpList,
    communityAnswer
  } = props;

  const referenceBookData = repositoryData.filter((item) => item.dataNode[0].工具书编号);
  const cnkizhishi = repositoryData.filter((item) => item.domain === 'CNKI知识');
  const JournalData = repositoryData.filter((item) => item.domain === '期刊');
  const literatureData = repositoryData.filter((item) => item.domain === '文献');
  const scholarData = repositoryData.filter((item) => item.domain === '学者');
  const relatedLiterature =
    relatedData.length && relatedData.filter((item) => item.domain === '文献'); //相关文献
  const relatedPatent =
    relatedData.length && relatedData.filter((item) => item.domain === '专利'); //相关专利

  const communityAnswerLength = communityAnswer ? 1 : 0;

  const resultLength =
    cnkizhishi.length +
    sgData.length +
    faqData.length +
    referenceBookData.length +
    JournalData.length +
    literatureData.length +
    scholarData.length +
    communityAnswerLength;

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
            {cnkizhishi.length
              ? cnkizhishi.map((item) => <Graphic key={item.id} data={item.dataNode}></Graphic>)
              : null}
            {communityAnswer ? <CommunityAnswer data={communityAnswer}></CommunityAnswer> : null}
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
                    q={q}
                    domain={item.domain}
                    dispatch={dispatch}
                    pagination={item.pagination}
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
            {relatedLiterature.length ? (
              <RelatedList
                q={q}
                extra={{
                  time: '出版日期',
                  author: '作者',
                  source: '来源'
                }}
                title="相关文献"
                focus="题名"
                data={relatedLiterature[0].dataNode}
              />
            ) : null}
            {relatedData.length && helpList.length ? <Divider dashed /> : null}
            {relatedPatent.length ? (
              <RelatedList
                q={q}
                extra={{ time: '发表时间', author: '发明人' }}
                title="相关专利"
                focus="专利名"
                data={relatedPatent[0].dataNode}
              />
            ) : null}
            {relatedData.length && helpList.length ? <Divider dashed /> : null}

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
