<template>
        <n-config-provider>
                <n-message-provider>
                        <Toaster position="top-center" richColors/>
                        <router-view />
                </n-message-provider>
        </n-config-provider>
</template>

<style></style>

<script setup>
import { NConfigProvider, NMessageProvider } from "naive-ui";
import { useAuthStore } from "./store/auth";
import { onMounted } from "vue";


const auth = useAuthStore()

onMounted(() => {
  auth.fetchUser()
})

</script>