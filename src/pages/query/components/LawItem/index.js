import React from 'react';
import { List, Descriptions } from 'antd';
import FoldText from '../../../../components/FoldText';
import Label from '../Label';
import styles from './index.less';
import RestTools from '../../../../utils/RestTools';

function LawItem({ data }) {
  return (
    <div className={styles.LawItem}>
      <List
        itemLayout="vertical"
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
        dataSource={data}
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
                      <FoldText originText={item.条目全文.slice(0, 300)} fullText={item.Answer} />
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
