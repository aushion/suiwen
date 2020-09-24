import React from 'react';
import { List, Input, Popconfirm, Tag, Breadcrumb, Button } from 'antd';
import RestTools from '../../../utils/RestTools';
import CaAvatar from '../../../components/CaAvatar';
import { Link } from 'umi';

const { Search } = Input;
function HelpList(props) {
  const {
    data,
    size,
    communityNode,
    current,
    domain,
    handleSearchOrChangePage,
    loading,
    dispatch
  } = props;
  const { firstNode = null, secondNode = null } = communityNode || {};
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
      <div style={{ fontSize: 16, marginBottom: 10, paddingLeft: 10, color: '#8590A6' }}>
        共<span style={{ fontWeight: 'bold', color: '#333' }}>{data && data.total}</span>条
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid #eee',
          padding: '10px'
        }}
      >
        {communityNode ? (
          <div style={{ background: '#EBF7FF', padding: '4px 10px', borderRadius: 4 }}>
            <Breadcrumb>
              <Breadcrumb.Item>{firstNode.cName || '全部'}</Breadcrumb.Item>
              {secondNode ? <Breadcrumb.Item href="">{secondNode.cName}</Breadcrumb.Item> : null}
            </Breadcrumb>
          </div>
        ) : null}
        <div>
          <Search
            style={{ width: 200 }}
            autoComplete="new-password"
            size="small"
            defaultValue={sessionStorage.getItem('searchKey') || ''}
            onSearch={(value) => {
              RestTools.setSession('searchKey', value);
              // const page = JSON.parse(sessionStorage.getItem('page'));
              const payload = { domain, searchKey: value, size: 10, index: 1 };
              handleSearchOrChangePage(payload);
            }}
          />
            <input type="text" style={{ width: 0, height: 0, opacity: 0, border:'none',padding: 0 }}></input>
         
        </div>
      
      </div>

      <List
        style={{ backgroundColor: '#fff', padding: '0 10px 10px 10px', borderRadius: '4px' }}
        loading={loading}
        dataSource={data.dataList}
        itemLayout="vertical"
        pagination={
          data.total && data.total > size
            ? {
                total: data.total,
                pageSize: 10,
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
            <List.Item >
              <div className="display_flex justify-content_flex-justify">
                <div
                  style={{
                    width: '60%',
                    lineHeight: '28px',
                    fontSize: 15,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div style={{ display: 'inline-block' }}>
                    <CaAvatar userName={item.userName} showFollowBtn={false} />
                  </div>

                  <Link
                    style={{ color: '#454749', fontWeight: 800, display: 'block', paddingTop: 6 }}
                    to={`/reply?q=${encodeURIComponent(item.content)}&QID=${item.qid}`}
                    target="_blank"
                  >
                    {current === 'myReply' ? item.question : item.content}
                    <span style={{ marginLeft: 10 }}>
                    {item.tag
                      ? item.tag.split(',').map((item, index) => (
                          <Tag color="volcano" key={index}>
                            {item}
                          </Tag>
                        ))
                      : null}
                  </span>
                  </Link>
                
                </div>
                <div style={{paddingTop: 6}}>
                  <div style={{ textAlign: 'right' }}>
                    <Button
                      icon="edit"
                      size="small"
                      ghost
                      type="primary"
                      href={`/web/reply?q=${encodeURIComponent(item.content)}&QID=${
                        item.qid
                      }&editStatus=true`}
                      target="_blank"
                    >
                      写回答
                    </Button>
                  </div>
                  <div style={{ color: '#8590A6', lineHeight: '40px' }}>
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
                    已有回答:{item.answerCount}
                    <span>
                      <span style={{ display: 'inline-block', padding: '0 10px' }}>|</span>
                      {item.commitTime}
                    </span>
                  </div>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  ) : null;
}

export default HelpList;
