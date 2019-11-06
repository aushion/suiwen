import React from 'react';
import { Descriptions } from 'antd';
import Label from './Label';
import RestTools from '../../../utils/RestTools';

const HISTORYKEY = RestTools.HISTORYKEY
export default function Project(props) {
  const {
    // 唯一编码 = '-',
    承担单位,
    // 用户编码 = '-',
    负责人 = '-',
    项目关键词 = '-',
    项目名称 = '-',
    项目批准号 = '-',
    项目立项时间 = '-',
    项目类别 = '-',
    项目经费 = '-',
  } = props.data;

  function projectClick(q,type) {
    if (q === '-') return;
    RestTools.setStorageInput(HISTORYKEY, q)
    window.location.href = window.location.href.split('?')[0] + `?q=${q}&topic=${type}`;
  }

  return (
    <Descriptions
      style={{
        background: '#fff',
        padding: '20px',
        boxShadow: '#a5a5a5 0 0 10.8px 0',
        marginBottom: 10,
      }}
      layout="horizontal"
      title={
        <div
          style={{ color: '#047AE8', fontWeight: 'bold' }}
          dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(项目名称) }}
        ></div>
      }
    >
      <Descriptions.Item span={3} label={<Label text="承担单位" />}>
        <span
          style={{ cursor: 'pointer', color: 'rgb(4, 122, 232)' }}
          onClick={projectClick.bind(this, 承担单位.replace(/###/g, '').replace(/\$\$\$/g, ''), 'KJJG')}
          dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(承担单位) }}
        ></span>
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="负责人" />}>
        <span
          style={{ cursor: 'pointer', color: 'rgb(4, 122, 232)' }}
          onClick={projectClick.bind(this, 负责人.replace(/###/g, '').replace(/\$\$\$/g, ''), 'KJRC')}
          dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(负责人) }}
        ></span>
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="项目关键词" />}>
        <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(项目关键词) }}></span>
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="项目批准号" />}>
        {项目批准号}
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="项目立项时间" />}>
        {项目立项时间}
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="项目类别" />}>
        <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(项目类别) }}></span>
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="项目经费" />}>
        {项目经费}
      </Descriptions.Item>
      {/* <Descriptions.Item span={3} label={<Label text="用户编码" />}>
        {用户编码}
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="唯一编码" />}>
        {唯一编码}
      </Descriptions.Item> */}
    </Descriptions>
  );
}
