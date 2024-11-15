<template>
  <v-slider
    v-model="slideValue"
    class="multi_switch"
    thumb-label="always"
    track-fill-color="transparent"
    :min="-1"
    :max="max"
    :step="1"
    :color="color"
    :show-ticks="false"
    :hide-details="true"
    :thumb-size="size"
    :track-size="size"
    :max-width="maxWidth"
    readonly
    @click.capture="onClick"

    v-bind="$attrs"
  >
    <template #thumb-label>
      <v-icon v-if="icon" :icon="icon" />
    </template>
  </v-slider>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: { type: null, default: null },
  options: { type: Array, default: null },
  size: { type: String, default: "20px" },
  maxWidth: { type: String, default: "0px" },
})
const emits = defineEmits(["update:modelValue"])

const slideValue = ref(0);

const max = computed(() => {
  return props.options?.length || 0;
})
const icon = computed(() => {
  const options: any[] = props.options;
  return options?.[slideValue.value]?.icon;
})
const color = computed(() => {
  const options: any[] = props.options;
  return options?.[slideValue.value]?.color ?? "surface";
})

watch(() => props.modelValue, () => {
  const options: any[] = props.options;
  slideValue.value = options?.findIndex((o) => o.value === props.modelValue) || 0;
})

const onClick = () => {
  const nextSlideValue = max.value ? (slideValue.value + 1) % max.value : 0;
  const options: any[] = props.options;
  const newValue = options?.[nextSlideValue]?.value;
  emits("update:modelValue", newValue);
}
</script>

<style lang="scss" scoped>
@import url("./styles/index@default.scss");
</style>
