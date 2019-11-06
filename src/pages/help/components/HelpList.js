import { List, Input } from 'antd';

const { Search } = Input;
function HelpList(props) {
  const {
    data,
    size,
    index,
    current,
    domain,
    handleSearchOrChangePage,
    loading,
    handleClickItem,
  } = props;

  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 16 }}>
          共<span style={{ fontWeight: 'bold', color: '#333' }}>{data.total}</span>条
        </div>
        <div>
          <Search
            style={{ width: 200 }}
            onSearch={value => {
              const payload = { domain, searchKey: value };
              handleSearchOrChangePage(payload);
            }}
          ></Search>
        </div>
      </div>
      <List
        loading={loading}
        dataSource={data.list}
        pagination={
          data.total > size
            ? {
                total: data.total,
                pageSize: size,
                current: index,
                onChange: function(page, pageSize) {
                  const payload = { size: pageSize, index: page, domain: domain };
                  handleSearchOrChangePage(payload);
                },
              }
            : null
        }
        renderItem={item => {
          return (
            <List.Item
              style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0' }}
            >
              <div
                style={{
                  width: '60%',
                  color: '#3192e1',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                onClick={() => handleClickItem(item)}
              >
                {current === 'myReply' ? item.Qeustion : item.Content}
              </div>
              {current === 'myReply' ? (
                <div>查看回答</div>
              ) : (
                <div>
                  已有回答:{item.CheckSum}
                  <span>
                    <span style={{ display: 'inline-block', padding: '0 10px' }}>|</span>
                    {item.Time}
                  </span>
                </div>
              )}
            </List.Item>
          );
        }}
      ></List>
    </div>
  );
}

export default HelpList;
