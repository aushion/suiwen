/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Divider,
  Icon,
  Button,
  Form,
  Spin,
  message,
  Row,
  Col,
  Input,
  List,
  Empty,
  Avatar
} from 'antd';
import queryString from 'querystring';
import BraftEditor from 'braft-editor';
import groupBy from 'lodash/groupBy';
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

  const { total, answerList, loading, sgData, dispatch } = props;
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
  const [selectText, setSelectText] = useState('');
  const [resourceInfo, setResourceInfo] = useState(null);
  const [showEditor, switchEditor] = useState(false);
  const [showComment, switchComment] = useState(-1);
  const [newComment, addComment] = useState('');

  const menus = RestTools.getLocalStorage('userInfo')
    ? [
        { key: 'newHelp', text: '新求助' },
        { key: 'myHelp', text: '我的求助' },
        { key: 'myReply', text: '我的回答' }
      ]
    : [{ key: 'newHelp', text: '新求助' }];

  const groupByData = groupBy(sgData, 'id');
  const keys = Object.keys(groupByData);

  useEffect(() => {
    // function hideAddQuote(e) {
    //   const addQuote = document.getElementById('addQuote');
    //   if (e.target !== addQuote) {
    //     addQuote.style.display = 'none';
    //   }
    // }
    // document.addEventListener('click', hideAddQuote);
    // return () => {
    //   document.removeEventListener('click', hideAddQuote);
    //   resetFields(); //重置表单值
    //   quoteArray = []; //重置缓存数组
    // };
  }, [resetFields]);

  useEffect(() => {
    if (editStatus && editStatus.resource) {
      //创建临时数组，以渲染索引
      let tempArray = editStatus.resource.split(/<\/p><p>/g).map((item, index) => ({
        resourceStr: item.replace(/<p>/g, '').replace(/<\/p>/g, ''),
        index: index + 1,
        source_id: index
      }));

      quoteArray = tempArray;
      //   setFieldsValue({
      //     contents: BraftEditor.createEditorState(editStatus.answer),
      //     resource: BraftEditor.createEditorState(editStatus.resource)
      //   });
      // } else if (editStatus && editStatus.answer) {
      //   quoteArray = [];
      //   setFieldsValue({
      //     contents: BraftEditor.createEditorState(editStatus.answer),
      //     resource: BraftEditor.createEditorState(null)
      //   });
      // } else {
      //   quoteArray = [];
      //   setFieldsValue({
      //     contents: BraftEditor.createEditorState(null),
      //      resource: BraftEditor.createEditorState(null)
      //   });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editStatus]);

  function addQuoteIndex(text, resourceInfo) {
    const { year, qikanName, title, source_id, author } = resourceInfo;
    const len = quoteArray.length;
    const sourceidArray = quoteArray.length > 0 ? quoteArray.map((item) => item.source_id) : [];
    //定义一个索引，设置引用序号
    let index = len > 0 ? quoteArray[len - 1].index : 1;
    //判断如果来自同一个句群内容，引用内容及引用文献链接不变，简单处理
    if (len > 0 && !sourceidArray.includes(source_id)) {
      quoteArray.push({
        index: index + 1,
        resourceStr: `<a href="http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${source_id}"  style="text-decoration:none" target="_blank">${index +
          1}. 《${title}》 ${author} ${qikanName} ${year}</a>`,
        source_id: source_id
      });
    } else if (len === 0) {
      quoteArray.push({
        index: index,
        resourceStr: `<a href="http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${source_id}"  style="text-decoration:none" target="_blank">${1}. 《${title}》 ${author} ${qikanName} ${year}</a>`,
        source_id: source_id
      });
    }
    return quoteArray;
  }
  function copyTextToEditor(text, resourceInfo) {
    //把引用信息转成引用数组
    const quoteArrayList = addQuoteIndex(text, resourceInfo);
    //获取文献引用数组并去重
    const resourceArray = [...new Set(quoteArrayList.map((item) => item.resourceStr))];
    //重新定义引文内容字符串，引用文献字符串，并处理格式
    let str = getFieldValue('contents') ? getFieldValue('contents').toHTML() : '';
    let newText = (str += `${text}[${resourceArray.length}]`).replace('<p></p>', '');
    let newResourceStr = '';

    for (let i = 0; i < resourceArray.length; i++) {
      newResourceStr += resourceArray[i] + '<br>';
    }

    if (newText) {
      setFieldsValue({
        contents: BraftEditor.createEditorState(newText)
        // resource: BraftEditor.createEditorState(newResourceStr)
      });
    }
    const addQuote = document.getElementById('addQuote');
    addQuote.style.display = 'none';
  }

  function selectHtml() {
    let selectedHtml = '';
    if (document.selection) {
      //IE
      let selectionObj = document.selection;
      let rangeObj = selectionObj.createRange();
      selectedHtml = rangeObj.htmlText;
    } else {
      //ff chrom
      let selectionObj = window.getSelection();
      let rangeObj = selectionObj.getRangeAt(0);
      let docFragment = rangeObj.cloneContents();
      let testDiv = document.createElement('div');
      testDiv.appendChild(docFragment);
      selectedHtml = testDiv.innerHTML;
    }
    return selectedHtml;
  }

  function handleMouseUp(e, info) {
    let x = e.clientX;
    let y = e.clientY;
    const selectedHtml = selectHtml();
    setSelectText(selectedHtml.replace(/<span style="color:red">/g, '').replace(/<\/span>/g, ''));
    setResourceInfo(info);
    const addQuote = document.getElementById('addQuote');
    if (selectedHtml.length) {
      setTimeout(function() {
        addQuote.style.display = 'block';
        addQuote.style.left = x + 'px';
        addQuote.style.top = y + 'px';
      }, 100);
    } else {
      addQuote.style.display = 'none';
    }
  }

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
    if (data.commentList) {
      let tempdata = answerList.map((item) => {
        if (item.aid === data.aid) {
          item.showComment = !item.showComment;
        }
        return item;
      });
      dispatch({
        type: 'reply/saveAnswers',
        payload: { answerList: tempdata }
      });
    } else {
      props
        .dispatch({
          type: 'reply/getComment',
          payload: {
            aId: data.aid,
            pageSize: 10,
            pageStart: 1
          }
        })
        .then((res) => {
          res = res.map((item) => {
            if (item.aid === data.aid) {
              return {
                ...item,
                showComment: !item.showComment
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

  function editComment(e) {
    addComment(e.target.value);
  }

  function sendComment(item) {
    const userCommunityInfo = sessionStorage.getItem('userCommunityInfo') ? JSON.parse(sessionStorage.getItem('userCommunityInfo')) : null; 
    if(newComment && userCommunityInfo){
      dispatch({
        type: 'reply/addComment',
        payload: {
          entityId: item.aid,
          content: newComment,
          userName: userCommunityInfo.userName
        }
      })
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

                  {/* <FormItem label="引用文献">
                  {getFieldDecorator('resource', {
                    // initialValue: contentState,
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        required: false
                        // validator: (_, value, callback) => {
                        //   if (value.isEmpty()) {
                        //     callback('请输入文献链接');
                        //   } else {
                        //     callback();
                        //   }
                        // }
                      }
                    ]
                  })(
                    <BraftEditor
                      style={{
                        border: '1px solid #eee',
                        height: 240,
                        backgroundColor: '#fff',
                        borderRadius: 4
                      }}
                      contentStyle={{ height: 200, fontSize: 14 }}
                      controls={['link']}
                      // readOnly
                      placeholder={`    
                      引用文献示例
                      1.篇名  作者 机构 年份
                      2.篇名  作者 机构 年份`}
                    />
                  )}
                </FormItem> */}
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
                      发布于{dayjs().from(dayjs(item.replyTime))}
                    </span>
                    {/* <span style={{ paddingRight: 20 }}>#{index + 1}</span>
                    <Link to={`help/otherHelp?username=${username}`} style={{ paddingRight: 20 }}>

                      <Avatar
                        src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${username}`}
                        size="small"
                      />
                      {/^1[3-9]\d{9}$/.test(username)
                        ? username.substring(0, 3) + '****' + username.substring(7, 11)
                        : username}
                    </Link>
                    <span style={{ padding: '0 10px' }}>
                      {RestTools.status[item.status]}
                      {item.failReason ? (
                        <span style={{ color: 'red' }}>原因：{item.failReason}</span>
                      ) : null}
                    </span>
                    <span style={{ color: '#c3c3c3' }}>{item.opTime}</span>
                    {RestTools.getLocalStorage('userInfo') &&
                    RestTools.getLocalStorage('userInfo').UserName === username &&
                    item.status === 0 ? (
                      <span
                        style={{ paddingLeft: 10 }}
                        onClick={() => setEditorStatus(editStatus ? null : item)}
                      >
                        <a>{editStatus ? '取消编辑' : '编辑答案'}</a>
                      </span>
                    ) : null} */}
                  </div>

                  <div className={replyStyle.commentList}>
                    {item.showComment ? (
                      <div>
                        {item.commentList.length ? (
                          <List
                            dataSource={item.commentList || []}
                            header={false}
                            footer={false}
                            renderItem={(item) => {
                              return (
                                <List.Item>
                                  <List.Item.Meta
                                    avatar={
                                      <Avatar
                                        src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${item.userName}}`}
                                      />
                                    }
                                    title={item.userName}
                                    description={item.content}
                                  />
                                </List.Item>
                              );
                            }}
                          />
                        ) : null}

                        <Input
                          value={newComment}
                          onChange={editComment}
                          placeholder="请输入您的评论"
                          style={{ width: '80%', marginRight: 10 }}
                        />
                        <Button type="primary" disabled={!newComment} onClick={sendComment.bind(this,item)}>
                          发布
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </Col>
          <Col span={6}>
            <div>
              <UserInfo />
            </div>
            {/* <span>参考回答助手：</span>
            <Search
              style={{ width: '50%', marginBottom: 10 }}
              onSearch={(value) => {
                dispatch({
                  type: 'reply/getSG',
                  payload: {
                    q: encodeURIComponent(value),
                    pageStart: 1,
                    pageCount: 10,
                    userId: ''
                  }
                });
              }}
              placeholder={q}
            /> */}
            {/* <Spin spinning={loading}>
              <div
                id="sg"
                style={{
                  padding: '2px 2px',
                  height: keys.length ? '80vh' : 'auto',
                  overflowY: keys.length ? 'scroll' : 'auto'
                }}
              >
                {keys.length ? (
                  keys.map((item) => {
                    const year =
                      (groupByData[item][0].sgAdditionInfo &&
                        groupByData[item][0].sgAdditionInfo.年) ||
                      '';
                    const author =
                      (groupByData[item][0].sgAdditionInfo &&
                        groupByData[item][0].sgAdditionInfo.作者) ||
                      '';
                    const qikanName =
                      (groupByData[item][0].sgAdditionInfo &&
                        groupByData[item][0].sgAdditionInfo.中文刊名) ||
                      '';

                    const title = groupByData[item][0].data.caption || '';
                    const source_id = groupByData[item][0].data.source_id || '';
                    return (
                      <div className={replyStyle.wrapper} key={item}>
                        <List
                          itemLayout="vertical"
                          dataSource={groupByData[item]}
                          renderItem={(item, index) => {
                            const answer = item.data.context + item.data.sub_context;
                            return (
                              <List.Item style={{ overflow: 'hidden' }}>
                                <div
                                  onMouseUp={(e) =>
                                    handleMouseUp(e, { year, qikanName, title, source_id, author })
                                  }
                                  className={replyStyle.fontStyle}
                                  key={index}
                                  dangerouslySetInnerHTML={{
                                    __html: RestTools.formatText(RestTools.translateToRed(answer.substring(0,10)))
                                  }}
                                />
                              </List.Item>
                            );
                          }}
                        />
                      </div>
                    );
                  })
                ) : (
                  <Empty />
                )}
              </div>
            </Spin>
            <div
              id="addQuote"
              style={{
                display: 'none',
                position: 'fixed',
                cursor: 'pointer',
                background: '#fff',
                border: '1px solid #ccc',
                padding: '5px 10px',
                boxShadow: '2px 2px 10px #999'
              }}
              onClick={copyTextToEditor.bind(this, selectText, resourceInfo)}
            >
              <Icon type="copy" theme="twoTone" />
              添加引用
            </div> */}
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
