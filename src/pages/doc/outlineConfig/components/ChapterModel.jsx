import React from 'react';
import { Input, Modal, Form, Button } from 'antd';

const ChapterEdit = Form.create({
  mapPropsToFields(props) {
    if (props.data != undefined) {
      return {
        label: Form.createFormField({ value: props.data.label }),
        orderNum: Form.createFormField({ value: props.data.orderNum }),
      };
    }
  },
})(props => {
  const { data, modalVisible, form } = props

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
    props.onHandleCancel();
  }

  //新建章，提交按钮事件
  const onHandleOk = () => {

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
         ...fieldsValue,
        'parentId': '0',
        'routeId': data.id,
      }
      props.onHandleOk(values);
    });
  };

  return (
    <Modal
      //关闭时销毁 Modal 里的子元素， 默认false
      destroyOnClose
      //是否支持键盘 esc 关闭 ， 默认true
      keyboard
      title={data.id === undefined ? '新增章标题' : '编辑章标题'}
      centered={true}
      visible={modalVisible}
      width={600}
      onOk={onHandleOk}
      onCancel={() => onHandleCancel()}

    >
      <Form {...formItemLayout} >
        <Form.Item label="章标题">
          {form.getFieldDecorator('label', {
            rules: [{ required: true, message: '请输入章标题!' }],
          })(<Input placeholder='建议中文、数字与下划线"_" ' style={{ width: 400 }} />)}
        </Form.Item>
        <Form.Item label="排序号" hidden={data.id === undefined ? true : false}>
          {form.getFieldDecorator('orderNum', {
           
          })(<Input placeholder='建议纯数字' style={{ width: 400 }} />)}
        </Form.Item>

      </Form>
    </Modal>
  );
});
export default ChapterEdit;