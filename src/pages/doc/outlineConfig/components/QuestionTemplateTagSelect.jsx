import { Row, Col, Checkbox, Input, message } from 'antd';
import React, { useState } from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { find } from 'lodash';


//词槽名称下拉列表框控件
const QuestionTemplateTagSelect = props => {
  const questionTemplateTagOptions = props.questionTemplateTagOptions;
  const questionSourceData = props.questionSourceData;
  const [checkedValues, setCheckedValues] = useState([]);
  //保存多个input组件中自定义内容所形成的问题值
  const [inputList, setInputList] = useState([]);

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
      for (var i = 0; i < checkedValuesArr.length; i++) {
        if (checkedValues.indexOf(checkedValuesArr[i]) === -1) {
          //此时checkedValuesArr[i]即为待处理的元素，需要将其在inputList里新增。
          let inputListTemp = inputList;
          inputListTemp.splice(i, 0, { title: checkedValuesArr[i], value: '' });
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

  //保存标签问题
  function saveInputTagQuestion(item, index) {
    //限制问题添加数量
    if (questionSourceData.length > 4) {
      message.warn('该提纲下的问题已超出最大上限5条!');
      return;
    }
    //限制问题填充不可为空
    if (inputList[index].value === '') {
      message.warn('问题不可为空!');
      return;
    }
    let question = inputList[index].value + item.split('###')[0].substring(3);
    if (!question) {
      message.warn('待保存的问题不可为空！');
      return;
    }
    //取出伴随问题的标签
    let tagQuestion = question + '###' + item.split('###')[1];
    const values = {
      question: question,
      tagQuestion: tagQuestion,
    }
    //调用保存问题函数
    props.addNodeTagQuestion(values);

    //同步取消对应标签的选择状态
    let checkedValuesTemp = checkedValues;
    checkedValuesTemp.splice(index, 1);
    setCheckedValues(checkedValuesTemp);
    //同步删除inputList中input
    let inputListTemp = inputList;
    inputListTemp.splice(index, 1);
    setInputList(inputListTemp);


  }


  return (
    <div style={{ width: '800px', height: '180px' }} >
      <Row gutter={[24, 24]} >
        <Col span={8}>
          <div style={{ textAlign: 'left', marginTop: 0 }}>
            <font face="宋体" size="2"><b>问题标签选择：</b></font>
          </div>
          <div style={{ width: '250px', height: '165px', overflowY: 'scroll' }} >
            <Checkbox.Group value={checkedValues} options={questionTemplateTagOptions} style={{ display: 'flex', flexDirection: 'column' }}
              onChange={onCheckboxChange} />
          </div>
        </Col>

        <Col span={16}>
          {inputList.length ? inputList.map((item, index) => {
            return <div style={{ display: 'flex' }} key={index}>
              <Input value={item.value} style={{ width: '400px' }} addonAfter={item.title.split('###')[0].substring(3)}
                onChange={(e) => { inputChange(e, index, item.title) }} />
              <CheckOutlined style={{ width: '30px', marginLeft: '10px', display: 'flex', alignItems: 'center' }}
                onClick={(() => { saveInputTagQuestion(item.title, index) })} title="保存" />
            </div>
          }) : null}
        </Col>
      </Row>


    </div >
  );
};
export default QuestionTemplateTagSelect;
