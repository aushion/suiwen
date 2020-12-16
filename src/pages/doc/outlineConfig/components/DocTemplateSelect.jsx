import React from 'react';
import { Modal, Form, Button, Input } from 'antd';

const DocTemplateSelect = Form.create({
  mapPropsToFields(props) {
    if (props.data !== undefined) {
      return {
        keyWord: Form.createFormField({ value: props.data.keyWord ? props.data.keyWord : '' }),
      };
    }
  },
})(props => {

  const { modalVisible, form} = props;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  const onHandleCancel = () => {
    props.onCancle();
  }

  //应用模板，提交按钮事件
  const onHandleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        // 'docTemplateId': selectedDocTemplate,
      }
      props.handleOk(values);
    });

  }


  return (
    <Modal
      //关闭时销毁 Modal 里的子元素， 默认false
      destroyOnClose
      //是否支持键盘 esc 关闭 ， 默认true
      keyboard
      title={'编辑主题词'}
      centered={true}
      visible={modalVisible}
      width={400}
      height={300}
      // okText={'下载'}
      // cancelText={'放弃'}
      // onOk={onHandleOk}
      onCancel={() => onHandleCancel()}
      footer={[
        <Button key="放弃" onClick={onHandleCancel}>放弃</Button>,
        <Button key="应用" type="primary" onClick={onHandleOk}>
          应用
        </Button>,]}
    >
      <Form {...formItemLayout} >

        <Form.Item label="主题词">
          {form.getFieldDecorator('keyWord', {
            rules: [{ pattern: /^(\S[\S\s]{0,19})$/, required: true, message: '开头不可为空字符,且不可超过20个字符' }],
          })(<Input placeholder='文档模板不为空时，主题词必填' style={{ width: 250 }} maxLength={30} />)}
        </Form.Item>


      </Form>
    </Modal>
  );
});
export default DocTemplateSelect;