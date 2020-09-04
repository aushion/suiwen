import React, { useEffect, useState } from 'react';
import { Icon, Badge, Popover, Tabs, List } from 'antd';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { connect } from 'dva';
import { Link } from 'umi';
import { getUnReadNotification } from '../../services/message';
import RestTools from '../../utils/RestTools';

const { TabPane } = Tabs;
function MessageBox(props) {
  const { userName, dispatch } = props;
  const [count, minusCount] = useState(0); //当3-count>0时去掉红点
  const [notifyList, setNotifyList] = useState([]); //列表数据
  const [visible, setVisible] = useState(false); //是否弹出消息层
  const [tabKey, setTabKey] = useState('3'); //消息tabs默认的key
  const [loading, setLoading] = useState(false); //数据list的loading状态

  //连接组件
  const LinkElement = ({ to, content }) => {
    return (
      <Link style={{ padding: '0 10px' }} to={to}>
        {content}
      </Link>
    );
  };

  //消息列表组件
  const MessageList = ({ data, type }) => {
    return (
      <div style={{ height: 300 }}>
        <List
          loading={loading}
          style={{ width: 300 }}
          dataSource={data}
          renderItem={(item) => {
            const sentence = {
              '00': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  喜欢了你的回答
                  <LinkElement
                    to={`/reply?q=${item.content}&QID=${item.groupId}`}
                    content={item.content}
                  />
                </span>
              ),
              '04': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  赞了你的评论
                  <LinkElement
                    to={`/reply?q=${item.content}&QID=${item.groupId}`}
                    content={item.content}
                  />
                </span>
              ),
              '05': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  赞了你的回复
                  <LinkElement
                    to={`/reply?q=${item.content}&QID=${item.groupId}`}
                    content={item.content}
                  />
                </span>
              ),
              '14': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  评论你的回答
                  <LinkElement
                    to={`/reply?q=${item.content}&QID=${item.groupId}`}
                    content={item.content}
                  />
                </span>
              ),
              '15': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  回复了你在
                  <LinkElement
                    to={`/reply?q=${item.content}&QID=${item.groupId}`}
                    content={item.content}
                  />
                  中的评论
                </span>
              ),
              '22': (
                <span>
                  <>
                    {item.fromId.split(',').map((item) => (
                      <LinkElement
                        key={item}
                        to={`/personCenter/people/ask?userName=${item}`}
                        content={RestTools.formatPhoneNumber(item)}
                      />
                    ))}
                  </>
                  关注了你
                </span>
              ),
              '21': (
                <span>
                  <>
                    {item.fromId.split(',').map((item) => (
                      <LinkElement
                        key={item}
                        to={`/personCenter/people/ask?userName=${item}`}
                        content={RestTools.formatPhoneNumber(item)}
                      />
                    ))}
                  </>
                  关注了你的问题
                  <LinkElement
                    to={`/reply?q=${item.content}&QID=${item.groupId}`}
                    content={item.content}
                  />
                </span>
              ),
              '31': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  回答了问题
                  <LinkElement
                    to={`/reply?q=${item.content}&QID=${item.groupId}`}
                    content={item.content}
                  />
                </span>
              ),
              '33': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  回答了你关注的问题
                  <LinkElement
                    to={`/reply?q=${item.content}&QID=${item.groupId}`}
                    content={item.content}
                  />
                </span>
              )
            };

            return <List.Item>{sentence[`${type}${item.entityType}`]}</List.Item>;
          }}
        />
      </div>
    );
  };

  useEffect(() => {
    const sock = new SockJS(`http://192.168.103.25:8080/sw.test.api/im/conn?uid=${userName}`);
    const stompClient = Stomp.over(sock);
    // 创建连接
    stompClient.connect({}, function(frame) {
      //订阅消息
      stompClient.subscribe(`/user/${userName}/msg`, function(data) {
        console.log(data.body);
      });
    });
  }, [userName]);

  useEffect(() => {
    setLoading(true);
    getUnReadNotification({
      pageSize: 10,
      pageStart: 1,
      type: tabKey,
      userName
    })
      .then((res) => {
        setLoading(false);
        if (res.data.code === 200) {
          setNotifyList(res.data.result);
          dispatch({
            type: 'global/save',
            payload: {
              messageCount: res.data.result.length
            }
          });
        }
      })
      .then((err) => {
        setLoading(false);
      });
  }, [tabKey, userName, dispatch]);

  function handleChange(activeKey) {
    minusCount(count + 1); //每次切换不同选项卡count+1
    setTabKey(activeKey);
  }

  const content = (
    <Tabs activeKey={tabKey} animated={false} size="small" onChange={handleChange}>
      <TabPane
        tab={
          <span>
            <Icon type="bars" />
          </span>
        }
        key="3"
      >
        <MessageList data={notifyList} type="3" />
        <Link to={`/notify?type=3`}>查看所有通知</Link>
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="message" theme="filled" />
          </span>
        }
        key="1"
      >
        <MessageList data={notifyList} type="1" />
        <Link to={`/notify?type=1`}>查看所有通知</Link>
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="contacts" theme="filled" />
          </span>
        }
        key="2"
      >
        <MessageList data={notifyList} type="2" />
        <Link to={`/notify?type=2`}>查看所有通知</Link>
      </TabPane>
      <TabPane
        tab={
          <span>
            <Icon type="heart" theme="filled" />
          </span>
        }
        key="0"
      >
        <MessageList data={notifyList} type="0" />
        <Link to={`/notify?type=0`}>查看所有通知</Link>
      </TabPane>
    </Tabs>
  );

  return (
    <div>
      <Popover
        placement="bottom"
        content={content}
        trigger="click"
        visible={visible}
        onVisibleChange={(visible) => {
          setVisible(visible);
        }}
      >
        <Badge dot={3 - count > 0}>
          <Icon style={{ fontSize: 24 }} type="bell" theme="filled" />
        </Badge>
      </Popover>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.global
  };
}

export default connect(mapStateToProps)(MessageBox);
