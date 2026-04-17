<template>
  <div class="search-add">
    <div class="search-add__input-row">
      <t-input
        v-model="stockCode"
        placeholder="输入股票代码，如 sh600519、sz000001"
        clearable
        @enter="handleSearch"
      >
        <template #prefixIcon>
          <t-icon name="search" />
        </template>
      </t-input>
      <t-button theme="primary" :loading="searching" @click="handleSearch">
        查询
      </t-button>
    </div>

    <!-- 行情预览卡片 -->
    <div v-if="preview" class="search-add__preview">
      <div class="preview-card">
        <div class="preview-card__header">
          <span class="preview-card__name">{{ preview.name }}</span>
          <span class="preview-card__code">{{ preview.code }}</span>
        </div>
        <div class="preview-card__body">
          <span :class="priceClass">
            {{ preview.currentPrice.toFixed(2) }}
          </span>
          <span :class="priceClass" style="margin-left: 12px">
            {{ preview.changePercent >= 0 ? '+' : '' }}{{ preview.changePercent.toFixed(2) }}%
          </span>
        </div>
        <div class="preview-card__actions">
          <t-input
            v-model="notes"
            placeholder="备注（可选，如'长期持有'）"
            clearable
            style="flex: 1"
          />
          <t-button theme="primary" :loading="adding" @click="handleAdd">
            添加到自选
          </t-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { getQuotes, addStock } from '@/api/stock'
import type { QuoteInfo } from '@/types'

const emit = defineEmits<{
  (e: 'added'): void
}>()

const stockCode = ref('')
const notes = ref('')
const preview = ref<QuoteInfo | null>(null)
const searching = ref(false)
const adding = ref(false)

const priceClass = computed(() => {
  if (!preview.value) return 'text-flat'
  if (preview.value.changePercent > 0) return 'text-rise'
  if (preview.value.changePercent < 0) return 'text-fall'
  return 'text-flat'
})

async function handleSearch() {
  const code = stockCode.value.trim()
  if (!code) {
    MessagePlugin.warning('请输入股票代码')
    return
  }

  searching.value = true
  preview.value = null
  try {
    const data = await getQuotes([code])
    if (data && data.length > 0) {
      preview.value = data[0]
    } else {
      MessagePlugin.warning('未找到该股票信息')
    }
  } catch {
    MessagePlugin.error('查询失败，请检查股票代码')
  } finally {
    searching.value = false
  }
}

async function handleAdd() {
  if (!preview.value) return
  adding.value = true
  try {
    await addStock({
      stockCode: preview.value.code,
      stockName: preview.value.name,
      notes: notes.value.trim(),
    })
    MessagePlugin.success('添加成功')
    preview.value = null
    stockCode.value = ''
    notes.value = ''
    emit('added')
  } catch {
    MessagePlugin.error('添加失败，可能已存在')
  } finally {
    adding.value = false
  }
}
</script>

<style scoped lang="less">
.search-add {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  &__input-row {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  &__preview {
    margin-top: 16px;
  }
}

.preview-card {
  background: #f9fafb;
  border: 1px solid #e7e7e7;
  border-radius: 6px;
  padding: 16px;

  &__header {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  &__name {
    font-size: 16px;
    font-weight: 600;
  }

  &__code {
    font-size: 13px;
    color: #999;
  }

  &__body {
    margin: 8px 0 16px;
    font-size: 22px;
    font-weight: 600;
  }

  &__actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }
}
</style>
