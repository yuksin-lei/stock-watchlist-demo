import axios from 'axios'
import type { StockWithQuote, AddStockReq, UpdateNotesReq, QuoteInfo } from '@/types'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

/** 查询自选股列表（附带实时行情） */
export function getStockList() {
  return http.get<StockWithQuote[]>('/stocks').then((res) => res.data)
}

/** 添加自选股 */
export function addStock(data: AddStockReq) {
  return http.post('/stocks', data).then((res) => res.data)
}

/** 修改备注 */
export function updateNotes(id: number, data: UpdateNotesReq) {
  return http.put(`/stocks/${id}`, data).then((res) => res.data)
}

/** 删除自选股 */
export function deleteStock(id: number) {
  return http.delete(`/stocks/${id}`).then((res) => res.data)
}

/** 批量获取实时行情 */
export function getQuotes(codes: string[]) {
  return http
    .get<QuoteInfo[]>('/quotes', { params: { codes: codes.join(',') } })
    .then((res) => res.data)
}
