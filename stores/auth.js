import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        user: null,
        isLoading: false,
    }),
    getters: {
        isAuthenticated: (state) => state.token !== '',
    },

    actions: {
        async login(nim) {
            this.isLoading = true
            await fetch('https://akar-kuadrat-api.fly.dev/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nim,
                })
            })
                .then((res) => res.json())
                .then((user) => {
                    this.isLoading = false
                    if(!user.data) return { error: 'NIM tidak ditemukan'}
                    this.token = user.data.token
                    this.user = user.data
                    localStorage.setItem('token', user.data.token)
                }).catch((err) => {
                    this.isLoading = false
                    console.log(err)
                })
        },
        logout() {
            this.token = ''
        },
    },
})