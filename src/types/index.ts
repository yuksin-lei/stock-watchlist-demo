/** 自选股记录（后端返回） */
export interface StockItem {
  id: number
  stockCode: string
  stockName: string
  notes: string
  createdAt: string
  updatedAt: string
}

/** 实时行情数据 */
export interface QuoteInfo {
  code: string
  name: string
  currentPrice: number
  changePercent: number
  changeAmount: number
  open: number
  high: number
  low: number
  volume: number
  turnover: number
}

/** 自选股 + 行情合并后的展示数据 */
export interface StockWithQuote extends StockItem {
  quote?: QuoteInfo
}

/** 添加自选股请求 */
export interface AddStockReq {
  stockCode: string
  stockName: string
  notes?: string
}

/** 修改备注请求 */
export interface UpdateNotesReq {
  notes: string
}
