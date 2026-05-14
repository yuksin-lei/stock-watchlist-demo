/** 通用 API 响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 自选股记录（对应后端 Stock 实体） */
export interface StockItem {
  id: number
  stockCode: string
  stockName: string
  notes: string
  createdAt: string
  updatedAt: string
}

/** 自选股 + 行情（对应后端 StockQuoteVO） */
export interface StockQuoteVO {
  id: number
  stockCode: string
  stockName: string
  currentPrice: number
  todayOpen: number
  yesterdayClose: number
  high: number
  low: number
  volume: number
  notes: string
}

/** 搜索结果（对应后端 StockSearchVO） */
export interface StockSearchVO {
  stockCode: string
  stockName: string
}

/** 添加自选股请求（对应后端 StockAddRequest） */
export interface AddStockReq {
  stockCode: string
  notes?: string
}

/** 修改备注请求（对应后端 StockUpdateRequest） */
export interface UpdateNotesReq {
  notes: string
}
