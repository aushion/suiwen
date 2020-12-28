import React, { useState } from 'react';
import RestTools from '../../utils/RestTools';
import arrow_up from '../../assets/arrow_up.png';
import arrow_down from '../../assets/arrow_down.png';
import styles from './index.less';

function FoldText({ originText, fullText = null, style = null }) {
  let fullTextWithIcon = fullText
    ? fullText +
      `<a class="up" style="color:#2090E3">  收起<img class="up" style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_up}"></a>`
    : null;
  let originTextWithIcon = fullText
    ? originText +
      `<a class="more" style="color:#2090E3">  更多<img class="more" style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_down}"></a>`
    : originText;

  const [text, updateText] = useState(originTextWithIcon);
  const [pageYOffset, setPageYOffest] = useState(0); //默认滚动条移动距离

  function handleClick(e) {
    if (e.target.className === 'more') {
      updateText(fullTextWithIcon);
      setPageYOffest(window.pageYOffset); //存储滚动条位置
    } else if (e.target.className === 'up') {
      updateText(originTextWithIcon);
      window.scrollTo({ top: pageYOffset }); //回到原来的滚动条位置
    }
  }

  return (
    <div
      className={styles.fontStyle}
      style={style}
      onClick={(e) => handleClick(e)}
      dangerouslySetInnerHTML={{ __html: RestTools.superMarkRed(RestTools.translateToRed(text)) }}
    />
  );
}

export default FoldText;
