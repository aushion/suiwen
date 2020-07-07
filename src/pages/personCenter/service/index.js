import request from '../../../utils/request';

export function getUserInfo(payload) {
  const { userName = '' } = payload;
  return request.post(`/user/getUserInfo?userName=${userName}`);
}

export function editUserInfo(payload) {
  return request.post(`/user/editUserInfo`, {
    data: { ...payload }
  });
}

export function getUserHeadPicture(payload) {
  const { userName = '' } = payload;
  return request.get(`/user/getUserHeadPicture?userName=${userName}`);
}

export function uploadUserHeadPicture(payload) {
  const { userName = '' } = payload;
  return request.post(`/user/uploadUserHeadPicture?userName=${userName}`);
}
