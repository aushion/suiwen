import React from 'react';
import { List } from 'antd';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';

export default function Literature(props) {
  const { data, id, evaluate } = props;
  const { good, bad, isevalute } = evaluate;
  const spanStyle = {
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  };
  return (
    <List
      style={{ background: '#fff', marginBottom: 20, boxShadow: '#a5a5a5 0 0 10.8px 0' }}
      bordered
      footer={
        <div>
          <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
        </div>
      }
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
          <a
            style={Object.assign({}, spanStyle, { width: '45%' })}
            dangerouslySetInnerHTML={{
              __html: RestTools.translateToRed(item.题名)
            }}
            href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${item.文件名}`}
            target="_blank"
            rel="noopener noreferrer"
          />
          <span>被引：{item.下载频次}</span>
          <span>{item.来源数据库}</span>
          <span>{item.出版日期}</span>
          <span title={item.作者} style={Object.assign({}, spanStyle, { width: '10%' })}>
            {item.作者}
          </span>
        </List.Item>
      )}
    />
  );
}
