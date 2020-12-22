import React, { useState, useEffect } from 'react';
import { Input, Modal, Form, message, Select, Row, Col, Checkbox } from 'antd';

const NodeModel = Form.create({
  mapPropsToFields(props) {
    if (props.data !== undefined) {
      return {
        label: Form.createFormField({ value: props.data.label ? String(props.data.label).slice(String(props.data.label).indexOf(' ') + 1).trim() : '' }),
        orderNum: Form.createFormField({ value: props.data.orderNum ? props.data.orderNum : '' }),
      };
    }
  },
})(props => {
  const { data, modalVisible, form, chapterId } = props
  //问题、关键字 模版相关
  const [questionTemplateData, setQuestionTemplateData] = useState([]);
  //标签问题相关
  const [checkedValues, setCheckedValues] = useState([]);
  //保存多个input组件中自定义内容所形成的问题值
  const [inputList, setInputList] = useState([]);

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
      let newTagQuestions = '';
      for (let i = 0; i < inputList.length; i++) {
        //判断当前的input组件内容是否为空
        if (!inputList[i].value) {
          continue;
        }
        let question = inputList[i].value + inputList[i].title.split('###')[0].substring(3);
        newTagQuestions = newTagQuestions + (question + '###' + inputList[i].title.split('###')[1]);
        if (i !== inputList.length - 1) {
          newTagQuestions += '\n';
        }
      }
      const values = {
        ...fieldsValue,
        'parentId': chapterId,
        'routeId': data.id,
        'question': newTagQuestions,
      }
      props.onHandleOk(values);
    });
  };


  //问题模板标签多选框数据初始化
  let questionTemplateTagOptions = [];
  let questionTemplateOptions = [];
  if (questionTemplateData.length) {
    for (let i = 0; i < questionTemplateData.length; i++) {

      questionTemplateOptions.push(
        <Select.Option value={questionTemplateData[i]['question']} key={i} title={questionTemplateData[i]['tag']}>
          {questionTemplateData[i]['tag']}
        </Select.Option>
      );

      let tagObject = { label: questionTemplateData[i]['tag'], value: questionTemplateData[i]['question'] + '###' + questionTemplateData[i]['tag'] };
      questionTemplateTagOptions.push(tagObject);
    }
  }


  //多选框多选项值改变触发函数
  function onCheckboxChange(checkedValuesArr) {
    if (checkedValuesArr.length > 5) {
      message.warn('问题标签最多同时选取5个！');
      return;
    }

    //根据最新多选值与保留输入数据的inputList的长度差异，判定该操作是新增还是减少
    if (checkedValuesArr.length < inputList.length) {
      //代表问题标签选择框 减少了一个值
      //获取减少的那个值，并同步于inputList中。保持两者长度始终不变。
      for (var i = 0; i < checkedValues.length; i++) {
        if (checkedValuesArr.indexOf(checkedValues[i]) === -1) {
          //此时checkedValues[i]即为待处理的元素，需要将其在inputList里删掉。
          let inputListTemp = inputList;
          inputListTemp.splice(i, 1);
          setInputList(inputListTemp);
          break;
        }
      }
    } else if (checkedValuesArr.length > inputList.length) {
      //代表问题标签选择框 比之前新增了一个值
      //获取新增的那个值，并同步于inputList中。保持两者长度始终不变。
      for (var j = 0; j < checkedValuesArr.length; j++) {
        if (checkedValues.indexOf(checkedValuesArr[j]) === -1) {
          //此时checkedValuesArr[i]即为待处理的元素，需要将其在inputList里新增。
          let inputListTemp = inputList;
          inputListTemp.splice(j, 0, { title: checkedValuesArr[j], value: '' });
          setInputList(inputListTemp);
          break;
        }
      }
    }

    setCheckedValues(checkedValuesArr);

  }

  //input组件值改变函数 e  内燃机   index  0 item  XXX研究目的###目的
  function inputChange(e, index, item) {
    let newInputList = inputList.map(c => {
      if (c.title === item) {
        return {
          title: c.title,
          value: e.target.value
        }
      }
      return c;
    })

    setInputList(newInputList);
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

        <Form.Item label="章节号" hidden={data.id === undefined ? true : false}>
          {form.getFieldDecorator('orderNum', {
            rules: [{ pattern: /^([1-9][0-9]?)$/, required: data.id === undefined ? false : true, message: '章节号取值范围为[1,99]的正整数!' }],
          })(<Input placeholder='只支持数字格式' style={{ width: 400 }} />)}
        </Form.Item>
      </Form>

      <div style={{ width: '500px', height: '180px', display: 'flex' }} hidden={data.id === undefined ? false : true}>
        <Row gutter={[24, 24]} >
          <Col span={10}>
            <div style={{ textAlign: 'left', marginTop: 0, marginLeft: '30px', width: '150px' }}>
              <font face="宋体" size="2"><b>问题配置：(非必填)</b></font>
            </div>
            <div style={{ width: '150px', height: '160px', overflowY: 'scroll', marginLeft: '60px' }} >
              <Checkbox.Group value={checkedValues} options={questionTemplateTagOptions} style={{ display: 'flex', flexDirection: 'column' }}
                onChange={onCheckboxChange} />
            </div>
          </Col>
          <Col span={14}>
            <div style={{ width: '350px', marginLeft: '0px' }}>
              {inputList.length ? inputList.map((item, index) => {
                return <div key={index}>
                  <Input value={item.value} style={{ width: '275px' }} addonAfter={item.title.split('###')[0].substring(3)}
                    onChange={(e) => { inputChange(e, index, item.title) }} />
                </div>
              }) : null}
            </div>
          </Col>
        </Row>
      </div >
    </Modal>
  );
});
export default NodeModel;