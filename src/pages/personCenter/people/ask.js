import React from 'react';
import { Divider, List, Modal, Tag } from 'antd';
import { Link } from 'umi';
import { connect } from 'dva';
import styles from './people.less';
import RestTools from '../../../utils/RestTools';
const { confirm } = Modal;
function People(props) {
  const { myCommunityQuestion, loading, location, dispatch } = props;
  const { query } = location;
  let { userName } = query;
  userName = RestTools.decodeBase64(userName);
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  function handleDelete(item) {
    if (userInfo) {
      confirm({
        title: '是否删除此问题?',
        content: item.question,
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk() {
          dispatch({
            type: 'personCenter/delPersonQuestion',
            payload: {
              qId: item.qid,
              userName: userInfo.UserName
            }
          });
        }
      });
    }
  }
  return (
    <div className={styles.people}>
      <div className={styles.main}>
        <div className={styles.title}>
          {userInfo?.UserName === userName
            ? `我的提问`
            : `${RestTools.formatPhoneNumber(RestTools.hideEmailInfo(userName))}的提问`}
        </div>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <div className={styles.content}>
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={myCommunityQuestion?.dataList}
            pagination={
              myCommunityQuestion
                ? {
                    hideOnSinglePage: true,
                    pageSize: myCommunityQuestion?.pageCount,
                    size: myCommunityQuestion?.pageNum,
                    total: myCommunityQuestion?.total,
                    onChange: (page) => {
                      dispatch({
                        type: 'personCenter/getMyCommunityQuestion',
                        payload: {
                          operatorName: userInfo.UserName,
                          pageSize: 10,
                          pageStart: page,
                          userName
                        }
                      });
                    }
                  }
                : null
            }
            renderItem={(item) => {
              return (
                <List.Item className={styles.item}>
                  <Link
                    to={`/reply?q=${item.question}&QID=${item.qid}`}
                    style={{ fontSize: 16, fontWeight: 'bold', color: '#38393C' }}
                  >
                    {item.question}
                  </Link>
                  <div>
                    <div style={{ paddingTop: 6 }}>
                      {item.tag
                        ? item.tag.split(',').map((item) => (
                            <Tag color="volcano" key={item}>
                              {item}
                            </Tag>
                          ))
                        : null}
                    </div>
                  </div>
                  <div
                    style={{
                      color: '#B3B3B3',
                      fontSize: 14,
                      paddingTop: 10
                    }}
                  >
                    <span style={{ marginRight: 14 }}>{item.total}个回答</span>
                    <span style={{ marginRight: 14 }}>{item.followers}个关注</span>
                    <span style={{ marginRight: 14 }}>发布于{item.commitTime}</span>
                    {item.total === 0 && userInfo.UserName === userName ? (
                      <span
                        className={styles.delete}
                        onClick={() => {
                          handleDelete(item);
                        }}
                      >
                        删除
                      </span>
                    ) : null}
                  </div>
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.personCenter,
    loading: state.loading.effects['personCenter/getMyCommunityQuestion']
  };
}

export default connect(mapStateToProps)(People);
