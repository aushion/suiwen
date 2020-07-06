import React from 'react';
import { Upload, Button, Icon } from 'antd';

function avatar() {
  return (
    <div>
      <div>
        <Upload name="file">
          <Button>
            <Icon type="upload" /> 点击上传
          </Button>
        </Upload>
      </div>

      <div>
        <label htmlFor="照片预览">照片预览:</label>

        <div style={{ width: 280, height: 280, backgroundColor: '#c5c5c5' }}>未上传图片</div>
        <img src="" alt="" />
      </div>
    </div>
  );
}

export default avatar;
