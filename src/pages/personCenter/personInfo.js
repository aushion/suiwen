import React from 'react';
import { Row, Col, Form, Input } from 'antd';
import { connect } from 'dva';
import PersonMenu from './components/PersonMenu';
import PersonAvatar from './components/PersonAvatar';

function personInfo(props) {
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };
  return (
    <div>
      <PersonAvatar />
      <div style={{ marginTop: 40, margin: '2% 18.75% 0' }}>
        <Row gutter={24}>
          <Col span={5}>
            <PersonMenu />
          </Col>

          <Col span={19}>
            <div style={{ backgroundColor: '#fff', height: 500 }}>
              <Form {...formItemLayout}>
                <Form.Item label="E-mail">
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
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="Password" hasFeedback>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your password!'
                      },
                     
                    ]
                  })(<Input.Password />)}
                </Form.Item>
                <Form.Item label="Confirm Password" hasFeedback>
                  {getFieldDecorator('confirm', {
                    rules: [
                      {
                        required: true,
                        message: 'Please confirm your password!'
                      },
                    
                    ]
                  })(<Input.Password />)}
                </Form.Item>
                <Form.Item label={<span>Nickname&nbsp;</span>}>
                  {getFieldDecorator('nickname', {
                    rules: [
                      { required: true, message: 'Please input your nickname!', whitespace: true }
                    ]
                  })(<Input />)}
                </Form.Item>

                <Form.Item label="Phone Number">
                  {getFieldDecorator('phone', {
                    rules: [{ required: true, message: 'Please input your phone number!' }]
                  })(<Input style={{ width: '100%' }} />)}
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
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
