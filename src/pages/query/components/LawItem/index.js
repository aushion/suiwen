import React, { useState } from 'react';
import { List, Descriptions } from 'antd';
import querystring from 'querystring';
import FoldText from '../../../../components/FoldText';
import Label from '../Label';
import { getAnswerByTopicPage } from '../../service/result';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less'

function LawItem({ data }) {
  const [resource, setResource] = useState(data);
  const { dataNode, pagination, domain, intentDomain, intentId } = resource;
  const { q, topic } = querystring.parse(window.location.search.substring(1));

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
    <div className={styles.LawItem}>
      <List
        itemLayout="vertical"
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
              href="https://lawnew.cnki.net/kns/brief/result.aspx?dbprefix=CLKLK"
              rel="noreferrer"
              target="_blank"
            >
              CNKI法律法规库
            </a>
          </div>
        }
        dataSource={dataNode}
        renderItem={(item) => {
          return (
            <List.Item>
              <div className={styles.fullContent}>
                <Descriptions size="small" layout="horizontal" colon={3} >
                   <Descriptions.Item label={<Label text="条目名称" />} span={3}>
                    <div
                      dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.法条名) }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label={<Label text="时效性" />} span={3}>
                    <div
                      dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.时效性) }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label={<Label text="发布日期" />} span={3}>
                    <div
                      dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.发布日期) }}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label={<Label text="条目全文" />} span={3}>
                    {item.Answer && item.Answer.length > 300 ? (
                      <FoldText originText={item.Answer.slice(0, 300)} fullText={item.Answer} />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: RestTools.translateToRed(`${item.Answer}`)
                        }}
                      />
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default LawItem;
