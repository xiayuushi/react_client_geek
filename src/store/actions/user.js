import request from '@/utils/request'
import { USER_GETUSERINFO } from '@/store/contants/actionType'

export const user_getUserInfo = () => {
  return async (dispatch) => {
    const res = await request({
      url: '/v1_0/user/profile',
    })
    return dispatch({
      type: USER_GETUSERINFO,
      payload: res,
    })
  }
}
