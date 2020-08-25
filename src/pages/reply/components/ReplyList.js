import React, { useState } from 'react';
import { List, Avatar, Input, Button, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import dayjs from 'dayjs';
import IconText from './IconText';
import RestTools from 'Utils/RestTools';
import styles from './ReplyList.less';

function ReplyList({ replyData, inputId, dispatch, entityId, commentId }) {
  const [newComment, setNewComment] = useState('');

  const userCommunityInfo = sessionStorage.getItem('userCommunityInfo')
    ? JSON.parse(sessionStorage.getItem('userCommunityInfo'))
    : null;

  function handleReply(replyId) {
    dispatch({
      type: 'reply/saveAnswers',
      payload: {
        inputId: replyId
      }
    });
  }

  function handleChange(e) {
    setNewComment(e.target.value);
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

  function sendComment(replyUserName) {
    if (newComment && userCommunityInfo) {
      dispatch({
        type: 'reply/replyComment',
        payload: {
          commentId,
          entityId,
          content: newComment,
          replyUserName,
          userName: userCommunityInfo.userName
        }
      }).then((res) => {
        if (res.code === 200) {
          getComment();
        }
      });
    }
  }

  function confirm(replyId) {
    dispatch({
      type: 'reply/delReply',
      payload: {
        answerId: entityId,
        replyId: replyId
      }
    }).then((res) => {
      if (res.code === 200) {
        message.success('删除成功');
        getComment();
      }
    });
  }

  return (
    <div className={styles.replylist}>
      <List
        itemLayout="vertical"
        dataSource={replyData || []}
        header={false}
        footer={false}
        renderItem={(k, index) => {
          return (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    size="small"
                    src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${k.userName}`}
                  />
                }
                title={
                  <span>
                    <span style={{ fontSize: 12 }}>
                      {RestTools.formatPhoneNumber(k.userName)}
                      {RestTools.formatPhoneNumber(k.replyUserName) ? (
                        <span>
                          <span style={{ padding: '0 10px', color: '#9EACB6' }}>回复</span>
                          {RestTools.formatPhoneNumber(k.replyUserName)}
                        </span>
                      ) : null}
                    </span>

                    <span style={{ fontSize: 12, color: '#9EACB6', marginLeft: 20 }}>
                      {dayjs(k.createTime).fromNow()}
                    </span>
                  </span>
                }
              />
              <div style={{ color: '#333' }} className={styles.iconList}>
                <div>{k.content}</div>
                <div style={{ padding: '10px 0' }}>
                  <IconText type="like-o" text={`赞`} key="list-vertical-like-o" />
                  <IconText
                    type="message"
                    text="回复"
                    key="list-vertical-message"
                    onClick={handleReply.bind(this, k.replyId)}
                  />
                  {k.userName === userCommunityInfo.userName ? (
                    <span className={styles.delete}>
                      <Popconfirm
                        title="确定删除这条回复吗"
                        onConfirm={confirm.bind(this, k.replyId)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <IconText type="delete" text="删除" key="list-vertical-trash" />
                      </Popconfirm>
                    </span>
                  ) : null}
                </div>
                {inputId === k.replyId ? (
                  <div>
                    <Input
                      value={newComment}
                      placeholder="输入回复"
                      style={{ width: 550, marginRight: 20 }}
                      onChange={handleChange}
                    />
                    <Button
                      type="primary"
                      disabled={!newComment}
                      onClick={sendComment.bind(this, k.userName)}
                    >
                      发表
                    </Button>
                  </div>
                ) : null}
              </div>
            </List.Item>
          );
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

export default connect(mapStateToProps)(ReplyList);
