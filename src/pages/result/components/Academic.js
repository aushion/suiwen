import { Descriptions } from 'antd';
import RestTools from '../../../utils/RestTools';
import Label from './Label';

export default function Academic(props) {
  const {
    学者单位 = '',
    学者名,
    个人简介 = '-',
    籍贯 = '-',
    主要成就介绍 = '-',
    主题 = '-',
    科技资源分类名称 = '-',
  } = props.data;
  return (
    <Descriptions
      style={{
        background: '#fff',
        marginBottom: 20,
        padding: 20,
        boxShadow: '#a5a5a5 0 0 10.8px 0',
        color: '#666',
        letterSpacing: 2,
      }}
      title={
        <div style={{ fontWeight: 'bold' }}>
          <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(学者名) }}></span>
          <span
            dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(学者单位) }}
            style={{ marginLeft: 10, color: '#F5BB1A', fontSize: 16 }}
          ></span>
        </div>
      }
    >
      <Descriptions.Item span={3} label={<Label text="职称" />}>
        {科技资源分类名称}
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="研究方向" />}>
        <span dangerouslySetInnerHTML={{ __html: RestTools.translateToRed(主题) }}></span>
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="籍贯" />}>
        {籍贯}, Zhejiang
      </Descriptions.Item>
      <Descriptions.Item span={3} label={<Label text="个人简介" />}>
        {个人简介}
      </Descriptions.Item>
      <Descriptions.Item label={<Label text="主要成就" />} span={3}>
        {主要成就介绍}
      </Descriptions.Item>
    </Descriptions>
  );
}
