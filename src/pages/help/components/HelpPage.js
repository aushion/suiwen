import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import { connect } from 'dva';

import DomainTags from './DomainTags';
import HelpList from './HelpList';
import HelpMenu from './HelpMenu';
import WaitAnswer from '../../../components/WaitAnswer';
import AskModal from '../../../components/AskModal';
import UserInfo from './UserInfo';
import helpStyle from '../index.less';

function HelpPage(props) {
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
    current,
    userInfo
  } = props;
  const menus = [
    { key: 'newHelp', text: '新求助' },
    { key: 'hotHelp', text: '热门求助' },
    { key: 'needHelp', text: '待解决' }
  ];

  const actionType = {
    newHelp: 'help/getNewQuestions',
    hotHelp: 'help/getHotQuestions',
    needHelp: 'help/getNeedHelpQuestions'
  };
  const [visible, setVisible] = useState(false);

  //点击tag响应事件
  function handleClickTag(payload) {
    dispatch({
      type: actionType[current],
      payload: payload
    });
  }

  function handleSearchOrChangePage(payload) {
    dispatch({
      type: actionType[current],
      payload: payload
    });
  }

  return (
    <div className={helpStyle.help}>
      <div className={helpStyle.content}>
        <Row gutter={24}>
          <Col span={18} className={helpStyle.content_left}>
            <HelpMenu current={current} data={menus} dispatch={dispatch} />
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
            <WaitAnswer title="等我来答" />
            <Button
              // type="primary"
              style={{ marginTop: 10 }}
              block
              onClick={() => {
                setVisible(true);
              }}
            >
              我要提问
            </Button>
          </Col>
        </Row>
      </div>
      <AskModal
        visible={visible}
        onTriggerCancel={() => {
          setVisible(false);
        }}
      />
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
export default connect(mapStateToProps)(HelpPage);
