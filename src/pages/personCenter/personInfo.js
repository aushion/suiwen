import React from 'react';
import { Form, Input, DatePicker, Radio, Button } from 'antd';
import { connect } from 'dva';

function personInfo(props) {
  const { getFieldDecorator } = props.form;
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
  return (
    <div>
      <Form {...formItemLayout}>
        <Form.Item label="账号">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!'
              },
              {
                required: true,
                message: 'Please input your E-mail!'
              }
            ]
          })(<Input style={{ width: '60%' }} />)}
        </Form.Item>
        <Form.Item label="性别">
          {getFieldDecorator('sex', {
            rules: []
          })(
            <Radio.Group>
              <Radio value="a">男</Radio>
              <Radio value="b">女</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="出生日期" hasFeedback>
          {getFieldDecorator('confirm', {})(<DatePicker style={{ width: '60%' }} />)}
        </Form.Item>
        <Form.Item label="年龄">
          {getFieldDecorator('nickname', {
            rules: []
          })(<Input style={{ width: '60%' }} />)}
        </Form.Item>
        <Form.Item label="办公电话">
          {getFieldDecorator('phone', {
            rules: []
          })(<Input style={{ width: '60%' }} />)}
        </Form.Item>
        <Form.Item label="手机号">
          {getFieldDecorator('phone', {
            rules: []
          })(<Input style={{ width: '60%' }} />)}
        </Form.Item>

        <Form.Item label="邮箱">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!'
              }
            ]
          })(<Input style={{ width: '60%' }} />)}
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
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
    ...state.personCenter
    // loading: state.loading.effects['']
  };
}

export default connect(mapStateToProps)(Form.create()(personInfo));
