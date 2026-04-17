<template>
  <div class="app-layout">
    <!-- 顶部 Header -->
    <header class="app-header">
      <h1 class="app-header__title">自选股 Watchlist</h1>
    </header>

    <!-- 主体内容 -->
    <main class="app-main narrow-scrollbar">
      <div class="app-content">
        <!-- 搜索添加区 -->
        <SearchAdd @added="handleAdded" />
        <!-- 自选股表格 -->
        <StockTable ref="stockTableRef" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchAdd from '@/components/SearchAdd.vue'
import StockTable from '@/components/StockTable.vue'

const stockTableRef = ref<InstanceType<typeof StockTable> | null>(null)

function handleAdded() {
  stockTableRef.value?.refresh()
}
</script>

<style scoped lang="less">
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-header {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
  flex-shrink: 0;

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

.app-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.app-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
