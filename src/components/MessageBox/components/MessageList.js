import React, { useState, useEffect } from 'react';
import { List, Spin } from 'antd';
import { connect } from 'dva';
import InfiniteScroll from 'react-infinite-scroller';
import LinkElement from './LinkElement';
import { getUnReadNotification, readMessage, getUnReadCount } from '../../../services/message';
import RestTools from '../../../utils/RestTools';

//消息列表组件
const MessageList = ({ data, type, userName, showLoading, onContentClick, dispatch }) => {
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [notifyList, setNotifyList] = useState([]);

  useEffect(() => {
    setLoading(showLoading);
  }, [showLoading]);

  const Content = ({ item, content }) => (
    <span
      style={{ cursor: 'pointer', fontWeight: 'bold' }}
      onClick={onContentClick.bind(this, item, content)}
    >
      {content}
    </span>
  );

  function fetchData(pageStart = 1) {
    getUnReadNotification({
      pageSize: 10,
      pageStart,
      type,
      userName
    })
      .then((res) => {
        setLoading(false);
        if (res.data.code === 200) {
          const { dataList, pageNum, pageCount, total } = res.data.result;
          setNotifyList(notifyList.concat(dataList));
          setPageInfo({
            pageCount: pageCount,
            pageNum: pageNum,
            total: total
          });
          setHasMore(total > pageNum * pageCount);
        }
      })
      .then((err) => {
        setLoading(false);
      });
  }

  function handleFollow(item) {
    readMessage({
      action: item.action,
      date: item.createDate,
      entityType: item.entityType,
      groupId: item.groupId,
      toUser: userName
    }).then((res) => {
      if (res.data.code === 200) {
        getUnReadCount({userName}).then((res) => {
          if (res.data.code === 200) {
            dispatch({
              type: 'global/save',
              payload: {
                messageCount: res.data.result
              }
            });
          }
        });
      }
    });
  }

  return (
    <div style={{ height: 300, overflowY: 'auto', overflowX: 'hidden' }}>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={() => {
          fetchData(pageInfo.pageNum + 1);
        }}
        hasMore={!loading && hasMore}
        useWindow={false}
      >
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
                  <Content content={item.content} item={item} />
                </span>
              ),
              '04': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  赞了你的评论
                  <Content content={item.content} item={item} />
                </span>
              ),
              '05': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  赞了你的回复
                  <Content content={item.content} item={item} />
                </span>
              ),
              '14': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  评论你的回答
                  <Content content={item.content} item={item} />
                </span>
              ),
              '15': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  回复了你在
                  <Content content={item.content} item={item} />
                  中的评论
                </span>
              ),
              '22': (
                <span style={{cursor: 'pointer'}} onClick={handleFollow.bind(this, item)}>
                  {item.fromId.split(',').map((item) => (
                    <LinkElement
                      key={item}
                      to={`/personCenter/people/ask?userName=${item}`}
                      content={RestTools.formatPhoneNumber(item)}
                    />
                  ))}
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
                  <Content content={item.content} item={item} />
                </span>
              ),
              '31': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  回答了问题
                  <Content content={item.content} item={item} />
                </span>
              ),
              '33': (
                <span>
                  <LinkElement
                    to={`/personCenter/people/ask?userName=${item.fromId}`}
                    content={RestTools.formatPhoneNumber(item.fromId)}
                  />
                  回答了你关注的问题
                  <Content content={item.content} item={item} />
                </span>
              )
            };

            return (
              <List.Item>
                <div>{sentence[`${type}${item.entityType}`]}</div>
              </List.Item>
            );
          }}
        >
          {loading && hasMore && <Spin />}
        </List>
      </InfiniteScroll>
    </div>
  );
};

export default connect((state) => ({
  ...state.global
}))(MessageList);
