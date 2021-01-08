import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import { groupBy } from 'lodash';
import Cookies from 'js-cookie';
import Evaluate from '../Evaluate';
import FoldText from '../../../../components/FoldText';
import gif from '../../../../assets/giphy2.gif';
import RestTools from '../../../../utils/RestTools';
import request from '../../../../utils/request';
import styles from './index.less';

let count = 0;
let timeId = null;
function SgPro(props) {
  const { q, needEvaluate = true } = props;
  const [newData, setNewData] = useState(null);
  const [showLoading, setLoading] = useState(true);

  let userId = RestTools.getLocalStorage('userInfo')
    ? RestTools.getLocalStorage('userInfo').UserName
    : Cookies.get('cnki_qa_uuid');

  function handleData({ data, pagination }) {
    let groupData = groupBy(data, (item) => item.data.source_id);
    const tempData = Object.keys(groupData).map((item) => ({
      id: item,
      dataList: groupData[item]
    }));

    setNewData({ tempData, pagination });
  }

  function checkSemanticStatus(payload) {
    request.post(`/checkSemanticStatus`, null, { params: payload }).then((res) => {
      if (res.data.result.async_result_state === 'SUCCESS' || count === 100) {
        clearTimeout(timeId);
        // setNewData(res.data.result.dataList);
        handleData({ data: res.data.result.data, pagination: res.data.result.pagination });
        setLoading(false);
      } else {
        timeId = setTimeout(() => {
          count += 1;
          checkSemanticStatus(payload);
        }, 3000);
      }
    });
  }

  function fetchSg(q, pageStart) {
    return request.get(`/getSemanticData`, {
      timeout: 30000,
      params: {
        q: q,
        pageStart,
        pageCount: 10,
        userId
      }
    });
  }

  useEffect(() => {
    setNewData([]); //重置数据
    setLoading(true); //显示loading
    fetchSg(q)
      .then((res) => {
        if (res.data.code === 200) {
          if (res.data.result.async_result_state === 'SUCCESS') {
            handleData({ data: res.data.result.data, pagination: res.data.result.pagination });
            setLoading(false);
          } else {
            checkSemanticStatus({
              taskId: res.data.result.async_result_id,
              userId
            });
          }
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
    return () => {
      clearTimeout(timeId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const LoadingGif = () => (
    <div style={{ marginTop: '2%' }}>
      <div>
        <img style={{ width: 300 }} src={gif} alt="loading" />
      </div>
      <div style={{ color: '#bababa' }}>答案正在生成中，请您稍等...</div>
    </div>
  );

  return (
    <div className={styles.SgPro} id="ReadComp">
      <h2>
        <a
          href={`https://kns.cnki.net/KNS8/DefaultResult/Index?dbcode=CJFQ&kw=${q}&korder=FT`}
          rel="noreferrer"
          target="_blank"
        >
          <span>{q}</span>
        </a>{' '}
        - 细粒度知识问答
      </h2>

      <List
        style={showLoading ? { minHeight: '45vh', alignItems: 'center' } : null}
        loading={{
          spinning: showLoading,
          indicator: <LoadingGif />
        }}
        dataSource={newData?.tempData}
        pagination={{
          current: newData?.pagination?.pageStart,
          pageCount: newData?.pagination?.pageCount,
          total: newData?.pagination?.total,
          hideOnSinglePage: true,
          onChange: (page) => {
            setLoading(true);
            fetchSg(q, page)
              .then((res) => {
                if (res.data.code === 200) {
                  if (res.data.result.async_result_state === 'SUCCESS') {
                    handleData({
                      data: res.data.result.data,
                      pagination: res.data.result.pagination
                    });
                    setLoading(false);
                  } else {
                    checkSemanticStatus({
                      taskId: res.data.result.async_result_id,
                      userId
                    });
                  }
                } else {
                  setLoading(false);
                }
              })
              .catch((err) => {
                setLoading(false);
              });
          }
        }}
        itemLayout="vertical"
        renderItem={(item, index) => {
          const year =
            (item.dataList[0].sgAdditionInfo && item.dataList[0].sgAdditionInfo.年) || '';
          const qikanName =
            (item.dataList[0].sgAdditionInfo && item.dataList[0].sgAdditionInfo.中文刊名) || '';
          const caption = item.dataList[0].data.caption;
          const source_id = item.dataList[0].data.source_id;
          const source_type = item.dataList[0].data.soure_type;
          const result_score =
            item.dataList[0].data.result_score !== '0' ? item.dataList[0].data.result_score : '';

          return (
            <List.Item style={{ overflow: 'hidden' }}>
              {item.dataList.map((current, index) => {
                const originText = current.data.semantic_text || current.data.context;
                const fullText = originText + current.data.sub_context;

                return (
                  <div key={index} style={{ paddingBottom: 10, wordBreak: 'break-all' }}>
                    <FoldText originText={originText} fullText={fullText} />
                  </div>
                );
              })}
              <div
                style={{
                  paddingTop: '10px',
                  textAlign: 'right',
                  fontSize: 13,
                  color: '#999',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    textAlign: 'right',
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: `${
                      result_score ? 'CF:' + result_score : ''
                    }&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${year}&nbsp;&nbsp;&nbsp;${qikanName}&nbsp;&nbsp;&nbsp;`
                  }}
                />
                <a
                  style={{
                    color: '#999',
                    // maxWidth: '50%',
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={caption}
                  href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${RestTools.kns[source_type].dbcode}&&dbname=${RestTools.kns[source_type].dbname}&filename=${source_id}`}
                >
                  {caption}
                </a>
                <div className={styles.sg_evaluate}>
                  {needEvaluate ? (
                    <Evaluate
                      id={item.dataList[0].id}
                      goodCount={item.dataList[0].evaluate.good}
                      badCount={item.dataList[0].evaluate.bad}
                      isevalute={item.dataList[0].evaluate.isevalute}
                    />
                  ) : null}
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default React.memo(SgPro);
