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
                fontSize: 12
              }}
              onClick={() => {RestTools.setSession('q', item.Content)}}
            >
              <Link
                title={item.Content}
                style={{
                  display: 'inline-block',
                  width: '50%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginRight: 10,
                  fontSize: 14,
                  color: '#848484'
                }}
                to={`/reply?question=${item.Content}&QID=${item.ID}&domain=${item.Domain}`}
              >
                {item.Content}
              </Link>
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
