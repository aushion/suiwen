import React, { useState } from 'react';
import { List } from 'antd';
import Cookies from 'js-cookie';

import RestTools from '../../../../utils/RestTools';
import request from '../../../../utils/request';
import styles from './index.less';

function ReadComp(props) {
  const { data, q, loading, taskId } = props;
  const [newData, setNewData] = useState(data);
  const [showLoading, setLoading] = useState(loading);

  let userId = RestTools.getLocalStorage('userInfo')
    ? RestTools.getLocalStorage('userInfo').UserName
    : Cookies.get('cnki_qa_uuid');

  function checkSemanticStatus(payload) {
    let timeId = null;
    request.post(`/checkSemanticStatus`, null, { params: payload }).then((res) => {
      if (res.data.result.async_result_state === 'SUCCESS') {
        clearTimeout(timeId);
        setNewData(res.data.result.dataList);
        setLoading(false);
      } else {
        timeId = setTimeout(() => {
          checkSemanticStatus(payload);
        }, 3000);
      }
    });
  }

  if (showLoading) {
    checkSemanticStatus({ taskId, userId });
  }

  return (
    <div className={styles.ReadComp} id="ReadComp">
      <h2>
        <a
          href={`https://kns.cnki.net/KNS8/DefaultResult/Index?dbcode=CJFQ&kw=${q}&korder=FT`}
          rel="noreferrer"
          target="_blank"
        >
          <span>{q}</span>
        </a>{' '}
        - 细粒度知识问答
      </h2>
      <List
        loading={showLoading}
        dataSource={newData}
        itemLayout="vertical"
        renderItem={(item, index) => {
          const year = (item.sgAdditionInfo && item.sgAdditionInfo.年) || '';
          const qikanName = (item.sgAdditionInfo && item.sgAdditionInfo.中文刊名) || '';
          const answer = item.data.semantic_text ? item.data.semantic_text : item.data.context;
          return (
            <List.Item style={{ overflow: 'hidden' }}>
              <div
                key={index}
                className={styles.fontStyle}
                dangerouslySetInnerHTML={{
                  __html: RestTools.superMarkRed(answer)
                }}
              />
              <div
                style={{
                  paddingTop: '10px',
                  textAlign: 'right',
                  fontSize: 13,
                  color: '#999',
                  overflow: 'hidden'
                }}
              >
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
                    // maxWidth: '50%',
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.data.caption}
                  href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${item.data.source_id}`}
                >
                  {item.data.caption}
                </a>
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default ReadComp;
