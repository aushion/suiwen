import React from 'react';
import { Form, Button, Input } from 'antd';

function updatePassword(props) {
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

  const { getFieldDecorator } = props.form;

  return (
    <div>
      <Form {...formItemLayout}>
        <Form.Item label="账号">
          {getFieldDecorator('email', {})(<Input style={{ width: '60%' }} />)}
        </Form.Item>
        <Form.Item label="原密码">
          {getFieldDecorator('email', {})(<Input.Password style={{ width: '60%' }} />)}
        </Form.Item>
        <Form.Item label="新密码">
          {getFieldDecorator('email', {})(<Input.Password style={{ width: '60%' }} />)}
        </Form.Item>
        <Form.Item label="确认新密码">
          {getFieldDecorator('email', {})(<Input.Password style={{ width: '60%' }} />)}
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

export default Form.create()(updatePassword);
