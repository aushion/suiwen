import React from 'react';
import { Divider, Empty } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import DomainTags from '../components/DomainTags';
import HelpList from '../components/HelpList';
import HelpMenu from '../components/HelpMenu';
import helpStyle from './../index.less';

function NewHelp(props) {

  const { domainList, newHelpData, dispatch, domain, size, index, uid, loading } = props;
  //点击tag响应事件
  function handleClickTag(payload) {
    dispatch({
      type: 'help/getNewQuestions',
      payload: payload,
    });
  }
  function handleClickItem(item) {
    dispatch({ type: 'global/setQuestion', payload: { question: item.Content } });
    router.push(`/reply?question=${item.Content}&QID=${item.ID}&domain=${item.Domain}`);
  }

  function handleSearchOrChangePage(payload) {
    dispatch({
      type: 'help/getNewQuestions',
      payload: payload,
    });
  }

  return (
    <div className={helpStyle.help}>
      <HelpMenu current="newHelp"></HelpMenu>

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
              handleSearchOrChangePage={handleSearchOrChangePage} //响应搜索或者分页事件
              handleClickItem={handleClickItem}
            />
          ) : <Empty />}
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
export default connect(mapStateToProps)(NewHelp);
