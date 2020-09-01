import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import DomainTags from './components/DomainTags';
import HelpList from './components/HelpList';
import HelpMenu from './components/HelpMenu';

import NewHelp from '../query/components/NewHelp';
import UserInfo from './components/UserInfo';
import helpStyle from './index.less';

function NewHelpPage(props) {
  const {
    domainList,
    newHelpData,
    hotHelpData,
    dispatch,
    domain,
    size,
    index,
    uid,
    loading,
    communityNode
  } = props;
  const menus = [
    {
      key: 'newHelp',
      text: '新求助'
    }
  ];

  //点击tag响应事件
  function handleClickTag(payload) {
    dispatch({
      type: 'help/getNewQuestions',
      payload: payload
    });
  }
  function handleClickItem(item) {
    dispatch({ type: 'global/setQuestion', payload: { q: item.content } });
    router.push(
      `/reply?q=${encodeURIComponent(item.content)}&QID=${item.qid}&domain=${item.domain}`
    );
  }

  function handleSearchOrChangePage(payload) {
    dispatch({
      type: 'help/getNewQuestions',
      payload: payload
    });
  }

  return (
    <div className={helpStyle.help}>
      <div className={helpStyle.content}>
        <Row gutter={24}>
          <Col span={18} className={helpStyle.content_left}>
            <HelpMenu current="newHelp" data={menus} />
            {domainList.length ? (
              <div className={helpStyle.domainTags}>
                <DomainTags
                  localDomain={domain}
                  communityNode={communityNode}
                  data={domainList}
                  onClickTag={handleClickTag}
                />
              </div>
            ) : null}
            <HelpList
              data={newHelpData}
              domain={domain}
              size={size}
              index={index}
              loading={loading}
              uid={uid}
              communityNode={communityNode}
              handleSearchOrChangePage={handleSearchOrChangePage} //响应搜索或者分页事件
              handleClickItem={handleClickItem}
            />
          </Col>
          <Col span={6}>
            <div style={{ marginBottom: 20 }}>
              <UserInfo />
            </div>
            {hotHelpData ? (
              <NewHelp title="热门求助" data={hotHelpData.dataList.slice(0, 5)} />
            ) : null}
          </Col>
        </Row>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.help,
    loading: state.loading.models.help
  };
}
export default connect(mapStateToProps)(NewHelpPage);
