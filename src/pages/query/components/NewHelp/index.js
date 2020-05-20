import { List, Icon } from 'antd';
import Link from 'umi/link';
import RestTools from '../../../../utils/RestTools';

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
                fontSize: 12,
                overflow: 'hidden'
              }}
              onClick={() => {
                RestTools.setSession('q', item.Content);
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
                to={`/reply?q=${encodeURIComponent(item.Content)}&QID=${item.ID}&domain=${
                  item.Domain
                }`}
              >
                {item.Content}
              </Link>

              <div
                style={{
                  float: 'right',
                  color: '#999',
                  fontSize: 12,
                  width: 60,
                  lineHeight: '25px'
                }}
              >
                回答数：{item.CheckSum}
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default NewHelp;
