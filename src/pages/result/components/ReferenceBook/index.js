import styles from './index.less';
import RestTools from '../../../../utils/RestTools';
import Evaluate from '../Evaluate';

function ReferenceBook(props) {
  const { data, id, evaluate, title, domain } = props;
  const { good, bad, isevalute } = evaluate;

  function handleAnswer(str, code) {
    if (str) {
      return (
        str.replace(/<{1}[^<img|br|a>]*>{1}/g, '').substr(0, 300) +
        '<a href="http://192.168.103.24/qa.web/query/link?id=' +
        code +
        '&db=crfd"' +
        'target="_blank"' +
        'rel="noopener noreferrer"' +
        'style="white-space:nowrap"' +
        '> 查看全文>>' +
        '</a>'
      );
    }
    return '-';
  }

  return (
    <div className={styles.ReferenceBook}>
      {/* <div
        className={styles.ReferenceBook_title}
        dangerouslySetInnerHTML={{
          __html: RestTools.translateToRed(data[0].TITLE || data[0].Title)
        }}
      /> */}
      {data.map((item) => (
        <div key={item.工具书编号}>
          <div
            className={styles.ReferenceBook_title}
            dangerouslySetInnerHTML={{
              __html: RestTools.translateToRed(item.TITLE || item.Title || '-')
            }}
          />
          <div
            key={item.工具书编号}
            className={styles.ReferenceBook_answer}
            dangerouslySetInnerHTML={{
              __html:
                RestTools.translateToRed(
                  RestTools.completeToolsBook(
                    handleAnswer(item.Answer || item.介绍 || '-', item.条目编码)
                  )
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
              dangerouslySetInnerHTML={{ __html: '--' + RestTools.removeFlag(item.工具书名称) }}
            />
          </div>
        </div>
      ))}
      <a
        className={styles.ReferenceBook_more}
        href={
          domain === '翻译'
            ? `http://dict.cnki.net/dict_result.aspx?searchword=${RestTools.removeFlag(
                data[0].TITLE || data[0].Title || '-'
              )}`
            : `http://192.168.103.24/qa.web/query/linknavi?kw=${RestTools.removeFlag(
                data[0].TITLE || data[0].Title || '-'
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
      ></a>
      <div className={styles.ReferenceBook_evaluate}>
        <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
      </div>
    </div>
  );
}

export default ReferenceBook;
