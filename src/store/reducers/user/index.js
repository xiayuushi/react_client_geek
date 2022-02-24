import { USER } from '../../contants/actionType'

const initState = {}

const userReducer = (state = initState, action) => {
  if (action.type === USER) {
    return state
  }
  return state
}

export default userReducer
