import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Divider, Icon, Button, Form, Spin, message, Row, Col, Input, List } from 'antd';
import queryString from 'querystring';
import BraftEditor from 'braft-editor';
import groupBy from 'lodash/groupBy';

import Link from 'umi/link';
// import { useTextSelection } from '@umijs/hooks';
import RestTools from '../../utils/RestTools';

import HelpMenu from '../help/components/HelpMenu';

import replyStyle from './index.less';
import 'braft-editor/dist/index.css';

const FormItem = Form.Item;
const { Search } = Input;

const quoteArray = [];

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

  const [selectText, setSelectText] = useState('');
  const [resourceInfo, setResourceInfo] = useState(null);

  const menus = RestTools.getLocalStorage('userInfo')
    ? [
        {
          key: 'newHelp',
          text: '新求助'
        },
        {
          key: 'hotHelp',
          text: '热门求助'
        },
        {
          key: 'myHelp',
          text: '我的求助'
        },
        {
          key: 'myReply',
          text: '我的回答'
        }
      ]
    : [
        {
          key: 'newHelp',
          text: '新求助'
        },
        {
          key: 'hotHelp',
          text: '热门求助'
        }
      ];

  const groupByData = groupBy(sgData, 'id');
  const keys = Object.keys(groupByData);

  useEffect(() => {
    function hideAddQuote(e) {
      const addQuote = document.getElementById('addQuote');
      if (e.target !== addQuote) {
        addQuote.style.display = 'none';
      }
    }
    document.addEventListener('click', hideAddQuote);
    return () => {
      document.removeEventListener('click', hideAddQuote);
    };
  }, []);

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
    console.log(str);
    let newText = (str += `${text}[${resourceArray.length}]`);
    let newResourceStr = '';

    for (let i = 0; i < resourceArray.length; i++) {
      newResourceStr += resourceArray[i] + '<br>';
    }

    if (newText) {
      setFieldsValue({
        contents: BraftEditor.createEditorState(newText),
        resource: BraftEditor.createEditorState(newResourceStr)
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
    setSelectText(selectedHtml);
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
          contents: values.contents.toHTML() // or values.content.toHTML()
          // domain: values.domain,
        };
        const QID = props.QID || params.QID;
        const payload = QID
          ? {
              qid: QID,
              answer: submitData.contents,
              resource: submitData.resource,
              username: props.username,
              // domain: submitData.domain,
              uid: props.uid,
              isedit: false
            }
          : {
              question: params.question,
              answer: submitData.contents,
              username: props.username,
              uid: props.uid
              // domain: submitData.domain,
            };
        if (QID) {
          props.dispatch({ type: 'reply/setAnswer', payload });
        } else {
          props.dispatch({ type: 'reply/setQanswer', payload });
        }
        resetFields();
        // props.form.setFieldsValue({
        //   contents: BraftEditor.createEditorState(''),
        //   resource: BraftEditor.createEditorState('')
        // });
      }
    });
  }
  return (
    <div className={replyStyle.reply}>
      <div>
        <HelpMenu data={menus} />
      </div>

      <div className={replyStyle.content}>
        <div className={replyStyle.title}>
          <Icon style={{ color: '#f39b27', paddingRight: 10 }} type="question-circle" />
          {params.q}
        </div>

        <Row gutter={40}>
          <Col span={12}>
            <div className={replyStyle.replyCount}>
              <span style={{ paddingRight: 10 }}>回答数:</span>
              {total}
            </div>
            <Divider style={{ margin: '0' }}></Divider>
            {answerList.map((item, index) => {
              const username = item.UserName || item.userName;
              return (
                <div className={replyStyle.answerItem} key={item.answerid || item.aid}>
                  <div
                    className={replyStyle.itemTitle}
                    dangerouslySetInnerHTML={{ __html: item.Content || item.answer }}
                  />
                  <div>
                    <span style={{ paddingRight: 20 }}>{index}#</span>
                    <Link to={`help/otherHelp?username=${username}`} style={{ paddingRight: 20 }}>
                      <Icon type="user" />
                      {/^1[3-9]\d{9}$/.test(username)
                        ? username.substring(0, 3) + '****' + username.substring(7, 11)
                        : username}
                    </Link>
                    <span style={{ padding: '0 10px' }}>{RestTools.status[item.Status]}</span>
                    <span style={{ color: '#c3c3c3' }}>{item.OPTime}</span>
                  </div>
                </div>
              );
            })}

            <div className={replyStyle.draft}>
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
                      style={{ border: '1px solid #ccc', height: 300 }}
                      contentStyle={{ height: 240, fontSize: 14 }}
                      controls={controls}
                      placeholder="请输入正文内容"
                    />
                  )}
                </FormItem>

                <FormItem label="文献链接">
                  {getFieldDecorator('resource', {
                    // initialValue: contentState,
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        required: false,
                        validator: (_, value, callback) => {
                          if (value.isEmpty()) {
                            callback('请输入文献链接');
                          } else {
                            callback();
                          }
                        }
                      }
                    ]
                  })(
                    <BraftEditor
                      style={{ border: '1px solid #ccc', height: 240 }}
                      contentStyle={{ height: 200, fontSize: 14 }}
                      controls={['link']}
                    />
                  )}
                </FormItem>
                <FormItem>
                  <Button
                    loading={props.loading}
                    size="large"
                    type="primary"
                    htmlType="submit"
                    onClick={submitContent}
                  >
                    提交
                  </Button>
                </FormItem>
              </Form>
            </div>
          </Col>
          <Col span={12} style={{ paddingTop: 20 }}>
            <span>参考回答助手：</span>
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
            />
            <Spin spinning={loading}>
              <div id="sg">
                {keys.map((item) => {
                  const year =
                    (groupByData[item][0].Data.additional_info &&
                      groupByData[item][0].Data.additional_info.年) ||
                    '';
                  const author =
                    (groupByData[item][0].Data.additional_info &&
                      groupByData[item][0].Data.additional_info.作者) ||
                    '';
                  const qikanName =
                    (groupByData[item][0].Data.additional_info &&
                      groupByData[item][0].Data.additional_info.中文刊名) ||
                    '';

                  const title = groupByData[item][0].Data.title || '';
                  const source_id = groupByData[item][0].Data.source_id || '';
                  return (
                    <div
                      className={replyStyle.wrapper}
                      key={item}
                      onMouseUp={(e) =>
                        handleMouseUp(e, { year, qikanName, title, source_id, author })
                      }
                    >
                      <List
                        itemLayout="vertical"
                        dataSource={groupByData[item]}
                        footer={
                          <div
                            style={{
                              float: 'right',
                              fontSize: 13,
                              color: '#999',
                              overflow: 'hidden'
                            }}
                          >
                            <div>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: `${year}&nbsp;&nbsp;&nbsp;${qikanName}&nbsp;&nbsp;&nbsp;`
                                }}
                              />
                              <a
                                style={{ color: '#999' }}
                                target="_blank"
                                rel="noopener noreferrer"
                                href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${groupByData[item][0].Data.source_id}`}
                              >
                                {groupByData[item][0].Data.title}
                              </a>
                            </div>
                          </div>
                        }
                        renderItem={(item, index) => {
                          const answer = item.Data.answer;
                          return (
                            <List.Item style={{ overflow: 'hidden' }}>
                              <div
                                className={replyStyle.fontStyle}
                                key={index}
                                dangerouslySetInnerHTML={{
                                  __html: RestTools.formatText(RestTools.translateToRed(answer))
                                }}
                              />
                            </List.Item>
                          );
                        }}
                      />
                    </div>
                  );
                })}
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
