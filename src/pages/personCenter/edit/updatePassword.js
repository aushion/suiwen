import React from 'react';
import { Form, Button, Input, message } from 'antd';
import { connect } from 'dva';
import RestTools from 'Utils/RestTools';

function UpdatePassword(props) {
  const userInfo = RestTools.getLocalStorage('userInfo');
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

  const { getFieldDecorator, validateFields, resetFields } = props.form;

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const { confirmPassword, newPassword, password, username } = values;
        if (confirmPassword === newPassword) {
          const data = {
            newPassword,
            password,
            username
          };
          props
            .dispatch({
              type: 'personCenter/updatePassword',
              payload: {
                ...data
              }
            })
            .then((res) => {
              if (res.data.result) {
                message.success('密码修改成功');
                resetFields();
              } else {
                message.error(res.data.msg);
              }
            });
        } else {
          message.warn('两次新密码不一致');
        }
      }
    });
  }

  return (
    <div style={{padding: '20px 0 0 20%'}}>
      <Form {...formItemLayout} onSubmit={handleSubmit}>
        <Form.Item label="账号">
          {getFieldDecorator('username', {
            initialValue: userInfo.UserName || ''
          })(<Input disabled style={{ width: '60%' }} />)}
        </Form.Item>
        <Form.Item label="原密码">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请您填写原密码'
              }
            ]
          })(<Input.Password style={{ width: '60%' }} placeholder="原密码" />)}
        </Form.Item>
        <Form.Item label="新密码">
          {getFieldDecorator('newPassword', {
            rules: [
              {
                required: true,
                message: '请您填写新密码'
              },
              {
                pattern: /^[a-zA-Z](?![a-zA-Z]+$)\w{5,19}$/,
                message: '密码为6-20位数字、字母或下划线，至少包括其中两种，以字母开头'
              }
            ]
          })(<Input.Password style={{ width: '60%' }} placeholder="新密码" />)}
        </Form.Item>
        <Form.Item label="确认新密码">
          {getFieldDecorator('confirmPassword', {
            rules: [
              {
                required: true,
                message: '请您再次填写新密码'
              },
              {
                pattern: /^[a-zA-Z](?![a-zA-Z]+$)\w{5,19}$/,
                message: '密码为6-20位数字、字母或下划线，至少包括其中两种，以字母开头'
              }
            ]
          })(<Input.Password style={{ width: '60%' }} placeholder="确认新密码" />)}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 14 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.personCenter,
    loading: state.loading.effects['personCenter/getUserInfo']
  };
}

export default connect(mapStateToProps)(Form.create()(UpdatePassword));
