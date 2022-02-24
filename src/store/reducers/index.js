import { combineReducers } from 'redux'

import user from './user'
import login from './login'
import article from './article'

const rootReducer = combineReducers({
  user,
  login,
  article,
})

export default rootReducer
