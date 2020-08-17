import { Collapse, Button } from 'antd';
import Link from 'umi/link';
const { Panel } = Collapse;

export default function MyAnswerList(props) {
  const { data, from = true } = props;
  return (
    <div style={{ padding: '10px 0' }}>
      <div>共{data && data.total}条</div>
      <Collapse>
        {data
          ? data.data.map((item, index) => {
              return (
                <Panel
                  showArrow={false}
                  header={item.question}
                  key={index}
                  extra={<div style={{ cursor: 'pointer' }}>查看回答</div>}
                >
                  {item.answerList.map((child) => {
                    return (
                      <div>
                        <p dangerouslySetInnerHTML={{ __html: child.answer }} />
                        {from ? <div>来自：{child.domain}</div> : null}

                        <div dangerouslySetInnerHTML={{ __html: child.resource }} />
                        {child.status === 0 ? (
                          <Link to={`/reply?q=${child.question}&QID=${child.qid}&aid=${child.aid}`}>
                            <Button type="primary" size="small" ghost>
                              编辑答案
                            </Button>
                          </Link>
                        ) : null}
                      </div>
                    );
                  })}
                </Panel>
              );
            })
          : null}
      </Collapse>
    </div>
  );
}
