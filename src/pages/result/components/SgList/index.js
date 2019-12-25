import React from 'react';
import { List, Popover } from 'antd';
import groupBy from 'lodash/groupBy';
import Evaluate from '../Evaluate/index';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

function SgList(props) {
  const data = props.data;
  const groupByData = groupBy(data, 'id');
  const keys = Object.keys(groupByData);
  return (
    <div className={styles.SgList}>
      {keys.map((item) => (
        <div key={item} className={styles.wrapper}>
          <List
            itemLayout="vertical"
            dataSource={groupByData[item]}
            footer={
              <div style={{ float: 'right', fontSize: 14, color: '#999', overflow: 'hidden' }}>
                <div>
                  <a
                    style={{ color: '#999', marginRight: 20 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${groupByData[item][0].Data.source_id}`}
                  >
                    {groupByData[item][0].Data.title}
                  </a>{' '}
                  <span>{groupByData[item][0].Data.additional_info.FieldValue.年 || ''}</span>
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
                    __html: RestTools.translateToRed(
                      item.Data.answer.replace(/:/g, ':<br>')
                      // .replace(/;/g, ';<br>')
                    )
                  }}
                />
                <Popover
                  placement="right"
                  content={
                    <div
                      style={{
                        width: 500,
                        color: '#333',
                        letterSpacing: '2px',
                        lineHeight: '27.2px',
                        textIndent: '2em'
                      }}
                      className={styles.fontStyle}
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.Data.answer_context)
                      }}
                    />
                  }
                  trigger="click"
                >
                  <div className={styles.more}>显示更多>></div>
                </Popover>
              </List.Item>
            )}
          />
        </div>
      ))}
    </div>
  );
}

export default SgList;
