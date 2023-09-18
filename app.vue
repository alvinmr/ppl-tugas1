<script setup>
const client = useSupabaseClient()
const number = ref(0)
const answer = ref(0)
const time = ref(0)
const history_data = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const toast = useToast()

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
}
fetchHistory()

const sqrt = () => {
  $fetch(`https://akar-kuadrat-api.vercel.app/api/sqrt?number=${number.value}`)
    .then((res) => {
      answer.value = res.data.sqrt
      time.value = res.data.time
      fetchHistory()
    })
    .catch((err) => {
      toast.add({
        title: 'Error',
        description: "Invalid number, please try again!",
        color: 'red',
      })
    })
}

watch([currentPage, itemsPerPage], fetchHistory)
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
)
</script>

<template>
  <div class="mx-10 p-4 text-center">
    <h1 class="text-3xl font-bold mb-2">Square Root Calculator</h1>
    <form @submit.prevent="sqrt">
      <UInput
        type="number"
        v-model="number"
        placeholder="Input number, enter to calculate"
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
      </UInput>
    </form>
    <UCard class="mt-5">
      <div class="flex flex-col items-center">
        <div class="text-2xl font-bold mb-2">Answer</div>
        <div class="text-4xl font-bold mb-2">{{ answer }}</div>
        <div class="text-sm text-gray-500 mb-2">
          Execution Time: {{ time }} ms
        </div>
      </div>
    </UCard>
    <UCard class="mt-5">
      <h1 class="text-2xl font-bold mb-2">Log</h1>
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
              { key: 'created_at', label: 'Created At' },
            ]"
          />
          <UPagination
            v-model="currentPage"
            :page-count="1"
            :total="totalPages"
          />
        </div>
      </div>
    </UCard>
    <UNotifications />
  </div>
</template>
