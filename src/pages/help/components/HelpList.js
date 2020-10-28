import React from 'react';
import { List, Input, Breadcrumb } from 'antd';
import RestTools from '../../../utils/RestTools';

import QuestionItem from './QuestionItem';

const { Search } = Input;
function HelpList(props) {
  const { data, size, communityNode, domain, handleSearchOrChangePage, loading } = props;
  const { firstNode = null, secondNode = null } = communityNode || {};

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
          <input
            type="text"
            style={{ width: 0, height: 0, opacity: 0, border: 'none', padding: 0 }}
          />
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
            <List.Item>
              <QuestionItem item={item} />
            </List.Item>
          );
        }}
      />
    </div>
  ) : null;
}

export default HelpList;
