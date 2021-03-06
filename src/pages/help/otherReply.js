import React from 'react';
import { Divider, Spin } from 'antd';
import { connect } from 'dva';
import DomainTags from './components/DomainTags';
import HelpMenu from './components/HelpMenu';
import MyAnswerList from './components/MyAnswerList';

import helpStyle from './index.less';

function OtherReply(props) {
  const { domainList, newHelpData, dispatch, domain, uid, loading } = props;
  const menus =[
    {
      key: 'otherHelp',
      text: 'TA的求助'
    },
   
    {
      key: 'otherReply',
      text: 'TA的回答'
    }
  ]
  //点击tag响应事件
  function handleClickTag(payload) {
    dispatch({
      type: 'help/getMyAnswerQuestions',
      payload: Object.assign(payload, { uid: uid }),
    });
  }

  return (
    <div className={helpStyle.help}>
      <HelpMenu current="otherReply" data={menus}></HelpMenu>

      <div className={helpStyle.content}>
        {domainList.length ? (
          <div className={helpStyle.domainTags}>
            <DomainTags localDomain={domain} data={domainList} onClickTag={handleClickTag} />
          </div>
        ) : null}
        <div>
          <Divider style={{ margin: 0 }} />
          <Spin spinning={loading}>
            {newHelpData ? <MyAnswerList from={false} data={newHelpData}></MyAnswerList> : null}
          </Spin>
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.help,
    loading: state.loading.models.help,
  };
}
export default connect(mapStateToProps)(OtherReply);
