import { List, Icon } from 'antd';
import Link from 'umi/link';
import RestTools from '../../../../utils/RestTools';

function NewHelp(props) {
  const { data, title } = props;
  return (
    <div style={{ backgroundColor: '#fff', padding: 20, boxShadow: '#cecece 0 0 6px 0' }}>
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
                  color: '#848484',
                  display: 'block'
                }}
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
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default NewHelp;
