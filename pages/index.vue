<script setup>
import { useAuthStore } from '../stores/auth'

const client = useSupabaseClient()
const answer = ref(0)
const time = ref(0)
const history_data = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const toast = useToast()
const isLoading = ref(false)
const user = useAuthStore()
const number = ref(0)
const fastest = ref(0)
const slowest = ref(0)
const average = ref(0)
number.value = user.user.username

definePageMeta({
  middleware: 'auth',
})

const fetchHistory = () => {
  client
    .from('sqrt_number')
    .select('*', { count: 'exact' })
    .range(
      (currentPage.value - 1) * itemsPerPage.value,
      currentPage.value * itemsPerPage.value - 1
    )
    .order('id', { ascending: false })
    .then((res) => {
      history_data.value = res.data
      totalItems.value = res.count
    })

  client
    .from('sqrt_number')
    .select('execution_time')
    .order('execution_time', { ascending: true })
    .limit(1)
    .then((res) => {
      fastest.value = res.data[0].execution_time
    })

  client
    .from('sqrt_number')
    .select('execution_time')
    .order('execution_time', { ascending: false })
    .limit(1)
    .then((res) => {
      slowest.value = res.data[0].execution_time
    })

  client
    .from('sqrt_number')
    .select('execution_time')
    .then((res) => {
      let sum = 0
      for (let i = 0; i < res.data.length; i++) {
        sum += res.data[i].execution_time
      }
      average.value = sum / res.data.length
    })
}
fetchHistory()

const sqrt = () => {
  isLoading.value = true
  $fetch(`https://akar-kuadrat-api.fly.dev/api/sqrt?number=${number.value}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })
    .then((res) => {
      answer.value = res.data.sqrt
      time.value = res.data.time
      fetchHistory()
      isLoading.value = false
    })
    .catch((err) => {
      toast.add({
        title: 'Error',
        description: 'Invalid number, please try again!',
        color: 'red',
      })
      isLoading.value = false
    })
}

const sqrt_sql = () => {
  isLoading.value = true
  $fetch(
    `https://akar-kuadrat-api.fly.dev/api/sql/sqrt?number=${number.value}`,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  )
    .then((res) => {
      answer.value = res.data.sqrt
      time.value = res.data.execution_time
      fetchHistory()
      isLoading.value = false
    })
    .catch((err) => {
      toast.add({
        title: 'Error',
        description: 'Invalid number, please try again!',
        color: 'red',
      })
      isLoading.value = false
    })
}

watch([currentPage, itemsPerPage], fetchHistory)
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
)
</script>

<template>
  <div class="mx-10 p-4 text-center">
    <div class="grid md:grid-cols-4 gap-5 mb-5">
      <UCard>
        <div class="flex flex-col items-center">
          <div class="text-xl font-bold mb-2">Total Data</div>
          <div class="text-lg mb-2">{{ totalItems }}</div>
        </div>
      </UCard>
      <UCard>
        <div class="flex flex-col items-center">
          <div class="text-xl font-bold mb-2">Fastest Processed (ms)</div>
          <div class="text-lg mb-2">
            {{ fastest.toString().substring(0, 6) }}
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex flex-col items-center">
          <div class="text-xl font-bold mb-2">Slowest Processed (ms)</div>
          <div class="text-lg mb-2">{{ slowest }}</div>
        </div>
      </UCard>
      <UCard>
        <div class="flex flex-col items-center">
          <div class="text-xl font-bold mb-2">Average Processed (ms)</div>
          <div class="text-lg mb-2">
            {{ average.toString().substring(0, 6) }}
          </div>
        </div>
      </UCard>
    </div>
    <h1 class="text-3xl font-bold mb-2">Square Root Calculator</h1>
    <UInput
      type="text"
      v-model="number"
      disabled
      placeholder="Input number here"
      :ui="{ icon: { trailing: { pointer: '' } } }"
      :loading="isLoading"
    >
    </UInput>
    <!-- button to send -->
    <div
      class="mt-5 flex flex-col justify-center gap-2 align-middle md:flex-row"
    >
      <UButton
        icon="i-heroicons-wifi"
        :ui="{ ripple: { color: 'white' } }"
        class="bg-blue-500 hover:bg-blue-600 text-white"
        @click="sqrt"
        :loading="isLoading"
      >
        Calculate Using API
      </UButton>

      <UButton
        icon="i-heroicons-table-cells-solid"
        :ui="{ ripple: { color: 'white' } }"
        class="bg-blue-500 hover:bg-blue-600 text-white md:ml-5"
        @click="sqrt_sql"
        :loading="isLoading"
      >
        Calculate Using PL/SQL
      </UButton>
    </div>
    <UCard class="mt-5">
      <div class="flex flex-col items-center">
        <div class="text-2xl font-bold mb-2">Answer</div>
        <div class="text-4xl font-bold mb-2">{{ answer }}</div>
        <div class="text-sm text-gray-500 mb-2">
          Execution Time: {{ time }} ms
        </div>
      </div>
    </UCard>
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
          Log
        </h1>
      </template>
      <div class="flex justify-between items-center w-full px-4 py-3">
        <div class="flex items-center gap-1.5">
          <span class="text-sm leading-5">Rows per page:</span>

          <USelect
            v-model="itemsPerPage"
            :options="[3, 5, 10, 20, 30, 40]"
            class="me-2 w-20"
            size="xs"
          />

          <UButton
            icon="i-heroicons-arrow-path"
            :ui="{ ripple: { color: 'white' } }"
            class="bg-blue-500 hover:bg-blue-600 text-white"
            @click="fetchHistory"
            :loading="isLoading"
          />
        </div>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-full">
          <UTable
            :ui="{
              th: {
                base: 'text-center',
              },
            }"
            :rows="history_data"
            :columns="[
              { key: 'id', label: 'ID' },
              { key: 'number', label: 'Number' },
              { key: 'sqrt', label: 'Square Root' },
              { key: 'execution_time', label: 'Execution Time' },
              { key: 'type', label: 'From' },
              { key: 'created_at', label: 'Created At' },
            ]"
          >
            <template #execution_time-data="{ row }">
              {{ row.execution_time.toString().substring(0, 6) }} ms
            </template>
            <template #created_at-data="{ row }">
              {{ new Date(row.created_at).toLocaleString() }}
            </template>
          </UTable>
        </div>
      </div>
      <template #footer>
        <UPagination
          v-model="currentPage"
          :page-count="1"
          :total="totalPages"
        />
      </template>
    </UCard>
    <UNotifications />
  </div>
</template>
