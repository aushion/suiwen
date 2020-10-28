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

export function getMyCommunityQuestion(payload) {
  return request.post(`/community/getMyCommunityQuestion`, null, {
    params: { ...payload }
  });
}

export function getMyCommunityAnswer(payload) {
  return request.post(`/community/getMyCommunityAnswer`, null, {
    params: payload
  })
}

export function getUserFolloweeInfo(payload) {
  return request.post(`/user/getUserFolloweeInfo`, null, {
    params: payload
  })
}

export function getUserFollowerInfo(payload) {
  return request.post(`/user/getUserFollowerInfo`, null, {
    params: payload
  })
}

export function getUserFollowedQuestion(payload) {
  return request.post(`/user/getUserFollowedQuestion`, null, {
    params: payload
  })
}

