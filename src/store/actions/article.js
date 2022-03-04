import request from '@/utils/request'
import {
  ARTICLE_GETCHANNELSLIST,
  ARTICLE_GETARTICLESDATA,
} from '@/store/contants/actionType'

export const getChannelsList = () => {
  return async (dispatch) => {
    const res = await request({ url: '/v1_0/channels' })
    dispatch({
      type: ARTICLE_GETCHANNELSLIST,
      payload: res.channels,
    })
  }
}

export const getArticlesData = (params) => {
  return async (dispatch) => {
    const res = await request({ url: '/v1_0/mp/articles', params })
    dispatch({
      type: ARTICLE_GETARTICLESDATA,
      payload: res,
    })
  }
}

export const delArticle = (id) => {
  return async () => {
    await request({
      url: `/v1_0/mp/articles/${id}`,
      method: 'delete',
    })
    // 删除后不需要操作reducer，只需在组件调用 dispatch 提交actions时再次重新请求文章列表即可（getArticlesData）
    // 因此此处删除文章时也就无需去store定义actionType以及reducer了
  }
}

export const addArticle = ({ draft = false, data }) => {
  // 传入draft=true则走存入草稿接口，否则则为发布文章接口
  return async () => {
    await request({
      url: '/v1_0/mp/articles',
      method: 'post',
      params: { draft },
      data,
    })
  }
}
