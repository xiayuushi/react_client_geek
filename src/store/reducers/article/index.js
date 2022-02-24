import { ARTICLE } from '../../contants/actionType'

const initState = {}

const articleReducer = (state = initState, action) => {
  if (action.type === ARTICLE) {
    return state
  }
  return state
}

export default articleReducer
