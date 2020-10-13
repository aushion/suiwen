import { List, Icon } from 'antd';
import Link from 'umi/link';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

function NewHelp(props) {
  const { data, title } = props;
  return (
    <div className={styles.newHelp}>
      <div className={styles.title}>
        <Icon type="question-circle" style={{ fontSize: 16, marginRight: 6, color: '#f39b27' }} />
        {title || '新求助'}
      </div>
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div
              className={styles.listItem}
              onClick={() => {
                RestTools.setSession('q', item.Content);
              }}
              title={item.Content}
            >
              <Link
                className={styles.question}
                title={item.Content}
                to={`/reply?q=${encodeURIComponent(item.content)}&QID=${item.qid}`}
              >
                {item.content}
                <div
                  style={{
                    float: 'right',
                    color: '#999',
                    fontSize: 12,
                    width: 60,
                    lineHeight: '25px'
                  }}
                >
                  回答数：{item.checkCount}
                </div>
              </Link>
              <div
                style={{
                  color: '#999',
                  fontSize: 12,
                  width: 60,
                  lineHeight: '25px'
                }}
              >
                回答数：{item.checkCount}
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default NewHelp;
