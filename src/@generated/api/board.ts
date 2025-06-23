import type { ApiResponse, BoardUpdateRequest, BoardUpdateResponse, BoardInsertRequest, BoardInsertResponse, BoardBumpResponse, MyBoardResponse, MyBoardCursorResponse, BoardByIdResponseForMember, BoardResponse, BoardByIdResponse, BoardCursorResponse } from '../types'
import { AuthAxios } from '@/api/auth'

/* putPostsBoardId - 수정 */
export const putPostsBoardId = async (boardId: number | string, data: BoardUpdateRequest): Promise<ApiResponse<BoardUpdateResponse>> => {
  const endpoint = `/api/v2/posts/${boardId}`
  try {
    const response = await AuthAxios.put(endpoint, data)
    return response.data
  } catch (error) {
    console.error('putPostsBoardId failed:', error)
    throw error
  }
}

/* deletePostsBoardId - 삭제 */
export const deletePostsBoardId = async (boardId: number | string): Promise<ApiResponse<string>> => {
  const endpoint = `/api/v2/posts/${boardId}`
  try {
    const response = await AuthAxios.delete(endpoint)
    return response.data
  } catch (error) {
    console.error('deletePostsBoardId failed:', error)
    throw error
  }
}

/* postPosts - 생성 */
export const postPosts = async (data: BoardInsertRequest): Promise<ApiResponse<BoardInsertResponse>> => {
  const endpoint = '/api/v2/posts'
  try {
    const response = await AuthAxios.post(endpoint, data)
    return response.data
  } catch (error) {
    console.error('postPosts failed:', error)
    throw error
  }
}

/* postPostsBoardIdBump - 생성 */
export const postPostsBoardIdBump = async (boardId: number | string): Promise<ApiResponse<BoardBumpResponse>> => {
  const endpoint = `/api/v2/posts/${boardId}/bump`
  try {
    const response = await AuthAxios.post(endpoint)
    return response.data
  } catch (error) {
    console.error('postPostsBoardIdBump failed:', error)
    throw error
  }
}

/* getPostsMy - 조회 */
export const getPostsMy = async (page: number): Promise<ApiResponse<MyBoardResponse>> => {
  const endpoint = '/api/v2/posts/my'
  try {
    const response = await AuthAxios.get(endpoint)
    return response.data
  } catch (error) {
    console.error('getPostsMy failed:', error)
    throw error
  }
}

/* getPostsMyCursor - 조회 */
export const getPostsMyCursor = async (cursor?: string): Promise<ApiResponse<MyBoardCursorResponse>> => {
  const endpoint = '/api/v2/posts/my/cursor'
  try {
    const response = await AuthAxios.get(endpoint, { params: { cursor } })
    return response.data
  } catch (error) {
    console.error('getPostsMyCursor failed:', error)
    throw error
  }
}

/* getPostsMemberListBoardId - 조회 */
export const getPostsMemberListBoardId = async (boardId: number | string): Promise<ApiResponse<BoardByIdResponseForMember>> => {
  const endpoint = `/api/v2/posts/member/list/${boardId}`
  try {
    const response = await AuthAxios.get(endpoint)
    return response.data
  } catch (error) {
    console.error('getPostsMemberListBoardId failed:', error)
    throw error
  }
}

/* getPostsList - 조회 */
export const getPostsList = async (page: number, gameMode?: string, tier?: string, mainP?: string, subP?: string, mike?: string): Promise<ApiResponse<BoardResponse>> => {
  const endpoint = '/api/v2/posts/list'
  try {
    const response = await AuthAxios.get(endpoint, { params: { gameMode, tier, mainP, subP, mike } })
    return response.data
  } catch (error) {
    console.error('getPostsList failed:', error)
    throw error
  }
}

/* getPostsListBoardId - 조회 */
export const getPostsListBoardId = async (boardId: number | string): Promise<ApiResponse<BoardByIdResponse>> => {
  const endpoint = `/api/v2/posts/list/${boardId}`
  try {
    const response = await AuthAxios.get(endpoint)
    return response.data
  } catch (error) {
    console.error('getPostsListBoardId failed:', error)
    throw error
  }
}

/* getPostsCursor - 조회 */
export const getPostsCursor = async (cursor?: string, cursorId?: number, gameMode?: string, tier?: string, position1?: string, position2?: string): Promise<ApiResponse<BoardCursorResponse>> => {
  const endpoint = '/api/v2/posts/cursor'
  try {
    const response = await AuthAxios.get(endpoint, { params: { cursor, cursorId, gameMode, tier, position1, position2 } })
    return response.data
  } catch (error) {
    console.error('getPostsCursor failed:', error)
    throw error
  }
}
