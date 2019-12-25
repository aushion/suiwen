import { List } from 'antd';
import RestTools from '../../../utils/RestTools';

function RelatedLiteraure(props) {
  const { data, q } = props;
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 400, color: '#333' }}>相关文献</div>
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div>
              <a
                style={{
                  fontSize: 14,
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={RestTools.removeFlag(item.TITLE)}
                href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=${item.文件名}`}
                dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.TITLE) }}
              />
            </div>
            <div
              style={{
                width: '100%',
                color: '#999',
                fontSize: 12,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ display: 'inline-block', marginRight: 10 }}>{item.作者}</span>
              <span style={{ display: 'inline-block', marginRight: 10 }}>{item.来源}</span>
              <span>{item.出版日期}</span>
            </div>
          </List.Item>
        )}
      />
      <a
        style={{ textAlign: 'right', display: 'block' }}
        href={`http://kns.cnki.net/kns/brief/Default_Result.aspx?code=SCDB&kw=${q}&korder=0&sel=1`}
        target="_blank"
        rel="noopener noreferrer"
      >
        更多文献>>
      </a>
    </div>
  );
}

export default RelatedLiteraure;
