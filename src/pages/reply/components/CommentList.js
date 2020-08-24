import React, { useState } from 'react';
import { connect } from 'dva';
import dayjs from 'dayjs';
import { List, Avatar, Input, Button, Icon, Divider } from 'antd';
import ReplyList from './ReplyList';
import RestTools from 'Utils/RestTools';
import IconText from './IconText';
import replyStyle from '../index.less';

function CommentList(props) {
  const { data = null, dispatch } = props;
  const [newComment, addComment] = useState('');
  const userCommunityInfo = sessionStorage.getItem('userCommunityInfo')
    ? JSON.parse(sessionStorage.getItem('userCommunityInfo'))
    : null;
  const [commentId, setCommentId] = useState('');

  function editComment(e, id) {
    addComment(e.target.value);
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
              pageStart: 1
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

  function showInput(commentId) {
    setCommentId(commentId);
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

            {data.commentList.length ? (
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
                              <IconText type="like-o" text={`赞`} key="list-vertical-like-o" />
                              <Divider type="vertical" style={{ margin: '0 18px' }} />
                              <IconText
                                type="message"
                                text="回复"
                                key="list-vertical-message"
                                onClick={showInput.bind(this, item.commentId)}
                              />
                            </div>
                            {commentId === item.commentId ? (
                              <div>
                                <Input
                                  placeholder="输入回复"
                                  style={{ width: 550, marginRight: 20 }}
                                />
                                <Button type="primary" disabled={!newComment}>
                                  发表
                                </Button>
                              </div>
                            ) : null}
                            {item.replyList.length ? (
                              <ReplyList replyData={item.replyList} />
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
