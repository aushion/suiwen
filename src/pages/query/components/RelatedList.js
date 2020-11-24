import { List, Icon } from 'antd';
import Link from 'umi/link';
import RestTools from '../../../utils/RestTools';

function RelatedLiteraure(props) {
  const { data, q, title, focus, extra, topic } = props;
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

  const iconType = {
    相关文献: 'read',
    相关问题: 'question-circle',
    相关专利: 'file-protect'
  };
  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: 20,
        boxShadow: '#cecece 0 0 6px 0',
        marginBottom: 20
      }}
    >
      <div
        style={{
          fontSize: 16,
          paddingBottom: 10,
          fontWeight: 'bold',
          color: '#333',
          borderBottom: '1px solid #e6e6e6'
        }}
      >
        <Icon type={iconType[title]} style={{ fontSize: 16, marginRight: 6, color: '#f39b27' }} />
        {title}
      </div>
      <List
        itemLayout="vertical"
        dataSource={data.filter((item) => item !== q)}
        renderItem={(item) => (
          <List.Item style={focus === '问题' ? { border: 'none', padding: 8, }: {border: 'none'}}>
            <div>
              {focus === '问题' ? (
                <Link
                  style={{
                    fontSize: 14,
                    display: 'inline-block',
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={item[focus]}
                  to={
                    topic
                      ? `/query?q=${encodeURIComponent(item[focus])}&topic=${topic}`
                      : `/query?q=${encodeURIComponent(item[focus])}`
                  }
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
                  title={  RestTools.removeFlag(item[focus])}
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
                {item[extra.author] ? (
                  <span style={{ display: 'inline-block', marginRight: 10 }}>
                    {item[extra.author]}
                  </span>
                ) : null}
                {item[extra.source] ? (
                  <span
                    style={{ display: 'inline-block', marginRight: 10 }}
                    dangerouslySetInnerHTML={{
                      __html: RestTools.removeFlag(item[extra.source])
                    }}
                  />
                ) : null}
                <span>{item[extra.time]}</span>
              </div>
            ) : null}
          </List.Item>
        )}
      />
      {focus !== '问题' ? (
        <a
          style={{ textAlign: 'right', display: 'block', color: '#999', fontSize: 12 }}
          href={moreLink(title, q)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {'更多>>'}
        </a>
      ) : null}
    </div>
  );
}

export default RelatedLiteraure;
