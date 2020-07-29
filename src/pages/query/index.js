import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Icon, Modal, Input, Result, Button, message, Badge, Skeleton } from 'antd';
import Link from 'umi/link';
import querystring from 'querystring';
import Cookies from 'js-cookie';
import Viewer from 'react-viewer';
import router from 'umi/router';
import findIndex from 'lodash/findIndex';
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
import Poem from './components/Poem';
import RestTools from '../../utils/RestTools';
import Sentence from './components/Sentence';

import ToolsBook from './components/ToolsBook';
import Weather from './components/Weather';
import ReadComp from './components/ReadComp';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const { TextArea } = Input;
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
    semanticData,
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
    fetchSemanticData,
    answerData
  } = props;

  const query = querystring.parse(window.location.href.split('?')[1]);
  //const historyQuestions = RestTools.getLocalStorage('SUIWEN_RECORD');
  let { topic = '' } = query;
  const [submitQ, setSubmitQ] = useState(q);
  const topicData =
    JSON.parse(window.sessionStorage.getItem('topicData')) ||
    RestTools.getLocalStorage('topicData');
  const topicindex = findIndex(topicData, { info: { topic: topic } }); //查找当前专题索引
  const [topicIndex, setTopicIndex] = useState(-1); //设置索引渲染专题tag
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
    setSubmitQ(q);
  }, [q]);

  useEffect(() => {
    setTopicIndex(topicindex);
  }, [topicindex]);

  useEffect(() => {
    document.addEventListener('copy', handleCopy);
    document.addEventListener('click', handleClick);
    return function() {
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  const referenceBookData = repositoryData.filter((item) => item.template === 'referencebook'); //工具书数据
  const JournalData = repositoryData.filter((item) => item.template === 'journal'); //期刊数据
  const literatureData = repositoryData.filter((item) => item.template === 'literature'); //文献数据
  const scholarData = repositoryData.filter((item) => item.template === 'scholar'); //学者数据
  const medicalData = repositoryData.filter((item) => item.template === 'medical'); //医学数据
  const patentData = repositoryData.filter((item) => item.template === 'patent'); //专利数据
  const poemData = repositoryData.filter((item) => item.template === 'poem'); //诗词
  const statisticsData = repositoryData.filter((item) => item.template === 'statistic'); //统计
  
  const sentenceData = repositoryData.filter((item) => item.template === 'sentence'); //句型覆盖
  const weather = repositoryData.filter((item) => item.template === 'weather');
  const kaifangyuData = repositoryData.filter((item) => item.template === 'graphic'); //开放域

  const relatedLiterature = relatedData.length
    ? relatedData.filter((item) => /文献/g.test(item.domain))
    : []; //相关文献
  const relatedPatent = relatedData.length
    ? relatedData.filter((item) => /专利/g.test(item.domain))
    : []; //相关专利

  const communityAnswerLength = communityAnswer ? 1 : 0;

  const resultLength =
    // cnkizhishi.length +
    sgData.length +
    semanticData.length +
    faqData.length +
    referenceBookData.length +
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

  function changeQuestion(e) {
    setSubmitQ(e.target.value);
  }

  function submitQuestion() {
    if (submitQ) {
      dispatch({
        type: 'result/setQuestion',
        payload: {
          q: submitQ,
          domain: answerData.length ? answerData[0].domain : '',
          uId: RestTools.getLocalStorage('userInfo')
            ? RestTools.getLocalStorage('userInfo').UserName
            : Cookies.get('cnki_qa_uuid')
        }
      });
    }
  }

  function myReply() {
    if (RestTools.getLocalStorage('userInfo')) {
      router.push(`reply?q=${encodeURIComponent(q)}`);
    } else {
      message.warn('请您登录后再操作');
    }
  }

  return (
    <div className={styles.result} id="result">
      <div style={{ minHeight: 'calc(45vh)' }}>
        <div className={styles.result_tips}>
          {resultLength ? <span>为您找到{resultLength}条结果</span> : null}

          <span style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }} onClick={showModal}>
            问题求助
          </span>
          <span style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }} onClick={myReply}>
            我来回答
          </span>
        </div>

        <Row gutter={24}>
          <Col span={4} style={{ padding: 0 }}>
            <div className={styles.topicList}>
              <div className={styles.title}>您也可以选择专题问答</div>
              <div>
                {topicData.length
                  ? topicData.map((item, index) => (
                      <div className={styles.item} key={item.name}>
                        <Link
                          to={`/special?topicId=${item.topicId}&q=${q}`}
                          target="_blank"
                          style={{
                            color: index === topicIndex ? '#0097FF' : '#43474A',
                            display: 'inline-block',
                            width: '100%',
                            padding: '8px 10px'
                          }}
                        >
                          {item.name === '阅读理解' ? (
                            <Badge
                              count={
                                <div
                                  style={{
                                    backgroundColor: '#f50',
                                    color: '#fff',
                                    fontSize: 10,
                                    top: '-2px',
                                    right: '-20px',
                                    padding: '2px'
                                  }}
                                >
                                  Beta
                                </div>
                              }
                            >
                              {item.name}专题
                            </Badge>
                          ) : (
                            item.name + '专题'
                          )}
                        </Link>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </Col>
          <Col span={15}>
            <div>
              <Skeleton loading={fetchSemanticData || loading} active>
                <div>
                  {/* {referenceBookData.length
                    ? referenceBookData.map((item) => (
                        <ReferenceBook
                          key={item.id}
                          id={item.id}
                          domain={item.domain}
                          intentDomain={item.intentDomain}
                          intentFocus={item.intentFocus}
                          evaluate={item.evaluate}
                          title={item.title}
                          data={item.dataNode}
                        />
                      ))
                    : null} */}
                  {referenceBookData.length ? <ToolsBook data={referenceBookData} /> : null}

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
                  {literatureData.length &&
                  (literatureData.length === 1 || literatureData.length === 3) ? (
                    <Literature
                      literatureData={literatureData}
                      dispatch={dispatch}
                      loading={fetchLiterature}
                    />
                  ) : null}
                  {patentData.length
                    ? patentData.map((item) => <Patent key={item.id} data={item} title={item.title} />)
                    : null}
                  {scholarData.length
                    ? scholarData.map((item) => (
                        <Scholar
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
                          evaluate={item.evaluate}
                          data={item.dataNode}
                        />
                      ))
                    : null}

                  {/* {referenceBook63.length
                    ? referenceBook63.map((item) => (
                        <ReferenceBook63
                          key={item.id}
                          id={item.id}
                          domain={item.domain}
                          intentDomain={item.intentDomain}
                          intentFocus={item.intentFocus}
                          evaluate={item.evaluate}
                          title={item.title}
                          data={item.dataNode}
                        />
                      ))
                    : null}
                  {referenceBook69.length
                    ? referenceBook69.map((item) => (
                        <ReferenceBook69
                          key={item.id}
                          id={item.id}
                          domain={item.domain}
                          intentDomain={item.intentDomain}
                          intentFocus={item.intentFocus}
                          evaluate={item.evaluate}
                          title={item.title}
                          data={item.dataNode}
                        />
                      ))
                    : null} */}
                  {sentenceData.length ? <Sentence data={sentenceData} /> : null}

                  {kaifangyuData.length
                    ? kaifangyuData.map((item) => (
                        <Graphic
                          key={item.id}
                          id={item.id}
                          q={q}
                          data={item.dataNode}
                          intentJson={item.intentJson}
                          intentDomain={item.intentDomain}
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
                  {faqData.length ? (
                    <div>
                      {faqData.map((item) => (
                        <FAQ key={item.id} data={item} />
                      ))}
                    </div>
                  ) : null}
                  {communityAnswer ? <CommunityAnswer data={communityAnswer} /> : null}
                  {weather.length ? <Weather weatherData={weather[0]} /> : null}

                  {semanticData.length ? <ReadComp data={semanticData} /> : null}
                </div>
              </Skeleton>

              <Skeleton loading={fetchSg} active>
                {sgData.length ? <SgList data={sgData} /> : null}
              </Skeleton>

              <Skeleton loading={loading || fetchSg || fetchLiterature || fetchSemanticData}>
                {!answerData.length &&
                !communityAnswer &&
                !sgData.length &&
                !semanticData.length ? (
                  <Result
                    style={{ width: 600, margin: 'auto' }}
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
            </div>
          </Col>
          <Col span={5} style={{ padding: 0 }}>
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
      <Modal
        visible={visible}
        onCancel={hideModal}
        title="提交问题"
        onOk={submitQuestion}
        confirmLoading={loading}
      >
        <TextArea rows={4} value={submitQ} onChange={changeQuestion}></TextArea>
      </Modal>
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
    fetchSg: state.loading.effects['result/getSG'] || false
  };
}
export default connect(mapStateToProps)(ResultPage);
