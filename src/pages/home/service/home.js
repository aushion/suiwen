import request from '../../../utils/request'

export  function getDomainQuestions(payload) {
  return request.get('/getDomainQuestions')
}

export function getTopicQuestions(payload) {
  return request.get('/getTopicQuestions')
}


export function getHotHelpList(payload) {
  return request.get(process.env.apiUrl_help + '/GetNewQuestion?size=12')
}
