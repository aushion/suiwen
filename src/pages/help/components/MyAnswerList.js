import { Collapse, Button } from 'antd';
import Link from 'umi/link';
const { Panel } = Collapse;

export default function MyAnswerList(props) {
  const { data, from = true } = props;
  return (
    <div style={{ padding: '10px 0' }}>
      <div>共{data && data.total}条</div>
      <Collapse>
        {data?data.list.map((item, index) => {
          return (
            <Panel
              showArrow={false}
              header={item.question}
              key={index}
              extra={<div style={{ cursor: 'pointer' }}>查看回答</div>}
            >
              <p dangerouslySetInnerHTML={{ __html: item.answer }} />
              {from ? <div>来自：{item.domain}</div> : null}

              <div dangerouslySetInnerHTML={{ __html: item.resource }} />
              {item.status === 0 ? (
                <Link to={`/reply?q=${item.question}&QID=${item.qid}&aid=${item.aid}`}>
                  <Button type="primary" size="small" ghost>编辑答案</Button>
                </Link>
              ) : null}
            </Panel>
          );
        }):null}
      </Collapse>
    </div>
  );
}
