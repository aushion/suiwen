import request from '../../../utils/request';

export function getUserInfo(payload) {
  const { userName = '' } = payload;
  return request.post(`/user/getUserInfo?userName=${userName}`);
}

export function editUserInfo(payload) {
  return request.post(`/user/editUserInfo`, null, {
    data: { ...payload }
  });
}

export function updatePassword(payload) {
  return request.post(`/Login/changePassword`, null, {
    params: { ...payload }
  });
}
