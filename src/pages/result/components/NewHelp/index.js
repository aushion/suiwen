import { List } from 'antd';

function NewHelp(props) {
  const { data } = props;
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 400, color: '#333' }}>新求助</div>
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
                style={{ display: 'inline-block', float: 'right', color: '#999', fontSize: 14 }}
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
