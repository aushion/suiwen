import React, { useState } from 'react';
import { Tabs, Spin, Empty, Row, Col, Card, Icon, message } from 'antd';
import { Link } from 'umi';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import querystring from 'querystring';
import Literature from '../components/Literature';
import LawCase from '../components/LawCase';
import ToolsBook from '../components/ToolsBook';
import SgList from '../components/SgList';
import Graphic from '../components/Graphic';
import RelatedList from '../components/RelatedList';
import NewHelp from '../components/NewHelp';
import AskModal from '../../../components/AskModal';
import styles from './index.less';

function Law({
  repositoryData,
  sgData,
  loading,
  dispatch,
  relaventQuestions,
  relatedData = [],
  helpList
}) {
  const topicData =
    JSON.parse(window.sessionStorage.getItem('topicData')) ||
    JSON.parse(localStorage.getItem('topicData'));
  const relatedLiterature = relatedData.length
    ? relatedData.filter((item) => /文献/g.test(item.domain))
    : []; //相关文献
  const relatedPatent = relatedData.length
    ? relatedData.filter((item) => /专利/g.test(item.domain))
    : []; //相关专利
  repositoryData = repositoryData && repositoryData.filter((item) => item.intentDomain !== '案由'); //案由

  const referenceData =
    repositoryData && repositoryData.filter((item) => item.template === 'referencebook'); //工具书

  const literatureData =
    repositoryData && repositoryData.filter((item) => item.template === 'lawliterature'); //文献

  const kaifangyuData =
    repositoryData && repositoryData.filter((item) => item.template === 'graphic'); //开放域

  const { q, topic } = querystring.parse(window.location.search.substring(1));

  const [visible, setVisible] = useState(false);

  function showModal() {
    if (Cookies.get('Ecp_LoginStuts') || localStorage.getItem('userInfo')) {
      setVisible(true)
    } else {
      message.warn('请您登录后再操作');
    }
  }

  function hideModal() {
    setVisible(false);
  }

  return (
    <Spin spinning={loading}>
      <div className={styles.law}>
        <div style={{padding:'0 0 10px 0',fontSize: 15}}>
          <span style={{ marginLeft: 10, color: '#1890ff', cursor: 'pointer' }} onClick={showModal}>
            社区求助
          </span>
        </div>

        <Row gutter={24}>
          <Col span={17}>
            <Tabs type="card" tabBarGutter={0}>
              {repositoryData
                ? repositoryData.map((item, index) => {
                    return (
                      <Tabs.TabPane tab={`${item.intentDomain || item.tagName}`} key={index}>
                        {item.template === 'graphic'
                          ? kaifangyuData.map((item) => (
                              <Graphic
                                key={item.id}
                                id={item.id}
                                // q={q}
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
                        {/* 渲染工具书 */}
                        {item.tagName === '百科问答' ? <ToolsBook data={referenceData} /> : null}
                        {/* 渲染法规组件 */}
                        {item.template === 'lawpost' ? (
                          <LawCase data={item} type="lawpost" />
                        ) : null}
                        {/* 渲染法规条目 */}
                        {item.template === 'lawitem' ? (
                          <LawCase data={item} type="lawitem" />
                        ) : null}
                        {/* 渲染案例 */}
                        {item.template === 'lawcase' ? (
                          <LawCase data={item} type="lawcase" />
                        ) : null}
                        {/* 渲染法律相关论文 */}
                        {item.template === 'lawliterature' ? (
                          <Literature law literatureData={literatureData} dispatch={dispatch} />
                        ) : null}
                      </Tabs.TabPane>
                    );
                  })
                : null}
              {/* 句群 */}
              {sgData && !loading ? (
                <Tabs.TabPane tab="知识片段" key="知识片段">
                  <SgList data={sgData} needEvaluate={false} />
                </Tabs.TabPane>
              ) : null}
            </Tabs>
            {!loading && !repositoryData ? <Empty /> : null}
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
                    {topicData.filter(item => item.name!=='法律').map((item) => {
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
        <AskModal visible={visible} onTriggerCancel={hideModal} q={q} />
      </div>
    </Spin>
  );
}

function mapStateToProps(state) {
  return {
    ...state.result,
    ...state.law,
    loading: state.loading.models.law
  };
}

export default connect(mapStateToProps)(Law);
