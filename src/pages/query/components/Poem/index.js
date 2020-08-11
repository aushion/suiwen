import React, { useState } from 'react';
import Evaluate from '../Evaluate';
import styles from './index.less';
import RestTools from '../../../../utils/RestTools';
import arrow_up from '../../../../assets/arrow_up.png';
import arrow_down from '../../../../assets/arrow_down.png';

function Poem(props) {
  const { id, dataNode, evaluate, intentJson } = props.data;
  const { good, bad, isevaluate } = evaluate;
  const more =
    intentJson.results[0].fields['诗词名999999999999999999999999999'] ||
    intentJson.results[0].fields['作者'] ||
    intentJson.results[0].fields['年代'];
  const [pageYoffset, setPageYOffest] = useState(0);
  const [data, setData] = useState(dataNode)

  function handleShowMore(e, item, index) {
    if (e.target.className === 'showMore') {
      setPageYOffest(window.pageYOffset);
      let newItem = {
        ...item,
        originContext:
          item.原文 +
          ` <a class="up"> 收起<img style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_up}" alt=""/></a>`
      };
      let newData = {
        ...dataNode
      };
      newData[index] = newItem;
      setData(newData);
    } else if (e.target.className === 'up') {
      window.scrollTo({ top: pageYoffset });
      let newItem = {
        ...item,
        originContext:
          RestTools.subHtml(item.原文, 300, false) +
          `<a class="showMore"> 更多<img style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_down}" alt=""/></a>`
      };
      let newData = {
        ...dataNode
      };
      newData[index] = newItem;
      setData(newData);
    }
  }

  function handleStr(str) {
    return str && str.length > 300
      ? RestTools.subHtml(str, 300, false) +
          `<a class="showMore"> 更多<img style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_down}" alt=""/></a>`
      : str;
  }

  return (
    <div className={styles.poem}>
      {data.length
        ? data.map((item, index) => {
            const { 诗词名称 = '', 作者 = '', 年代 = '', 诗词名 = '', 原文 = '' } = item;
            let str = item.originContext ? item.originContext : handleStr(原文);
            return (
              <div key={index} className={styles.poem_item}>
                <div
                  className={styles.poem_title}
                  dangerouslySetInnerHTML={{
                    __html: `《${RestTools.translateToRed(诗词名称 || 诗词名)}》`
                  }}
                />
                {作者 && 年代 ? (
                  <div
                    className={styles.poem_author}
                    dangerouslySetInnerHTML={{
                      __html: `${RestTools.translateToRed(作者)} ● ${RestTools.translateToRed(
                        年代
                      )}`
                    }}
                  />
                ) : null}
                <div
                  className={styles.poem_content}
                  onClick={(e) => handleShowMore(e, item, index)}
                  dangerouslySetInnerHTML={{
                    __html: `${RestTools.completeToolsBook(RestTools.translateToRed(str))}`
                  }}
                />
              </div>
            );
          })
        : null}
      {more ? (
        <div className={styles.more}>
          <a
            style={{ color: '#999' }}
            target="_blank"
            rel="noopener noreferrer"
            href={`http://gongjushu.cnki.net/RBook/Search/SimpleSearch?range=TOTAL&opt=0&key=${encodeURIComponent(
              more
            )}`}
          >
            {`更多关于${more}`}的诗词
          </a>
        </div>
      ) : null}
      <div>
        <Evaluate id={id} goodCount={good} badCount={bad} isevaluate={isevaluate} />
      </div>
    </div>
  );
}

export default Poem;
