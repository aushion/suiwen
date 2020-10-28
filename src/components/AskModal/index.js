import React, { useState, useEffect } from 'react';
import { Modal, message, Tag, Divider, Input, Icon, Alert } from 'antd';
import { router } from 'umi';
import { find } from 'lodash';

import request from '../../utils/request';
const { TextArea } = Input;
const { CheckableTag } = Tag;
function AskModal({ visible, q = '', onTriggerCancel }) {
  const [submitQ, setSubmitQ] = useState(q);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState(null);
  const [domainChildren, setDomainChildren] = useState(null); // 二级标签
  const [selectedTags, updateCheckedTag] = useState([]); // 已选择的二级标签
  const [selectedRoot, setSelectedRoot] = useState(null); // 一级标签
  const [errorTips, setErrorTips] = useState(null); // 错误提示

  const rootTagStyle = {
    background: '#F5F5F5',
    border: 'none',
    marginBottom: 6,
    padding: '2px 8px'
  };

  const childTagStyle = {
    border: '1px dashed #8590A6',
    background: '#fff',
    color: '#8590A6',
    cursor: 'pointer',
    borderRadius: 10,
    marginBottom: 6
  };
  const childChecked = {
    background: '#1890ff',
    color: '#fff'
  };

  useEffect(() => {
    if (visible) {
      q && setSubmitQ(q);
      request
        .post('/community/getCommunityClass')
        .then((res) => {
          if (res.data.code === 200) {
            setDomain(res.data.result);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {};
  }, [visible, q]);

  function changeQuestion(e) {
    setErrorTips(null);
    setSubmitQ(e.target.value);
  }

  function submitQuestion() {
    const loginUser = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    const domain = selectedTags.length ? selectedTags.map((item) => item.cId).join(',') : '';
    if (selectedTags.length === 0 && selectedRoot) {
      setErrorTips('请至少选择一项二级标签分类');
      return;
    }
    if (selectedTags.length > 10) {
      setErrorTips('至多选择10个标签');
      return;
    }
    if (submitQ && loginUser) {
      setLoading(true);
      request
        .post(process.env.apiUrl + '/commitQuestion', null, {
          params: {
            q: submitQ,
            uId: loginUser.UserName,
            domain,
          }
        })
        .then((res) => {
          if (res.data.result) {
            router.push(`/personCenter/people/ask?userName=${loginUser.UserName}`);
          } else {
            message.error(res.data.msg);
          }
          setLoading(false);
          onTriggerCancel();
          reset();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setErrorTips('请您输入问题');
    }
  }

  function reset() {
    setDomainChildren(null);
    setSelectedRoot(null);
    updateCheckedTag([]);
    setSubmitQ('');
    setErrorTips(null);
  }

  function handleClickRoot(item) {
    if (item.cName === '其他分类') {
      setDomainChildren([]);
      updateCheckedTag([item]);
    } else {
      updateCheckedTag(selectedTags.filter((item) => item.cName !== '其他分类'));
      setDomainChildren(item.communityClassList);
    }
    setSelectedRoot(item);
  }

  function handleChange(tag, checked) {
    setErrorTips(null);
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag.cId);

    updateCheckedTag(nextSelectedTags);
  }

  function handleClickClose(current) {
    const restTags = selectedTags.filter((item) => item.cId !== current.cId);
    updateCheckedTag(restTags);
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      onCancel={() => {
        onTriggerCancel();
        // reset();
      }}
      title="问题求助"
      onOk={submitQuestion}
      confirmLoading={loading}
    >
      <TextArea maxLength={200} value={submitQ} rows={4} onChange={changeQuestion} />
      <Divider />
      <div>
        <div>选择标签</div>
        <div style={{ padding: 10 }}>
          {domain
            ? domain.map((item) => (
                <Tag
                  style={
                    item.cId === selectedRoot?.cId
                      ? { ...rootTagStyle, ...childChecked }
                      : rootTagStyle
                  }
                  key={item.cId}
                  onClick={handleClickRoot.bind(this, item)}
                >
                  {item.cName}
                </Tag>
              ))
            : null}
        </div>

        <div>
          {domainChildren
            ? domainChildren.map((item) => (
                <CheckableTag
                  key={item.cId}
                  style={
                    selectedTags.map((item) => item.cId).indexOf(item.cId) > -1
                      ? { ...childTagStyle, ...childChecked }
                      : childTagStyle
                  }
                  checked={selectedTags.map((item) => item.cId).indexOf(item.cId) > -1}
                  onChange={(checked) => handleChange(item, checked)}
                >
                  {item.cName}
                </CheckableTag>
              ))
            : null}
        </div>

        {selectedTags.length ? (
          <div style={{ borderTop: '1px dashed #ccc', paddingTop: 20 }}>
            <label style={{ fontSize: 12 }}>已选：</label>
            {selectedTags.map((item) => (
              <Tag color="#87d068" key={item.cId} style={{ marginBottom: 10 }}>
                {find(domain, { cId: item.parentId })
                  ? find(domain, { cId: item.parentId }).cName + '/' + item.cName
                  : item.cName}
                <Icon
                  type="close"
                  style={{ fontSize: 14 }}
                  onClick={handleClickClose.bind(this, item)}
                />
              </Tag>
            ))}
          </div>
        ) : null}
      </div>
      {errorTips ? <Alert message={errorTips} type="error" /> : null}
    </Modal>
  );
}

export default AskModal;
