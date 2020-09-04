import React, { useState } from 'react';
import { Row, Col, Card, List, Select } from 'antd';
import { connect } from 'dva';
import UserInfo from '../help/components/UserInfo';
import styles from './index.less';

const { Option } = Select;
function Notify(props) {
  const { userHistoryNotification, location, dispatch } = props;
  const { query } = location;
  const { type } = query;
  const [selectValue, setSelectValue] = useState(type);

  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  const action = {
    '00': '喜欢了你的回答',
    '04': '赞了你的评论',
    '05': '赞了你的回复',
    '14': '评论了你的回答',
    '15': '回复了你的评论',
    '22': '关注了你',
    '21': '关注了你的问题',
    '31': '回答了你的问题',
    '33': '回答了你关注的问题'
  };

  function handleChange(item) {
    setSelectValue(item);
    dispatch({
      type: 'notify/fetch',
      payload: {
        pageSize: 10,
        pageStart: 1,
        type: item,
        userName: userInfo.UserName
      }
    });
  }

  const SingleSelect = (
    <Select value={selectValue} onSelect={handleChange}>
      <Option value="0">点赞</Option>
      <Option value="1">评论</Option>
      <Option value="2">关注</Option>
      <Option value="3">通知</Option>
    </Select>
  );

  return (
    <div className={styles.notify}>
      <Row gutter={40}>
        <Col span={18} className={styles.left}>
          <Card title="通知中心" bordered={false} extra={SingleSelect}>
            {userHistoryNotification ? (
              <List
                itemLayout="vertical"
                dataSource={userHistoryNotification.dataList || []}
                pagination={{
                  hideOnSinglePage: true,
                  pageSize: userHistoryNotification.pageCount,
                  current: userHistoryNotification.pageNum,
                  total: userHistoryNotification.total
                }}
                renderItem={(item) => {
                  return (
                    <List.Item>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        <span style={{ color: '#333' }}>{item.fromId}</span>
                        <span style={{ padding: '0 10px' }}>
                          {action[`${item.action}${item.entityType}`]}
                        </span>
                        <span>{item.createDate}</span>
                      </div>
                      <div style={{ color: '#333', fontWeight: 'bold' }}>{item.content}</div>
                    </List.Item>
                  );
                }}
              />
            ) : null}
          </Card>
        </Col>
        <Col span={6}>
          <UserInfo userName={userInfo.UserName} />
        </Col>
      </Row>
    </div>
  );
}

export default connect((state) => {
  return {
    ...state.notify
  };
})(Notify);
