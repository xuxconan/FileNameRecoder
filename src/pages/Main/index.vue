<template>
  <div class="main">
    <v-toolbar
      density="compact"
      :elevation="8"
      :title="channelProcess.Env.APP_TITLE"
    >
      <v-spacer></v-spacer>
      <MultiSwitch
        v-model="themeValue"
        size="20px"
        max-width="30px"
        :options="themeOptions"
      ></MultiSwitch>
    </v-toolbar>
    <v-footer :border="true">
      <v-row justify="end" no-gutters>
        Copyright 2024&nbsp;<strong>XUYUXIANG</strong>
      </v-row>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useTheme } from 'vuetify';

import { THEME_SYSTEM, THEME_DARK, THEME_LIGHT } from '@/consts';
import ChannelTheme from "@/channels/Theme/web";
import ChannelProcess from "@/channels/Process/web";

import MultiSwitch from "@/global/components/MultiSwitch/index.vue";

const channelProcess = new ChannelProcess();
const channelTheme = new ChannelTheme();

const vueTheme = useTheme();

const themeOptions = ref([
  { value: THEME_SYSTEM, color: "black" },
  { value: THEME_DARK, color: "black" },
  { value: THEME_LIGHT, color: "white" },
])
const themeValue = ref(THEME_SYSTEM);

watch(themeValue, async () => {
  channelTheme.SetThemeSrc(themeValue.value);
})

// 主题来源变化时触发回调
channelTheme.OnSrcChanged(async (ev: any, src: string) => {
  themeValue.value = src;
  if (src !== THEME_SYSTEM) {
    // 如果不跟随系统主题，则直接给指定的主题
    vueTheme.global.name.value = src;
  } else {
    // 否则获取当前是否使用暗色主题
    const isDark = await channelTheme.GetIsDark();
    vueTheme.global.name.value = isDark ? THEME_DARK : THEME_LIGHT;
    themeOptions.value[0].color = isDark ? "black" : "white";
  }
})
// 系统的主题更新时触发回调
channelTheme.OnSysUpdated((ev: any, isDark: boolean) => {
  // 获取当前是否使用暗色主题
  vueTheme.global.name.value = isDark ? THEME_DARK : THEME_LIGHT;
  themeOptions.value[0].color = isDark ? "black" : "white";
})
// https://cn.vuejs.org/guide/built-ins/suspense.html#async-setup
// NOTE: js下可以通过await关键词直接转换，但是ts会通不过语法检测
const asyncSetTheme = async () => {
  const currentThemeSource = await channelTheme.GetThemeSrc(); // 获取主题依据
  themeValue.value = currentThemeSource; // 反映到开关控件上
  if (currentThemeSource !== THEME_SYSTEM) {
    // 如果不跟随系统主题，则直接给指定的主题
    vueTheme.global.name.value = currentThemeSource;
  } else {
    // 否则获取当前是否使用暗色主题
    const isDark = await channelTheme.GetIsDark();
    vueTheme.global.name.value = isDark ? THEME_DARK : THEME_LIGHT;
    themeOptions.value[0].color = isDark ? "black" : "white";
  }
}
asyncSetTheme();
</script>

<style lang="scss" scoped>
@import url("./styles/index@default.scss");
</style>
