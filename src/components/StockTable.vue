<template>
  <div class="stock-table">
    <div class="stock-table__header">
      <h3 class="stock-table__title">我的自选股</h3>
      <t-button variant="text" theme="primary" :loading="loading" @click="refresh">
        <template #icon><t-icon name="refresh" /></template>
        刷新行情
      </t-button>
    </div>

    <t-table
      :data="list"
      :columns="columns"
      :loading="loading"
      row-key="id"
      stripe
      hover
      empty="暂无自选股，请在上方搜索添加"
      style="margin-top: 12px"
    />
  </div>
</template>

<script setup lang="tsx">
import { ref, onMounted, onUnmounted, h } from 'vue'
import { MessagePlugin, DialogPlugin, Input as TInput, Button as TButton } from 'tdesign-vue-next'
import { getStockList, deleteStock, updateNotes } from '@/api/stock'
import type { StockWithQuote } from '@/types'
import type { PrimaryTableCol } from 'tdesign-vue-next'

defineExpose({ refresh: loadList })

const list = ref<StockWithQuote[]>([])
const loading = ref(false)
const editingId = ref<number | null>(null)
const editingNotes = ref('')

let timer: ReturnType<typeof setInterval> | null = null

const columns: PrimaryTableCol<StockWithQuote>[] = [
  {
    colKey: 'stockCode',
    title: '股票代码',
    width: 120,
  },
  {
    colKey: 'stockName',
    title: '名称',
    width: 120,
    cell: (_h, { row }) => {
      return row.quote?.name || row.stockName
    },
  },
  {
    colKey: 'currentPrice',
    title: '现价',
    width: 100,
    cell: (_h, { row }) => {
      if (!row.quote) return '--'
      const cls = getColorClass(row.quote.changePercent)
      return h('span', { class: cls }, row.quote.currentPrice.toFixed(2))
    },
  },
  {
    colKey: 'changePercent',
    title: '涨跌幅',
    width: 100,
    cell: (_h, { row }) => {
      if (!row.quote) return '--'
      const val = row.quote.changePercent
      const cls = getColorClass(val)
      const text = (val >= 0 ? '+' : '') + val.toFixed(2) + '%'
      return h('span', { class: cls, style: { fontWeight: '600' } }, text)
    },
  },
  {
    colKey: 'notes',
    title: '备注',
    cell: (_h, { row }) => {
      if (editingId.value === row.id) {
        return h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } }, [
          h(TInput, {
            modelValue: editingNotes.value,
            'onUpdate:modelValue': (v: string) => { editingNotes.value = v },
            size: 'small',
            placeholder: '输入备注',
            onEnter: () => handleSaveNotes(row),
          }),
          h(TButton, { size: 'small', theme: 'primary', variant: 'text', onClick: () => handleSaveNotes(row) }, () => '保存'),
          h(TButton, { size: 'small', variant: 'text', onClick: () => { editingId.value = null } }, () => '取消'),
        ])
      }
      return h('span', { style: { color: row.notes ? '#333' : '#ccc' } }, row.notes || '无')
    },
  },
  {
    colKey: 'actions',
    title: '操作',
    width: 140,
    cell: (_h, { row }) => {
      return h('div', { style: { display: 'flex', gap: '4px' } }, [
        h(TButton, {
          size: 'small',
          variant: 'text',
          theme: 'primary',
          onClick: () => {
            editingId.value = row.id
            editingNotes.value = row.notes || ''
          },
        }, () => '编辑备注'),
        h(TButton, {
          size: 'small',
          variant: 'text',
          theme: 'danger',
          onClick: () => handleDelete(row),
        }, () => '删除'),
      ])
    },
  },
]

function getColorClass(change: number) {
  if (change > 0) return 'text-rise'
  if (change < 0) return 'text-fall'
  return 'text-flat'
}

async function loadList() {
  loading.value = true
  try {
    const data = await getStockList()
    list.value = data || []
  } catch {
    MessagePlugin.error('获取自选股列表失败')
  } finally {
    loading.value = false
  }
}

function refresh() {
  loadList()
}

async function handleSaveNotes(row: StockWithQuote) {
  try {
    await updateNotes(row.id, { notes: editingNotes.value.trim() })
    row.notes = editingNotes.value.trim()
    editingId.value = null
    MessagePlugin.success('备注已更新')
  } catch {
    MessagePlugin.error('更新备注失败')
  }
}

function handleDelete(row: StockWithQuote) {
  const dialog = DialogPlugin.confirm({
    header: '确认删除',
    body: `确定要从自选股中移除「${row.quote?.name || row.stockName}（${row.stockCode}）」吗？`,
    confirmBtn: { theme: 'danger', content: '删除' },
    onConfirm: async () => {
      try {
        await deleteStock(row.id)
        list.value = list.value.filter((item) => item.id !== row.id)
        MessagePlugin.success('已删除')
        dialog.destroy()
      } catch {
        MessagePlugin.error('删除失败')
      }
    },
  })
}

onMounted(() => {
  loadList()
  // 每 15 秒刷新一次行情
  timer = setInterval(loadList, 15000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="less">
.stock-table {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
}
</style>
