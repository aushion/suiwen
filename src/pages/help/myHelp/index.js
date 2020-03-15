import React from 'react';
import { Divider } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import DomainTags from '../components/DomainTags';
import HelpList from '../components/HelpList';
import HelpMenu from '../components/HelpMenu';
import helpStyle from './../index.less';
import RestTools from '../../../utils/RestTools';

function MyHelp(props) {
  const { domainList, newHelpData, dispatch, domain, size, index, uid, loading } = props;

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
      type: 'help/getNewQuestions',
      payload: Object.assign({}, payload, { uid: uid })
    });
  }
  function handleClickItem(item) {
    dispatch({ type: 'global/setQuestion', payload: { question: item.Content } });
    router.push(`/reply?question=${item.Content}&QID=${item.ID}`);
  }

  function handleSearchOrChangePage(payload) {
    dispatch({
      type: 'help/getNewQuestions',
      payload: Object.assign({}, payload, { uid: uid })
    });
  }

  return (
    <div className={helpStyle.help}>
      <HelpMenu current="myHelp" data={menus} />

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
              current={'myHelp'}
              uid={uid}
              dispatch={dispatch}
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
export default connect(mapStateToProps)(MyHelp);
