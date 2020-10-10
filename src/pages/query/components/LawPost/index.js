import React from 'react';
import { List, Descriptions } from 'antd';
import FoldText from '../../../../components/FoldText';
import Label from '../Label';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

function LawPost({ data, pagination, title }) {
  return (
    <div className={styles.LawPost}>
      {/* <h2>{title}</h2> */}

      <List
        itemLayout="vertical"
        dataSource={data}
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
                <Descriptions.Item label={<Label text="发布日期" />} span={3}>
                  <span
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.发布日期) }}
                  />
                </Descriptions.Item>
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
