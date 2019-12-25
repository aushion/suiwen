import { List, Icon } from 'antd';

function NewHelp(props) {
  const { data } = props;
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
        <Icon type="question-circle" style={{ fontSize: 16, marginRight: 6, color: '#f39b27' }} />
        新求助
      </div>
      <List
        itemLayout="vertical"
        dataSource={data.slice(0, 2)}
        renderItem={(item) => (
          <List.Item>
            <div
              style={{
                width: '100%',
                fontSize: 12
              }}
            >
              <span
                title={item.Content}
                style={{
                  display: 'inline-block',
                  width: '70%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginRight: 10,
                  fontSize: 14
                }}
              >
                {item.Content}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  float: 'right',
                  color: '#999',
                  fontSize: 12,
                  lineHeight: '25px'
                }}
              >
                回答数：{item.CheckSum}
              </span>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default NewHelp;
