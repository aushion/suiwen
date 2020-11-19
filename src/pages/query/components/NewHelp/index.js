import { List, Icon } from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
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
        footer={
          <div onClick={() => {
            router.push('/help/newHelp')
          }} className={styles.more}>{'更多>>'} </div>
        }
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
              </Link>
              <div
                style={{
                  color: '#999',
                  fontSize: 12,
                  width: 60,
                  lineHeight: '25px'
                }}
              >
                回答数：{item.answerCount}
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default NewHelp;
