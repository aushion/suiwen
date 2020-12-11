import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Button, message } from 'antd';
import queryString from 'querystring';

import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import RestTools from '../../../utils/RestTools';

const FormItem = Form.Item;

function AnswerForm(props) {
  const { editStatus, answerList, answerHelpData } = props;

  const { getFieldDecorator, validateFields, resetFields, setFieldsValue } = props.form;
  const params = queryString.parse(window.location.href.split('?')[1]);
  const controls = ['font-size', 'bold', 'italic', 'underline', 'text-color', 'separator', 'link'];
  const userInfo = RestTools.getLocalStorage('userInfo')
    ? RestTools.getLocalStorage('userInfo')
    : null;
  const username = answerList.length && (answerList[0].userName || answerList[0].UserName);

  useEffect(() => {
    if (answerHelpData && answerHelpData.resource) {
      setFieldsValue({
        contents: BraftEditor.createEditorState(answerHelpData.contents)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerHelpData]);

  useEffect(() => {
    if (editStatus && editStatus.answer) {
      setFieldsValue({
        contents: BraftEditor.createEditorState(editStatus.answer)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editStatus]);

  function submitContent(e) {
    if (userInfo) {
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
          resource: answerHelpData?.resource || editStatus?.resource || ''
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
          payload = { ...payload, qid: QID };
        } else {
          payload = {
            content: submitData.contents,
            resource: submitData.resource,
            userName: props.uid,
            domain: '',
            question: params.q
          };
        }
        if (editStatus) {
          //修改答案
          props.dispatch({
            type: 'reply/editAnswer',
            payload: { ...payload, aid: editStatus.aid, eidtorId: '' }
          });
        } else {
          props.dispatch({ type: 'reply/setAnswer', payload });
        }

        resetFields(); //重置表单值
      }
    });
  }
  return (
    <div style={{ overflow: 'hidden', borderBottom: '1px solid #eee' }}>
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

        <FormItem style={{ float: 'right', overflow: 'hidden' }}>
          <Button loading={props.loading} type="primary" htmlType="submit" onClick={submitContent}>
            {editStatus ? '提交修改' : '提交回答'}
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.reply
  };
}

export default connect(mapStateToProps)(Form.create()(AnswerForm));
