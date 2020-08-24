import React, { useState } from 'react';
import { List, Avatar, Input, Button, Divider } from 'antd';
import dayjs from 'dayjs';
import IconText from './IconText';
import RestTools from 'Utils/RestTools';

function ReplyList({ replyData }) {
  const [replyId, setReplyId] = useState('');
  const [newComment, setNewComment] = useState('');
  return (
    <div>
      <List
        itemLayout="vertical"
        dataSource={replyData || []}
        header={false}
        footer={false}
        renderItem={(k) => {
          return (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    size="small"
                    src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${k.userName}`}
                  />
                }
                title={
                  <span>
                    <span style={{ fontSize: 12 }}>
                      {RestTools.formatPhoneNumber(k.userName)}
                      {/* {RestTools.formatPhoneNumber(k.replyUserName)} */}
                    </span>

                    <span style={{ fontSize: 12, color: '#9EACB6', marginLeft: 20 }}>
                      {dayjs(k.createTime).fromNow()}
                    </span>
                  </span>
                }
              />
              <div style={{ color: '#333' }}>
                <div>{k.content}</div>
                <div>
                  <IconText type="like-o" text="156" key="list-vertical-like-o" />
                  <Divider type="vertical" style={{ margin: '0 18px' }} />
                  <IconText
                    type="message"
                    text="回复"
                    key="list-vertical-message"
                    onClick={() => {
                      setReplyId(k.replyId);
                    }}
                  />
                </div>
                {replyId === k.replyId ? (
                  <div>
                    <Input placeholder="输入回复" style={{ width: 550, marginRight: 20 }} />
                    <Button type="primary" disabled={!newComment}>
                      发表
                    </Button>
                  </div>
                ) : null}
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default ReplyList;
