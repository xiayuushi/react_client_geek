import { LOGIN } from '../../contants/actionType'

const initState = {
  token: '',
  refresh_token: '',
}

const loginReducer = (state = initState, action) => {
  if (action.type === LOGIN) {
    return {
      ...state,
      token: action.payload.token,
      refresh_token: action.payload.refresh_token,
    }
  }
  return state
}

export default loginReducer
