import React, { useState } from 'react';
import { List, Descriptions } from 'antd';
import querystring from 'querystring';
import FoldText from '../../../../components/FoldText';
import Label from '../Label';
import { getAnswerByTopicPage } from '../../service/result';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less'

function LawPost({ data }) {
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
    <div className={styles.LawPost}>
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
        renderItem={(item) => {
          return (
            <List.Item>
              <Descriptions
                title={
                  <div
                    style={{ color: '#047AE8' }}
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.中文标题) }}
                  />
                }
                colon={3}
              >
                <Descriptions.Item label={<Label text="时效性" />} span={3}>
                  <span
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.时效性) }}
                  />
                </Descriptions.Item>
                <Descriptions.Item label={<Label text="发布机关" />} span={3}>
                  <span
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.发布机关) }}
                  />
                </Descriptions.Item>
                {item.发布日期 ? (
                  <Descriptions.Item label={<Label text="发布日期" />} span={3}>
                    <span
                      dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.发布日期) }}
                    />
                  </Descriptions.Item>
                ) : null}
                <Descriptions.Item span={3}>
                  {item.全文.length > 300 ? (
                    <FoldText originText={item.全文.slice(0, 300)} fullText={item.全文} />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: `【正文快照】${item.全文}` }} />
                  )}
                </Descriptions.Item>
              </Descriptions>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default LawPost;
