import request from '../../../utils/request';

//文档生成
export async function addUserDoc(params) {
  return request({
    url: '/doc/addUserDoc',
    method: 'post',
    data: {
      ...params
    }
  });
}

//删除文档片段
export async function delContent(params) {
  return request({
    url: '/doc/delContent',
    method: 'post',
    params
  });
}

//删除文档路径
export async function delDocRoute(params) {
  return request({
    url: '/doc/delDocRoute',
    method: 'post',
    params
  });
}

//删除文档章节的问题信息
export async function delRouteQuestion(params) {
  return request({
    url: '/doc/delRouteQuestion',
    method: 'post',
    params
  });
}

//删除用户的个人文档
export async function delUserDoc(params) {
  return request({
    url: '/doc/delUserDoc',
    method: 'post',
    params
  });
}

//编辑个人文档
export async function editUserDoc(params) {
  return request({
    url: '/doc/editUserDoc',
    method: 'post',
    data: {
      ...params
    }
  });
}

//生成文档
export async function generateDoc(params) {
  return request({
    url: '/doc/generateDoc',
    method: 'post',
    params
  });
}

//获取路径下的内容信息
export async function getRouteContent(params) {
  return request({
    url: '/doc/getRouteContent',
    method: 'post',
    params
  });
}

//查询用户的个人文档
export async function getUserDoc(params) {
  return request({
    url: '/doc/getUserDoc',
    method: 'post',
    params
  });
}

//获取文档的路径信息
export async function queryForRoute(params) {
  return request({
    url: '/doc/queryForRoute',
    method: 'post',
    params
  });
}

//获取文档章节的问题信息
export async function queryForRouteQuestion(params) {
  return request({
    url: '/doc/queryForRouteQuestion',
    method: 'post',
    params
  });
}

//获取文档下的内容信息、刷新文档内容
export async function refreshDocContent(params) {
  return request({
    url: '/doc/refreshDocContent',
    method: 'post',
    params
  });
}

//保存文档路径
export async function saveRoute(params) {
  return request({
    url: '/doc/saveRoute',
    method: 'post',
    data: {
      ...params
    }
  });
}

//保存文档章节的问题信息
export async function saveRouteQuestion(params) {
  return request({
    url: '/doc/saveRouteQuestion',
    method: 'post',
    data: {
      ...params
    }
  });
}
