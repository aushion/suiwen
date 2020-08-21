/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Divider, Icon, Button, Form, Spin, message, Row, Col, Input, List, Avatar } from 'antd';
import queryString from 'querystring';
import BraftEditor from 'braft-editor';
import Link from 'umi/link';
import RestTools from '../../utils/RestTools';
import HelpMenu from '../help/components/HelpMenu';
import UserInfo from '../help/components/UserInfo';
import replyStyle from './index.less';
import 'braft-editor/dist/index.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

const FormItem = Form.Item;
// const { Search } = Input;
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
let quoteArray = [];

function Reply(props) {
  const params = queryString.parse(window.location.href.split('?')[1]);
  const userInfo = RestTools.getLocalStorage('userInfo')
    ? RestTools.getLocalStorage('userInfo')
    : null;

  const { total, answerList, loading, dispatch } = props;
  const {
    getFieldDecorator,
    resetFields,
    getFieldValue,
    validateFields,
    setFieldsValue
  } = props.form;
  const { q } = params;
  const controls = ['font-size', 'bold', 'italic', 'underline', 'text-color', 'separator', 'link'];
  const username = answerList.length && (answerList[0].userName || answerList[0].UserName);

  const [editStatus, setEditorStatus] = useState(null);
  const [showEditor, switchEditor] = useState(false);
  const [newComment, addComment] = useState('');

  const menus = RestTools.getLocalStorage('userInfo')
    ? [
        { key: 'newHelp', text: '新求助' },
        { key: 'myHelp', text: '我的求助' },
        { key: 'myReply', text: '我的回答' }
      ]
    : [{ key: 'newHelp', text: '新求助' }];

  function submitContent(e) {
    if (userInfo) {
      // const username = answerList.length && (answerList[0].userName || answerList[0].UserName);
      if (username === userInfo.user_name) {
        message.warning('您已回答过该问题');
        return;
      }
    } else {
      message.warning('您还未登录，请您登录后操作');
      return;
    }
    e.preventDefault();
    validateFields((error, values) => {
      if (!error) {
        const submitData = {
          contents: values.contents.toHTML(), // or values.content.toHTML()
          resource: values.resource.toHTML()
          // domain: values.domain,
        };
        const QID = props.QID || params.QID;
        let payload = {
          content: submitData.contents,
          resource: submitData.resource,
          userName: props.username,
          uId: props.uid
        };
        if (QID) {
          payload = { ...payload, qId: QID };
        } else {
          payload = {
            content: submitData.contents,
            resource: submitData.resource,
            uId: props.uid,
            domain: '',
            question: params.q
          };
        }
        if (QID) {
          if (params && params.aid && editStatus) {
            //修改答案
            props.dispatch({
              type: 'reply/editAnswer',
              payload: { ...payload, id: params.aid, eidtorId: '' }
            });
          } else {
            props.dispatch({ type: 'reply/setAnswer', payload });
          }
        } else {
          props.dispatch({ type: 'reply/setQanswer', payload });
        }
        resetFields(); //重置表单值
        quoteArray = []; //重置缓存数组
      }
    });
  }

  function handleComment(data) {
    //如果已经获取过评论列表，关闭loading
    if (data.commentList) {
      let tempdata = answerList.map((item) => {
        if (item.aid === data.aid) {
          item.showComment = !item.showComment;
          item.loading = false;
        }
        return item;
      });
      dispatch({
        type: 'reply/saveAnswers',
        payload: { answerList: tempdata }
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

  function editComment(e, id) {
    const element = document.getElementById(id); //获取相应id输入框dom对象
    const value = element.value; //获取输入框的值
    addComment(value);
  }

  function sendComment(item) {
    const userCommunityInfo = sessionStorage.getItem('userCommunityInfo')
      ? JSON.parse(sessionStorage.getItem('userCommunityInfo'))
      : null;
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
            //这个res就是answerList由model中传过来的
            // res = res.map((k) => {
            //   if (k.aid === item.aid) {
            //     return {
            //       ...k,
            //       showComment: !k.showComment
            //     };
            //   }
            //   return k;
            // });
            dispatch({
              type: 'reply/saveAnswers',
              payload: { answerList: res }
            });
          });
        }
      });
    }
  }

  return (
    <div className={replyStyle.reply}>
      <div className={replyStyle.content}>
        <Row gutter={40}>
          <Col span={18} className={replyStyle.content_left}>
            <div>
              <HelpMenu data={menus} />
            </div>
            <div className={replyStyle.title}>
              <Icon style={{ color: '#f39b27', paddingRight: 10 }} type="question-circle" />
              <span>{params.q}</span>
              <div className="display_flex" style={{ marginTop: 20 }}>
                <div style={{ marginRight: 10 }}>
                  <Button type="primary">关注问题</Button>
                </div>
                <div>
                  <Button
                    type="primary"
                    icon="edit"
                    ghost
                    onClick={() => {
                      switchEditor(!showEditor);
                    }}
                  >
                    写回答
                  </Button>
                </div>
              </div>
            </div>

            <Divider style={{ margin: 0 }}></Divider>

            <div className={replyStyle.draft}>
              {showEditor ? (
                <Form>
                  <FormItem>
                    {getFieldDecorator('contents', {
                      // initialValue: contentState,
                      validateTrigger: 'onBlur',
                      rules: [
                        {
                          required: true,
                          validator: (_, value, callback) => {
                            if (value.isEmpty()) {
                              callback('请输入正文内容');
                            } else {
                              callback();
                            }
                          }
                        }
                      ]
                    })(
                      <BraftEditor
                        style={{
                          border: '1px solid #eee',
                          height: 300,
                          backgroundColor: '#fff',
                          borderRadius: 4
                        }}
                        contentStyle={{ height: 240, fontSize: 14 }}
                        controls={controls}
                        // readOnly
                        placeholder={`   
                      标准格式更容易被采纳 
                      文献内容                                                  
                         XXXXXXXXXXXXX
                      XXXXXXXXXXXXX[1]
                        XXXXXXXXXXXXXX
                      XXXXXXXXXXXXX[2]`}
                      />
                    )}
                  </FormItem>

                  <FormItem style={{ float: 'right' }}>
                    <Button
                      loading={props.loading}
                      type="primary"
                      htmlType="submit"
                      onClick={submitContent}
                    >
                      {editStatus ? '提交修改' : '提交回答'}
                    </Button>
                  </FormItem>
                </Form>
              ) : null}
            </div>
            <div className={replyStyle.replyCount}>
              共 <strong style={{ color: '#333' }}>{total}</strong>个回答
            </div>
            {answerList.map((item, index) => {
              const username = item.UserName || item.userName;
              console.log('item.loading', item.loading);
              return (
                <div className={replyStyle.answerItem} key={item.answerid || item.aid}>
                  <div className={replyStyle.answerAvatar}>
                    <Link to={`help/otherHelp?username=${username}`} style={{ paddingRight: 20 }}>
                      <Avatar
                        src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${username}`}
                        shape="square"
                      />
                      <span style={{ marginLeft: 10 }}>
                        {/^1[3-9]\d{9}$/.test(username)
                          ? username.substring(0, 3) + '****' + username.substring(7, 11)
                          : username}
                      </span>
                    </Link>
                  </div>
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

                    <span className={replyStyle.action}>
                      发布于{dayjs(item.replyTime).fromNow()}
                    </span>
                  </div>
                  <Spin spinning={Boolean(item.loading)}>
                    {item.showComment ? (
                      <div className={replyStyle.commentList}>
                        <div>
                          <div>
                            共<strong>{item.commentNum}</strong>条评论
                          </div>
                          {item.commentList.length ? (
                            <List
                              itemLayout="vertical"
                              dataSource={item.commentList || []}
                              header={false}
                              footer={false}
                              renderItem={(item) => {
                                return (
                                  <List.Item
                                    extra={
                                      <div style={{ color: '#8590a6' }}>
                                        {dayjs(item.createTime).fromNow()}
                                      </div>
                                    }
                                  >
                                    <List.Item.Meta
                                      avatar={
                                        <Avatar
                                          src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${item.userName}`}
                                        />
                                      }
                                      title={RestTools.formatPhoneNumber(item.userName)}
                                      description={item.content}
                                    />
                                    {item.replyList.map((k) => {
                                      return (
                                        <div style={{ marginLeft: 40 }} key={k.replyId}>
                                          <div>
                                            <Avatar
                                              size="small"
                                              src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${k.userName}`}
                                            />
                                            <span>
                                              {RestTools.formatPhoneNumber(k.userName)}回复
                                              {RestTools.formatPhoneNumber(k.replyUserName)}
                                            </span>
                                            <span style={{ float: 'right' }}>
                                              {dayjs(k.createTime).fromNow()}
                                            </span>
                                          </div>
                                          <div style={{ paddingLeft: 20 }}>{k.content}</div>
                                        </div>
                                      );
                                    })}
                                  </List.Item>
                                );
                              }}
                            />
                          ) : null}

                          <Input
                            id={item.aid}
                            // value={newComment[item.aid]}
                            onChange={(e) => {
                              editComment(e, item.aid);
                            }}
                            placeholder="请输入您的评论"
                            style={{ width: '80%', marginRight: 10 }}
                          />
                          <Button
                            type="primary"
                            disabled={!newComment}
                            onClick={sendComment.bind(this, item)}
                          >
                            发布
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </Spin>
                </div>
              );
            })}
          </Col>
          <Col span={6}>
            <div>
              <UserInfo />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.reply, loading: state.loading.models.reply };
}

export default connect(mapStateToProps)(Form.create()(Reply));
