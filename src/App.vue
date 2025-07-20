<template>
  <template v-if="slides.length">
    <Screen v-if="screening" />
    <Editor v-else-if="_isPC" />
    <Mobile v-else />
  </template>
  <FullscreenSpin tip="数据初始化中，请稍等 ..." v-else  loading :mask="false" />
</template>



<script lang="ts" setup>
import {onMounted} from 'vue'
import {storeToRefs} from 'pinia'
import {useMainStore, useScreenStore, useSlidesStore, useSnapshotStore} from '@/store'
import {LOCALSTORAGE_KEY_DISCARDED_DB} from '@/configs/storage'
import {deleteDiscardedDB} from '@/utils/database'
import {isPC} from '@/utils/common'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'
import Mobile from './views/Mobile/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import useUrlParams from '@/hooks/useUrlParams'
import {AidocService} from "@firmer/aidoc";
import useAIPPT from "@/hooks/useAIPPT";
import type {AIPPTSlide} from "@/types/AIPPT";
import useSlideHandler from "@/hooks/useSlideHandler";

const _isPC = isPC()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const snapshotStore = useSnapshotStore()
const {databaseId} = storeToRefs(mainStore)
const {slides} = storeToRefs(slidesStore)
const {screening} = storeToRefs(useScreenStore())
const {resetSlides} = useSlideHandler()
const {AIPPT} = useAIPPT()

if (import.meta.env.MODE !== 'development') {
  window.onbeforeunload = () => false
}

const sleep = async (ms: number) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), ms)
  })
}

onMounted(async () => {
  resetSlides()
  const {pattern} = useUrlParams()
  const data = await AidocService.iframeHub.pptxPattern(pattern.value ?? '{}')
  const schema = JSON.parse(data.schema);
  const slides = (JSON.parse(data.slides ?? '[]') ?? []) as AIPPTSlide[];
  for (let slide of slides) {
    mainStore.setAIPPTDialogState(false)
    AIPPT(schema.slides, [slide])
    await sleep(150)
  }

  slidesStore.setTheme(schema.theme)

  await deleteDiscardedDB()
  snapshotStore.initSnapshotDatabase()
})

// 应用注销时向 localStorage 中记录下本次 indexedDB 的数据库ID，用于之后清除数据库
window.addEventListener('beforeunload', () => {
  const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
  const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []

  discardedDBList.push(databaseId.value)

  const newDiscardedDB = JSON.stringify(discardedDBList)
  localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB)
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>