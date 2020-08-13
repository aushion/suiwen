import React, { useState, useEffect } from 'react';
import { Descriptions } from 'antd';
import axios from 'axios';
import RestTools from 'Utils/RestTools'

import styles from './index.less';

function Weather(props) {
  const {dataNode} = props.weatherData;
  const {城市} = dataNode[0];
  const [data, setWeather] = useState(null);
  useEffect(() => {
    axios
      .get(`https://free-api.heweather.com/s6/weather/now`, {
        params: {
          key: '2502052d9d4f41878b85fa75635be718',
          tdsourcetag: 's_pcqq_aiomsg',
          location: RestTools.removeFlag(城市)
        },
        
      })
      .then((res) => {
        setWeather(res.data.HeWeather6[0]);
      });
  }, [城市]);

  return (
    <div className={styles.weather}>
      {data ? (
        <div>

        <Descriptions title={`${data.basic.location}`}>
          <Descriptions.Item label="天气">
            <img
              style={{ width: 24, height: 24 }}
              src={require(`@assets/weather/${data.now.cond_code}.png`)}
              alt="sss"
            />
            {data.now.cond_txt}
          </Descriptions.Item>
          <Descriptions.Item label="温度">{data.now.tmp}℃</Descriptions.Item>
          <Descriptions.Item label="体感温度">{data.now.fl}℃</Descriptions.Item>
          <Descriptions.Item label="风力">{data.now.wind_sc}</Descriptions.Item>
          <Descriptions.Item label="风向">{data.now.wind_dir}</Descriptions.Item>
          <Descriptions.Item label="降水量">{data.now.pcpn}</Descriptions.Item>
          <Descriptions.Item label="相对湿度">{data.now.hum}</Descriptions.Item>
          <Descriptions.Item label="能见度">{data.now.vis}公里</Descriptions.Item>
        </Descriptions>
        <div style={{textAlign: 'right'}}>数据来源：<a href="https://www.heweather.com/" target="_blank" rel="noreferrer">和风天气</a></div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Weather;
