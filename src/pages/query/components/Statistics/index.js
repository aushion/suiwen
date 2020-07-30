import React from 'react';
import { Table } from 'antd';
import Chart from 'bizcharts/lib/components/Chart';
import Axis from 'bizcharts/lib/components/Axis';
import Interval from 'bizcharts/lib/components/TypedGeom/Interval';
import Tooltip from 'bizcharts/lib/components/Tooltip';
import Coord from 'bizcharts/lib/components/Coord';
import Legend from 'bizcharts/lib/components/Legend';
import flattenDeep from 'lodash/flattenDeep';
import Evaluate from '../Evaluate';
import RestTools from 'Utils/RestTools';
import styles from './index.less';
const { Column } = Table;

export default function Statistics(props) {
  let { intentDomain, id, evaluate = {}, data = [], intentJson, title } = props;
  const { good = 0, bad = 0, isevalute = false } = evaluate;
  const fields = intentJson && intentJson.results[0].fields;

  if (data.length && data[0].name) {
    data = data.map((item) => {
      item = item.fileds.map((current) => {
        return {
          key: current.toString(),
          value: Number(item[current]),
          name: item.name,
          unit: item.unit
        };
      });
      return item;
    });
    data = flattenDeep(data);
  }

  function unitIsUnite(data) {
    const unitArray = data.map((item) => item.unit);
    return unitArray.every((item) => item === unitArray[0]);
  }

  const shuzhuwenda =
    data.length && intentDomain === '数值问答' ? (
      unitIsUnite(data) && data.length > 1 ? (
        data[0].name ? (
          <div>
            <Chart height={500} data={data} forceFit>
              <Legend />
              <Axis name="key" />
              <Axis name="value" position={'left'} />
              <Tooltip />
              <Interval
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
            <Chart height={500} data={data} forceFit>
              <Coord transpose />
              <Axis name="prop" label={{ autoRotate: true, rotate: 30 }} />
              <Axis name="value" />
              <Legend />
              <Tooltip />
              <Interval
                tooltip={[
                  'prop*value*unit',
                  (prop, value, unit) => {
                    return {
                      name: prop,
                      value: value + unit
                    };
                  }
                ]}
                position="prop*value"
                color="prop"
                // size="value"
                size={18}
              >
                {/* <Label
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
              /> */}
              </Interval>
            </Chart>
          </div>
        )
      ) : (
        <>
          <div
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              color: '#777',
              textAlign: 'left'
            }}
          >
            {title}
          </div>
          <Table dataSource={data} size="middle" rowKey="prop" pagination={false} bordered={false}>
            <Column
              title={fields['focus']}
              dataIndex="prop"
              render={(record) => (
                <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(record) }} />
              )}
            />
            <Column
              title={fields['指标']}
              key="value"
              render={(record) => {
                return <span>{`${record.value} (${record.unit})`}</span>;
              }}
            />
          </Table>
        </>
      )
    ) : null;

  return (
    <div className={styles.Statistics}>
      {intentDomain === '数值问答' ? shuzhuwenda : null}

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
