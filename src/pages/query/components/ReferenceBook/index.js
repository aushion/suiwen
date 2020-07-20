
import styles from './index.less';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';


function ReferenceBook(props) {
  const { data, id, evaluate, title, domain, intentFocus, intentDomain } = props;
  const { good, bad, isevalute } = evaluate;

  function handleAnswer(str, code) {
    if (str) {
      if (str.length > 300) {
        return (
          RestTools.subHtml(str, 300, false) +
          '<a href="http://gongjushu.cnki.net/refbook/detail.aspx?recid=' +
          code +
          '&db=crfd"' +
          'target="_blank"' +
          'rel="noopener noreferrer"' +
          'style="white-space:nowrap;border-radius:20px;background-color:#3A83EC;color:#fff;font-size:12px;padding:2px 4px;"' +
          '> 查看全文' +
          '</a>'
        );
      } else {
        return str;
      }
    }
    return '-';
  }

  return (
    <div className={`${styles.ReferenceBook} reference`} >
      {data.map((item, index) => {
        const answer =
          intentFocus === '谜语'
            ? `谜底：${handleAnswer(item.Answer || item.介绍 || '-', item.条目编码)}`
            : handleAnswer(item.Answer || item.介绍 || '-', item.条目编码);
        const title =
          intentFocus === '谜语'
            ? `谜面: ${item.TITLE || item.Title || '-'}`
            : `${item.TITLE || item.Title || '-'} ${item.条目拼音 || ''}`;


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
                __html: RestTools.translateToRed(RestTools.completeToolsBook(answer, intentDomain, domain))
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
                  __html: `来源:《${RestTools.removeFlag(item.工具书名称 || item.Title || item.TITLE)}》`
                }}
              />
            </div>
          </div>
        );
      })}
      <div style={{ textAlign: 'right' }}>
        <a
          className={styles.ReferenceBook_more}
          href={
            domain === '翻译'
              ? `http://dict.cnki.net/dict_result.aspx?searchword=${encodeURIComponent(
                  RestTools.removeFlag(data[0].TITLE || data[0].Title || '-')
                )}`
              : intentFocus === '成语'
              ? `http://gongjushu.cnki.net/rbook/`
              : `http://gongjushu.cnki.net/RBook/Search/SimpleSearch?range=TOTAL&opt=0&key=${encodeURIComponent(
                  RestTools.removeFlag(data[0].TITLE || data[0].Title || '-')
                )}&c=crfdsearch`
          }
          target="_blank"
          rel="noopener noreferrer"
          dangerouslySetInnerHTML={{
            __html:
              domain === '翻译'
                ? 'CNKI翻译助手'
                : `更多“${RestTools.removeFlag(title || '-')}”的工具书`
          }}
        />
      </div>
      <div className={styles.ReferenceBook_evaluate}>
        <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
   
    </div>
  );
}

export default ReferenceBook;
