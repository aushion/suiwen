import React, { useState } from 'react';
import { Menu, Divider } from 'antd';
import { connect } from 'dva';
import DomainTags from './components/DomainTags';
import HelpList from './components/HelpList';
import helpStyle from './index.less';

function Help(props) {
  const [current, setCurrent] = useState('newHelp');
  const { domainList, newHelpData, dispatch, domain, size, index, uid } = props;
  //点击菜单响应事件
  function handleClick(e) {
    setCurrent(e.key);
    if (e.key === 'hotHelp') {
      dispatch({ type: 'help/getHotQuestions', payload: { domain, size: 15, index: 1 } });
    } else if (e.key === 'newHelp') {
      dispatch({ type: 'help/getNewQuestions', payload: { domain, size: 15, index: 1 } });
    } else if (e.key === 'myHelp') {
      dispatch({ type: 'help/getNewQuestions', payload: { domain, uid, size: 15, index: 1 } });
    } else if (e.key === 'myReply') {
      dispatch({ type: 'help/getMyAnswerQuestions', payload: { domain, uid, size: 15, index: 1 } });
    }
  }

  //点击tag响应事件
  function handleClickTag(payload) {
    if (current === 'newHelp') {
      dispatch({ type: 'help/getNewQuestions', payload });
    } else if (current === 'hotHelp') {
      dispatch({ type: 'help/getHotQuestions', payload });
    }
  }

  function dispatchHanlder(current, payload) {
    if (current === 'newHelp') {
      dispatch({
        type: 'help/getNewQuestions',
        payload: payload,
      });
    } else if (current === 'hotHelp') {
      dispatch({
        type: 'help/getHotQuestions',
        payload: payload,
      });
    } else if (current === 'myHelp') {
      dispatch({
        type: 'help/getNewQuestions',
        payload: Object.assign({}, payload, { uid: props.uid }),
      });
    }
  }

  function handleSearchOrChangePage(payload) {
    dispatchHanlder(current, payload);
  }

  return (
    <div className={helpStyle.help}>
      <Menu
        style={{ paddingLeft: '18.75%' }}
        theme="light"
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
      >
        <Menu.Item key="newHelp">新求助</Menu.Item>
        <Menu.Item key="hotHelp">热门求助</Menu.Item>
        <Menu.Item key="myHelp">我的求助</Menu.Item>
        <Menu.Item key="myReply">我的回答</Menu.Item>
      </Menu>

      <div className={helpStyle.content}>
        {domainList.length ? (
          <div className={helpStyle.domainTags}>
            <DomainTags data={domainList} onClickTag={handleClickTag} />
          </div>
        ) : null}
        <div>
          <Divider style={{ margin: 0 }} />
          {newHelpData ? (
            <HelpList
              data={newHelpData}
              current={current}
              domain={domain}
              size={size}
              index={index}
              uid={uid}
              handleSearchOrChangePage={handleSearchOrChangePage} //响应搜索或者分页事件
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.help,
  };
}
export default connect(mapStateToProps)(Help);