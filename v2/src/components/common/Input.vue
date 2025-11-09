<template>
  <div class="input-wrapper">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>

    <div
      :class="[
        'input-container',
        {
          'input-error': error,
          'input-disabled': disabled,
          'input-focused': isFocused,
        },
      ]"
    >
      <span v-if="$slots.prefix || prefixIcon" class="input-prefix">
        <slot name="prefix">
          <component v-if="prefixIcon" :is="prefixIcon" class="input-icon" />
        </slot>
      </span>

      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :readonly="readonly"
        :min="min"
        :max="max"
        :step="step"
        :autocomplete="autocomplete"
        class="input-field"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="emit('enter')"
      />

      <span v-if="$slots.suffix || suffixIcon" class="input-suffix">
        <slot name="suffix">
          <component v-if="suffixIcon" :is="suffixIcon" class="input-icon" />
        </slot>
      </span>
    </div>

    <p v-if="helperText || error" class="input-helper" :class="{ 'helper-error': error }">
      {{ error || helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Component } from 'vue';

interface Props {
  modelValue?: string | number;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  prefixIcon?: Component;
  suffixIcon?: Component;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  readonly: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [];
  blur: [];
  enter: [];
}>();

const inputRef = ref<HTMLInputElement>();
const isFocused = ref(false);

const inputId = computed(() => {
  return `input-${Math.random().toString(36).substr(2, 9)}`;
});

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function handleFocus() {
  isFocused.value = true;
  emit('focus');
}

function handleBlur() {
  isFocused.value = false;
  emit('blur');
}

function focus() {
  inputRef.value?.focus();
}

defineExpose({
  focus,
  inputRef,
});
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.input-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.required {
  color: var(--error);
  margin-left: 2px;
}

.input-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  height: 40px;
  padding: 0 var(--spacing-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  transition: var(--transition-all);
}

.input-container:hover:not(.input-disabled) {
  border-color: var(--border-strong);
}

.input-focused {
  border-color: var(--primary-500);
  box-shadow: var(--shadow-focus);
}

.input-error {
  border-color: var(--error);
}

.input-error:focus-within {
  border-color: var(--error);
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.2);
}

.input-disabled {
  background: var(--gray-100);
  cursor: not-allowed;
  opacity: 0.6;
}

.input-field {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--text-base);
  color: var(--text-primary);
  outline: none;
  min-width: 0;
}

.input-field::placeholder {
  color: var(--text-disabled);
}

.input-field:disabled {
  cursor: not-allowed;
}

/* Remove number input spinners */
.input-field[type='number']::-webkit-inner-spin-button,
.input-field[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-field[type='number'] {
  -moz-appearance: textfield;
}

.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.input-icon {
  width: 16px;
  height: 16px;
}

.input-helper {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin: 0;
}

.helper-error {
  color: var(--error);
}

/* Dark Mode */
:root[data-theme='dark'] .input-disabled {
  background: var(--surface-variant);
}
</style>
