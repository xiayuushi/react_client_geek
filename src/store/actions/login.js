import request from '@/utils/request'
import { LOGIN } from '../contants/actionType'
import { setToken } from '@/utils/storage'

export const login = (data) => {
  return async (dispatch) => {
    const res = await request({
      url: '/v1_0/authorizations',
      method: 'post',
      data,
    })
    setToken(res.token)
    return dispatch({
      type: LOGIN,
      payload: res,
    })
  }
}
