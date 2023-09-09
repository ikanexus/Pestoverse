<script lang="ts" setup>
import {CSSProperties} from "@vue/runtime-dom";

const props = defineProps<{ index: number; to?: string; click?: () => void; style: string | CSSProperties; class: string }>();
defineEmits(['mouseover', 'mouseout'])
const classes = `origin-center animate-orbit hover:[animation-play-state:_paused] ${props.class}`;
</script>
<template>
    <NuxtLink
        v-if="to"
        :to="to"
        :id="`planet-${index}`"
        @mouseover="$emit('mouseover')"
        @mouseout="$emit('mouseout')"
        :class="classes"
        :style="style"
    >
        <slot />
    </NuxtLink>
    <g
        v-if="!to && click"
        role="button"
        @click="click"
        :id="`planet-${index}`"
        :class="classes"
        @mouseover="$emit('mouseover')"
        @mouseout="$emit('mouseout')"
        :style="style"
    >
        <slot />
    </g>
</template>
