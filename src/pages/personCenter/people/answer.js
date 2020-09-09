import React from 'react';
import { Divider, List, Avatar } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import RestTools from '../../../utils/RestTools';
import FoldText from '../../../components/FoldText';
import styles from './people.less';

function Answer(props) {
  const { myCommunityAnswer, avatar, loading, location } = props;
  const { query } = location;
  const { userName } = query;
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  return (
    <div className={styles.people}>
      <div className={styles.main}>
        <div className={styles.title}>
          {userInfo?.UserName === userName ? `我的回答` : `他的回答`}
        </div>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <div className={styles.content}>
          <List
            loading={loading}
            dataSource={myCommunityAnswer?.dataList}
            pagination={
              myCommunityAnswer
                ? {
                    hideOnSinglePage: true,
                    pageSize: myCommunityAnswer.pageCount,
                    size: myCommunityAnswer.pageNum,
                    total: myCommunityAnswer.total
                  }
                : null
            }
            itemLayout="vertical"
            renderItem={(item) => {
              const removeHtmlText = RestTools.removeHtmlTag(item.answer[0].answer);
              return (
                <List.Item>
                  <Link
                    to={`/reply?q=${item.question}&QID=${item.qid}`}
                    style={{ fontSize: 16, fontWeight: 'bold', color: '#38393C' }}
                  >
                    {item.question}
                  </Link>
                  <div style={{ padding: '10px 0' }}>
                    <Avatar src={avatar} />
                    <span style={{paddingLeft: 4}}>{RestTools.formatPhoneNumber(item.answer[0].userName)}</span>
                  </div>

                  <FoldText
                    originText={
                      removeHtmlText.length > 300 ? removeHtmlText.slice(0, 300) : removeHtmlText
                    }
                    fullText={removeHtmlText.length > 300 ? removeHtmlText : null}
                  />
                  <div
                    style={{
                      color: '#B3B3B3',
                      fontSize: 14,
                      paddingTop: 10
                    }}
                  >
                    <span style={{ marginRight: 14 }}>{item.total}个回答</span>
                    <span style={{ marginRight: 14 }}>{item.followers}个关注</span>

                  <span>发布于{item.commitTime}</span>
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

export default connect((state) => ({
  ...state.personCenter,
  loading: state.loading.effects['personCenter/getMyCommunityAnswer']
}))(Answer);
