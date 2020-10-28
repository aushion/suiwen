import React, { useState } from 'react';
import { List, Avatar, Popconfirm, message } from 'antd';
import dayjs from 'dayjs';
import RestTools from '../../../utils/RestTools';
import IconText from './IconText';
import SwTextArea from '../../../components/SwTextArea';
import ReplyList from './ReplyList';
import ReasonModal from '../../../components/ReasonModal';
import styles from './CommentItem.less';

let timer = null;

function CommentItem({ item, dispatch, entityId, qId, inputId }) {
  const [InputId, setInputId] = useState(inputId);
  const [newReply, addReply] = useState('');
  const [likeInfo, setLikeInfo] = useState({
    isLiked: item.isLiked,
    likedCount: item.likedCount
  });
  const [modalState, setModalState] = useState({
    visible: false
  });
  const userCommunityInfo = sessionStorage.getItem('userCommunityInfo')
    ? JSON.parse(sessionStorage.getItem('userCommunityInfo'))
    : null;



  function showInput(id) {
    setInputId(id);
  }

  function getComment(page = 1) {
    dispatch({
      type: 'reply/getComment',
      payload: {
        aId: entityId,
        pageSize: 10,
        pageStart: page,
        sort: 'hot',
        userName: userCommunityInfo.userName
      }
    }).then((res) => {
      dispatch({
        type: 'reply/saveAnswers',
        payload: { answerList: res, inputId: null }
      });
    });
  }

  function editReply(e) {
    addReply(e.target.value);
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
          addReply('');
        } else {
          message.warning(res.msg);
        }
      });
    }
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
    setLikeInfo({
      isLiked: current.isLiked === 0 ? 1 : 0,
      likedCount: current.isLiked
        ? current.likedCount - 1 < 0
          ? 0
          : current.likedCount - 1
        : current.likedCount + 1
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
    <div>
      <List.Item className={styles.CommentItem}>
        <List.Item.Meta
          avatar={
            <Avatar
              src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${item.userName}`}
            />
          }
          title={
            <div>
              <span style={{ fontSize: 13 }}>{RestTools.formatPhoneNumber(item.userName)}</span>
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
                  style={likeInfo.isLiked ? { color: 'green' } : null}
                  type="like"
                  text={`赞${likeInfo.likedCount ? likeInfo.likedCount : ''}`}
                  key="list-vertical-like-o"
                  onClick={handleLike.bind(this, { ...likeInfo, commentId: item.commentId })}
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
                <span
                  className={styles.report}
                  onClick={() => {
                    setModalState({
                      visible: true,
                      id: item.commentId
                    });
                  }}
                >
                  <IconText type="warning" text="举报" />{' '}
                </span>
              </div>
              {InputId === item.commentId ? (
                <div>
                  <SwTextArea
                    maxLength={200}
                    autoSize
                    width={200}
                    value={newReply}
                    placeholder="输入回复"
                    style={{ width: 500, marginLeft: 10 }}
                    onChange={editReply}
                    onClick={sendReply.bind(this, item.commentId)}
                  />
                </div>
              ) : null}
              {item.replyList.length ? (
                <ReplyList
                  commentId={item.commentId}
                  entityId={entityId}
                  qId={qId}
                  replyData={item.replyList}
                />
              ) : null}
            </div>
          }
        />
      </List.Item>
      <ReasonModal
        visible={modalState.visible}
        id={modalState.id}
        entityType={4}
        triggerCancel={() => {
          setModalState({
            visible: false
          });
        }}
      />
    </div>
  );
}

export default CommentItem;
