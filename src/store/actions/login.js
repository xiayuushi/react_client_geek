import request from '@/utils/request'
import { LOGIN, LOGIN_LOGOUT } from '../contants/actionType'
import { setToken, removeToken } from '@/utils/storage'

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

export const logout = () => {
  removeToken()
  return {
    type: LOGIN_LOGOUT,
  }
}
