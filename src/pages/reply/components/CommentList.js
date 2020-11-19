import React, { useState } from 'react';
import { connect } from 'dva';
import { List, Avatar, message } from 'antd';
import SwTextArea from '../../../components/SwTextArea';
import replyStyle from '../index.less';
import CommentItem from './CommentItem';

function CommentList(props) {
  const { data = null, dispatch, entityId, answerList, qId, inputId } = props;
  const [newComment, addComment] = useState(''); //评论
  const [loading, setLoading] = useState(false);

  const userCommunityInfo = sessionStorage.getItem('userCommunityInfo')
    ? JSON.parse(sessionStorage.getItem('userCommunityInfo'))
    : null;

  function editComment(e) {
    addComment(e.target.value);
  }

  function sendComment(item) {
    if(!userCommunityInfo){
      message.warning('请您先登录')
      return;
    }
    if (newComment && userCommunityInfo) {
      setLoading(true);
      dispatch({
        type: 'reply/addComment',
        payload: {
          entityId: item.aid,
          content: newComment,
          userName: userCommunityInfo.userName
        }
      })
        .then((res) => {
          if (res.code === 200) {
            dispatch({
              type: 'reply/getComment',
              payload: {
                aId: item.aid,
                pageSize: 10,
                sort: 'time',
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
          } else {
            message.warning(res.msg);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }

  function getComment(page = 1) {
    dispatch({
      type: 'reply/getComment',
      payload: {
        aId: entityId,
        pageSize: 10,
        pageStart: page,
        sort: 'time',
        userName: userCommunityInfo?userCommunityInfo.userName:''
      }
    }).then((res) => {
      dispatch({
        type: 'reply/saveAnswers',
        payload: { answerList: res, inputId: null }
      });
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
            {userCommunityInfo ? (
              <div style={{ padding: '20px 0' }}>
                <Avatar
                  src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${userCommunityInfo.userName}`}
                />

                <SwTextArea
                  id={data.aid}
                  autoSize
                  loading={loading}
                  maxLength={200}
                  value={newComment}
                  placeholder="输入评论"
                  style={{ width: 500, marginLeft: 10 }}
                  onChange={(e) => {
                    editComment(e, data.aid);
                  }}
                  disabled={!newComment}
                  onClick={sendComment.bind(this, data)}
                />
              </div>
            ) : null}
            {data.commentList && data.commentList.length ? (
              <List
                itemLayout="vertical"
              
                dataSource={data.commentList || []}
                pagination={{
                  size: 'small',
                  hideOnSinglePage: true,
                  pageSize: 10,
                  current: data.commentPageInfo.current,
                  total: data.commentPageInfo.total,
                  onChange: (page) => {
                    getComment(page);
                  }
                }}
                header={false}
                footer={false}
                renderItem={(item, index) => {
                  return (
                    <CommentItem
                      answerList={answerList}
                      item={item}
                      dispatch={dispatch}
                      entityId={entityId}
                      qId={qId}
                      inputId={inputId}
                    />
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
    ...state.reply,
    fetchCommentList: state.loading.effects['reply/getComment'] //拉取评论的loading
  };
}

export default connect(mapStateToProps)(CommentList);
