import React, { useState } from 'react';
import { Upload, Icon, message } from 'antd';
import querystring from 'querystring';
import { connect } from 'dva';
import RestTools from 'Utils/RestTools';

function Avatar(props) {
  const { userName } = querystring.parse(window.location.href.split('?')[1]);
  const TokenKey = sessionStorage.getItem('TokenKey');
  // const [imageUrl, setImageUrl] = useState('');
  const { dispatch } = props;
  const [loading, setLoading] = useState(false);
  const userInfo = RestTools.getLocalStorage('userInfo');

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function handleChange(info) {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        // setImageUrl(imageUrl);
        setLoading(false);
        dispatch({
          type: 'personCenter/save',
          payload: {
            avatar: `${process.env.apiUrl}/user/getUserHeadPicture?userName=${
              userInfo.UserName
            }&_t=${new Date().getTime()}`
          }
        });
        dispatch({
          type: 'global/save',
          payload: {
            avatar: `${process.env.apiUrl}/user/getUserHeadPicture?userName=${
              userInfo.UserName
            }&_t=${new Date().getTime()}`
          }
        });
      });
    }
  }

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">点击上传</div>
    </div>
  );

  return (
    <div style={{ padding: '10px 0 10px 50%', marginLeft: '-100px'}}>
      <div>
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={`${process.env.apiUrl}/user/uploadUserHeadPicture?userName=${userName}`}
          beforeUpload={beforeUpload}
          headers={{
            'X-Token': TokenKey
          }}
          onChange={handleChange}
        >
          {uploadButton}
        </Upload>
      </div>
      <div>
        <label htmlFor="照片预览">照片预览:</label>
        <div style={{ width: 200, height: 200 }}>
          <img
            style={{ width: '100%', height: '100%', borderRadius: 6 }}
            src={props.avatar}
            alt={userInfo.UserName}
          />
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.personCenter
  };
}

export default connect(mapStateToProps)(Avatar);
