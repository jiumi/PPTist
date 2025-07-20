/*
 * Copyright (c) 2019, 2025, firmer.tech and/or its affiliates. All rights reserved.
 * Firmer Corporation PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 *
 */

// src/hooks/useUrlParams.ts
import { ref, onMounted, computed } from 'vue'

export default function useUrlParams() {
  const urlParams = ref<Record<string, string>>({})
  const isLoading = ref(true)

  // 获取所有URL参数
  const getUrlParams = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const params: Record<string, string> = {}
    
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    
    urlParams.value = params
    isLoading.value = false
  }

  // 获取特定参数
  const getParam = (key: string): string | null => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get(key)
  }

  // 检查参数是否存在
  const hasParam = (key: string): boolean => {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.has(key)
  }

  // 设置参数
  const setParam = (key: string, value: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set(key, value)
    window.history.pushState({}, '', url.toString())
    getUrlParams() // 重新获取参数
  }

  // 删除参数
  const removeParam = (key: string) => {
    const url = new URL(window.location.href)
    url.searchParams.delete(key)
    window.history.pushState({}, '', url.toString())
    getUrlParams() // 重新获取参数
  }

  // 专门获取pattern参数的计算属性
  const pattern = computed(() => {
    return getParam('pattern')
  })

  // 检查pattern参数是否存在
  const hasPattern = computed(() => {
    return hasParam('pattern')
  })

  // 设置pattern参数
  const setPattern = (value: string) => {
    setParam('pattern', value)
  }

  // 删除pattern参数
  const removePattern = () => {
    removeParam('pattern')
  }

  onMounted(() => {
    getUrlParams()
  })

  return {
    // 通用方法
    urlParams,
    isLoading,
    getParam,
    hasParam,
    setParam,
    removeParam,
    getUrlParams,
    
    // pattern参数专用方法
    pattern,
    hasPattern,
    setPattern,
    removePattern
  }
}