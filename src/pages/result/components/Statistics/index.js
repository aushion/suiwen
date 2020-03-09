import React from 'react';
import { Chart, Geom, Axis, Tooltip, Label, Legend } from 'bizcharts';
import  flattenDeep  from 'lodash/flattenDeep';
import Evaluate from '../Evaluate';
import RestTools from 'Utils/RestTools';
import styles from './index.less';

export default function Statistics(props) {
  let { intentDomain, id, evaluate = {}, data=[] } = props;
  const { good = 0, bad = 0, isevalute = false } = evaluate;

  if(data.length && data[0].name) {
    data = data.map((item) => {
      item = item.fileds.map((current) => {
        return {
          key: current,
          value: item[current],
          name: item.name,
          unit: item.unit
        };
      });
      return item;
    });
    data = flattenDeep(data)
  }


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
      data[0].name ? (
        <div>
          <Chart height={400} data={data} forceFit>
            <Legend />
            <Axis name="key" />
            <Axis name="value" position={'left'} />
            <Tooltip />
            <Geom
              type="interval"
              position="key*value"
              color={['name']}
              adjust={[
                {
                  type: 'dodge',
                  marginRatio: 1 / 32
                }
              ]}
              tooltip={[
                'name*value*unit',
                (name, value, unit) => {
                  return {
                    name: name,
                    value: value + unit
                  };
                }
              ]}
            />
          </Chart>
        </div>
      ) : (
        <div>
          <Chart height={400} data={data} forceFit>
            <Axis name="prop" />
            <Axis name="value" />
            <Legend />
            <Tooltip />
            <Geom
              tooltip={[
                'prop*value*unit',
                (prop, value, unit) => {
                  return {
                    name: prop,
                    value: value + unit
                  };
                }
              ]}
              type="interval"
              position="prop*value"
              color="prop"
            >
              <Label
                content="value"
                offset={20} // 设置坐标轴文本 label 距离坐标轴线的距离
                textStyle={{
                  textAlign: 'center', // 文本对齐方向，可取值为： start middle end
                  fill: '#696969', // 文本的颜色
                  fontSize: '12', // 文本大小
                  textBaseline: 'top' // 文本基准线，可取 top middle bottom，默认为middle
                }}
                //textStyle={()=>{}}// 支持回调
                rotate={15}
                autoRotate={true} // 是否需要自动旋转，默认为 true
                formatter={(text, item, index) => {
                  return `${item.point.value}${item.point.unit}`;
                }} // 回调函数，用于格式化坐标轴上显示的文本信息
                // htmlTemplate= {()=>{}}, // 使用 html 自定义 label
              />
            </Geom>
          </Chart>
        </div>
      )
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
