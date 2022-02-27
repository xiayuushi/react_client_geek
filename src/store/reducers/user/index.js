import { USER_GETUSERINFO } from '../../contants/actionType'

const initState = {}

const userReducer = (state = initState, action) => {
  if (action.type === USER_GETUSERINFO) {
    return action.payload
  }
  return state
}

export default userReducer
