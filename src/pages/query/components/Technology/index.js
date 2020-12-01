import React, { useState } from 'react';
import styles from './index.less';
import { Button, List } from 'antd';
import request from '../../../../utils/request';
import RestTools from '../../../../utils/RestTools';
import { Link } from 'umi';

function Technology({ data, q }) {
  let journalData = null;
  let fieldData = null;

  if (data.length === 1) {
    journalData = data[0];
  } else {
    [fieldData = null, journalData] = data;
  }
  const fields = fieldData
    ? fieldData.intentJson
      ? fieldData.intentJson.results[0].fields
      : null
    : null;

  const subject = fields ? fields[fields['focus']] : null;

  const sql = journalData ? journalData.dataNode.sql : null;

  const [journal, setJournal] = useState(journalData);
  const [sourceType, setSourceType] = useState('全部');
  const [loading, setLoading] = useState(false);

  function fetchData(page, sourceType) {
    setLoading(true);
    request
      .post(`${process.env.apiUrl}/getTechnologyPage`, null, {
        data: {
          pageStart: page,
          sql,
          sourceType: sourceType === '全部' ? '' : sourceType
        }
      })
      .then((res) => {
        if (res.data.code === 200) {
          setLoading(false);
          setJournal({
            ...journalData,
            ...res.data.result
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function fetchDataBySourceType(sourceType) {
    setSourceType(sourceType);
    fetchData(1, sourceType);
  }

  return (
    <div className={styles.technology}>
      <h2>
        <span>{subject || q}</span>
        <span> - 随问知识库</span>
      </h2>

      <div>
        {fieldData ? (
          <div className={styles.desc}>
            <span>{subject || q}核心技术包括：</span>
            {fieldData.dataNode.data.map((item, index) =>
              index === fieldData.dataNode.data.length - 1 ? (
                <Link
                  to={`/query?q=${encodeURIComponent(item.TERM)}`}
                  className={styles.cara}
                  key={item.TERM}
                >
                  {RestTools.translateToRed(item.TERM)}。
                </Link>
              ) : (
                <Link
                  to={`/query?q=${encodeURIComponent(item.TERM)}`}
                  className={styles.cara}
                  key={item.TERM}
                >
                  {RestTools.translateToRed(item.TERM)}、
                </Link>
              )
            )}
          </div>
        ) : null}

        <div className={styles.list}>
          <div className={styles.btn}>
            {journal.dataNode.groupList && journal.dataNode.groupList.length ? (
              <div>
                <Button
                  type={sourceType === '全部' ? 'primary' : 'default'}
                  style={{ marginRight: 10 }}
                  onClick={fetchDataBySourceType.bind(this, '全部')}
                >
                  全部
                </Button>
                {journal.dataNode.groupList.map((item) => (
                  <Button
                    style={{ marginRight: 10 }}
                    type={item.SOURE_TYPE === sourceType ? 'primary' : 'default'}
                    key={item.SOURE_TYPE}
                    onClick={fetchDataBySourceType.bind(this, item.SOURE_TYPE)}
                  >
                    {item.SOURE_TYPE}（{item.cnt}）
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
          <List
            bordered
            loading={loading}
            dataSource={journal.dataNode.data}
            pagination={
              journal.pagination.pageCount >= journal.pagination.total
                ? false
                : {
                    pageSize: journal.pagination.pageCount,
                    current: journal.pagination.pageStart,
                    total: journal.pagination.total,
                    onChange: (page) => {
                      fetchData(page, sourceType);
                    }
                  }
            }
            renderItem={(item, index) => (
              <div className={styles.item}>
                <div>
                  <span
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.CONTEXT) }}
                  />
                </div>
                {item.addition ? (
                  <div style={{ color: '#999', paddingTop: 10, fontSize: 12, fontWeight: 400 }}>
                    <a
                      style={{
                        display: 'inline-block',
                        color: '#999',
                        maxWidth: 300,
                        marginRight: 10,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${item.addition.文件名}`}
                      title={item.addition.篇名}
                    >{`${item.addition.篇名}`}</a>
                    <span
                      style={{ marginRight: 10, display: 'inline-block', overflow: 'hidden' }}
                    >{`${item.addition.中文刊名}`}</span>
                    <span style={{ marginRight: 10, display: 'inline-block', overflow: 'hidden' }}>
                      {sourceType === '全部' ? '期刊' : sourceType}
                    </span>
                    <span style={{ display: 'inline-block', overflow: 'hidden' }}>
                      {item.addition.发表时间}
                    </span>
                  </div>
                ) : null}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default Technology;
