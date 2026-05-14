import axios from 'axios'
import type { StockItem, StockQuoteVO, StockSearchVO, AddStockReq, UpdateNotesReq, ApiResponse } from '@/types'

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

/** GET /stocks — 查询自选股列表（附带实时行情） */
export function getStockList() {
  return http.get<ApiResponse<StockQuoteVO[]>>('/stocks').then((res) => res.data)
}

/** GET /stocks/search — 搜索股票 */
export function searchStocks(keyword: string) {
  return http.get<ApiResponse<StockSearchVO[]>>('/stocks/search', { params: { keyword } }).then((res) => res.data)
}

/** POST /stocks — 添加自选股 */
export function addStock(data: AddStockReq) {
  return http.post<ApiResponse<StockItem>>('/stocks', data).then((res) => res.data)
}

/** PUT /stocks/:id — 修改备注 */
export function updateNotes(id: number, data: UpdateNotesReq) {
  return http.put<ApiResponse<StockItem>>(`/stocks/${id}`, data).then((res) => res.data)
}

/** DELETE /stocks/:id — 删除自选股 */
export function deleteStock(id: number) {
  return http.delete<ApiResponse<void>>(`/stocks/${id}`).then((res) => res.data)
}

/** GET /quotes — 批量获取实时行情 */
export function getQuotes(codes: string[]) {
  return http.get<ApiResponse<StockQuoteVO[]>>('/quotes', { params: { codes: codes.join(',') } }).then((res) => res.data)
}
