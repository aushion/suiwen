import React from 'react';
import { List } from 'antd';
// import groupBy from 'lodash/groupBy';
import Evaluate from '../Evaluate/index';
import FoldText from '../../../../components/FoldText';
import styles from './index.less';

function SgList(props) {
  const { data, q, needEvaluate = true } = props;

  // const groupByData = groupBy(data, 'id');
  // const keys = Object.keys(groupByData);
  // const [sgData, updateData] = useState(groupByData);
  // const sgData = groupByData;

  return (
    <div className={`${styles.SgList} copy`} id="sg">
      <h2>
        <a
          href={`https://kns.cnki.net/KNS8/DefaultResult/Index?dbcode=CJFQ&kw=${q}&korder=FT`}
          rel="noreferrer"
          target="_blank"
        >
          <span>知网期刊</span>
        </a>{' '}
        - 片段重组
      </h2>

      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item) => {
          const year = (item.sgAdditionInfo && item.sgAdditionInfo.年) || '';
          const qikanName = (item.sgAdditionInfo && item.sgAdditionInfo.中文刊名) || '';
          return (
            <List.Item style={{ overflow: 'hidden', borderBottom: '1px solid #eee' }}>
              <FoldText
                originText={item.data.context}
                fullText={item.data.context + item.data.sub_context}
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
                <div>{/* 点赞模块预留 */}</div>
                <div>
                  <div
                    style={{
                      textAlign: 'right',
                      display: 'inline-block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: `${year}&nbsp;&nbsp;&nbsp;${qikanName}&nbsp;&nbsp;&nbsp;`
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
                    title={item.data.caption}
                    href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${item.data.source_id}`}
                  >
                    {item.data.caption}
                  </a>
                </div>
                <div className={styles.sg_evaluate}>
                  {needEvaluate ? (
                    <Evaluate
                      id={item.id}
                      goodCount={item.evaluate.good}
                      badCount={item.evaluate.bad}
                      isevalute={item.evaluate.isevalute}
                    />
                  ) : null}
                </div>
              </div>
            </List.Item>
          );
        }}
      />

      {/* {keys.map((item, keyIndex) => {
        const year = (sgData[item][0].sgAdditionInfo && sgData[item][0].sgAdditionInfo.年) || '';
        // const qikan = sgData[item][0].Data.additional_info && sgData[item][0].Data.additional_info.来源数据库 || '';
        const qikanName =
          (sgData[item][0].sgAdditionInfo && sgData[item][0].sgAdditionInfo.中文刊名) || '';
        return (
          <div key={item} className={styles.wrapper}>
  
          </div>
        );
      })} */}
    </div>
  );
}

export default SgList;
