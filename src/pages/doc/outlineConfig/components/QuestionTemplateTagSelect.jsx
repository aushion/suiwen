import {  Row, Col, Checkbox,Input } from 'antd';
import React, { useState } from 'react';
import { CheckOutlined} from '@ant-design/icons';


//词槽名称下拉列表框控件
const QuestionTemplateTagSelect = props => {
  const questionTemplateTagOptions = props.questionTemplateTagOptions;
  const [newTagAndQuestionsList, setNewTagAndQuestionsList] = useState([]);
  const [checkedValues, setCheckedValues] = useState([]);
  //保存多个input组件中自定义内容所形成的问题值
  const [inputTagAndQuestionsObject, setInputTagAndQuestionsObject] = useState({});



  function onCheckboxChange(checkedValues) {
    //判定选值数组长度是否大于5，限制最大值为5
    // if(checkedValues && checkedValues.length >5){
    //   message.warn('最多可选择5个！');
    //   return;
    // }
    // console.log('checked = ', checkedValues);
    setNewTagAndQuestionsList(checkedValues);
    setCheckedValues(checkedValues);
    // setInputTagAndQuestionsList();
  }

  //input组件值改变函数 e  内燃机   index  0 item  XXX研究目的###目的
  function inputChange(e,index,item){

    inputTagAndQuestionsObject[item] = e.target.value + item.split('###')[0].substring(3);
    setInputTagAndQuestionsObject(inputTagAndQuestionsObject);
    // console.log('inputTagAndQuestionsObject',inputTagAndQuestionsObject);
  }

  //保存标签问题
  function saveInputTagQuestion(item,index){
    //取出当前保存按钮对应Input组件编辑的问题
    let question = inputTagAndQuestionsObject[item];
    //取出伴随问题的标签
    let tagQuestion = question + '###' + item.split('###')[1];
    // console.log('question',question);
    // console.log('tagQuestion',tagQuestion);
    const values={
      question : question,
      tagQuestion : tagQuestion,
    }
    //调用保存问题函数
    props.addNodeTagQuestion(values);
    //同步取消对应标签的选择状态
    let checkedValuesTemp = checkedValues;
    checkedValuesTemp.splice(index,1);
    setCheckedValues(checkedValuesTemp);
    
  }

  
  



  return (
    <div style={{ width: '800px', height: '180px' }} >
      <Row gutter={[24, 24]} >
        <Col span={8}>
          <div style={{ textAlign: 'left', marginTop: 0 }}>
            <font face="宋体" size="2"><b>问题标签选择：</b></font>
          </div>
          <div style={{ width: '250px', height: '165px', overflowY: 'scroll' }} >
            <Checkbox.Group value={checkedValues} options={questionTemplateTagOptions} style={{ display: 'flex', flexDirection: 'column' }} onChange={onCheckboxChange} />
          </div>
        </Col>

        <Col span={16}>
          {newTagAndQuestionsList.length > 0 ?
            newTagAndQuestionsList.map((item, index) => {
              return (
                <div style={{ display: 'flex' }} key={index}>
                  <Input style={{width:'400px'}} addonAfter={item.split('###')[0].substring(3)} onChange={(e)=>{inputChange(e,index,item)}}/>
                  <CheckOutlined style={{ width: '30px', marginLeft: '10px', display: 'flex', alignItems: 'center' }} onClick={(() => {saveInputTagQuestion(item,index) })} title="保存" />


                </div>
              )
            })
            : null}
        </Col>
      </Row>


    </div >
  );
};
export default QuestionTemplateTagSelect;
