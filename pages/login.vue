<script setup>
const store = useAuthStore()
const router = useRouter()
const state = ref({
  nim: undefined,
})
const toast = useToast()

definePageMeta({
  layout: 'auth',
})


const validate = (state) => {
  const errors = []
  if (!state.nim) errors.push({ path: 'nim', message: 'Required' })
  return errors
}

async function login(event) {
  store.login(event.data.nim).then((res) => {
    if(!store.user){
      toast.add({
        title: 'Error',
        description: 'NIM tidak ditemukan',
        color: 'red',
      })
      return
    }
    router.push('/')
  }).catch((err) => {
    toast.add({
        title: 'Error',
        description: err,
        color: 'red',
      })
  })
}
</script>

<template>
  <!-- <UContainer>
    <UCard>
      <template #header>
        <h1 class="text-2xl font-bold">Login</h1>
      </template>

      <UForm :validate="validate" :state="state" @submit="login">
        <UFormGroup label="NIM" name="nim">
          <UInput v-model="state.nim" placeholder="NIM : Ex 2005551014" />
        </UFormGroup>
        <UButton class="mt-5" :loading="store.isLoading" type="submit"> Submit </UButton>
      </UForm>
      <template #footer />
    </UCard>
  </UContainer> -->

  <div
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-400"
      >
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <UForm :validate="validate" :state="state" @submit="login">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400"
            >NIM (Nomor Induk Mahasiswa)</label
          >
          <div class="mt-2">
            <UInput :loading="store.isLoading" v-model="state.nim" placeholder="NIM : Ex 2005551014" />
          </div>
        </div>

        <div>
          <UButton
            class="flex w-full mt-5 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            :loading="store.isLoading"
            type="submit"
          >
            Submit
          </UButton>
        </div>
      </UForm>
      <UNotifications />
    </div>
  </div>
</template>
