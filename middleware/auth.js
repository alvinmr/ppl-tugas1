export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()
    if (!auth.isAuthenticated && to.path !== '/login') {
        return navigateTo('/login');
    }else{
        return navigateTo('/')
    }
})