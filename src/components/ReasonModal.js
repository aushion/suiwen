import React, { useState, useRef } from 'react';
import { Modal, Radio, Input, Typography, message } from 'antd';
import Cookies from 'js-cookie';
import helpServer from '../services/help';
const { Text } = Typography;

function ReasonModal({ visible, triggerCancel, id, entityType }) {
  const [value, setReason] = useState('');
  const [moreReason, setMoreReason] = useState('');
  const [showTips, setShowTips] = useState(false);
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

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
          const reason = value === '5' ? moreReason : '';
          const params = reason
            ? {
                entityId: id,
                entityType,
                reason,
                userName: userInfo?userInfo.UserName:Cookies.get('cnki_qa_uuid'),
                reportType: value
              }
            : {
                entityId: id,
                entityType,
                userName: userInfo?userInfo.UserName:Cookies.get('cnki_qa_uuid'),
                reportType: value
              };
          helpServer
            .communityReport(params)
            .then((res) => {
              if (res.data.code === 200) {
                message.success('感谢您的反馈，共建美好社区');
              } else {
                message.error(res.data.msg);
              }
              triggerCancel();
            })
            .catch(() => {
              triggerCancel();
            });
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
