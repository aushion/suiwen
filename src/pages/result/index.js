import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Spin, Row, Col, Icon, Divider, Modal, Input, Result, Button, message } from 'antd';
import Cookies from 'js-cookie';
import router from 'umi/router';
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
import RestTools from '../../utils/RestTools';
import Statistics from './components/Statistics';

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
    communityAnswer,
    visible,
    answerData
  } = props;
  const [submitQ, setSubmitQ] = useState(q);
  useEffect(() => {
    setSubmitQ(q);
  }, [q]);
  const referenceBookData = repositoryData.filter((item) => Array.isArray(item.dataNode) && item.dataNode[0].工具书编号); //工具书数据
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
  const statisticsData = repositoryData.filter((item) => item.domain === '统计数据');
  const communityAnswerLength = communityAnswer ? 1 : 0;

  const kaifangyuData = repositoryData.filter(
    (item) =>
      item.domain !== 'CNKI知识' &&
      item.domain !== '期刊' &&
      item.domain !== '学者' &&
      item.domain !== '文献' &&
      item.domain !== '专利' &&
      item.domain !== '医学' &&
      item.domain !== '统计数据' &&
      !item.dataNode[0].提名 &&
      !item.dataNode[0].工具书编号
  );

  const resultLength =
    cnkizhishi.length +
    sgData.length +
    faqData.length +
    referenceBookData.length +
    JournalData.length +
    literatureData.length +
    scholarData.length +
    communityAnswerLength;

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
          domain: answerData[0].domain,
          uid: RestTools.getLocalStorage('userInfo')
            ? RestTools.getLocalStorage('userInfo').UserName
            : Cookies.get('cnki_qa_uuid')
        }
      });
    }
  }

  function myReply() {
    if (RestTools.getLocalStorage('userInfo')) {
      router.push('reply');
    } else {
      message.warn('请您登录后再操作');
    }
  }

  return (
    <div className={styles.result}>
      <Spin spinning={loading} indicator={antIcon}>
        <div style={{ minHeight: 'calc(45vh)' }}>
          {answerData.length ? (
            <div className={styles.result_tips}>
              <span>为您找到{resultLength}条结果</span>

              <span
                style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }}
                onClick={showModal}
              >
                问题求助
              </span>
              <span
                style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }}
                onClick={myReply}
              >
                我来回答
              </span>
            </div>
          ) : null}
          {answerData.length || sgData.length ? (
            <Row gutter={24}>
              <Col span={18}>
                {cnkizhishi.length
                  ? cnkizhishi.map((item) => <Graphic key={item.id} data={item.dataNode} />)
                  : null}

                {statisticsData.length
                  ? statisticsData.map((item) => (
                      <Statistics
                        title={item.title}
                        id={item.id}
                        evaluate={item.evaluate}
                        intentDomain={item.intentDomain}
                        intentFocus={item.intentFocus}
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
                        year={item.dataNode.year}
                        subject={item.dataNode.subject}
                        intent={item.intentJson}
                        data={item.dataNode.data}
                        SN={item.dataNode.SN}
                        sql={item.dataNode.sql}
                        orderBy={item.dataNode.orderBy}
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
                {communityAnswer ? <CommunityAnswer data={communityAnswer} /> : null}
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

                {kaifangyuData.length
                  ? kaifangyuData.map((item) => (
                      <Graphic
                        key={item.id}
                        id={item.id}
                        data={item.dataNode}
                        title={item.title}
                        evaluate={item.evaluate}
                        intentFocus={item.intentFocus}
                      />
                    ))
                  : null}

                {faqData.length ? (
                  <div>
                    {faqData.map((item) => (
                      <FAQ key={item.id} data={item} />
                    ))}
                  </div>
                ) : null}
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

                {helpList.length ? <NewHelp data={helpList} /> : null}
              </Col>
            </Row>
          ) : !loading ? (
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
  return { ...state.result, ...state.global, loading: state.loading.models.result };
}
export default connect(mapStateToProps)(ResultPage);
