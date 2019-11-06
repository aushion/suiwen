import React, { useState } from 'react';
import { Descriptions } from 'antd';
import RestTools from '../../../utils/RestTools';
import Label from './Label';

export default function Institute(props) {
  let {
    主管部门,
    // 图片路径,
    学校类别,
    学校级别,
    成立日期,
    机构名称,
    电子邮箱,
    电话号码,
    简介,
    行政区编码,
    通讯地址,
  } = props.data;

  const [desc, setDesc] = useState(简介.slice(0, 100));
  return (
    <Descriptions
      style={{
        background: '#fff',
        marginBottom: 20,
        padding: '20px',
        boxShadow: '#a5a5a5 0 0 10.8px 0',
      }}
      layout="horizontal"
      title={<div dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(机构名称) }}></div>}
    >
      <Descriptions.Item span={3} label={<Label text="主管部门" />}>
        {主管部门}
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="学校类别" />}>
        {学校类别}
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="学校级别" />}>
        {学校级别}
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="成立日期" />}>
        {成立日期}
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="电子邮箱" />}>
        {电子邮箱}
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="电话号码" />}>
        {电话号码}
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="行政区编码" />}>
        {行政区编码}
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="通讯地址" />}>
        {通讯地址}
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="简介" />}>
        {desc}
        <span
          style={{ cursor: 'pointer', color: 'blue', marginLeft: 10 }}
          onClick={() => {
            setDesc(desc.length === 100 ? 简介 : desc.slice(0, 100));
          }}
        >
          {desc.length === 100 ? '查看更多' : '收起'}
        </span>
      </Descriptions.Item>
    </Descriptions>
  );
}
