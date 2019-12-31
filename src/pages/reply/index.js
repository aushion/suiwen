import React from 'react';
import { connect } from 'dva';
import { Divider, Icon, Button, Form, Spin, message } from 'antd';
import queryString from 'querystring';
import BraftEditor from 'braft-editor';
import Link from 'umi/link';
// import Cookies from 'js-cookie';
import RestTools from '../../utils/RestTools';
import 'braft-editor/dist/index.css';
import HelpMenu from '../help/components/HelpMenu';
import replyStyle from './index.less';

const FormItem = Form.Item;
// const { Option } = Select;
function Reply(props) {
  const params = queryString.parse(window.location.href.split('?')[1]);
  const userInfo = RestTools.getLocalStorage('userInfo')? RestTools.getLocalStorage('userInfo') : null;
  // const { domain } = params;
  const { total, answerList, loading } = props;
  const { getFieldDecorator } = props.form;
  const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link'];
  const username = answerList.length && (answerList[0].userName || answerList[0].UserName);
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
    props.form.validateFields((error, values) => {
      if (!error) {
        const submitData = {
          contents: values.contents.toHTML(), // or values.content.toHTML()
          // domain: values.domain,
        };
        const QID = props.QID || params.QID;
        const payload = QID
          ? {
              qid: QID,
              answer: submitData.contents,
              resource: '',
              username: props.username,
              // domain: submitData.domain,
              uid: props.uid,
              isedit: false,
            }
          : {
              question: params.question,
              answer: submitData.contents,
              username: props.username,
              uid: props.uid,
              // domain: submitData.domain,
            };
        if (QID) {
          props.dispatch({ type: 'reply/setAnswer', payload });
        } else {
          props.dispatch({ type: 'reply/setQanswer', payload });
        }

        props.form.setFieldsValue({
          contents: BraftEditor.createEditorState(''),
        });
      }
    });
  }
  return (
    <div className={replyStyle.reply}>
      <div>
        <HelpMenu></HelpMenu>
      </div>
      <div className={replyStyle.content}>
        <div className={replyStyle.title}>
          <Icon style={{ color: '#f39b27', paddingRight: 10 }} type="question-circle" />
          {params.question}
        </div>

        <Spin spinning={loading}>
          <div className={replyStyle.replyCount}>
            <span style={{ paddingRight: 10 }}>回答数:</span>
            {total}
          </div>
          <Divider style={{ margin: '0' }}></Divider>
          {answerList.map((item, index) => {
            return (
              <div className={replyStyle.answerItem} key={item.answerid || item.aid}>
                <div
                  className={replyStyle.itemTitle}
                  dangerouslySetInnerHTML={{ __html: item.Content || item.answer }}
                />
                <div>
                  <span style={{ paddingRight: 20 }}>{index}#</span>
                  <Link to={'/home'} style={{ paddingRight: 20 }}>
                    <Icon type="user" /> {item.UserName || item.userName}
                  </Link>
                  <span style={{ padding: '0 10px' }}>{RestTools.status[item.Status]}</span>
                  <span style={{ color: '#c3c3c3' }}>{item.OPTime}</span>
                </div>
              </div>
            );
          })}
        </Spin>
        {userInfo && username !== userInfo.UserName? (
          <div className={replyStyle.draft}>
            <Form>
              {/* <Form.Item label="问题分类" hasFeedback>
                {getFieldDecorator('domain', {
                  rules: [{ required: true, message: '请选择问题分类' }],
                  initialValue: domain,
                })(
                  <Select placeholder="请选择问题分类">
                    {domains.length &&
                      domains.map(item => (
                        <Option key={item.领域} value={item.领域}>
                          {item.领域}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item> */}
              <FormItem>
                {getFieldDecorator('contents', {
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
                      },
                    },
                  ],
                })(
                  <BraftEditor
                    style={{ border: '1px solid #ccc', height: 360 }}
                    contentStyle={{ height: 240 }}
                    controls={controls}
                    placeholder="请输入正文内容"
                  />,
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
        ) : null}
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state.reply, loading: state.loading.models.reply };
}

export default connect(mapStateToProps)(Form.create()(Reply));
