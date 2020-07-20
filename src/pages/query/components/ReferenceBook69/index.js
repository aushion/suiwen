import styles from './index.less';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';

function ReferenceBook69(props) {
  const { data, id, evaluate, title, intentDomain } = props;
  const { good, bad, isevalute } = evaluate;

  function cutAnswer(str, code) {
    if (str) {
      // if (str.length > 300) {
      return (
        RestTools.subHtml(str, 300, false) +
        '<a href="http://gongjushu.cnki.net/refbook/detail.aspx?recid=' +
        code +
        '&db=crfd"' +
        'target="_blank"' +
        'rel="noopener noreferrer"' +
        'style="white-space:nowrap"' +
        '> 查看全文>>' +
        '</a>'
      );
      // } else {
      //   return str;
      // }
    }
    return '-';
  }

  function handleAnswer(str) {
    let answerArray = str.toString().split(/【(.*?)】/);
    let answerObj = {};
    const answerProp = ['生态习性', '生长习性', '习性'];

    if (answerArray.length) {
      answerObj['front'] = answerArray[0];
      for (let i = 1; i < answerArray.length - 1; i++) {
        answerObj[answerArray[i]] = answerArray[i + 1];
      }
      const answerKey = answerProp.filter((item) => answerObj[item]);
      return answerKey.length ? `【###${answerKey}$$$】：${answerObj[answerKey]}` : str;
    }

  }

  return (
    <div className={styles.ReferenceBook}>
      {data.map((item, index) => {
        const title = item.植物名称 || item.Title;
        const answer = handleAnswer(item.Answer || item.植物介绍);

        return (
          <div key={item.工具书编号 + index}>
            <div
              className={styles.ReferenceBook_title}
              dangerouslySetInnerHTML={{
                __html: RestTools.translateToRed(title)
              }}
            />
            <div
              key={item.工具书编号 + index}
              className={styles.ReferenceBook_answer}
              dangerouslySetInnerHTML={{
                __html: RestTools.translateToRed(
                  RestTools.completeToolsBook(cutAnswer(answer), intentDomain)
                )
              }}
            />
            <div className={styles.ReferenceBook_extra}>
              <a
                className={styles.ReferenceBook_name}
                target="_blank"
                rel="noopener noreferrer"
                href={`http://gongjushu.cnki.net/refbook/${RestTools.removeFlag(
                  item.工具书编号
                )}.html`}
                dangerouslySetInnerHTML={{
                  __html: `《${RestTools.removeFlag(item.工具书名称 || item.Title || item.TITLE)}》`
                }}
              />
            </div>
          </div>
        );
      })}
      <div style={{ textAlign: 'right' }}>
        <a
          className={styles.ReferenceBook_more}
          href={`http://gongjushu.cnki.net/RBook/Search/SimpleSearch?range=TOTAL&opt=0&key=${encodeURIComponent(
            RestTools.removeFlag(data[0].TITLE || data[0].Title || '-')
          )}&c=crfdsearch`}
          target="_blank"
          rel="noopener noreferrer"
          dangerouslySetInnerHTML={{
            __html: `更多“${RestTools.removeFlag(title || '-')}”的工具书`
          }}
        />
      </div>
      <div className={styles.ReferenceBook_evaluate}>
        <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
    </div>
  );
}

export default ReferenceBook69;
