import { useState } from 'react';
import { Modal } from 'antd';
import RestTools from '../../../utils/RestTools';
import Evaluate from './Evaluate';
import styles from './Graphic.less';

function Graphic(props) {
  const { data, intentFocus, title, evaluate = null, id, domain, intentJson } = props;
  const { good = null, bad = null, isevalute = null } = evaluate || {};
  const [visible, setVisible] = useState(false);
  const [initialText, setText] = useState('');
  function showMore(text) {
    setVisible(true);
    setText(text);
  }
  return (
    <div className={styles.Graphic}>
      {domain === '翻译' ? (
        <div>
          <div style={{ color: '#2f8bd6', fontSize: 20, paddingBottom: 10 }}>
            {intentJson.results[0].fields['词汇']}
          </div>
          <div style={{ textAlign: 'right' }}>
            <a
              style={{
                color: 'rgb(153, 153, 153)'
              }}
              target="_blank"
              rel="noopener noreferrer"
              href={`http://dict.cnki.net/dict_result.aspx?searchword=${encodeURIComponent(
                intentJson.results[0].fields['词汇']
              )}`}
            >
              试试CNKI翻译助手
            </a>
          </div>
        </div>
      ) : domain === '最美四季' ? (
        <div style={{padding: '10px'}}>
          {data.map((item, index) => {
            return (
              <div key={index} style={{padding: '10px'}}>
               {intentFocus === '省份'? <div>地点：{item[intentFocus]}</div>:null}
                <div>景点：{item.景点}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div style={{ color: '#2f8bd6', fontSize: 20, paddingBottom: 10 }}>{title}</div>
          {data.map((item, index) => {
            let oldAnswer = item.hasOwnProperty('Answer') ? item.Answer : item[intentFocus];
            let answer = oldAnswer.substring(0, 300);
            return (
              <div key={index}>
                {item.hasOwnProperty('Title') ? (
                  <h3
                    dangerouslySetInnerHTML={{
                      __html: `《${RestTools.translateToRed(item.Title)}》`
                    }}
                  ></h3>
                ) : null}
                <div
                  style={{
                    letterSpacing: '2px',
                    lineHeight: '27.2px',
                    textIndent: '2em',
                    color: 'rgb(51, 51, 51)'
                  }}
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html: RestTools.translateToRed(RestTools.UnicodeToAscii(answer))
                  }}
                />
                {oldAnswer.length > 300 ? (
                  <div
                    className={styles.more}
                    onClick={showMore.bind(this, oldAnswer.substring(300))}
                  >
                    显示更多>>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
      <div></div>
      <div>
        {evaluate ? (
          <Evaluate id={id} goodCount={good} badCount={bad} isevalute={isevalute} />
        ) : null}
      </div>
      <Modal
        visible={visible}
        footer={null}
        style={{ top: 40, left: '29%' }}
        onCancel={() => {
          setVisible(false);
        }}
      >
        <div
          style={{
            // width: 400,
            paddingTop: 10,
            color: '#333',
            letterSpacing: '2px',
            lineHeight: '27.2px',
            textIndent: '2em'
          }}
          // className={styles.fontStyle}
          dangerouslySetInnerHTML={{
            __html: RestTools.translateToRed(RestTools.formatText(initialText))
          }}
        />
      </Modal>
    </div>
  );
}

export default Graphic;
