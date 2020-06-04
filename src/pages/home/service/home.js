import request from '../../../utils/request'

export  function getDomainQuestions(payload) {
  return request.get('/getDomainQuestions')
}

export function getTopicQuestions(payload) {
  return request.get('/getTopicQuestions')
}
export function getHomePictureIds(payload) {
  const {type} = payload;
  return request.get(`/getHomePictureIds?type=${type}`)
}
export function getHotHelpList(payload) {
  return request.get(process.env.apiUrl + '/getNewQuestion',{
    params: {
      ...payload
    }
  })
}


