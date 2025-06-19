<template>
        <n-config-provider>
                <n-message-provider>
                        <router-view />
                </n-message-provider>
        </n-config-provider>
</template>

<style></style>

<script setup>
import { NConfigProvider, NMessageProvider } from "naive-ui";
</script>