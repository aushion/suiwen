import React from 'react';
import { List } from 'antd';
import RestTools from '../../../utils/RestTools';

function SgList(props) {
  const data = props.data;
  return (
    <div
      style={{
        boxShadow: '#a5a5a5 0 0 10.8px 0',
        marginBottom: 20,
        padding: 20,
        background: '#fff',
      }}
    >
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <div style={{ fontSize: 16, color: '#047FEA', fontWeight: 'bold', paddingBottom: 10 }}>
              {item.Data.title}
            </div>
            <div
              style={{ color: 'rgba(0,0,0,.65)', letterSpacing: '2px' }}
              dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.Data.answer) }}
            />
            <div style={{ textAlign: 'right', paddingRight: 10, color: '#666' }}>
              {item.Data.source_type}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}

export default SgList;
