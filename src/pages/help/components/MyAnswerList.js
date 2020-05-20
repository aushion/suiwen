import { Collapse, Button } from 'antd';
import Link from 'umi/link';
const { Panel } = Collapse;

export default function MyAnswerList(props) {
  const { data, from = true } = props;
  return (
    <div style={{ padding: '10px 0' }}>
      <div>共{data.total}条</div>
      <Collapse>
        {data.list.map((item, index) => {
          return (
            <Panel
              showArrow={false}
              header={item.Qeustion}
              key={index}
              extra={<div style={{ cursor: 'pointer' }}>查看回答</div>}
            >
              <p dangerouslySetInnerHTML={{ __html: item.Content }} />
              {from ? <div>来自：{item.Domain}</div> : null}

              <div dangerouslySetInnerHTML={{ __html: item.resource }} />
              {item.Status === 0 ? (
                <Link to={`/reply?q=${item.Qeustion}&QID=${item.QID}&Domian=${item.Domain}`}>
                  <Button type="primary" size="small" ghost>编辑答案</Button>
                </Link>
              ) : null}
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
}
