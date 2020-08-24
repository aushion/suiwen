import React from 'react';
import { Divider, Spin, Row, Col } from 'antd';
import { connect } from 'dva';
import DomainTags from './components/DomainTags';
import HelpMenu from './components/HelpMenu';
import MyAnswerList from './components/MyAnswerList';
import UserInfo from './components/UserInfo';
import helpStyle from './index.less';

function MyReply(props) {
  const { domainList, newHelpData, dispatch, domain, uid, loading } = props;
  const menus = [
    {
      key: 'newHelp',
      text: '新求助'
    }
  ];
  //点击tag响应事件
  function handleClickTag(payload) {
    dispatch({
      type: 'help/getMyAnswerQuestions',
      payload: Object.assign(payload, { uid: uid })
    });
  }

  return (
    <div className={helpStyle.help}>
      <div className={helpStyle.content}>
        <Row gutter={24}>
          <Col span={18} className={helpStyle.content_left}>
            <HelpMenu current="myReply" data={menus} />

            {domainList.length ? (
              <div className={helpStyle.domainTags}>
                <DomainTags localDomain={domain} data={domainList} onClickTag={handleClickTag} />
              </div>
            ) : null}
            <div>
              <Divider style={{ margin: 0 }} />
              <Spin spinning={loading}>
                {newHelpData ? <MyAnswerList from={false} data={newHelpData} /> : null}
              </Spin>
            </div>
          </Col>
          <Col span={6}>
            <UserInfo />
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
export default connect(mapStateToProps)(MyReply);
