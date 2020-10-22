import React, { useState } from 'react';
import { Modal, Input, message } from 'antd';
import { router } from 'umi';
import request from '../../utils/request';

const { TextArea } = Input;

function AskModal({ visible, q = '', onTriggerCancel }) {
  const [submitQ, setSubmitQ] = useState(q);
  const [loading, setLoading] = useState(false);

  // const [selectedTags, updateCheckedTag] = useState([]);
  // const [selectedRoot, setSelectedRoot] = useState(null);

  function changeQuestion(e) {
    setSubmitQ(e.target.value);
  }

  function submitQuestion() {
    const loginUser = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    // const domain = selectedRoot + ',' + selectedTags.join(',');

    if (submitQ && loginUser) {
      setLoading(true);
      request
        .post(process.env.apiUrl + '/commitQuestion', null, {
          params: {
            q: submitQ,
            uId: loginUser.UserName,
            domain:''
          }
        })
        .then((res) => {
          if (res.data.result) {
            setLoading(false);
            onTriggerCancel();

            router.push(`/help/myHelp`);
          } else {
            onTriggerCancel();
            setLoading(false);
            message.error(res.data.msg);
          }
          // reset();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  // function reset() {
  //   setSelectedRoot(null);
  //   updateCheckedTag([]);
  // }

  return (
    <Modal
      visible={visible}
      onCancel={() => {
        onTriggerCancel();
        // reset();
      }}
      title="问题求助"
      onOk={submitQuestion}
      confirmLoading={loading}
    >
      <TextArea rows={4} value={submitQ} onChange={changeQuestion} />
    </Modal>
  );
}

export default AskModal;
