import React, { useState } from 'react';
import { Modal, Input, message } from 'antd';
import { router } from 'umi';
import request from '../../utils/request';

const { TextArea } = Input;

function AskModal({ visible, q = '', onTriggerCancel }) {
  const [submitQ, setSubmitQ] = useState(q);
  const [loading, setLoading] = useState(false);

  function changeQuestion(e) {
    setSubmitQ(e.target.value);
  }

  function submitQuestion() {
    const loginUser = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (submitQ && loginUser) {
      setLoading(true);
      request
        .post(process.env.apiUrl + '/community/commitQuestion', null, {
          params: {
            q: submitQ,
            uId: loginUser.UserName
          }
        })
        .then((res) => {
          if (res.data.result) {
            setLoading(false);
            onTriggerCancel()
            router.push(`/personCenter/people/ask?userName=${loginUser.UserName}`);
          } else {
              onTriggerCancel()
            setLoading(false);
            message.error(res.data.msg);
          }
        })
        .catch(err => {
            console.log(err)
        });
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onTriggerCancel}
      title="提交问题"
      onOk={submitQuestion}
      confirmLoading={loading}
    >
      <TextArea rows={4} value={submitQ} onChange={changeQuestion} />

      <div></div>
    </Modal>
  );
}

export default AskModal;
