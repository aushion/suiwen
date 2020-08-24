import React, { useState } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import { Icon, Avatar, Spin } from 'antd';
import dayjs from 'dayjs';
import CommentList from './CommentList';
import AnswerForm from './AnswerForm';
import replyStyle from '../index.less';
import RestTools from 'Utils/RestTools';

function AnswerList(props) {
  const { total, answerList, dispatch } = props;
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  //编辑框的状态
  const [editStatus, setEditStatus] = useState(null);
  console.log(total);
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
          pageStart: 1
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

  return (
    <div>
      <div className={replyStyle.replyCount}>
        {parseInt(total) ? (
          <span>
            共<strong style={{ color: '#333' }}>{total}</strong>个回答
          </span>
        ) : (
          <span>暂时还没有回答</span>
        )}
      </div>
      {answerList.map((item, index) => {
        const username = item.UserName || item.userName;
        return (
          <div className={replyStyle.answerItem} key={item.answerid || item.aid}>
            <div className={replyStyle.answerAvatar}>
              <Link to={`help/otherHelp?username=${username}`} style={{ paddingRight: 20 }}>
                <Avatar
                  src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${username}`}
                  shape="square"
                />
                <span style={{ marginLeft: 10 }}>{RestTools.formatPhoneNumber(username)}</span>
              </Link>
            </div>

            {item.showEditForm ? (
              <>
                <AnswerForm editStatus={item} />
                {userInfo && userInfo.UserName === username ? (
                  <span
                    className={replyStyle.action}
                    style={{ color: '#1890ff', cursor: 'pointer' }}
                    onClick={editAnswer.bind(this, item, index)}
                  >
                    <span style={{ paddingLeft: 4 }}>取消编辑</span>
                  </span>
                ) : null}
              </>
            ) : (
              <>
                <div
                  className={replyStyle.itemTitle}
                  dangerouslySetInnerHTML={{ __html: item.Content || item.answer }}
                />

                {item.resource && item.resource.includes('<a') ? (
                  <>
                    <div>引用文献：</div>
                    <div dangerouslySetInnerHTML={{ __html: item.resource }} />
                  </>
                ) : null}

                <div className={replyStyle.operation}>
                  <button className={replyStyle.likeBtn}>
                    <Icon type="caret-up" />
                    赞同
                  </button>
                  <button className={replyStyle.likeBtn} style={{ marginLeft: 10 }}>
                    <Icon type="caret-down" />
                  </button>
                  {userInfo && userInfo.UserName === username ? (
                    <span
                      className={replyStyle.action}
                      style={{ color: '#1890ff' }}
                      onClick={editAnswer.bind(this, item, index)}
                    >
                      <Icon type="edit" />
                      <span style={{ paddingLeft: 4 }}>编辑</span>
                    </span>
                  ) : null}

                  <span
                    className={replyStyle.action}
                    onClick={handleComment.bind(this, item, index)}
                  >
                    <Icon type="message" />
                    <span style={{ paddingLeft: 4 }}>
                      {item.commentNum > 0 ? `${item.commentNum}条评论` : '添加评论'}
                    </span>
                  </span>

                  <span className={replyStyle.action}>
                    <Icon type="share-alt" />
                    <span style={{ paddingLeft: 4 }}>分享</span>
                  </span>

                  <span className={replyStyle.action}>
                    <Icon type="warning" />
                    <span style={{ paddingLeft: 4 }}>举报</span>
                  </span>

                  <span className={replyStyle.action}>发布于{dayjs(item.replyTime).fromNow()}</span>
                </div>
              </>
            )}
            <Spin spinning={!!item.loading} style={{ textAlign: 'center' }}>
              <div className={replyStyle.commentWrapper}>
                {item.showComment ? <CommentList data={item} /> : null}
              </div>
            </Spin>
          </div>
        );
      })}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.reply
  };
}

export default connect(mapStateToProps)(AnswerList);
