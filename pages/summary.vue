<script setup>
const client = useSupabaseClient()
const history_data = ref([])
const history_data_slice = ref([])
const search = ref('')


definePageMeta({
  middleware: 'auth'
})

const fetchHistory = () => {
  client
    .rpc('get_number_count')
    .then((res) => {
        history_data.value = res.data.sort((a, b) => b.count - a.count)
    })
}

const filterHistory = () => {
  if (search.value) {
    history_data_slice.value = history_data.value.filter((item) => {
      return item.number.toString().includes(search.value)
    })
  }
}

fetchHistory()
watch(search, filterHistory, { debounce: 300 })
</script>

<template>
  <div class="mx-10 p-4 text-center">
    <UCard
      :ui="{
        base: '',
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-700',
        header: { padding: 'px-4 py-5' },
        body: {
          padding: '',
          base: 'divide-y divide-gray-200 dark:divide-gray-700',
        },
        footer: { padding: 'p-4' },
      }"
      class="mt-5"
    >
      <template #header>
        <h1
          class="font-semibold text-xl text-gray-900 dark:text-white leading-tight"
        >
          Summary
        </h1>
      </template>

      <!-- Filters -->
    <div class="flex items-center justify-between gap-3 px-4 py-3">
      <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />
      <!-- button reload -->
        <UButton
            icon="i-heroicons-arrow-path"
            :ui="{ ripple: { color: 'white' } }"
            class="bg-blue-500 hover:bg-blue-600 text-white"
            @click="fetchHistory"
            :loading="isLoading"
        />
    </div>

      <div class="flex flex-col items-center">
        <div class="w-full">
          <UTable
            :ui="{
              th: {
                base: 'text-center',
              },
              td: { base: 'max-w-[0] truncate' },
            }"
            :rows="search ? history_data_slice : history_data"
            sort-asc-icon="i-heroicons-arrow-up"
            sort-desc-icon="i-heroicons-arrow-down"
            class="w-full"
            :columns="[
              { key: 'number', label: 'Number' },
              { key: 'count', label: 'Count', sortable: true },
            ]"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>
