import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Icon, Divider, Modal, Input, Result, Button, message } from 'antd';
import Link from 'umi/link';
import querystring from 'querystring';
import Cookies from 'js-cookie';
import router from 'umi/router';
import findIndex from 'lodash/findIndex';
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
import Medical from './components/Medical';
import Patent from './components/Patent';
import Statistics from './components/Statistics';
import Poem from './components/Poem';
import RestTools from 'Utils/RestTools';
import Sentence from './components/Sentence';

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
    answerData
  } = props;
  const query = querystring.parse(window.location.href.split('?')[1]);
  //const historyQuestions = RestTools.getLocalStorage('SUIWEN_RECORD');
  let { topic = '' } = query;
  const [submitQ, setSubmitQ] = useState(q);
  const topicData = RestTools.getSession('topicData');
  const topicindex = findIndex(topicData, { info: { topic: topic } }); //查找当前专题索引
  const [topicIndex, setTopicIndex] = useState(-1); //设置索引渲染专题tag
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

  useEffect(() => {
    setSubmitQ(q);
  }, [q]);

  useEffect(() => {
    setTopicIndex(topicindex);
  }, [topicindex]);

  useEffect(() => {
    document.addEventListener('copy', handleCopy);
    return function() {
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  const referenceBookData = repositoryData.filter(
    (item) =>
      Array.isArray(item.dataNode) &&
      item.dataNode[0].工具书编号 &&
      item.intentDomain !== '句型覆盖'
  ); //工具书数据
  const cnkizhishi = repositoryData.filter((item) => item.domain === 'CNKI知识'); //CNKI知识数据
  const JournalData = repositoryData.filter((item) => item.domain === '期刊'); //期刊数据
  const literatureData = repositoryData.filter((item) => item.domain === '文献'); //文献数据
  const scholarData = repositoryData.filter((item) => item.domain === '学者'); //学者数据
  const relatedLiterature =
    relatedData.length && relatedData.filter((item) => item.domain === '文献'); //相关文献
  const relatedPatent = relatedData.length && relatedData.filter((item) => item.domain === '专利'); //相关专利

  const medicalData = repositoryData.filter(
    (item) => item.domain === '医学' && !item.dataNode[0].工具书编号
  );
  const patentData = repositoryData.filter((item) => item.domain === '专利'); //专利数据
  const poemData = repositoryData.filter((item) => item.domain === '诗词'); //诗词
  const statisticsData = repositoryData.filter((item) => item.domain === '统计数据');
  const sentenceData = repositoryData.filter((item) => item.intentDomain === '句型覆盖');
  const communityAnswerLength = communityAnswer ? 1 : 0;
  const kaifangyuData = repositoryData.filter(
    (item) =>
      // item.domain !== 'CNKI知识' &&
      item.domain !== '诗词' &&
      item.domain !== '期刊' &&
      item.domain !== '学者' &&
      item.domain !== '文献' &&
      item.domain !== '专利' &&
      item.domain !== '医学' &&
      item.domain !== '统计数据' &&
      !(item.dataNode && item.dataNode[0].题名) &&
      !(item.dataNode && item.dataNode[0].工具书编号)
  );

  const resultLength =
    cnkizhishi.length +
    sgData.length +
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
    dispatch({
      type: 'result/save',
      payload: {
        visible: true
      }
    });
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
          uid: RestTools.getLocalStorage('userInfo')
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
      <Spin spinning={loading} indicator={antIcon}>
        <div style={{ minHeight: 'calc(45vh)' }}>
          <div className={styles.result_tips}>
            {resultLength ? <span>为您找到{resultLength}条结果</span> : null}

            <span
              style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }}
              onClick={showModal}
            >
              问题求助
            </span>
            <span style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }} onClick={myReply}>
              我来回答
            </span>
          </div>

          {answerData.length || sgData.length ? (
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
                              target="blank"
                              style={{
                                color: index === topicIndex ? '#0097FF' : '#43474A',
                                display: 'inline-block',
                                width: '100%',
                                padding: '8px 10px'
                              }}
                            >
                              {item.name}专题
                            </Link>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
                {/* <div style={{ height: 20 }}></div>
                <Card
                  title="历史搜索"
                  headStyle={{ height: 20, lineHeight: '20px', fontSize: 14 }}
                  style={{ boxShadow: 'rgb(165, 165, 165) 0px 0px 10.8px 0px' }}
                >
                  {historyQuestions.map((item) => (
                    <div
                      key={item}
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        padding: '4px 0'
                      }}
                      title={item}
                    >
                      <Link to={`/query?q=${item}`}>{item}</Link>
                    </div>
                  ))}
                </Card> */}
              </Col>
              <Col span={15}>
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
                  ? patentData.map((item) => <Patent key={item.id} data={item} />)
                  : null}
                {referenceBookData.length
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
                  : null}
                {sentenceData.length ? <Sentence data={sentenceData} /> : null}

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

                {sgData.length ? <SgList data={sgData} /> : null}
              </Col>
              <Col span={5} style={{ boxShadow: '#a5a5a5 0 0 10.8px 0', padding: 20 }}>
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
                {relatedPatent.length && helpList.length ? <Divider dashed /> : null}
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
                {relaventQuestions.length ? (
                  <RelatedList
                    q={q}
                    title="相关问题"
                    focus="问题"
                    data={relaventQuestions}
                    topic={topic}
                  />
                ) : null}
                {relaventQuestions.length ? <Divider dashed /> : null}
                {helpList.length ? <NewHelp data={helpList} /> : null}
              </Col>
            </Row>
          ) : !loading && !fetchLiterature && !fetchSg ? (
            <Result
              icon={<Icon type="smile" theme="twoTone" />}
              title="抱歉，您输入的问题，我暂时还不能识别出它的意思。请变换一下说法再问问我^_^。（提问方式：自然语言 or 关键词）"
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
        </div>
      </Spin>

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
    loading: state.loading.effects['result/getAnswer'],
    fetchLiterature: state.loading.effects['result/getCustomView'],
    fetchSg: state.loading.effects['result/getSG']
  };
}
export default connect(mapStateToProps)(ResultPage);
