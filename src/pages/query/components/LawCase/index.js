import React, { useState } from 'react';
import { List, Descriptions } from 'antd';
import querystring from 'querystring';
import FoldText from '../../../../components/FoldText';
import Label from '../Label';
import { getAnswerByTopicPage } from '../../service/result';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

function LawCase({ data }) {
  const [resource, setResource] = useState(data);
  const { dataNode, pagination, domain, intentDomain, intentId } = resource;
  const { q, topic } = querystring.parse(window.location.search.substring(1));
  const map = {
    lawitem: {
      dataItem: ['法条名', '时效性', '发布日期']
    }
  };
  function fetchData(params) {
    getAnswerByTopicPage(params).then((res) => {
      if (res.data.code === 200) {
        setResource(res.data.result.metaList[0]);
        window.scrollTo({
          top: 0
        });
      }
    });
  }
  return (
    <div className={styles.LawCase}>
      <List
        itemLayout="vertical"
        dataSource={dataNode}
        pagination={{
          current: pagination.pageStart,
          pageSize: pagination.pageCount,
          total: pagination.total,
          onChange: (page) => {
            fetchData({
              domain,
              intentDomain,
              intentId,
              q,
              topic,
              pageStart: page,
              pageCount: 10
            });
          }
        }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <a
              style={{ color: '#999' }}
              href="https://lawnew.cnki.net/kns/brief/result.aspx?dbprefix=CLKC"
              rel="noreferrer"
              target="_blank"
            >
              CNKI法律案例库
            </a>
          </div>
        }
        renderItem={(item) => {
          return (
            <List.Item>
              <Descriptions
                title={
                  <div
                    style={{ color: '#047AE8' }}
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.标题) }}
                  />
                }
                colon={3}
              >
                {item.案由 ? (
                  <Descriptions.Item label={<Label text="案由" />} span={3}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.案由 || '/')
                      }}
                    />
                  </Descriptions.Item>
                ) : null}
                {item.裁判日期 ? (
                  <Descriptions.Item label={<Label text="裁判日期" />} span={3}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.裁判日期 || '/')
                      }}
                    />
                  </Descriptions.Item>
                ) : null}

                {item.审理法院 ? (
                  <Descriptions.Item label={<Label text="审理法院" />} span={3}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.审理法院 || '/')
                      }}
                    />
                  </Descriptions.Item>
                ) : null}

                <Descriptions.Item span={3}>
                  <div className={styles.fullContent}>
                    {item.全文.length > 300 ? (
                      <FoldText originText={item.全文.slice(0, 300)} fullText={item.全文} />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: `${item.全文}` }} />
                    )}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default LawCase;
