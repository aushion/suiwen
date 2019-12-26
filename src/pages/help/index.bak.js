// import React, { useState } from 'react';
// import { Menu, Divider } from 'antd';
// import { connect } from 'dva';
// import router from 'umi/router';
// import DomainTags from './components/DomainTags';
// import HelpList from './components/HelpList';
// import MyAnswerList from './components/MyAnswerList';
// import RestTools from '../../utils/RestTools';
// import helpStyle from './index.less';

// function Help(props) {
//   const {
//     domainList,
//     newHelpData,
//     dispatch,
//     initCurrent,
//     domain,
//     size,
//     index,
//     uid,
//     loading,
//   } = props;
//   const [current, setCurrent] = useState(initCurrent);

//   //点击菜单响应事件
//   function handleClick(e) {
//     setCurrent(e.key);
//     RestTools.setLocalStorage('current', e.key);
//     if (e.key === 'hotHelp') {
//       dispatch({ type: 'help/getHotQuestions', payload: { domain, size: 10, index: 1 } });
//     } else if (e.key === 'newHelp') {
//       dispatch({ type: 'help/getNewQuestions', payload: { domain, size: 10, index: 1 } });
//     } else if (e.key === 'myHelp') {
//       dispatch({ type: 'help/getNewQuestions', payload: { domain, uid, size: 10, index: 1 } });
//     } else if (e.key === 'myReply') {
//       dispatch({ type: 'help/getMyAnswerQuestions', payload: { domain, uid, size: 10, index: 1 } });
//     }
//   }

//   //点击tag响应事件
//   function handleClickTag(payload) {
//     RestTools.setLocalStorage('domain', payload.domain);
//     dispatchHanlder(current, payload);
//   }
//   function handleClickItem(item) {
//     dispatch({type: 'global/setQuestion', payload: {question: item.Content}})
//     router.push(`/reply?question=${item.Content}&QID=${item.ID}`);
//   }
//   function dispatchHanlder(current, payload) {
//     if (current === 'newHelp') {
//       dispatch({
//         type: 'help/getNewQuestions',
//         payload: payload,
//       });
//     } else if (current === 'hotHelp') {
//       dispatch({
//         type: 'help/getHotQuestions',
//         payload: payload,
//       });
//     } else if (current === 'myHelp') {
//       dispatch({
//         type: 'help/getNewQuestions',
//         payload: Object.assign({}, payload, { uid: uid }),
//       });
//     } else if (current === 'myReply') {
//       dispatch({
//         type: 'help/getMyAnswerQuestions',
//         payload: Object.assign(payload, { uid: uid }),
//       });
//     }
//   }

//   function handleSearchOrChangePage(payload) {
//     dispatchHanlder(current, payload);
//   }

//   return (
//     <div className={helpStyle.help}>
//       <Menu
//         style={{ paddingLeft: '18.75%' }}
//         theme="light"
//         onClick={handleClick}
//         selectedKeys={[current]}
//         mode="horizontal"
//       >
//         <Menu.Item key="newHelp">新求助</Menu.Item>
//         <Menu.Item key="hotHelp">热门求助</Menu.Item>
//         <Menu.Item key="myHelp">我的求助</Menu.Item>
//         <Menu.Item key="myReply">我的回答</Menu.Item>
//       </Menu>

//       <div className={helpStyle.content}>
//         {domainList.length ? (
//           <div className={helpStyle.domainTags}>
//             <DomainTags localDomain={domain} data={domainList} onClickTag={handleClickTag} />
//           </div>
//         ) : null}
//         <div>
//           <Divider style={{ margin: 0 }} />
//           {newHelpData ? (
//             current === 'myReply' ? (
//               <MyAnswerList data={newHelpData}></MyAnswerList>
//             ) : (
//               <HelpList
//                 data={newHelpData}
//                 current={current}
//                 domain={domain}
//                 size={size}
//                 index={index}
//                 loading={loading}
//                 uid={uid}
//                 handleSearchOrChangePage={handleSearchOrChangePage} //响应搜索或者分页事件
//                 handleClickItem={handleClickItem}
//               />
//             )
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }

// function mapStateToProps(state) {
//   return {
//     ...state.help,
//     loading: state.loading.models.help,
//   };
// }
// export default connect(mapStateToProps)(Help);
