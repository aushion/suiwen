import React, { useState, useEffect } from 'react';
import { List, Icon } from 'antd';
import Link from 'umi/link';
import request from 'Utils/request';
import RestTools from 'Utils/RestTools';
import styles from './index.less';

function WaitAnswer() {
  const [data, updateData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    setLoading(true);
    request
      .post('/community/waitAnswer')
      .then((res) => {
        if (res.data.code === 200) {
          updateData(res.data.result);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  return (
    <div className={styles.wrap}>
      <div className={`display_flex justify-content_flex-justify ${styles.header}`}>
        <div>
          <Icon type="question-circle" className={styles.left} />
          等你来答
        </div>

        <div
          className={styles.right}
          onClick={() => {
            fetchData();
          }}
        >
          换一换
          <Icon type="reload" style={{ paddingLeft: 2 }} />
        </div>
      </div>
      <List
        itemLayout="vertical"
        dataSource={data}
        loading={loading}
        renderItem={(item) => (
          <List.Item>
            <div
              style={{
                width: '100%',
                fontSize: 12,
                overflow: 'hidden'
              }}
              onClick={() => {
                RestTools.setSession('q', item.content);
              }}
            >
              <Link
                className={styles.link}
                title={item.Content}
                to={`/reply?q=${encodeURIComponent(item.content)}&QID=${item.qid}&editStatus=true`}
              >
                {item.content}
              </Link>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default WaitAnswer;
