<script setup lang="ts">
defineProps<{title: String, description: String}>();
import yesPesto from 'static/images/emotes/yesPesto.png';
import doggess from 'static/images/doggess.png';
</script>
<template>
    <div class="w-full h-full flex flex-col items-center justify-center text-slate-700 bg-slate-200 px-8 py-11">
    <img :src="yesPesto" class="absolute bottom-10 right-10 h-32 w-32"/>
    <img :src="doggess" class="absolute -left-20 -bottom-10 opacity-25 z-0" :style="{filter: 'blur(4px)'}"/>
    <div class="h-1 bg-pink-200 flex absolute bottom-0 left-0 w-[75rem]"></div>
    <div class="pb-10 justify-center items-center flex flex-col z-40">
      <h1 class="text-6xl">{{ title }}</h1>
      <p class="text-3xl leading-10 mx-10 mt-5 text-slate-700">
        {{ description }}
      </p>
    </div>
  </div>
</template>
