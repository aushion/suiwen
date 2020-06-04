import React from 'react';
import { Divider, Spin } from 'antd';
import { connect } from 'dva';
import DomainTags from './components/DomainTags';
import HelpMenu from './components/HelpMenu';
import MyAnswerList from './components/MyAnswerList';
import RestTools from '../../utils/RestTools';
import helpStyle from './index.less';

function MyReply(props) {
  const { domainList, newHelpData, dispatch, domain, uid, loading } = props;
  const menus = RestTools.getLocalStorage('userInfo')
    ? [
        {
          key: 'newHelp',
          text: '新求助'
        },
        {
          key: 'hotHelp',
          text: '热门求助'
        },
        {
          key: 'myHelp',
          text: '我的求助'
        },
        {
          key: 'myReply',
          text: '我的回答'
        }
      ]
    : [
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
      type: 'help/getMyAnswerQuestions',
      payload: Object.assign(payload, { uid: uid })
    });
  }

  return (
    <div className={helpStyle.help}>
      <HelpMenu current="myReply" data={menus}></HelpMenu>

      <div className={helpStyle.content}>
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
