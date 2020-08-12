import React from 'react';
import { Divider } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import DomainTags from './components/DomainTags';
import HelpList from './components/HelpList';
import HelpMenu from './components/HelpMenu';
import helpStyle from './index.less';

function OhterHelp(props) {
  const { domainList, newHelpData, dispatch, domain, size, index, uid, loading, communityNode } = props;

  const menus = [
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
      type: 'help/getNewQuestions',
      payload: Object.assign({}, payload, { uid: uid })
    });
  }
  function handleClickItem(item) {
    dispatch({ type: 'global/setQuestion', payload: { q: item.content } });
    router.push(`/reply?q=${encodeURIComponent(item.content)}&QID=${item.id}`);
  }

  function handleSearchOrChangePage(payload) {
    dispatch({
      type: 'help/getNewQuestions',
      payload: Object.assign({}, payload, { uid: uid })
    });
  }

  return (
    <div className={helpStyle.help}>
      <HelpMenu current="otherHelp" data={menus} />

      <div className={helpStyle.content}>
        {domainList.length ? (
          <div className={helpStyle.domainTags}>
            <DomainTags localDomain={domain} data={domainList} onClickTag={handleClickTag} />
          </div>
        ) : null}
        <div>
          <Divider style={{ margin: 0 }} />
          {newHelpData ? (
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
          ) : null}
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
export default connect(mapStateToProps)(OhterHelp);
