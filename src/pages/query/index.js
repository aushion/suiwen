import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Icon, Result, Button, message, Skeleton, Card, Popover } from 'antd';
import Link from 'umi/link';
import querystring from 'querystring';
import Cookies from 'js-cookie';
import Viewer from 'react-viewer';
import router from 'umi/router';
import styles from './index.less';
import SgList from './components/SgList';
import FAQ from './components/FAQ';
import RelatedList from './components/RelatedList';
import Journal from './components/Journal';
import Literature from './components/Literature';
import Scholar from './components/Scholar';
import NewHelp from './components/NewHelp';
import CommunityAnswer from './components/CommunityAnswer';
import Graphic from './components/Graphic';
import Medical from './components/Medical';
import Patent from './components/Patent';
import Statistics from './components/Statistics';
import Publication from './components/Statistics/publication';
import Yearbook from './components/Statistics/yearbook';
import Poem from './components/Poem';
import RestTools from '../../utils/RestTools';
import Sentence from './components/Sentence';
import ToolsBook from './components/ToolsBook';
import ToolsBookList from './components/ToolsBookList';
import Weather from './components/Weather';
import Translate from './components/Translate';
import AskModal from '../../components/AskModal';
import LawTabs from './components/LawTabs';
import Concept from './components/Concept';
import Method from './components/Concept/method';
import Technology from './components/Technology';
import Recommend from './components/Recommend';
import SgPro from './components/SgPro';
import Covid from './components/Covid';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

