import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import gif from '../../../../assets/giphy2.gif';
import RestTools from '../../../../utils/RestTools';
import request from '../../../../utils/request';
import SgListView from '../../../../components/SgListView';
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
        setNewData(res.data.result.data);
        setLoading(false);
      } else {
        timeId = setTimeout(() => {
          count += 1;
          checkSemanticStatus(payload);
        }, 3000);
      }
    });
  }

  function fetchSg({ q, pageStart, type = '' }) {
    request
      .get(`/getSemanticData`, {
        timeout: 30000,
        params:
          type === ''
            ? {
                q: encodeURIComponent(q),
                pageStart,
                pageCount: 10,
                userId
              }
            : {
                q: encodeURIComponent(q),
                pageStart,
                pageCount: 10,
                userId,
                type
              }
      })
      .then((res) => {
        if (res.data.code === 200) {
          if (res.data.result.async_result_state === 'SUCCESS') {
            setNewData(res.data.result.data);
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
      .catch(() => {
        setLoading(false);
      });
  }

  function handlePageChange(params) {
    setNewData([]); //清空上一页数据
    setLoading(true);
    fetchSg({ ...params });
  }

  useEffect(() => {
    setNewData([]); //重置数据
    setLoading(true); //显示loading
    fetchSg({ q });

    return () => {
      clearTimeout(timeId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);
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

      <SgListView
        data={newData} //数据源
        q={q}
        style={showLoading ? { minHeight: '45vh', alignItems: 'center' } : null}
        loading={{
          spinning: showLoading,
          indicator: <LoadingGif />
        }}
        needEvaluate //点赞
        handlePageChange={handlePageChange} //分页
      />
    </div>
  );
}

const LoadingGif = () => (
  <div style={{ marginTop: '2%' }}>
    <div>
      <img style={{ width: 300 }} src={gif} alt="loading" />
    </div>
    <div style={{ color: '#bababa' }}>答案正在生成中，请您稍等...</div>
  </div>
);

export default React.memo(SgPro);
