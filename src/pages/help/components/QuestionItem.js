import React, { useState } from 'react';
import { Link } from 'umi';
import { Button, Tag, Icon } from 'antd';
import CaAvatar from '../../../components/CaAvatar';
import ReasonModal from '../../../components/ReasonModal';
// import FoldText from '../../../components/FoldText';

import styles from './QuestionItem.less';

function QuestionItem({ item }) {
  const [modalState, setModalState] = useState({ visible: false });

  return (
    <div className={`${styles.questionItem} display_flex justify-content_flex-justify`}>
      <div
        style={{
          width: '60%',
          lineHeight: '28px',
          fontSize: 15,
          cursor: 'pointer'
          // overflow: 'hidden',
          // textOverflow: 'ellipsis',
          // whiteSpace: 'nowrap'
        }}
      >
        <div style={{ display: 'inline-block' }}>
          <CaAvatar userName={item.userName} />
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
          {item.content.length <= 50 ? (
            <span title={item.content}>{item.content}</span>
          ) : (
            <span title={item.content}>{`${item.content.substring(0,50)}...`}</span>
          )}
         
        </Link>
        <div>
        <span>
            {item.tag
              ? item.tag.split(',').map((item, index) => (
                  <Tag color="volcano" key={index}>
                    {item}
                  </Tag>
                ))
              : null}
          </span>
        </div>
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
        entityType={1}
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
