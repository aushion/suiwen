import React, { useState } from 'react';
import { Menu, Divider } from 'antd';
import { connect } from 'dva';
import DomainTags from './components/DomainTags';
import HelpList from './components/HelpList';
import helpStyle from './index.less';

function Help(props) {
  const [current, setCurrent] = useState('newHelp');
  const { domainList, newHelpData, dispatch, domain, size, index } = props;
  const uid = JSON.parse(localStorage.getItem('userInfo')).UserName;
  function handleClick(e) {
    setCurrent(e.key);
    if (e.key === 'hotHelp') {
      dispatch({ type: 'help/getHotQuestions', payload: { domain } });
    } else if (e.key === 'newHelp') {
      dispatch({ type: 'help/getNewQuestions', payload: { domain } });
    } else if (e.key === 'myHelp') {
      dispatch({ type: 'help/getNewQuestions', payload: { domain, uid: uid } });
    }
  }
  function setPage(page) {
    switch (page) {
      case 'newHelp':
        return (
          <div>
            <Divider style={{ margin: 0 }} />
            {newHelpData ? (
              <HelpList
                data={props.newHelpData}
                domain={domain}
                dispatch={dispatch}
                size={size}
                index={index}
              ></HelpList>
            ) : null}
          </div>
        );

      case 'hotHelp':
        return (
          <div>
            <Divider style={{ margin: 0 }} />
            {newHelpData ? (
              <HelpList
                data={props.newHelpData}
                current={current}
                domain={domain}
                dispatch={dispatch}
                size={size}
                index={index}
              ></HelpList>
            ) : null}
          </div>
        );

      case 'myHelp':
        return <div>我的求助</div>;

      case 'myReply':
        return <div>我的回答</div>;

      default:
        return <div>新求助</div>;
    }
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
            <DomainTags current={current} data={domainList} dispatch={dispatch}></DomainTags>
          </div>
        ) : null}
        {setPage(current)}
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