message.config({
  top: 150,
  duration: 2,
  maxCount: 1
});
Spin.setDefaultIndicator({ indicator: antIcon });
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
    relaventQuestions,
    communityAnswer,
    visible,
    fetchLiterature,
    fetchSg,
    fetchRecommend,
    fetchSemanticData,
    answerData,
    conceptData,
    conceptDataAttrs,
    methodData, //知识元方法数据
    methodDataAttrs, //知识元方法属性,
    recommend // 相关搜索
  } = props;

  const query = querystring.parse(window.location.href.split('?')[1]);
  let { topic = '', topicName = '' } = query;
  const topicData =
    JSON.parse(window.sessionStorage.getItem('topicData')) ||
    RestTools.getLocalStorage('topicData');

  const [imgVisible, setVisible] = useState(false); //图片状态
  const [previewImgSrc, setPreviewImgSrc] = useState('');
  function handleCopy(event) {
    if (event.target.tagName === 'INPUT') {
      return;
    }
    let clipboardData = event.clipboardData || window.clipboardData;

    if (!clipboardData) {
      return;
    }

    let text = document.selection
      ? document.selection.createRange().text
      : window.getSelection().toString();
    if (text) {
      // 如果文本存在，首先取消文本的默认事件
      event.preventDefault();

      clipboardData.setData('text/plain', text + '\n\n摘自【知网随问】');
    }
  }

  function handleClick(e) {
    if (e.target.className === 'imgpreview') {
      setVisible(true);
      setPreviewImgSrc(e.target.src);
    }
    return;
  }

  useEffect(() => {
    document.title = topicName ? `${topicName}专题-${q}` : q;
  }, [topicName, q]);

  useEffect(() => {
    document.addEventListener('copy', handleCopy);
    document.addEventListener('click', handleClick);
    return function() {
      document.removeEventListener('copy', handleCopy);
    };
  }, []);
  const faq = faqData.filter((item) => item.dataType === 0 && item.template !== 'covid'); //faq
  const covid = repositoryData.filter((item) => item.template === 'covid'); //疫情防护
  const referenceBookData = repositoryData.filter((item) => item.template === 'referencebook'); //工具书数据
  const referenceBookListData = repositoryData.filter((item) => item.template === 'booklist'); //工具书书目数据
  const JournalData = repositoryData.filter((item) => item.template === 'journal'); //期刊数据
  const literatureData = repositoryData.filter((item) => item.template === 'literature'); //文献数据
  const scholarData = repositoryData.filter((item) => item.template === 'scholar'); //学者数据
  const medicalData = repositoryData.filter((item) => item.template === 'medical'); //医学数据
  const patentData = repositoryData.filter((item) => item.template === 'patent'); //专利数据
  const poemData = repositoryData.filter((item) => item.template === 'poem'); //诗词
  const statisticsData = repositoryData.filter((item) => item.template === 'statistic'); //统计
  const publicationData = repositoryData.filter((item) => item.template === 'publication'); //统计刊物
  const yearbookData = repositoryData.filter((item) => item.template === 'yearbook'); //年鉴名录
  const sentenceData = repositoryData.filter((item) => item.template === 'sentence'); //句型覆盖
  const weather = repositoryData.filter((item) => item.template === 'weather');
  const kaifangyuData = repositoryData.filter((item) => item.template === 'graphic'); //开放域
  const translateData = repositoryData.filter((item) => item.template === 'translate'); //翻译

  const lawData = repositoryData.filter((item) => item.template.startsWith('law')); //法律类数据
  const technologyData = repositoryData.filter((item) => item.template === 'technology'); //核心技术数据

  const conceptInfo = repositoryData.filter((item) => item.template === 'concept'); //知识元概念数据
  const methodInfo = repositoryData.filter((item) => item.template === 'method'); //知识元方法数据
  const relatedLiterature = relatedData.length
    ? relatedData.filter((item) => /文献/g.test(item.domain))
    : []; //相关文献
  const relatedPatent = relatedData.length
    ? relatedData.filter((item) => /专利/g.test(item.domain))
    : []; //相关专利

  const communityAnswerLength = communityAnswer ? 1 : 0;

  const sgCount = sgData.reduce((total, item) => total + item.pagination.total, 0);

  const resultLength =
    sgCount +
    lawData.length +
    technologyData.length +
    faqData.length +
    referenceBookData.length +
    referenceBookListData.length +
    JournalData.length +
    literatureData.length +
    scholarData.length +
    communityAnswerLength +
    medicalData.length +
    patentData.length +
    poemData.length +
    sentenceData.length +
    statisticsData.length +
    kaifangyuData.length;

  function showModal() {
    // dispatch({
    //   type: 'result/save',
    //   payload: {
    //     visible: true
    //   }
    // });
    if (Cookies.get('Ecp_LoginStuts')) {
      dispatch({
        type: 'result/save',
        payload: {
          visible: true
        }
      });
    } else {
      message.warn('请您登录后再操作');
    }
  }

  function hideModal() {
    dispatch({
      type: 'result/save',
      payload: {
        visible: false
      }
    });
  }

  return (
    <div className={styles.result} id="result">
      <div style={{ minHeight: 'calc(45vh)' }}>
        <div className={styles.result_tips}>
          {resultLength ? <span>为您找到{resultLength}条结果</span> : null}
          <span style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }} onClick={showModal}>
            社区求助
          </span>
          <Popover title="您可以试试:" content={<Link to="/doc/outlineConfig">文档助手</Link>}>
            <span style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }}>问题分解</span>
          </Popover>
        </div>

        <Row gutter={16}>
          <Col span={17}>
            <div>
              {/* 阅读理解 */}
              {topic === 'YD' ? <SgPro q={q} /> : null}
              <Skeleton loading={fetchSemanticData || loading} active>
                <div>
                  {lawData.length ? <LawTabs data={lawData} q={q} /> : null}
                  {medicalData.length
                    ? medicalData.map((item) => (
                        <Medical
                          title={item.title}
                          id={item.id}
                          intentJson={item.intentJson}
                          evaluate={item.evaluate}
                          intentDomain={item.intentDomain}
                          intentFocus={item.intentFocus}
                          key={item.id}
                          data={item.dataNode}
                        />
                      ))
                    : null}
                  {referenceBookData.length ? <ToolsBook data={referenceBookData} /> : null}
                  {referenceBookListData.length ? (
                    <ToolsBookList
                      id={referenceBookListData[0].id}
                      title={
                        referenceBookListData[0].intentJson.results[0].fields.Title ||
                        referenceBookListData[0].intentJson.results[0].fields.TITLE
                      }
                      evaluate={referenceBookListData[0].evaluate}
                      data={referenceBookListData[0].dataNode}
                    />
                  ) : null}
                  {statisticsData.length
                    ? statisticsData.map((item) => (
                        <Statistics
                          title={item.title}
                          id={item.id}
                          evaluate={item.evaluate}
                          intentDomain={item.intentDomain}
                          intentFocus={item.intentFocus}
                          intentJson={item.intentJson}
                          key={item.id}
                          data={item.dataNode}
                        />
                      ))
                    : null}
                  {publicationData.length
                    ? publicationData.map((item) => (
                        <Publication
                          title={item.title}
                          id={item.id}
                          evaluate={item.evaluate}
                          intentDomain={item.intentDomain}
                          intentFocus={item.intentFocus}
                          intentJson={item.intentJson}
                          key={item.id}
                          data={item.dataNode}
                        />
                      ))
                    : null}

                  {conceptData && conceptDataAttrs ? (
                    <Concept
                      data={conceptData}
                      attrs={conceptDataAttrs}
                      intentJson={conceptInfo[0]?.intentJson}
                    />
                  ) : null}

                  {methodData && methodDataAttrs ? (
                    <Method
                      data={methodData}
                      attrs={methodDataAttrs}
                      intentJson={methodInfo[0].intentJson}
                    />
                  ) : null}
                  {technologyData.length ? <Technology data={technologyData} q={q} /> : null}
                  {yearbookData.length
                    ? yearbookData.map((item) => (
                        <Yearbook
                          title={item.title}
                          id={item.id}
                          evaluate={item.evaluate}
                          intentDomain={item.intentDomain}
                          intentFocus={item.intentFocus}
                          intentJson={item.intentJson}
                          key={item.id}
                          data={item.dataNode}
                        />
                      ))
                    : null}

                  {literatureData.length &&
                  (literatureData.length === 1 || literatureData.length === 3) ? (
                    <Literature
                      q={q}
                      literatureData={literatureData}
                      dispatch={dispatch}
                      loading={fetchLiterature}
                    />
                  ) : null}

                  {patentData.length
                    ? patentData.map((item) => (
                        <Patent key={item.id} data={item} title={item.title} />
                      ))
                    : null}
                  {scholarData.length
                    ? scholarData.map((item) => (
                        <Scholar
                          q={q}
                          key={item.id}
                          id={item.id}
                          evaluate={item.evaluate}
                          title={item.title}
                          data={item.dataNode}
                          intentJson={item.intentJson}
                        />
                      ))
                    : null}

                  {JournalData.length
                    ? JournalData.slice(0, 1).map((item) => (
                        <Journal
                          key={item.id}
                          id={item.id}
                          q={item.title}
                          evaluate={item.evaluate}
                          data={item.dataNode}
                        />
                      ))
                    : null}

                  {sentenceData.length ? <Sentence data={sentenceData} /> : null}

                  {kaifangyuData.length
                    ? kaifangyuData.map((item) => (
                        <Graphic
                          key={item.id}
                          id={item.id}
                          q={q}
                          topic={topic}
                          data={item.dataNode}
                          intentJson={item.intentJson}
                          intentDomain={item.intentDomain}
                          intentId={item.intentId}
                          domain={item.domain}
                          pagination={item.pagination}
                          title={item.title}
                          evaluate={item.evaluate}
                          intentFocus={item.intentFocus}
                          dispatch={dispatch}
                        />
                      ))
                    : null}
                  {poemData.length
                    ? poemData.map((item) => <Poem key={item.id} data={item}></Poem>)
                    : null}
                  {covid.length ? <Covid /> : null}
                  {faq.length && covid.length === 0 ? (
                    <div>
                      {faq.map((item) => (
                        <FAQ key={item.id} data={item} q={q} />
                      ))}
                    </div>
                  ) : null}

                  {communityAnswer ? <CommunityAnswer data={communityAnswer} q={q} /> : null}
                  {weather.length ? <Weather weatherData={weather[0]} q={q} /> : null}

                  {translateData.length
                    ? translateData.map((item) => (
                        <Translate
                          key={item.id}
                          id={item.id}
                          q={q}
                          data={item.dataNode}
                          intentJson={item.intentJson}
                          intentDomain={item.intentDomain}
                          domain={item.domain}
                          title={item.title}
                          evaluate={item.evaluate}
                          intentFocus={item.intentFocus}
                        />
                      ))
                    : null}
                </div>
              </Skeleton>

              <Skeleton loading={fetchSg} active>
                {sgData.length ? <SgList data={sgData} q={q} dispatch={dispatch} /> : null}
              </Skeleton>

              <Skeleton loading={loading || fetchSg || fetchLiterature} active>
                {!answerData.length && !communityAnswer && !sgData.length && topic !== 'YD' ? (
                  <Result
                    className={styles.noResult}
                    icon={<Icon type="frown" theme="twoTone" />}
                    subTitle={
                      <div style={{ textAlign: 'center' }}>
                        <p>抱歉，您输入的问题，我暂时还不能识别出它的意思。</p>
                        <p>请变换一下说法再问问我^_^。</p>
                        <p>（提问方式：自然语言 or 关键词）</p>
                      </div>
                    }
                    extra={
                      <Button
                        type="primary"
                        onClick={() => {
                          router.push('/');
                          dispatch({
                            type: 'global/setQuestion',
                            payload: {
                              q: ''
                            }
                          });
                        }}
                      >
                        回到首页
                      </Button>
                    }
                  />
                ) : null}
              </Skeleton>
              {/* 相关拓展问题 */}
              <Skeleton loading={fetchRecommend} active>
                {recommend.length ? <Recommend q={q} topic={topic} data={recommend} /> : null}
              </Skeleton>
            </div>
          </Col>
          <Col span={7}>
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
            {relatedPatent.length ? (
              <RelatedList
                q={q}
                extra={{ time: '发表时间', author: '发明人' }}
                title="相关专利"
                focus="专利名"
                data={relatedPatent[0].dataNode}
              />
            ) : null}

            {relaventQuestions.length ? (
              <RelatedList
                q={q}
                title="相关问题"
                focus="问题"
                data={relaventQuestions}
                topic={topic}
              />
            ) : null}
            {helpList.length ? <NewHelp data={helpList} /> : null}

            <div className={styles.topicWrap}>
              <Card
                title={
                  <div style={{ fontWeight: 'bold' }}>
                    <Icon type="appstore" style={{ color: 'rgb(243, 155, 39)', margin: '0 6px' }} />
                    专题问答
                  </div>
                }
              >
                {topicData.length ? (
                  <div className="display_flex">
                    {topicData
                      .filter((item) => item.name !== topicName && item.info.isBeta === 0)
                      .map((item) => {
                        return (
                          <div className={styles.item} key={item.topicId}>
                            <Link
                              to={`/special?topicId=${item.topicId}&q=${q}`}
                              target="_blank"
                              className={styles.imgWrap}
                              style={{ background: '#DDF0FF' }}
                            >
                              <img src={item.logoUrl} alt="" />
                            </Link>
                            <div>{item.name}</div>
                          </div>
                        );
                      })}
                  </div>
                ) : null}
              </Card>
            </div>
          </Col>
        </Row>
      </div>
      <Viewer
        visible={imgVisible}
        onClose={() => {
          setVisible(false);
        }}
        onMaskClick={() => {
          setVisible(false);
        }}
        images={[{ src: previewImgSrc, alt: '' }]}
      />
      <AskModal visible={visible} onTriggerCancel={hideModal} q={q} />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.result,
    ...state.global,
    loading: state.loading.effects['result/getAnswer'] || false,
    fetchLiterature: state.loading.effects['result/getCustomView'] || false,
    fetchSemanticData: state.loading.effects['result/getSemanticData'] || false,
    fetchSg: state.loading.effects['result/getSG'] || false,
    fetchRecommend: state.loading.effects['result/getRecommend'] || false
  };
}
export default connect(mapStateToProps)(ResultPage);
