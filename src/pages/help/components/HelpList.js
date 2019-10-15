import { List } from 'antd';

function HelpList(props) {
  const { data, size, index, domain, current, dispatch } = props;
  return (
    <List
      dataSource={data.list}
      pagination={
        data.total > size
          ? {
              total: data.total,
              pageSize: size,
              current: index,
              onChange: function(page, pageSize) {
                if (current === 'newHelp') {
                  dispatch({
                    type: 'help/getNewQuestions',
                    payload: { size: pageSize, index: page, domain: domain },
                  });
                } else if (current === 'hotHelp') {
                  dispatch({
                    type: 'help/getHotQuestions',
                    payload: { size: pageSize, index: page, domain: domain },
                  });
                }
              },
            }
          : null
      }
      renderItem={item => {
        return <List.Item style={{display: 'flex', justifyContent: 'space-between'}}>
           <div style={{width: '60%', cursor: 'pointer',overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{item.Content}</div>
                <div>
                  已有回答:{item.CheckSum}
                  <span>
                    <span style={{ display: 'inline-block', padding: '0 10px' }}>|</span>
                    {item.Time}
                  </span>
                </div>
        </List.Item>;
      }}
    ></List>
  );
}

export default HelpList;
