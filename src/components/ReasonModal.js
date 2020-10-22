import React, { useState, useRef } from 'react';
import { Modal, Radio, Input, Typography } from 'antd';
const { Text } = Typography;

function ReasonModal({ visible, handleOk, triggerCancel, id }) {
  const [value, setReason] = useState('');
  const [moreReason, setMoreReason] = useState('');
  const [showTips, setShowTips] = useState(false);
  const textRef = useRef();
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
  };

  const handleChange = (e) => {
    setShowTips(false);
    setReason(e.target.value);
  };

  return (
    <Modal
      title="举报原因"
      visible={visible}
      onOk={() => {
        if (value) {
          handleOk(
            id, // 当前操作列id
            value, // 内置的radio选择项
            moreReason // radio选择其他项时，自己写的原因
          );
        } else {
          setShowTips(true);
        }
      }}
      onCancel={() => {
        triggerCancel();
      }}
    >
      <Radio.Group onChange={handleChange} value={value}>
        <Radio style={radioStyle} value="0">
          政治敏感信息
        </Radio>
        <Radio style={radioStyle} value="1">
          垃圾广告信息
        </Radio>
        <Radio style={radioStyle} value="2">
          传播色情信息
        </Radio>
        <Radio style={radioStyle} value="3">
          传播虚假信息
        </Radio>
        <Radio style={radioStyle} value="4">
          包含不文明用语
        </Radio>
        <Radio style={radioStyle} value="5">
          其他
          {value === '5' ? (
            <Input.TextArea
              ref={textRef}
              maxLength={100}
              style={{ marginLeft: 10 }}
              onChange={(e) => {
                setMoreReason(e.target.value);
              }}
            />
          ) : null}
        </Radio>
      </Radio.Group>
      {showTips ? (
        <div>
          <Text type="danger">请选择或输入原因</Text>{' '}
        </div>
      ) : null}
    </Modal>
  );
}

export default ReasonModal;
