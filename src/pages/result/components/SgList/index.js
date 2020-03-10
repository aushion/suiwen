import React, { useState } from 'react';
import { List, Modal } from 'antd';
import groupBy from 'lodash/groupBy';
import Evaluate from '../Evaluate/index';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

function SgList(props) {
  const data = props.data;
  const groupByData = groupBy(data, 'id');
  const keys = Object.keys(groupByData);
  const [visible, setVisible] = useState(false);
  const [initialText, setText] = useState('');
  function showMore(text) {
    setVisible(true);
    setText(text);
  }
  return (
    <div className={styles.SgList}>
      {keys.map((item) => {
        return (
        <div key={item} className={styles.wrapper}>
          <List
            itemLayout="vertical"
            dataSource={groupByData[item]}
            footer={
              <div style={{ float: 'right', fontSize: 14, color: '#999', overflow: 'hidden' }}>
                <div>
                  <a
                    style={{ color: '#999',  }}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${groupByData[item][0].Data.source_id}`}
                  >
                    {groupByData[item][0].Data.title}
                  </a>
                  <span>
                    {groupByData[item][0].Data.additional_info && groupByData[item][0].Data.additional_info.FieldValue
                      ? groupByData[item][0].Data.additional_info.FieldValue.年
                      : ''}
                  </span>
                </div>
                {/* 点赞模块预留 */}
                <div className={styles.sg_evaluate}>
                  <Evaluate
                    id={groupByData[item][0].id}
                    goodCount={groupByData[item][0].evaluate.good}
                    badCount={groupByData[item][0].evaluate.bad}
                    isevalute={groupByData[item][0].evaluate.isevalute}
                  />
                </div>
              </div>
            }
            renderItem={(item, index) => (
              <List.Item style={{ overflow: 'hidden' }}>
                <div
                  className={styles.fontStyle}
                  dangerouslySetInnerHTML={{
                    __html: RestTools.formatText(
                      RestTools.translateToRed(item.Data.answer)
                    )
                  }}
                />
                {/* <Popover
                  placement="right"
                  content={
                    <div
                      style={{
                        width: 400,
                        color: '#333',
                        letterSpacing: '2px',
                        lineHeight: '27.2px',
                        marginLeft: 20,
                        textIndent: '2em'
                      }}
                      className={styles.fontStyle}
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed( RestTools.formatText(item.Data.answer_context))
                      }}
                    />
                  }
                  trigger="click"
                >
                  <div className={styles.more}>显示更多>></div>
                </Popover> */}
                {item.Data.answer_context ? (
                  <div
                    className={styles.more}
                    onClick={showMore.bind(this, item.Data.answer_context)}
                  >
                    显示更多>>
                  </div>
                ) : null}
              </List.Item>
            )}
          />
        </div>
      )}
      )}
      <Modal
        visible={visible}
        footer={null}
        style={{ top: 40, left: '29%' }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div
          style={{
            // width: 400,
            paddingTop: 10,
            color: '#333',
            letterSpacing: '2px',
            lineHeight: '27.2px',
            textIndent: '2em'
          }}
          className={styles.fontStyle}
          dangerouslySetInnerHTML={{
            __html: RestTools.translateToRed(RestTools.formatText(initialText))
          }}
        />
      </Modal>
    </div>
  );
}

export default SgList;
