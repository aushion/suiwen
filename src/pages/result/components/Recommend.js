import { Card } from 'antd';

export default function Recommend(props) {
  const data = props.data;
  function handleClick(item) {
    window.location.href = window.location.href.split('?')[0] + '?q=' + item;
  }
  return (
    <Card
      title="相关推荐"
      bordered={false}
      style={{ width: 300, boxShadow: '#a5a5a5 0 0 10.8px 0' }}
    >
      {data.map((item, index) => (
        <p style={{ cursor: 'pointer' }} key={index} onClick={handleClick.bind(this, item.content)}>
          {item.content}
        </p>
      ))}
    </Card>
  );
}
