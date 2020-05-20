import { List } from 'antd';
import styles from './index.less';
import face from '../../../../assets/face.gif';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';
import querystring from 'querystring';

export default function Scholar(props) {
  const { data, id, evaluate, intentJson } = props;
  const { good, bad, isevalute } = evaluate;
  const { fields } = intentJson.results[0];
  const linkKey = {
    学者名: 'nmv',
    学者单位: 'ut',
    研究领域: 'dn',
    主题: 'dn'
  };
  const resultKey = Object.keys(fields);
  const filterKey = resultKey.filter((item) => linkKey[item]);
  let paramObj = {};
  filterKey.forEach((item) => {
    paramObj[linkKey[item]] = RestTools.removeFlag(fields[item]);
  });
  const paramString = querystring.stringify(paramObj);
  return (
    <div className={styles.Scholar}>
      <List
        dataSource={data}
        itemLayout="vertical"
        renderItem={(item) => {
          const relatedLiterature = item.literature
            ? item.literature.map((item, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: 13,
                    width: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <a
                    href={`http://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${
                      RestTools.sourceDb[item.来源数据库]
                    }&filename=${item.文件名}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      // textDecoration: 'underline',
                      verticalAlign: 'middle',
                      padding: '4px 0',
                      width: '40%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'inline-block'
                    }}
                  >
                    {item.题名}
                  </a>
                  <span style={{ padding: '4px 10px', overflow: 'hidden', color: '#666' }}>
                    {item.出版日期.substr(0, 10)}
                  </span>
                  {/* <span style={{ padding: '4px 20px', color: '#666' }}>{item.作者}</span> */}
                  <span
                    style={{
                      padding: '4px 0',
                      color: '#666',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.来源}
                  </span>
                </div>
              ))
            : null;
          return (
            <List.Item>
              <div className={styles.Scholar_pic}>
                <img style={{ verticalAlign: 'text-top' }} src={face} alt={item.学者名} />
              </div>
              <div className={styles.Scholar_info}>
                <div className={styles.Scholar_info_item}>
                  <a
                    style={{ display: 'inline-block', marginRight: 10 }}
                    target="_blank"
                    rel="noopener noreferrer"
                    dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(item.学者名) }}
                    href={`http://kns.cnki.net/kcms/detail/knetsearch.aspx?sfield=au&skey=${encodeURIComponent(
                      RestTools.removeFlag(item.学者名)
                    )}&code=${item.学者代码}`}
                  />

                  <span
                    dangerouslySetInnerHTML={{
                      __html: RestTools.translateToRed(item.学者单位 || '-')
                    }}
                  />
                </div>
                {item.研究领域 && (
                  <div className={styles.Scholar_info_item}>
                    <label>研究领域：</label>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.研究领域 || '-')
                      }}
                    />
                  </div>
                )}
                {item.研究方向 && (
                  <div className={styles.Scholar_info_item}>
                    <label>研究方向：</label>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.研究方向 || '-')
                      }}
                    />
                  </div>
                )}

                {item.学者职称 && (
                  <div className={styles.Scholar_info_item}>
                    <label>学者职称：</label>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.学者职称 || '-')
                      }}
                    />
                  </div>
                )}

                {item.文献篇数 && (
                  <div className={styles.Scholar_info_item}>
                    <label>成果数：</label>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: RestTools.translateToRed(item.文献篇数 || '-')
                      }}
                    />
                  </div>
                )}

                <div className={styles.Scholar_info_item}>
                  <label>下载数/被引数：</label>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: RestTools.translateToRed(item.下载频次 + '/' + item.被引频次)
                    }}
                  />
                </div>
                {item.literature ? (
                  <div className={styles.Scholar_info_item}>
                    <div>学者最新文献：</div>
                    {relatedLiterature}
                  </div>
                ) : null}
              </div>
            </List.Item>
          );
        }}
      />
      <a
        className={styles.Scholar_more}
        target="_blank"
        rel="noopener noreferrer"
        href={`http://papers.cnki.net/Search/Search.aspx?ac=result&sm=0&${paramString}`}
      >
        CNKI学者成果库
      </a>
      <div className={styles.Scholar_evaluate}>
        <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
    </div>
  );
}
