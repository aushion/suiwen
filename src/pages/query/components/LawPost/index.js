import React from 'react';
import { List } from 'antd';
import FoldText from '../../../../components/FoldText';
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
              <h3
                style={{ fontWeight: 'bold' }}
                dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.中文标题) }}
              />
              <div className={styles.fullContent}>
                {item.全文.length > 300 ? (
                  <FoldText originText={item.全文.slice(0, 300)} fullText={item.全文} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: `【正文快照】${item.全文}`  }} />
                )}
              </div>
              <div className={styles.otherInfo}>
                <div className={styles.item}>【时效性】{item.时效性}</div>
                <div className={styles.item}>【发布日期】{item.发布日期}</div>
                <div className={styles.item}>【发布机关】{item.发布机关}</div>
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default LawPost;
