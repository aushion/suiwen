import { List, Input, Popconfirm } from 'antd';
import RestTools from '../../../utils/RestTools';

const { Search } = Input;
function HelpList(props) {
  const {
    data,
    size,
    // index,
    current,
    domain,
    handleSearchOrChangePage,
    loading,
    dispatch,
    handleClickItem
  } = props;

  function confirm(id) {
    dispatch({
      type: 'help/deleteQuestion',
      payload: {
        qId: id
      }
    });
  }
  return data ? (
    <div style={{ padding: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 16 }}>
          共<span style={{ fontWeight: 'bold', color: '#333' }}>{data && data.total}</span>条
        </div>
        <div>
          <Search
            style={{ width: 200 }}
            onSearch={(value) => {
              const payload = { domain, searchKey: value };
              RestTools.setSession('searchKey',value);
              handleSearchOrChangePage(payload);
            }}
          />
        </div>
      </div>
      <List
        style={{ backgroundColor: '#fff', padding: '0 20px 10px 20px', borderRadius: '4px' }}
        loading={loading}
        dataSource={data.list}
        pagination={
          data.total && data.total > size
            ? {
                total: data.total,
                pageSize: data.pageSize,
                current: data.pageNum,
                onChange: function(page, pageSize) {
                  RestTools.setSession('page', { size: pageSize, index: page });
                  const searchKey = sessionStorage.getItem('searchKey');
                  const payload = { size: pageSize, index: page, domain: domain, searchKey };
                  handleSearchOrChangePage(payload);
                }
              }
            : null
        }
        renderItem={(item) => {
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
                  whiteSpace: 'nowrap'
                }}
                // onMouseOver={() => { console.log('up'); setDelete(true)}}
                // onMouseLeave={() =>{setDelete(false)}}
                onClick={() => handleClickItem(item)}
              >
                {current === 'myReply' ? item.question : item.content}
              </div>

              {current === 'myReply' ? (
                <div>查看回答</div>
              ) : (
                <div>
                  {current === 'myHelp' && item.checkCount === 0 ? (
                    <Popconfirm
                      title="是否删除此问题?"
                      onConfirm={confirm.bind(this, item.id)}
                      okText="是"
                      cancelText="否"
                    >
                      <span
                        style={{
                          paddingRight: 10,
                          fontSize: 12,
                          cursor: 'pointer',
                          color: '#1890ff'
                        }}
                      >
                        删除
                      </span>
                    </Popconfirm>
                  ) : null}
                  已有回答:{item.checkCount}
                  <span>
                    <span style={{ display: 'inline-block', padding: '0 10px' }}>|</span>
                    {item.time}
                  </span>
                </div>
              )}
            </List.Item>
          );
        }}
      />
    </div>
  ) : null;
}

export default HelpList;
