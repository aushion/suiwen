import { List, Icon } from 'antd';
import Link from 'umi/link';
import RestTools from 'Utils/RestTools';

function WaitAnswer(props) {
  const { data, title } = props;
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 4,
        boxShadow: '#cecece 0 0 6px 0'
      }}
    >
      <div
        style={{
          paddingBottom: 10,
          borderBottom: '1px solid #e6e6e6',
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333'
        }}
      >
        <Icon type="question-circle" style={{ fontSize: 16, marginRight: 6, color: '#f39b27' }} />
        {title || '新求助'}
      </div>
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div
              style={{
                width: '100%',
                fontSize: 12,
                overflow: 'hidden'
              }}
              onClick={() => {
                RestTools.setSession('q', item.content);
              }}
            >
              <Link
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: 14,
                  color: '#666',
                  fontWeight: 'bold',
                  display: 'block'
                }}
                title={item.Content}
                to={`/reply?q=${encodeURIComponent(item.content)}&QID=${item.qid}&editStatus=true`}
              >
                {item.content}
              </Link>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default WaitAnswer;
