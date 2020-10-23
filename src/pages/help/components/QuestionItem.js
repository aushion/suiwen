import React, { useState } from 'react';
import { Link } from 'umi';
import { Button, Tag, Icon, message } from 'antd';
import CaAvatar from '../../../components/CaAvatar';
import ReasonModal from '../../../components/ReasonModal';
import helpServer from '../../../services/help';

import styles from './QuestionItem.less';

function QuestionItem({ item }) {
  const [modalState, setModalState] = useState({ visible: false });
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  function handleOk(id, radioValue, moreReason) {
    const reason = radioValue === '5' ? moreReason : radioValue;
    helpServer
      .communityReport({
        entityId: id,
        entityType: 1,
        reason,
        reportType: radioValue,
        userName: userInfo.UserName
      })
      .then((res) => {
        if (res.data.code === 200) {
          message.success('感谢您的反馈，共建美好社区');
        } else {
          message.error(res.data.msg);
        }
        setModalState({
          visible: false
        });
      })
      .catch(() => {
        setModalState({
          visible: false
        });
      });
  }

  return (
    <div className={`${styles.questionItem} display_flex justify-content_flex-justify`}>
      <div
        style={{
          width: '60%',
          lineHeight: '28px',
          fontSize: 15,
          cursor: 'pointer',
          // overflow: 'hidden',
          // textOverflow: 'ellipsis',
          // whiteSpace: 'nowrap'
        }}
      >
        <div style={{ display: 'inline-block' }}>
          <CaAvatar userName={item.userName} showFollowBtn={false} />
        </div>

        <Link
          style={{
            color: '#454749',
            fontWeight: 800,
            display: 'block',
            paddingTop: 6,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          to={`/reply?q=${encodeURIComponent(item.content)}&QID=${item.qid}`}
          target="_blank"
        >
          <span>{item.content}</span>
          <span style={{ marginLeft: 10 }}>
            {item.tag
              ? item.tag.split(',').map((item, index) => (
                  <Tag color="volcano" key={index}>
                    {item}
                  </Tag>
                ))
              : null}
          </span>
        </Link>
      </div>
      <div style={{ paddingTop: 6 }}>
        <div style={{ textAlign: 'right' }}>
          <Button
            icon="edit"
            size="small"
            ghost
            type="primary"
            href={`/web/reply?q=${encodeURIComponent(item.content)}&QID=${
              item.qid
            }&editStatus=true`}
            target="_blank"
          >
            写回答
          </Button>
        </div>
        <div style={{ color: '#8590A6', lineHeight: '40px' }}>
          <span
            className={styles.report}
            onClick={() => {
              setModalState({
                visible: true
              });
            }}
          >
            <Icon type="warning" />
            举报
          </span>
          <span>已有回答:{item.answerCount}</span>
          <span>
            <span style={{ display: 'inline-block', padding: '0 10px' }}>|</span>
            {item.commitTime}
          </span>
        </div>
      </div>

      <ReasonModal
        visible={modalState.visible}
        id={item.qid}
        handleOk={handleOk}
        triggerCancel={() => {
          setModalState({
            visible: false
          });
        }}
      />
    </div>
  );
}

export default QuestionItem;
