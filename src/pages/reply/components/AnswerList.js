import React, { useState } from 'react';
import { connect } from 'dva';
import { Icon, message, Spin } from 'antd';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

import CommentList from './CommentList';
import AnswerForm from './AnswerForm';
import replyStyle from '../index.less';
import CaAvatar from '../../../components/CaAvatar';
import ReasonModal from '../../../components/ReasonModal';

let timerCount = null;

function AnswerList(props) {
  const { total, answerList, dispatch, qId } = props;
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  const [modalState, setModalState] = useState({
    visible: false
  });

  //编辑框的状态
  function handleComment(data) {
    //如果当前评论列表是展开的就修改其状态，让其关闭
    if (data.showComment) {
      dispatch({
        type: 'reply/saveAnswers',
        payload: {
          answerList: answerList.map((item) => {
            if (item.aid === data.aid) {
              return {
                ...item,
                showComment: false
              };
            }
            return item;
          })
        }
      });
    } else {
      // 显示loading
      dispatch({
        type: 'reply/saveAnswers',
        payload: {
          answerList: answerList.map((item) => {
            if (item.aid === data.aid) {
              return {
                ...item,
                loading: true
              };
            }
            return item;
          })
        }
      });
      //发起请求
      dispatch({
        type: 'reply/getComment',
        payload: {
          aId: data.aid,
          pageSize: 10,
          pageStart: 1,
          sort: 'time',
          userName: userInfo ? userInfo.UserName : ''
        }
      }).then((res) => {
        //这个res就是answerList由model中传过来的
        res = res.map((item) => {
          if (item.aid === data.aid) {
            return {
              ...item,
              showComment: !item.showComment,
              loading: false
            };
          }
          return item;
        });
        dispatch({
          type: 'reply/saveAnswers',
          payload: { answerList: res }
        });
      });
    }
  }

  function editAnswer(current) {
    if (current.showEditForm) {
      dispatch({
        type: 'reply/saveAnswers',
        payload: {
          answerList: answerList.map((item) => {
            if (item.aid === current.aid) {
              return {
                ...item,
                showEditForm: false
              };
            }
            return item;
          })
        }
      });
    } else {
      dispatch({
        type: 'reply/saveAnswers',
        payload: {
          answerList: answerList.map((item) => {
            if (item.aid === current.aid) {
              return {
                ...item,
                showEditForm: true
              };
            }
            return item;
          })
        }
      });
    }
  }

  function handleLike(current, type) {
    if (!userInfo) {
      message.warning('请您先登录');
      return;
    }
    clearTimeout(timerCount);
    timerCount = setTimeout(() => {
      sendEvaluate(current, type);
    }, 300);
  }

  function sendEvaluate(current, type) {
    let localAction = null; //本地action
    let effectAction = null; //异步action
    if (type === 'up') {
      if (current.isLiked === -1) {
        message.warning('您已经点过踩了');
        return;
      }
    }
    if (type === 'down') {
      if (current.isLiked === 1) {
        message.warning('您已经点过赞啦');
        return;
      }
    }
    switch (type) {
      case 'up':
        localAction = {
          type: 'reply/saveAnswers',
          payload: {
            answerList: answerList.map((item) => {
              if (item.aid === current.aid) {
                return {
                  ...item,
                  isLiked: 1,
                  likeCount: item.likeCount + 1
                };
              }
              return item;
            })
          }
        };
        effectAction = {
          type: 'reply/likeAnswer',
          payload: {
            answerId: current.aid,
            type,
            userId: userInfo ? userInfo.UserName : Cookies.get('cnki_qa_uuid')
          }
        };
        dispatch(localAction); //本地页面先修改点赞信息
        dispatch(effectAction); //发起点赞请求
        break;

      case 'down':
        dispatch({
          type: 'reply/saveAnswers',
          payload: {
            answerList: answerList.map((item) => {
              if (item.aid === current.aid) {
                return {
                  ...item,
                  isLiked: -1,
                  likeCount: item.likeCount - 1 < 0 ? 0 : item.likeCount - 1,
                  disLikeCount: item.disLikeCount + 1
                };
              }
              return item;
            })
          }
        });
        dispatch({
          type: 'reply/disLikeAnswer',
          payload: {
            answerId: current.aid,
            type,
            userId: userInfo ? userInfo.UserName : Cookies.get('cnki_qa_uuid')
          }
        });
        break;

      case 'neutral':
        dispatch({
          type: 'reply/saveAnswers',
          payload: {
            answerList: answerList.map((item) => {
              if (item.aid === current.aid) {
                return {
                  ...item,
                  isLiked: 0,
                  likeCount: item.isLiked === 1 ? item.likeCount - 1 : item.likeCount,
                  disLikeCount: item.isLiked === -1 ? item.disLikeCount - 1 : item.disLikeCount
                };
              }
              return item;
            })
          }
        });
        effectAction = {
          type: current.isLiked === 1 ? 'reply/likeAnswer' : 'reply/disLikeAnswer',
          payload: {
            answerId: current.aid,
            type,
            userId: userInfo ? userInfo.UserName : Cookies.get('cnki_qa_uuid')
          }
        };
        dispatch(effectAction);
        break;

      default:
    }
  }

  return (
    <div>
      <div className={replyStyle.replyCount}>
        {parseInt(total) ? (
          <span>
            共<strong style={{ color: '#333' }}>{total}</strong>个回答
          </span>
        ) : //  <Alert message="暂时还没有回答" type="info" />
        null}
      </div>
      {answerList.map((item, index) => {
        const username = item.userName;
        return (
          <div className={replyStyle.answerItem} key={item.aid}>
            <div className="display_flex justify-content_flex-justify">
              <div className={replyStyle.answerAvatar}>
                <CaAvatar userName={username} />
              </div>
            </div>

            {item.showEditForm ? (
              <>
                {userInfo && userInfo.UserName === username ? (
                  <span
                    className={replyStyle.action}
                    style={{ color: '#1890ff', cursor: 'pointer' }}
                    onClick={editAnswer.bind(this, item, index)}
                  >
                    <span style={{ paddingLeft: 4 }}>取消编辑</span>
                  </span>
                ) : null}
                <AnswerForm editStatus={item} />
              </>
            ) : (
              <>
                <div
                  className={replyStyle.itemTitle}
                  dangerouslySetInnerHTML={{ __html: item.Content || item.answer }}
                />

                {item.resource && item.resource.includes('<a') ? (
                  <>
                    <div style={{ padding: '6px 0' }}>参考文献：</div>
                    <div dangerouslySetInnerHTML={{ __html: item.resource }} />
                  </>
                ) : null}

                <div className={replyStyle.operation}>
                  {userInfo ? (
                    <button
                      className={replyStyle.likeBtn}
                      style={
                        item.isLiked > 0
                          ? { background: '#1890ff', color: '#fff', marginRight: 10 }
                          : { marginRight: 10 }
                      }
                      onClick={handleLike.bind(this, item, item.isLiked === 1 ? 'neutral' : 'up')}
                    >
                      <Icon type="caret-up" />
                      赞同
                      {item.likeCount ? item.likeCount : null}
                    </button>
                  ) : null}
                  {userInfo ? (
                    <button
                      className={replyStyle.likeBtn}
                      style={
                        item.isLiked < 0
                          ? { background: '#1890ff', color: '#fff', marginRight: 10 }
                          : { marginRight: 10 }
                      }
                      onClick={handleLike.bind(
                        this,
                        item,
                        item.isLiked === -1 ? 'neutral' : 'down'
                      )}
                    >
                      <Icon type="caret-down" />
                    </button>
                  ) : null}
                  {userInfo && userInfo.UserName === username ? (
                    <span
                      className={replyStyle.action}
                      style={{ color: '#1890ff' }}
                      onClick={editAnswer.bind(this, item, index)}
                    >
                      <Icon type="edit" />
                      <span style={{ paddingRight: 4 }}>编辑</span>
                    </span>
                  ) : null}
                  {userInfo ? (
                    <span
                      className={replyStyle.action}
                      onClick={handleComment.bind(this, item, index)}
                    >
                      <Icon type="message" />
                      <span>{item.commentNum > 0 ? `${item.commentNum}条评论` : '添加评论'}</span>
                    </span>
                  ) : null}
                  {/* <span className={replyStyle.action}>
                    <Icon type="share-alt" />
                    <span style={{ paddingLeft: 4 }}>分享</span>
                  </span> */}

                  <span
                    className={replyStyle.action}
                    onClick={() => {
                      setModalState({
                        visible: true,
                        id: item.aid
                      });
                    }}
                  >
                    <Icon type="warning" />
                    <span>举报</span>
                  </span>

                  <span>发布于{dayjs(item.replyTime).fromNow()}</span>
                </div>
              </>
            )}
            <Spin spinning={!!item.loading} style={{ textAlign: 'center' }}>
              <div className={replyStyle.commentWrapper}>
                {item.showComment ? (
                  <CommentList qId={qId} entityId={item.aid} data={item} answerIndex={index} />
                ) : null}
              </div>
            </Spin>
          </div>
        );
      })}
      <ReasonModal
        visible={modalState.visible}
        id={modalState.id}
        entityType={0}
        triggerCancel={() => {
          setModalState({
            visible: false
          });
        }}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.reply
  };
}

export default connect(mapStateToProps)(AnswerList);
