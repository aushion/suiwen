import React from 'react';
import { List, Avatar } from 'antd';

import { router } from 'umi';
import { connect } from 'dva';
import FollowButton from '../../../components/FollowButton';
import RestTools from '../../../utils/RestTools';

function FollowList(props) {
  const { data, loading, userCommunityInfo } = props;

  return (
    <div>
      <List
        loading={loading}
        dataSource={data}
        renderItem={(item, index) => {
          return (
            <List.Item>
              <div style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                <div style={{ float: 'left' }}>
                  <Avatar
                    onClick={() => {
                      if (userCommunityInfo.userName !== item.userName) {
                        router.push(`/personCenter/people/ask?userName=${item.userName}`);
                      }
                      return;
                    }}
                    size={64}
                    shape="square"
                    src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${item.userName}`}
                  />
                </div>
                <div style={{ float: 'left', overflow: 'hidden', paddingLeft: 10 }}>
                  <div style={{ fontSize: 16 }}>{RestTools.formatPhoneNumber(item.userName)}</div>
                  <div style={{ color: '#999', fontWeight: 400, paddingTop: 16 }}>
                    <span style={{ paddingRight: 4 }}>
                      {' '}
                      <strong>{item.questionNum}</strong>提问
                    </span>
                    <span style={{ paddingRight: 4 }}>
                      {' '}
                      <strong>{item.answerNum}</strong>回答
                    </span>
                    <span style={{ paddingRight: 4 }}>
                      {' '}
                      <strong>{item.followers}</strong>粉丝
                    </span>
                    <span>
                      {' '}
                      <strong>{item.followees}</strong>关注者
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <FollowButton
                  hasFollowed={item.hasFollowed}
                  userName={item.userName}
                  userCommunityInfo={userCommunityInfo}
                />
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default connect((state) => ({
  ...state.personCenter
}))(FollowList);
