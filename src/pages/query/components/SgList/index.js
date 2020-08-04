import React, { useState } from 'react';
import { List } from 'antd';
import groupBy from 'lodash/groupBy';
import Evaluate from '../Evaluate/index';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';
import arrow_up from '../../../../assets/arrow_up.png';
import arrow_down from '../../../../assets/arrow_down.png';

function SgList(props) {
  const { data, needEvaluate = true } = props;
  const groupByData = groupBy(data, 'id');
  const keys = Object.keys(groupByData);
  const [sgData, updateData] = useState(groupByData);

  function handleShowMore(e, item, index) {
    let newSgData = { ...sgData }; //拷贝一份元数据
    let newItem; //初始化一个变量存储新数据
    if (e.target.className === 'showMore') {
      newItem = { ...item, originContext: item.data.context + item.data.sub_context };
    }
    if (e.target.className === 'up') {
      newItem = { ...item, originContext: '' };
      newSgData[item.id][index] = newItem;
    }
    newSgData[item.id][index] = newItem; //更新相应位置数据
    updateData(newSgData); //更新状态
  }

  return (
    <div className={`${styles.SgList} copy`} id="sg">
      {keys.map((item, keyIndex) => {
        const year = (sgData[item][0].sgAdditionInfo && sgData[item][0].sgAdditionInfo.年) || '';
        // const qikan = sgData[item][0].Data.additional_info && sgData[item][0].Data.additional_info.来源数据库 || '';
        const qikanName =
          (sgData[item][0].sgAdditionInfo && sgData[item][0].sgAdditionInfo.中文刊名) || '';
        return (
          <div key={item} className={styles.wrapper}>
            <List
              itemLayout="vertical"
              dataSource={sgData[item]}
              footer={
                <div
                  style={{ textAlign: 'right', fontSize: 13, color: '#999', overflow: 'hidden' }}
                >
                  <div>{/* 点赞模块预留 */}</div>
                  <div>
                    <div
                      style={{
                        textAlign: 'right',
                        display: 'inline-block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: `${year}&nbsp;&nbsp;&nbsp;${qikanName}&nbsp;&nbsp;&nbsp;`
                      }}
                    />
                    <a
                      style={{
                        color: '#999',
                        maxWidth: '50%',
                        display: 'inline-block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={sgData[item][0].data.caption}
                      href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${sgData[item][0].data.source_id}`}
                    >
                      {sgData[item][0].data.caption}
                    </a>
                  </div>
                  <div className={styles.sg_evaluate}>
                    {needEvaluate ? (
                      <Evaluate
                        id={sgData[item][0].id}
                        goodCount={sgData[item][0].evaluate.good}
                        badCount={sgData[item][0].evaluate.bad}
                        isevalute={sgData[item][0].evaluate.isevalute}
                      />
                    ) : null}
                  </div>
                </div>
              }
              renderItem={(item, itemIndex) => {
                const answer = item.originContext
                  ? item.originContext +
                    `<a class="up" style="color:#2090E3">  收起<img class="up" style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_up}"></a>`
                  : item.data.context +
                    `<a class="showMore" style="color:#2090E3;white-space:nowrap;">  更多<img class="showMore" style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_down}"> </a>`;
                return (
                  <List.Item style={{ overflow: 'hidden' }}>
                    <div
                      onClick={(e) => handleShowMore(e, item, itemIndex)}
                      key={itemIndex}
                      className={styles.fontStyle}
                      dangerouslySetInnerHTML={{
                        __html: RestTools.formatText(RestTools.translateToRed(answer))
                      }}
                    />
                  </List.Item>
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default SgList;
