import React from 'react';
import { Form, Input, DatePicker, Radio, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment'

function PersonInfo(props) {
  const { getFieldDecorator, validateFields } = props.form;
  const { userInfo, dispatch } = props;
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
        });
      }
    });
  }

  return (
    <div>
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
            initialValue: userInfo?userInfo.sex:'',
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
            initialValue: userInfo ? moment(userInfo.birthday,'YYYY-MM-DD') : moment()
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
    ...state.personCenter,
    loading: state.loading.effects['personCenter/getUserInfo']
  };
}

export default connect(mapStateToProps)(Form.create()(PersonInfo));
