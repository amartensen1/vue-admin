<script setup lang="ts">
type SortDir = 'asc' | 'desc'
interface ColumnDef { key: string; label: string; sortable?: boolean }
const props = defineProps<{ columns: Array<ColumnDef>; rows: Array<Record<string, any>>; rowClickable?: boolean; sortKey?: string; sortDir?: SortDir }>()
const emit = defineEmits<{ (e: 'row-click', row: any): void; (e: 'sort-change', payload: { key: string; dir: SortDir }): void }>()

function onHeaderClick(key: string, isSortable: boolean | undefined) {
  if (!isSortable) return
  const nextDir: SortDir = props.sortKey === key ? (props.sortDir === 'asc' ? 'desc' : 'asc') : 'asc'
  emit('sort-change', { key, dir: nextDir })
}
</script>

<template>
  <div class="bg-white rounded shadow overflow-hidden">
    <div class="w-full overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 text-gray-600">
          <tr>
            <th
              v-for="c in columns"
              :key="c.key"
              class="text-left p-2 whitespace-nowrap select-none border-b-2"
              :class="[
                c.sortable ? 'cursor-pointer' : '',
                props.sortKey === c.key ? 'text-blue-700 font-semibold border-blue-600' : 'border-transparent'
              ]"
              :aria-sort="props.sortKey === c.key ? (props.sortDir === 'asc' ? 'ascending' : 'descending') : 'none'"
              @click="onHeaderClick(c.key, c.sortable)"
            >
              <span class="inline-flex items-center gap-1">
                {{ c.label }}
                <span v-if="c.sortable && props.sortKey === c.key" class="inline-flex items-center gap-1" aria-hidden="true">
                  <span class="text-blue-700">{{ props.sortDir === 'asc' ? '▲' : '▼' }}</span>
                  <span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                </span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in rows" :key="idx" class="border-t" :class="props.rowClickable ? 'hover:bg-gray-50 cursor-pointer' : ''" @click="props.rowClickable ? emit('row-click', row) : undefined">
            <td v-for="c in columns" :key="c.key" class="p-2 whitespace-nowrap">
              <slot :name="`cell:${c.key}`" :row="row">{{ row[c.key] }}</slot>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td :colspan="columns.length" class="p-6 text-center text-gray-500">
              <slot name="empty">No data</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
</style>


