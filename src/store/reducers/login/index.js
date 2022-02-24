import { LOGIN } from '../../contants/actionType'

const initState = {}

const loginReducer = (state = initState, action) => {
  if (action.type === LOGIN) {
    return state
  }
  return state
}

export default loginReducer
