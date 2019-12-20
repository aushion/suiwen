import { Card, List } from 'antd';
import RestTools from '../../../utils/RestTools';

function RelatedPatent(props) {
  const { data } = props;
  return (
    <Card title='相关专利'>
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <span>{RestTools.translateToRed(item.TITLE)}</span>
          </List.Item>
        )}
      ></List>
    </Card>
  );
}

export default RelatedPatent;
