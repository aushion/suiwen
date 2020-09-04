import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';

import DomainTags from './components/DomainTags';
import HelpList from './components/HelpList';
import HelpMenu from './components/HelpMenu';
import WaitAnswer from './components/WaitAnswer';
import UserInfo from './components/UserInfo';
import helpStyle from './index.less';

function NewHelpPage(props) {
  const {
    domainList,
    newHelpData,
    dispatch,
    domain,
    size,
    index,
    uid,
    loading,
    communityNode,
    waitAnswer,
    userInfo
  } = props;
  const menus = [
    {
      key: 'newHelp',
      text: '新求助'
    },
    {
      key: 'hotHelp',
      text: '热门求助'
    }
  ];

  //点击tag响应事件
  function handleClickTag(payload) {
    dispatch({
      type: 'help/getNewQuestions',
      payload: payload
    });
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
            <HelpMenu current="newHelp" data={menus} dispatch={dispatch} />
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
              // handleClickItem={handleClickItem}
            />
          </Col>
          <Col span={6}>
            {userInfo ? <UserInfo /> : null}
            {waitAnswer.length ? <WaitAnswer title="等我来答" data={waitAnswer} /> : null}
          </Col>
        </Row>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.help,
    ...state.global,
    loading: state.loading.models.help
  };
}
export default connect(mapStateToProps)(NewHelpPage);
