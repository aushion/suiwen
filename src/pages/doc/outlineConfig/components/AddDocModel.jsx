import React, { useState } from 'react';
import { Input, Modal, Form, Select, Radio,Button } from 'antd';

const AddDocModel = Form.create({
  mapPropsToFields(props) {
    if (props.data !== undefined) {
      return {
        label: Form.createFormField({ value: props.data.label }),
        type: Form.createFormField({ value: props.data.type }),
        tag: Form.createFormField({ value: props.data.tag }),
      };
    }
  },
})(props => {


  const { modalVisible, form, docTemplateOptions, defaultDocumentTemplate, docClassifyOptions } = props;
  //文档模版选择
  const [selectedDocTemplate, setSeletedDocTemplate] = useState(defaultDocumentTemplate ? defaultDocumentTemplate : '');


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

  const onDocTemplateSelectChange = (v) => {
    setSeletedDocTemplate(v);
    if (v === '') {
      return;
    }
  }

  //新建文档，提交按钮事件
  const onHandleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        'docTemplateId': selectedDocTemplate,
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
      title={'新增文档'}
      centered={true}
      visible={modalVisible}
      width={600}
      onOk={onHandleOk}
      onCancel={() => onHandleCancel()}

    >
      <Form {...formItemLayout} >
        <Form.Item label="文档标题">
          {form.getFieldDecorator('label', {
            rules: [{ pattern: /^(.{1,30})$/, required: true, message: '文档标题不可超过30位字符!' }],
          })(<Input placeholder='建议中文、数字与下划线"_" ' style={{ width: 400 }} maxLength={30} />)}
        </Form.Item>
        <Form.Item label="文档模版" >
          <Select
            style={{ width: 400 }}
            value={selectedDocTemplate}
            onChange={(v) => onDocTemplateSelectChange(v)}
          >
            <Select.Option value={''}>{'无'}</Select.Option>
            {docTemplateOptions}
          </Select>
        </Form.Item>
        <Form.Item label="文档标签">
          {form.getFieldDecorator('tag', {
          })(
            <Select
              placeholder='点击此处可为文档选取多个标签'
              mode="multiple"
              style={{ width: 400 }}
            >
              {docClassifyOptions}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="是否公开">
          {form.getFieldDecorator('type', {
            initialValue: '1',
            rules: []
          })(
            <Radio.Group  style={{ width: 150 }}>
              <Radio value="0">公开</Radio>
              <Radio value="1">私有</Radio>
            </Radio.Group>
            
          )}
          <Button
          style={{ border: "0px", marginLeft:"230px" }}
          size={"small"}
          icon={"info-circle"}
          title={"选择公开，表示文档可以发布，使他人可见；\r\n选择私有，代表文档只自己可见。"}
          onClick={() => {
          }}
        >
        </Button>
        </Form.Item>
        
      </Form>
    </Modal>
  );
});
export default AddDocModel;