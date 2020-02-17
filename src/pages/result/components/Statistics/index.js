import React from 'react';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from 'bizcharts';

import Evaluate from '../Evaluate';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

export default function Statistics(props) {
  const { domain, intentId, intentDomain, intentFocus, data, id, evaluate } = props;
  const { good, bad, isevalute } = evaluate;

  const mockdata = [
    {
      year: '1951 年',
      sales: 38
    },
    {
      year: '1952 年',
      sales: 52
    },
    {
      year: '1956 年',
      sales: 61
    },
    {
      year: '1957 年',
      sales: 145
    },
    {
      year: '1958 年',
      sales: 48
    },
    {
      year: '1959 年',
      sales: 38
    },
    {
      year: '1960 年',
      sales: 38
    },
    {
      year: '1962 年',
      sales: 38
    }
  ];

  const cols = {
    sales: {
      tickInterval: 20
    }
  };

  const tongjikanwu =
    data.length && intentDomain === '统计刊物'
      ? data.map((item) => (
          <div key={item.ID} className={styles.Statistics_wrapper}>
            <div className={styles.Statistics_left}>
              <img
                src={`http://c61.cnki.net/cyfd/${item.编号}.jpg`}
                alt={RestTools.removeFlag(item.刊物)}
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
                <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.刊物) }} />
                {/* <span>{item.英文名}</span> */}
              </a>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">收录年份：</label>
                <span>{item.收录年份 || '-'}</span>
              </div>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">历任主编：</label>
                <span>{item.历任主编 || '-'}</span>
              </div>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">编撰机构：</label>
                <span>{item.主编单位 || '-'}</span>
              </div>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">出版社：</label>
                <span>{item.出版者 || '-'}</span>
              </div>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">出版地：</label>
                <span
                  dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.地区) || '-' }}
                />
              </div>
            </div>
          </div>
        ))
      : null;

  const nianjianminglu =
    data.length && intentDomain === '年鉴名录'
      ? data.map((item) => (
          <div key={item.ID} className={styles.Statistics_wrapper}>
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
                <span>{item.收录年份 || '-'}</span>
              </div>
              <div className={styles.Statistics_right_item}>
                <label htmlFor="">编辑说明：</label>
                <span>{item.编辑说明 || '-'}</span>
              </div>
            </div>
          </div>
        ))
      : null;

  const shuzhuwenda =
    data.length && intentDomain === '数值问答' ? (
      <div>
        <Chart height={400} data={mockdata} scale={cols} forceFit>
          <Axis name="year" />
          <Axis name="sales" />
          <Tooltip
            crosshairs={{
              type: 'y'
            }}
          />
          <Geom type="interval" position="year*sales" />
        </Chart>
      </div>
    ) : null;

  return (
    <div className={styles.Statistics}>
      {intentDomain === '数值问答' ? shuzhuwenda : null}
      {intentDomain === '年鉴名录' ? nianjianminglu : null}

      {intentDomain === '统计刊物' ? tongjikanwu : null}
      <a
        style={{ display: 'block', textAlign: 'right', color: '#999', fontSize: 14 }}
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
