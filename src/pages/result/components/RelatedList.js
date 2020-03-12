import { List, Icon } from 'antd';
import Link from 'umi/link';
import RestTools from '../../../utils/RestTools';

function RelatedLiteraure(props) {
  const { data, q, title, focus, extra } = props;
  function outLink(type, filename, source) {
    if (type === '相关文献') {
      return `http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${RestTools.sourceDb[source]}&filename=${filename}`;
    } else {
      return `http://dbpub.cnki.net/grid2008/dbpub/detail.aspx?dbcode=SCPD&dbname=SCPD&filename=${filename}`;
    }
  }

  function moreLink(type, q) {
    if (type === '相关文献') {
      return `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=SCDB&kw=${encodeURIComponent(
        q
      )}&korder=0&sel=1`;
    } else {
      return `http://kns.cnki.net/kns/brief/Default_Result.aspx?code=SCPD&kw=${encodeURIComponent(
        q
      )}&korder=0&sel=1`;
    }
  }
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
        <Icon type="read" style={{ fontSize: 16, marginRight: 6, color: '#f39b27' }} />
        {title}
      </div>
      <List
        itemLayout="vertical"
        dataSource={data.filter((item) => item !== q)}
        renderItem={(item) => (
          <List.Item>
            <div>
              {focus === '问题' ? (
                <Link
                  style={{
                    fontSize: 14,
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: '14px'
                  }}
                  to={`/result?q=${encodeURIComponent(item[focus])}`}
                >
                  {item[focus]}
                </Link>
              ) : (
                <a
                  style={{
                    fontSize: 14,
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={RestTools.removeFlag(item[focus])}
                  target="_blank"
                  rel="noopener noreferrer"
                  href={outLink(title, item.文件名, item.来源数据库)}
                  dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item[focus]) }}
                />
              )}
            </div>
            {extra ? (
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
                <span style={{ display: 'inline-block', marginRight: 10 }}>
                  {item[extra.author]}
                </span>
                <span style={{ display: 'inline-block', marginRight: 10 }}>
                  {item[extra.source]}
                </span>
                <span>{item[extra.time]}</span>
              </div>
            ) : null}
          </List.Item>
        )}
      />
      <a
        style={{ textAlign: 'right', display: 'block', color: '#999', fontSize: 12 }}
        href={moreLink(title, q)}
        target="_blank"
        rel="noopener noreferrer"
      >
        更多>>
      </a>
    </div>
  );
}

export default RelatedLiteraure;
