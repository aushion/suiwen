import React, { useState } from 'react';
import { connect } from 'dva';
import dayjs from 'dayjs';
import { List, Avatar, Input, Button, Popconfirm, message } from 'antd';
import ReplyList from './ReplyList';
import RestTools from 'Utils/RestTools';
import IconText from './IconText';
import replyStyle from '../index.less';

let timer = null;

function CommentList(props) {
  const { data = null, inputId, dispatch, entityId, answerList, qId } = props;
  const [newComment, addComment] = useState(''); //评论
  const [newReply, addReply] = useState(''); //回复
  const userCommunityInfo = sessionStorage.getItem('userCommunityInfo')
    ? JSON.parse(sessionStorage.getItem('userCommunityInfo'))
    : null;

  function editComment(e) {
    addComment(e.target.value);
  }

  function editReply(e) {
    addReply(e.target.value);
  }

  function sendComment(item) {
    if (newComment && userCommunityInfo) {
      dispatch({
        type: 'reply/addComment',
        payload: {
          entityId: item.aid,
          content: newComment,
          userName: userCommunityInfo.userName
        }
      }).then((res) => {
        if (res.code === 200) {
          dispatch({
            type: 'reply/getComment',
            payload: {
              aId: item.aid,
              pageSize: 10,
              pageStart: 1,
              userName: userCommunityInfo.userName
            }
          }).then((res) => {
            addComment('');
            dispatch({
              type: 'reply/saveAnswers',
              payload: { answerList: res }
            });
          });
        }
      });
    }
  }

  function sendReply(commentId) {
    if (newReply && userCommunityInfo) {
      dispatch({
        type: 'reply/replyComment',
        payload: {
          commentId,
          content: newReply,
          entityId: entityId,
          replyUserName: '',
          userName: userCommunityInfo.userName
        }
      }).then((res) => {
        if (res.code === 200) {
          getComment();
        }
      });
    }
  }

  function showInput(commentId) {
    dispatch({
      type: 'reply/saveAnswers',
      payload: {
        inputId: commentId
      }
    });
  }

  function getComment() {
    dispatch({
      type: 'reply/getComment',
      payload: {
        aId: entityId,
        pageSize: 10,
        pageStart: 1,
        userName: userCommunityInfo.userName
      }
    }).then((res) => {
      dispatch({
        type: 'reply/saveAnswers',
        payload: { answerList: res, inputId: null }
      });
    });
  }

  function confirm(commentId) {
    dispatch({
      type: 'reply/delComment',
      payload: {
        answerId: entityId,
        qId,
        commentId
      }
    }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        getComment();
      }
    });
  }

  function handleLike(current) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      sendLike(current);
    }, 300);
  }

  function sendLike(current) {
    let newList = answerList.map((item) => {
      if (item.commentList) {
        item.commentList = item.commentList.map((child) => {
          if (child.commentId === current.commentId) {
            let newItem = {
              ...current,
              isLiked: current.isLiked === 0 ? 1 : 0,
              likedCount: current.isLiked
                ? current.likedCount - 1 < 0
                  ? 0
                  : current.likedCount - 1
                : current.likedCount + 1
            };
            return newItem;
          }
          return child;
        });
      }
      return item;
    });

    dispatch({
      type: 'reply/saveAnswers',
      payload: {
        answerList: newList
      }
    });

    dispatch({
      type: 'reply/likeComment',
      payload: {
        commentId: current.commentId,
        type: current.isLiked ? 'neutral' : 'up',
        userId: userCommunityInfo.userName
      }
    });
  }

  return (
    <>
      {data ? (
        <div className={replyStyle.commentList}>
          <div>
            <div>
              {data.commentNum ? (
                <span>
                  共<strong>{data.commentNum}</strong>条评论
                </span>
              ) : (
                <span>暂时还没有评论</span>
              )}
            </div>

            <div style={{ padding: '20px 0' }}>
              <Avatar
                src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${userCommunityInfo.userName}`}
              />
              <Input
                id={data.aid}
                value={newComment}
                onChange={(e) => {
                  editComment(e, data.aid);
                }}
                placeholder="输入评论"
                style={{ width: 550, margin: '0 20px' }}
              />
              <Button type="primary" disabled={!newComment} onClick={sendComment.bind(this, data)}>
                发布
              </Button>
            </div>

            {data.commentList && data.commentList.length ? (
              <List
                itemLayout="vertical"
                dataSource={data.commentList || []}
                header={false}
                footer={false}
                renderItem={(item, index) => {
                  return (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${item.userName}`}
                          />
                        }
                        title={
                          <div>
                            <span style={{ fontSize: 13 }}>
                              {RestTools.formatPhoneNumber(item.userName)}
                            </span>
                            <span style={{ color: '#9EACB6', fontSize: 14, marginLeft: 20 }}>
                              {dayjs(item.createTime).fromNow()}
                            </span>
                          </div>
                        }
                        description={
                          <div style={{ color: '#333' }}>
                            <div>{item.content}</div>
                            <div style={{ padding: '10px 0' }}>
                              <IconText
                                style={item.isLiked ? { color: 'green' } : null}
                                type="like"
                                text={`赞${item.likedCount ? item.likedCount : ''}`}
                                key="list-vertical-like-o"
                                onClick={handleLike.bind(this, item)}
                              />
                              {item.userName !== userCommunityInfo.userName ? (
                                <IconText
                                  type="message"
                                  text="回复"
                                  key="list-vertical-message"
                                  onClick={showInput.bind(this, item.commentId)}
                                />
                              ) : null}
                              {item.userName === userCommunityInfo.userName ? (
                                <span>
                                  <Popconfirm
                                    title="确定删除这条评论吗"
                                    onConfirm={confirm.bind(this, item.commentId)}
                                    okText="确定"
                                    cancelText="取消"
                                  >
                                    <IconText type="delete" text="删除" key="list-vertical-trash" />
                                  </Popconfirm>
                                </span>
                              ) : null}
                            </div>
                            {inputId === item.commentId ? (
                              <div>
                                <Input
                                  value={newReply}
                                  placeholder="输入回复"
                                  style={{ width: 550, marginRight: 20 }}
                                  onChange={editReply}
                                />
                                <Button
                                  type="primary"
                                  disabled={!newReply}
                                  onClick={sendReply.bind(this, item.commentId)}
                                >
                                  发表
                                </Button>
                              </div>
                            ) : null}
                            {item.replyList.length ? (
                              <ReplyList
                                commentId={item.commentId}
                                entityId={entityId}
                                replyData={item.replyList}
                              />
                            ) : null}
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function mapStateToProps(state) {
  return {
    ...state.reply
  };
}

export default connect(mapStateToProps)(CommentList);
