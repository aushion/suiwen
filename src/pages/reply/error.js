import React from 'react';
import { Result, Button } from 'antd';

function ErrorPage() {
  return (
    <Result
      status="warning"
      title="该问题已被删除"
      extra={
        <Button type="primary" key="console" href={`/web/help/newHelp`}>
          去社区首页
        </Button>
      }
    />
  );
}

export default ErrorPage;
