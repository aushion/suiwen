import React from 'react';
import Evaluate from '../Evaluate';
import styles from './index.less';
import RestTools from '../../../../utils/RestTools';

function Poem(props) {
  const { id, dataNode, evaluate, intentJson } = props.data;
  const { good, bad, isevaluate } = evaluate;
  const more =
    intentJson.results[0].fields['诗词名称'] ||
    intentJson.results[0].fields['作者'] ||
    intentJson.results[0].fields['年代'];

  return (
    <div className={styles.poem}>
      {dataNode.length
        ? dataNode.map((item, index) => {
            const { 诗词名称, 诗文, 作者, 年代 } = item;
            return (
              <div key={index} className={styles.poem_item}>
                <div
                  className={styles.poem_title}
                  dangerouslySetInnerHTML={{ __html: `《${RestTools.translateToRed(诗词名称)}》` }}
                />
                <div
                  className={styles.poem_author}
                  dangerouslySetInnerHTML={{
                    __html: `${RestTools.translateToRed(作者)} ● ${RestTools.translateToRed(年代)}`
                  }}
                />
                <div
                  className={styles.poem_content}
                  dangerouslySetInnerHTML={{ __html: `${RestTools.translateToRed(诗文)}` }}
                />
              </div>
            );
          })
        : null}
      <div className={styles.more}>
        <a
        style={{ color: '#999',  }}
          target="_blank"
          rel="noopener noreferrer"
          href={`http://gongjushu.cnki.net/RBook/Search/SimpleSearch?range=TOTAL&opt=0&key=${encodeURIComponent(
            more
          )}`}
        >
          {`更多关于${more}`}的诗词
        </a>
      </div>
      <div>
        <Evaluate id={id} goodCount={good} badCount={bad} isevaluate={isevaluate} />
      </div>
    </div>
  );
}

export default Poem;
