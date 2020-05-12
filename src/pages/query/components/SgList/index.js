import React, { useState, useEffect } from 'react';
import { List, Modal } from 'antd';
import groupBy from 'lodash/groupBy';
import Evaluate from '../Evaluate/index';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

function SgList(props) {
  const {data, needEvaluate=true} = props;
  const groupByData = groupBy(data, 'id');
  const keys = Object.keys(groupByData);
  const [visible, setVisible] = useState(false);
  const [initialText, setText] = useState('');


  function showMore(text) {
    setVisible(true);
    setText(text);
  }

  function handleShowMore(e, str) {
    if (e.target.className === 'showMore') {
      showMore(str);
    }
  }

  return (
    <div className={`${styles.SgList} copy`} id="sg">
      {keys.map((item) => {
        const year =
          (groupByData[item][0].Data.additional_info &&
            groupByData[item][0].Data.additional_info.年) ||
          '';
        // const qikan = groupByData[item][0].Data.additional_info && groupByData[item][0].Data.additional_info.来源数据库 || '';
        const qikanName =
          (groupByData[item][0].Data.additional_info &&
            groupByData[item][0].Data.additional_info.中文刊名) ||
          '';
        return (
          <div key={item} className={styles.wrapper}>
            <List
              itemLayout="vertical"
              dataSource={groupByData[item]}
              footer={
                <div style={{ float: 'right', fontSize: 13, color: '#999', overflow: 'hidden' }}>
                  <div>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: `${year}&nbsp;&nbsp;&nbsp;${qikanName}&nbsp;&nbsp;&nbsp;`
                      }}
                    ></span>
                    <a
                      style={{ color: '#999' }}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${groupByData[item][0].Data.source_id}`}
                    >
                      {groupByData[item][0].Data.title}
                    </a>
                  </div>
                  {/* 点赞模块预留 */}
                  <div className={styles.sg_evaluate}>
                   {needEvaluate? <Evaluate
                      id={groupByData[item][0].id}
                      goodCount={groupByData[item][0].evaluate.good}
                      badCount={groupByData[item][0].evaluate.bad}
                      isevalute={groupByData[item][0].evaluate.isevalute}
                    />: null}
                  </div>
                </div>
              }
              renderItem={(item, index) => {
                const orginAnswer = item.Data.answer_context;
                const answer = item.Data.answer + '<a class="showMore"> 更多>></a>';
                return (
                  <List.Item style={{ overflow: 'hidden' }}>
                    <div
                      onClick={(e) => handleShowMore(e, orginAnswer)}
                      
                      key={index}
                      className={styles.fontStyle}
                      dangerouslySetInnerHTML={{
                        __html: RestTools.formatText(RestTools.translateToRed(answer))
                      }}
                    />

                    {/* {item.Data.answer_context ? (
                      <div
                        className={styles.more}
                        onClick={(e) => handleShowMore(e, orginAnswer)}
                      >
                        显示更多>>
                      </div>
                    ) : null} */}
                  </List.Item>
                );
              }}
            />
          </div>
        );
      })}
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
          className={`${styles.fontStyle} copy`}
          dangerouslySetInnerHTML={{
            __html: RestTools.translateToRed(RestTools.formatText(initialText))
          }}
        />
      </Modal>
    </div>
  );
}

export default SgList;
