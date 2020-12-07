import React, { useState, useEffect } from 'react';
import { Input, Modal, Form, message, Select } from 'antd';

const NodeModel = Form.create({
  mapPropsToFields(props) {
    if (props.data !== undefined) {
      return {
        label: Form.createFormField({ value: props.data.label }),
        orderNum: Form.createFormField({ value: props.data.orderNum }),
      };
    }
  },
})(props => {
  const { data, modalVisible, form, chapterId } = props
  const { TextArea } = Input;
  //问题、关键字 模版相关
  const [questionTemplateData, setQuestionTemplateData] = useState([]);
  const [selectedQuestionTemplate, setSeletedQuestionTemplate] = useState('');
  const [newNodeQuestions, setNewNodeQuestions] = useState('');

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

  useEffect(() => {
    //加载问题模版
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getQuestionTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //获取所有的问题、关键字模版
  function getQuestionTemplate() {
    props
      .dispatch({
        type: 'Doc/getQuestionTemplate',
      })
      .then(res => {
        if (res.code === 200) {
          setQuestionTemplateData(res.result);
        } else {
          message.error(res.msg);
        }
      });
  }

  const onHandleCancel = () => {
    props.onHandleCancel();
  }

  //新建节，提交按钮事件
  const onHandleOk = () => {

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        'parentId': chapterId,
        'routeId': data.id,
        'question': newNodeQuestions,
      }
      props.onHandleOk(values);
    });
  };

  let questionTemplateOptions = [];
  if (questionTemplateData.length) {
    for (let i = 0; i < questionTemplateData.length; i++) {
      questionTemplateOptions.push(
        <Select.Option value={questionTemplateData[i]['question']} key={i}>
          {questionTemplateData[i]['question']}
        </Select.Option>
      );
    }
  }


  //选择问题模版改变事件
  const onQuestionSelectChange = (v) => {
    setSeletedQuestionTemplate(v);
    if (v === '') {
      return;
    }

    //将选择的问题模版 填充到文本域里
    let newNodeQuestionsStr = newNodeQuestions + '\n' + v;
    setNewNodeQuestions(newNodeQuestionsStr);

  }

  return (
    <Modal
      //关闭时销毁 Modal 里的子元素， 默认false
      destroyOnClose
      //是否支持键盘 esc 关闭 ， 默认true
      keyboard
      title={data.id === undefined ? '新增节标题' : '编辑节标题'}
      centered={true}
      visible={modalVisible}
      width={600}
      onOk={onHandleOk}
      onCancel={() => onHandleCancel()}

    >
      <Form {...formItemLayout} >
        <Form.Item label="节标题">
          {form.getFieldDecorator('label', {
            rules: [{ pattern: /^(.{1,30})$/, required: true, message: '文档标题不可超过30位字符!' }],
          })(<Input placeholder='建议中文、数字与下划线"_" ' style={{ width: 400 }} maxLength={30} />)}
        </Form.Item>

        <Form.Item label="模版选择" hidden={data.id === undefined ? false : true}>

          <Select
            style={{ width: 400 }}
            value={selectedQuestionTemplate}
            onChange={(v) => onQuestionSelectChange(v)}
          >
            <Select.Option value={''} >
              {'无'}
            </Select.Option>
            {questionTemplateOptions}
          </Select>
        </Form.Item>

        <Form.Item label="问题/关键字" hidden={data.id === undefined ? false : true}>
          <TextArea
            style={{ border: 'solid 3px   #E6E8FA', width: 400 }}
            placeholder="批量添加以回车换行分割"
            autoSize={{ minRows: 10, maxRows: 15 }}
            value={newNodeQuestions}
            onChange={e => {
              setNewNodeQuestions(e.target.value);

            }}
          />
        </Form.Item>
        <Form.Item label="排序号" hidden={data.id === undefined ? true : false}>
          {form.getFieldDecorator('orderNum', {
            rules: [{ pattern: /^([1-9][0-9]?)$/, required: true, message: '排序号取值范围为[1,99]的正整数!' }],
          })(<Input placeholder='只支持数字格式' style={{ width: 400 }} />)}
        </Form.Item>
      </Form>

    </Modal>
  );
});
export default NodeModel;