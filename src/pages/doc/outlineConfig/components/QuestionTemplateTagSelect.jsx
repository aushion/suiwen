import { Form, Select, Row, Col, Button, Checkbox,Input,message } from 'antd';
import React, { useState } from 'react';
import { CheckOutlined} from '@ant-design/icons';


//词槽名称下拉列表框控件
const QuestionTemplateTagSelect = props => {
  const questionTemplateTagOptions = props.questionTemplateTagOptions;
  const dispatch = props.dispatch;
  const [newTagAndQuestionsList, setNewTagAndQuestionsList] = useState([]);
  //保存多个input组件中自定义内容所形成的问题值
  const [inputTagAndQuestionsList, setInputTagAndQuestionsList] = useState(['','','','','']);
  // let inputTagAndQuestionsList = new Array('','','','','');



  function onCheckboxChange(checkedValues) {
    //判定选值数组长度是否大于5，限制最大值为5
    // if(checkedValues && checkedValues.length >5){
    //   message.warn('最多可选择5个！');
    //   return;
    // }
    // console.log('checked = ', checkedValues);
    setNewTagAndQuestionsList(checkedValues);
    // setInputTagAndQuestionsList();
  }

  //input组件值改变函数 e  内燃机   index  0 item  XXX研究目的###目的
  function inputChange(e,index,item){
    // console.log("e",e.target.value);
    // console.log('index',index);
    // console.log('item',item);

    inputTagAndQuestionsList[index] = e.target.value + item.split('###')[0].substring(3);
    setInputTagAndQuestionsList(inputTagAndQuestionsList);
    console.log('inputTagAndQuestionsList',inputTagAndQuestionsList);

  }
  



  return (
    <div style={{ width: '800px', height: '180px' }} >
      <Row gutter={[24, 24]} >
        <Col span={8}>
          <div style={{ textAlign: 'left', marginTop: 0 }}>
            <font face="宋体" size="2"><b>问题标签选择：</b></font>
          </div>
          <div style={{ width: '250px', height: '165px', overflowY: 'scroll' }} >
            <Checkbox.Group options={questionTemplateTagOptions} style={{ display: 'flex', flexDirection: 'column' }} onChange={onCheckboxChange} />
          </div>
        </Col>

        <Col span={16}>
          {newTagAndQuestionsList.length > 0 ?
            newTagAndQuestionsList.map((item, index) => {
              return (
                <div style={{ display: 'flex' }} key={index}>
                  <Input style={{width:'400px'}} addonAfter={item.split('###')[0].substring(3)} onChange={(e)=>{inputChange(e,index,item)}}/>
                  <CheckOutlined style={{ width: '30px', marginLeft: '10px', display: 'flex', alignItems: 'center' }} onClick={(() => { })} title="保存" />


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
