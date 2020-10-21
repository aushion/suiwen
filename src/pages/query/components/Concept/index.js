import React from 'react';
import { find } from 'lodash';
import RestTools from '../../../../utils/RestTools';
import styles from './index.less';

function Concept({ data, intentJson }) {
  const { results } = intentJson;
  const [result] = results;
  const { 概念 = '' } = result.fields;

  console.log('data', Array.isArray(data));
  const conceptTypes = Array.isArray(data) ? [] : data.Classifys;
  const conceptContent = Array.isArray(data) ? data : null;
  const basicContent = Array.isArray(data) ?  null : find(data.Terms, { 属性类型: '基本定义' });
  return (
    <div className={styles.concept}>
      <h2>
        <a
          href={`https://concept.cnki.net/search_attribute.aspx?w=${概念}`}
          rel="noreferrer"
          target="_blank"
        >
          <span>{概念} </span>
        </a>
        - 知网知识元库
      </h2>
      <div className={styles.card}>
        {basicContent ? (
          <div className={styles.content}>
            <div
              dangerouslySetInnerHTML={{
                __html: RestTools.translateToRed(basicContent.属性句子)
              }}
            />
            <div className={styles.source}>
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=${RestTools.sourceDb['期刊']}&filename=${basicContent.文件名}`}
              >
                <span style={{ color: '#999' }}>来源：</span>
                {basicContent.中英文篇名 ? <span>{basicContent.中英文篇名}</span> : null}

                {basicContent.来源 ? <span>.{basicContent.来源}</span> : null}
                {basicContent.更新日期 ? <span>.{basicContent.更新日期}</span> : null}
              </a>
            </div>
          </div>
        ) : null}
        {conceptTypes.length ? (
          <div>
            {conceptTypes.map((item) => (
              <a
                className={styles.item}
                key={item}
                href={`https://concept.cnki.net/search_attribute.aspx?w=${概念}`}
                rel="noreferrer"
                target="_blank"
              >
                {item}
              </a>
            ))}
          </div>
        ) : null}
        {conceptContent ? (
          <ol>
            {conceptContent.map((item, index) => (
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
                    {item.更新日期 ? <span>.{item.更新日期}</span> : null}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        ) : null}

        <a
          className={styles.more}
          rel="noreferrer"
          target="_blank"
          href={`https://concept.cnki.net/search_result.aspx?w=${概念}`}
        >
          查看更多
        </a>
      </div>
    </div>
  );
}

export default Concept;
