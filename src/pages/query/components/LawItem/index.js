import React from 'react';
import { List } from 'antd';
import FoldText from '../../../../components/FoldText';
import styles from './index.less';

function LawItem({ data }) {
  return (
    <div className={styles.LawItem}>
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item) => {
          return (
            <List.Item>
              <div className={styles.fullContent}>
                {item.条目全文 && item.条目全文.length > 300 ? (
                  <FoldText originText={item.条目全文.slice(0, 300)} fullText={item.条目全文} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: `${item.条目概要}` }} />
                )}
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default LawItem;
