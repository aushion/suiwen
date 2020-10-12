import React from 'react';
import Evaluate from '../Evaluate';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

export default function Yearbook(props) {
  let { intentDomain, id, evaluate = {}, data = [] } = props;
  const { good = 0, bad = 0, isevalute = false } = evaluate;

  const nianjianminglu =
    data.length && intentDomain === '年鉴名录'
      ? data.map((item, index) => (
          <div key={index} className={styles.Statistics_wrapper}>
            <div className={styles.Statistics_left}>
              <img
                src={`http://c61.cnki.net/cyfd/${item.编号}.jpg`}
                alt={RestTools.removeFlag(item.年鉴中文名)}
              />
            </div>
            <div className={styles.Statistics_right}>
              <a
                className={styles.Statistics_right_item}
                style={{ fontSize: 16 }}
                href={`http://data.cnki.net/yearbook/Single/${item.编号}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.年鉴中文名) }}
                />
                {/* <span>{item.英文名}</span> */}
              </a>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">行业分类：</label>
                <span>{item.行业分类 || '-'}</span>
              </div>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">出版者：</label>
                <span>{item.出版者 || '-'}</span>
              </div>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">收录年份：</label>
                <span dangerouslySetInnerHTML={{__html: RestTools.translateToRed(item.收录年份 || '-')}} />
              </div>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">编辑说明：</label>
                <span>{item.编辑说明 || '-'}</span>
              </div>
            </div>
          </div>
        ))
      : null;

  return (
    <div className={styles.Statistics}>
      {intentDomain === '年鉴名录' ? nianjianminglu : null}

      <a
        style={{
          display: 'block',
          textAlign: 'right',
          color: '#999',
          fontSize: 14,
          paddingTop: 10
        }}
        href="http://data.cnki.net/Yearbook"
        target="_blank"
        rel="noopener noreferrer"
      >
        统计年鉴知识库
      </a>

      <div className={styles.Journal_evaluate}>
        <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
    </div>
  );
}
