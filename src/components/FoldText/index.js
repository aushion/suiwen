import React, { useState } from 'react';
import RestTools from '../../utils/RestTools';
import arrow_up from '../../assets/arrow_up.png';
import arrow_down from '../../assets/arrow_down.png';
import styles from './index.less';

function FoldText({ originText, fullText = null }) {
  let fullTextWithIcon = fullText
    ? fullText +
      `<a class="up" style="color:#2090E3">  收起<img class="up" style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_up}"></a>`
    : null;
  let originTextWithIcon = fullText
    ? originText +
      `<a class="more" style="color:#2090E3">  更多<img class="up" style="width:14px;height:8px;margin-bottom:3px;" src="${arrow_down}"></a>`
    : originText;

  const [text, updateText] = useState(originTextWithIcon);

  function handleClick(e) {
    if (e.target.className === 'more') {
      updateText(fullTextWithIcon);
    } else {
      updateText(originTextWithIcon);
    }
  }

  return (
    <div
      className={styles.fontStyle}
      onClick={(e) => handleClick(e)}
      dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(text) }}
    />
  );
}

export default FoldText;
