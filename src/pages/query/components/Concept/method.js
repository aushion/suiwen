import React from 'react';

import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

function Concept({ data, attrs, intentJson }) {
  const { results } = intentJson;
  const [result] = results;
  const { 方法 = '' } = result.fields;

  const methodTypes = attrs ? attrs.AttrTypes : [];
  const methodContent = Array.isArray(data) ? data : null;
  return (
    <div className={styles.concept}>
      <h2>
        <a
          href={`https://method.cnki.net/ResultShow.aspx?term=${方法}&option=1`}
          rel="noreferrer"
          target="_blank"
        >
          <span>{方法} </span>
        </a>
        - 知网知识元方法库
      </h2>
      <div className={styles.card}>
        {methodContent ? (
          <ol>
            {methodContent.map((item, index) => (
              <li key={index}>
                <div style={{ paddingBottom: 6 }}>{item.属性句子}</div>
                <div className={styles.source}>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${
                      RestTools.sourceDb[item.资源类型]
                    }&filename=${item.文件名}`}
                  >
                    <span style={{ color: '#999' }}>来源：</span>
                    {item.中英文篇名 ? <span>{item.中英文篇名}</span> : null}

                    {item.中文刊名 ? <span>.{item.中文刊名}</span> : null}
                    {item.出版日期 ? <span>.{item.出版日期}</span> : null}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        ) : null}

        {methodTypes.length ? (
          <div className={styles.types}>
            {methodTypes.slice(0, 8).map((item) => (
              <a
                className={styles.item}
                key={item}
                href={`https://method.cnki.net/ResultShow.aspx?term=${方法}&option=1&attrType=${item}`}
                rel="noreferrer"
                target="_blank"
              >
                {item}
              </a>
            ))}
          </div>
        ) : null}
        {/* <a
          className={styles.more}
          rel="noreferrer"
          target="_blank"
          href={`https://method.cnki.net/SearchResult.aspx?keyword=${方法}&option=1`}
        >
          查看更多
        </a> */}
      </div>
    </div>
  );
}

export default Concept;
