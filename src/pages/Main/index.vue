<template>
  <div class="main">
    <v-toolbar density="compact" :elevation="8" :title="i18n.t('web.main.app_title')">
      <v-spacer></v-spacer>

      <!-- 语言选择 -->
      <v-menu transition="slide-y-transition">
        <!-- 按钮 -->
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-translate" variant="text" v-bind="props"></v-btn>
        </template>
        <!-- 列表 -->
        <v-list density="compact">
          <v-list-subheader>{{ i18n.t("web.main.locale_options_title") }}</v-list-subheader>
          <v-list-item
            v-for="(item, i) in localeOptions"
            :key="i"
            :value="item.value"
            :active="item.value === localeValue"
            color="primary"
            @click="channelLocale.SetLocale(item.value)"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title v-text="item.label"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- 主题切换按钮 -->
      <MultiSwitch v-model="themeValue" size="24px" max-width="36px" :options="themeOptions"></MultiSwitch>
    </v-toolbar>
    <v-footer :border="true">
      <v-row justify="end" no-gutters>
        Copyright 2024&nbsp;<strong>XUYUXIANG</strong>
      </v-row>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive } from "vue";
import { useTheme } from 'vuetify';
import i18n from "@/libs/common/I18n";

import {
  THEME_SYSTEM,
  THEME_DARK,
  THEME_LIGHT,
} from '@/consts';
import ChannelTheme from "@/channels/Theme/web";
import ChannelLocale from "@/channels/Locale/web";
import ChannelProcess from "@/channels/Process/web";

import MultiSwitch from "@/global/components/MultiSwitch/index.vue";

const channelProcess = new ChannelProcess();
const channelLocale = new ChannelLocale();
const channelTheme = new ChannelTheme();

/** #region Theme */
const vueTheme = useTheme();

const themeOptions = ref<any[]>([
  { value: THEME_SYSTEM, icon: "mdi-cellphone-link" },
  { value: THEME_DARK, icon: "mdi-brightness-2" },
  { value: THEME_LIGHT, icon: "mdi-brightness-5" },
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
  }
})
// 系统的主题更新时触发回调
channelTheme.OnSysUpdated((ev: any, isDark: boolean) => {
  // 获取当前是否使用暗色主题
  vueTheme.global.name.value = isDark ? THEME_DARK : THEME_LIGHT;
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
  }
}
asyncSetTheme();
/** #endregion */

/** #region Locale */
const localeOptions = ref<any[]>(Object.keys(i18n.translations).map((key) => ({
  value: key, label: i18n.t(`locale.${key}.label`), icon: i18n.t(`locale.${key}.icon`),
})));
i18n.locale = navigator.language;
const localeValue = ref(i18n.locale);

channelLocale.OnLocaleChanged((ev: any, locale: string) => {
  i18n.locale = locale;
  localeValue.value = i18n.locale;
})
const asyncSetLocale = async () => {
  const locale = await channelLocale.GetLocale();
  i18n.locale = locale;
  localeValue.value = i18n.locale;
}
asyncSetLocale();
/** #endregion */
</script>

<style lang="scss" scoped>
@import url("./styles/index@default.scss");
</style>
