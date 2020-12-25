import React, { useState, useEffect } from 'react';
import { List } from 'antd';
import Cookies from 'js-cookie';
import FoldText from '../../../../components/FoldText';
import gif from '../../../../assets/giphy2.gif';
import RestTools from '../../../../utils/RestTools';
import request from '../../../../utils/request';
import styles from './index.less';

let count = 0;
let timeId = null;
function SgPro(props) {
  const { q } = props;
  const [newData, setNewData] = useState([]);
  const [showLoading, setLoading] = useState(true);

  let userId = RestTools.getLocalStorage('userInfo')
    ? RestTools.getLocalStorage('userInfo').UserName
    : Cookies.get('cnki_qa_uuid');

  function checkSemanticStatus(payload) {
    request.post(`/checkSemanticStatus`, null, { params: payload }).then((res) => {
      if (res.data.result.async_result_state === 'SUCCESS' || count === 100) {
        clearTimeout(timeId);
        setNewData(res.data.result.dataList);
        setLoading(false);
      } else {
        timeId = setTimeout(() => {
          count += 1;
          checkSemanticStatus(payload);
        }, 3000);
      }
    });
  }

  function fetchSg(q) {
    return request.get(`/getSemanticData`, {
      timeout: 30000,
      params: {
        q: q,
        pageStart: 1,
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
            setNewData(res.data.result.dataList);
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
      console.log('timeId', timeId);
      clearTimeout(timeId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const LoadingGif = () => (
    <div style={{ marginTop: 20 }}>
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
        dataSource={newData}
        itemLayout="vertical"
        renderItem={(item, index) => {
          const year = (item.sgAdditionInfo && item.sgAdditionInfo.年) || '';
          const qikanName = (item.sgAdditionInfo && item.sgAdditionInfo.中文刊名) || '';
          const result_score = item.data.result_score || 0;
          const answer = item.data.semantic_text ? item.data.semantic_text : item.data.context;
          return (
            <List.Item style={{ overflow: 'hidden' }}>
              <FoldText
                originText={RestTools.superMarkRed(answer)}
                fullText={RestTools.superMarkRed(answer + item.data.sub_context)}
              />
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
                      result_score
                        ? 'CF:' + result_score + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                        : ''
                    }${year}&nbsp;&nbsp;&nbsp;${qikanName}&nbsp;&nbsp;&nbsp;`
                  }}
                />
                <a
                  style={{
                    color: '#999',
                    display: 'inline-block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.data.caption}
                  href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${item.data.source_id}`}
                >
                  {item.data.caption}
                </a>
              </div>
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default SgPro;
