import React from 'react';
import { Modal, Rate, Form, Input, message } from 'antd';
// import { feedback } from '../../layouts/service';
import request from '../../utils/request';

const { TextArea } = Input;

function FeedBack(props) {
  const { visible, triggerCancel } = props;
  const { getFieldDecorator } = props.form;

  const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 22 }
  };

  function handleCancel() {
    triggerCancel();
  }

  function handleOk(e) {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const data = JSON.parse(
          JSON.stringify(values, function(key, value) {
            if (value) {
              return value;
            } else {
              return undefined;
            }
          })
        );
        //feedback(data)
        request
          .get('/insertFeedback', {
            params: { ...data }
          })
          .then((res) => {
            if (res.data.result) {
              triggerCancel();
              message.success('感谢您的反馈');
              props.form.setFieldsValue({
                level: null,
                suggestion: '',
                name: '',
                email: ''
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  return (
    <Modal
      title="欢迎您帮助我们改善问答系统"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      width={400}
    >
      <Form {...formItemLayout} labelAlign="left">
        <div>您觉得我的问答系统怎么样？</div>
        <Form.Item>
          {getFieldDecorator('level', {
            rules: [
              {
                required: true,
                message: '请您填写评分'
              }
            ]
          })(<Rate />)}
        </Form.Item>
        <div>请输入您的留言</div>
        <Form.Item>
          {getFieldDecorator('suggestion', {
            rules: [
              {
                max: 500,
                message: '最多输入500字'
              }
            ],
            initialValue: ''
          })(<TextArea rows={4} />)}
        </Form.Item>
        <div>您的联系方式</div>
        <Form.Item label="姓名">
          {getFieldDecorator('name', {
            rules: [
              {
                max: 20,
                message: '不能超过20个字哟'
              },
              {
                required: false,
                message: '请输入你的姓名'
              }
            ],
            initialValue: ''
          })(<Input placeholder="请输入你的姓名" />)}
        </Form.Item>

        <Form.Item label="邮箱">
          {getFieldDecorator('email', {
            rules: [
              {
                max: 100,
                message: '不能超过100个字符哟'
              },
              {
                required: false,
                message: '请输入你的邮箱'
              },
              {
                type: 'email',
                message: '请输入一个有效的邮箱!'
              }
            ],
            initialValue: ''
          })(<Input placeholder="请输入你的邮箱" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}

const WrapperForm = Form.create()(FeedBack);

export default WrapperForm;
