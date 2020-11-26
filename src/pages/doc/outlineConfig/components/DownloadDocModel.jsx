import React, { useState } from 'react';
import { Modal, Radio, Form, Button } from 'antd';

const DownloadDocModel = Form.create({
  mapPropsToFields(props) {

  },
})(props => {

  const { modalVisible } = props;
  const [isResource, setIsResource] = useState(true);

  const handleChange = (e) => {
    setIsResource(e.target.value);
  };

  const onHandleCancel = () => {
    props.onCancle();
  }

  //新建章，提交按钮事件
  const onHandleOk = () => {
    const values = {
      isResource: isResource,
    }
    props.handleOk(values);

  }


  return (
    <Modal
      //关闭时销毁 Modal 里的子元素， 默认false
      destroyOnClose
      //是否支持键盘 esc 关闭 ， 默认true
      keyboard
      title={'文档下载'}
      centered={true}
      visible={modalVisible}
      width={400}
      height={300}
      okText={'下载'}
      cancelText={'放弃'}
      onOk={onHandleOk}
      onCancel={() => onHandleCancel()}
    >
      <div>
        <span>包含来源 :</span>
        <Radio.Group onChange={handleChange} value={isResource}>
          <Radio style={{ marginLeft: '10px' }} value={true}>是</Radio>
          <Radio style={{ marginLeft: '5px' }} value={false}>否</Radio>
        </Radio.Group>
        <Button
          style={{ border: "0px", float: "right" }}
          size={"small"}
          icon={"info-circle"}
          title={"选择是，代表下载的文档包含片段来源信息；\r\n选择否，代表下载的文档无片段来源信息。"}
          onClick={() => {
          }}
        >
        </Button>
      </div>
    </Modal>
  );
});
export default DownloadDocModel;