import React, { useState, useEffect } from 'react';
import { Modal, Input, message, Tag, Divider } from 'antd';
import { router } from 'umi';
import request from '../../utils/request';

const { TextArea } = Input;
// const { CheckableTag } = Tag;
function AskModal({ visible, q = '', onTriggerCancel }) {
  const [submitQ, setSubmitQ] = useState(q);
  const [loading, setLoading] = useState(false);
  // const [domain, setDomain] = useState(null);
  // const [domainChildren, setDomainChildren] = useState(null);
  const [selectedTags, updateCheckedTag] = useState([]);
  const [selectedRoot, setSelectedRoot] = useState(null);

  // const rootTagStyle = {
  //   background: '#F5F5F5',
  //   border: 'none',
  //   marginBottom: 6,
  //   padding: '2px 8px'
  // };

  // const childTagStyle = {
  //   border: '1px dashed #8590A6',
  //   background: '#fff',
  //   color: '#8590A6',
  //   cursor: 'pointer',
  //   borderRadius: 10,
  //   marginBottom: 6
  // };
  // const childChecked = {
  //   background: '#1890ff',
  //   color: '#fff'
  // };

  // useEffect(() => {
  //   if (visible) {
  //     request
  //       .post('/community/getCommunityClass')
  //       .then((res) => {
  //         if (res.data.code === 200) {
  //           setDomain(res.data.result);
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }

  //   return () => {};
  // }, [visible]);

  function changeQuestion(e) {
    setSubmitQ(e.target.value);
  }

  function submitQuestion() {
    const loginUser = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    const domain = selectedRoot + ',' + selectedTags.join(',');

    if (submitQ && loginUser) {
      setLoading(true);
      request
        .post(process.env.apiUrl + '/community/commitQuestion', null, {
          params: {
            q: submitQ,
            uId: loginUser.UserName,
            domain
          }
        })
        .then((res) => {
          if (res.data.result) {
            setLoading(false);
            onTriggerCancel();
            router.push(`/personCenter/people/ask?userName=${loginUser.UserName}`);
          } else {
            onTriggerCancel();
            setLoading(false);
            message.error(res.data.msg);
          }
          reset();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function reset() {
    // setDomainChildren(null);
    setSelectedRoot(null);
    updateCheckedTag([]);
  }

  // function handleClickRoot(item) {
  //   setDomainChildren(item.communityClassList);
  //   setSelectedRoot(item.cId);
  // }

  // function handleChange(tag, checked) {
  //   const nextSelectedTags = checked
  //     ? [...selectedTags, tag.cId]
  //     : selectedTags.filter((t) => t !== tag.cId);
  //   updateCheckedTag(nextSelectedTags);
  // }
  return (
    <Modal
      visible={visible}
      onCancel={() => {
        onTriggerCancel();
        reset();
      }}
      title="问题求助"
      onOk={submitQuestion}
      confirmLoading={loading}
    >
      <TextArea rows={4} value={submitQ} onChange={changeQuestion} />
      {/* <Divider />
      <div>
        <div>选择标签</div>
        <div style={{ padding: 10 }}>
          {domain
            ? domain.map((item) => (
                <Tag
                  style={
                    item.cId === selectedRoot ? { ...rootTagStyle, ...childChecked } : rootTagStyle
                  }
                  key={item.cId}
                  onClick={handleClickRoot.bind(this, item)}
                >
                  {item.cName}
                </Tag>
              ))
            : null}
        </div> 
        <Divider dashed />
        <div>
          {domainChildren
            ? domainChildren.map((item) => (
                <CheckableTag
                  key={item.cId}
                  style={
                    selectedTags.indexOf(item.cId) > -1
                      ? { ...childTagStyle, ...childChecked }
                      : childTagStyle
                  }
                  checked={selectedTags.indexOf(item.cId) > -1}
                  onChange={(checked) => handleChange(item, checked)}
                >
                  {item.cName}
                </CheckableTag>
              ))
            : null}
        </div>
                
      </div>
      */}
    </Modal>
  );
}

export default AskModal;
