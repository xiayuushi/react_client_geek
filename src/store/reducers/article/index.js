import {
  ARTICLE_GETCHANNELSLIST,
  ARTICLE_GETARTICLESDATA,
} from '../../contants/actionType'

const initState = {
  channels: [],
  articles: {},
}

const articleReducer = (state = initState, action) => {
  if (action.type === ARTICLE_GETCHANNELSLIST) {
    return {
      ...state,
      channels: action.payload,
    }
  }
  if (action.type === ARTICLE_GETARTICLESDATA) {
    return {
      ...state,
      articles: action.payload,
    }
  }
  return state
}

export default articleReducer
