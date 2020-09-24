import React from 'react';
import { Form, Input, DatePicker, Radio, Button, message, Descriptions } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

function PersonInfo(props) {
  const { getFieldDecorator, validateFields } = props.form;
  const { userInfo, dispatch } = props;
  const localUserInfo = JSON.parse(window.localStorage.getItem('userInfo'));
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const data = JSON.parse(
          JSON.stringify(values, function(key, value) {
            if (value) {
              return value;
            } else {
              return undefined;
            }
          })
        );
        const { birthday, ...rest } = data;
        dispatch({
          type: 'personCenter/editUserInfo',
          payload: {
            birthday: values.birthday.format('YYYY-MM-DD'),
            ...rest
          }
        }).then((res) => {
          if (res.data.result) {
            message.success('保存成功');
          } else {
            message.error(res.data.msg);
          }
        });
      }
    });
  }

  return (
    <div style={{padding:'0 0 0 20%'}}>
      {localUserInfo && localUserInfo.UserType === 'bk' ? (
        <Descriptions title="账号信息" column={1} bordered>
          <Descriptions.Item label="账号">{userInfo ? userInfo.userName : ''}</Descriptions.Item>
          <Descriptions.Item label="办公电话">
            {userInfo && userInfo.telephone ? userInfo.telephone : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="手机号">{userInfo ? userInfo.mobile : '-'}</Descriptions.Item>

          <Descriptions.Item label="邮箱">{userInfo ? userInfo.email : ''}</Descriptions.Item>
        </Descriptions>
      ) : (
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item label="账号">
            {getFieldDecorator('userName', {
              initialValue: userInfo ? userInfo.userName : '',
              rules: [
                {
                  required: true,
                  message: 'Please input your E-mail!'
                }
              ]
            })(<Input style={{ width: '60%' }} disabled />)}
          </Form.Item>
          <Form.Item label="性别">
            {getFieldDecorator('sex', {
              initialValue: userInfo ? userInfo.sex : '',
              rules: []
            })(
              <Radio.Group>
                <Radio value="1">男</Radio>
                <Radio value="0">女</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="出生日期" hasFeedback>
            {getFieldDecorator('birthday', {
              initialValue:
                userInfo && userInfo.birthday ? moment(userInfo.birthday, 'YYYY-MM-DD') : null
            })(<DatePicker style={{ width: '60%' }} />)}
          </Form.Item>

          <Form.Item label="办公电话">
            {getFieldDecorator('telephone', {
              initialValue: userInfo ? userInfo.telephone : '',
              rules: [
                {
                  pattern: /^\d+[-]?\d+$/g,
                  message: '请您输入正确的电话号码'
                }
              ]
            })(<Input style={{ width: '60%' }} />)}
          </Form.Item>
          <Form.Item label="手机号">
            {getFieldDecorator('mobile', {
              initialValue: userInfo ? userInfo.mobile : '',
              rules: []
            })(<Input style={{ width: '60%' }} />)}
          </Form.Item>

          <Form.Item label="邮箱">
            {getFieldDecorator('email', {
              initialValue: userInfo ? userInfo.email : '',
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!'
                }
              ]
            })(<Input style={{ width: '60%' }} />)}
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 14 }}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.personCenter,
    loading: state.loading.effects['personCenter/getUserInfo']
  };
}

export default connect(mapStateToProps)(Form.create()(PersonInfo));
