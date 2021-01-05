import React, { useState } from 'react';
import { Input, Modal, Form, Select, Radio, Button,message } from 'antd';

const AddDocModel = Form.create({
  mapPropsToFields(props) {
    if (props.data !== undefined) {
      return {};
    }
  }
})((props) => {
  const {
    modalVisible,
    form,
    docTemplateOptions,
    defaultDocumentTemplate,
    docClassifyOptions,
    newType
  } = props;
  //文档模版选择
  const [selectedDocTemplate, setSeletedDocTemplate] = useState(
    defaultDocumentTemplate ? defaultDocumentTemplate : ''
  );
  //文档标题
  const [docTitle, setDocTitle] = useState('');

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  };

  const onHandleCancel = () => {
    props.onHandleCancel();
  };
  //文档模板选择改变触发函数
  const onDocTemplateSelectChange = (v) => {
    setSeletedDocTemplate(v);
    if (v === '') {
      return;
    }
  };
  //主题词输入内容改变触发函数
  const onKeyWordChange = (e) => {
    //将文档标题随着主题词的改变而改变。规则分为两种：
    //1.如果直接点击新建文档弹出的页面：主题词（内燃机）-> 文档标题(内燃机)
    //2.如果切换文档模板弹出的页面：主题词（内燃机）-> 文档标题(内燃机temp16081068352777428)
    let keyWordTemp = e.target.value;
    if (newType === 1) {
      setDocTitle(keyWordTemp);
    } else if (newType === 2) {
      var currentDate = new Date().Format('yyyyMMddHHmmss');
      let newDocTitleTemp = keyWordTemp + 'temp_' + currentDate;
      setDocTitle(newDocTitleTemp);
    } else {
      return;
    }
  };

  //文档标题输入内容改变触发函数
  const onDocTitleChange = (e) => {
    setDocTitle(e.target.value);
  };

  //新建文档，提交按钮事件
  const onHandleOk = () => {
    //校验文档标题
    if(docTitle.trim() === ''){
      message.warn('文档标题不可为空！');
      return ;
    }

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        docTemplateId: selectedDocTemplate,
        label: docTitle
      };
      props.onHandleOk(values);
    });
  };

  return (
    <Modal
      //关闭时销毁 Modal 里的子元素， 默认false
      destroyOnClose
      //是否支持键盘 esc 关闭 ， 默认true
      keyboard
      title={'新建文档'}
      centered={true}
      visible={modalVisible}
      width={600}
      onOk={onHandleOk}
      onCancel={() => onHandleCancel()}
    >
      <Form {...formItemLayout}>
        <Form.Item label="文档模版">
          <Select
            style={{ width: 400 }}
            value={selectedDocTemplate}
            onChange={(v) => onDocTemplateSelectChange(v)}
          >
            <Select.Option value={''}>{'无'}</Select.Option>
            {docTemplateOptions}
          </Select>
        </Form.Item>
        <Form.Item label="主题词" hidden={selectedDocTemplate === '' ? true : false}>
          {form.getFieldDecorator('keyWord', {
            rules: [
              {
                pattern: /^(\S[\S\s]{0,19})$/,
                required: selectedDocTemplate === '' ? false : true,
                message: '开头不可为空字符,且不可超过20个字符'
              }
            ]
          })(
            <Input
              placeholder="文档模板不为空时，主题词必填"
              style={{ width: 400 }}
              maxLength={30}
              onChange={(e) => onKeyWordChange(e)}
            />
          )}
        </Form.Item>
        <Form.Item label="文档标题" required={true}>
          {/* {form.getFieldDecorator('label', {
            rules: [{ pattern: /^(.{1,30})$/, required: true, message: '文档标题不可超过30位字符!' }],
          })(<Input placeholder='建议中文、数字与下划线"_" ' style={{ width: 400 }} maxLength={30} />)} */}
          <Input
            value={docTitle}
            placeholder='建议中文、数字与下划线"_" '
            style={{ width: 400 }}
            maxLength={30}
            onChange={(e) => onDocTitleChange(e)}
          />
        </Form.Item>
        <Form.Item label="文档标签">
          {form.getFieldDecorator('tag', {})(
            <Select
              placeholder="点击此处可为文档选取多个标签"
              mode="multiple"
              style={{ width: 400 }}
            >
              {docClassifyOptions}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="是否公开">
          {form.getFieldDecorator('type', {
            initialValue: '0',
            rules: []
          })(
            <Radio.Group style={{ width: 150 }}>
              <Radio value="0">公开</Radio>
              <Radio value="1">私有</Radio>
            </Radio.Group>
          )}
          <Button
            style={{ border: '0px', marginLeft: '230px' }}
            size={'small'}
            icon={'info-circle'}
            title={'选择公开，表示文档可以发布，使他人可见；\r\n选择私有，代表文档只自己可见。'}
            onClick={() => {}}
          ></Button>
        </Form.Item>
      </Form>
    </Modal>
  );
});
export default AddDocModel;
