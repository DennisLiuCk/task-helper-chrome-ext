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
/* ═══════════════════════════════════════════════════════════
   CYBER INPUT - Terminal Data Entry Field
   ═══════════════════════════════════════════════════════════ */

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.input-label {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary-400);
  text-shadow: 0 0 5px rgba(0, 217, 255, 0.3);
}

.required {
  color: var(--error);
  margin-left: var(--spacing-1);
  font-size: var(--text-sm);
  text-shadow: 0 0 5px var(--error-glow);
}

.input-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  height: 40px;
  padding: 0 var(--spacing-3);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  background: rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

/* Scan line hover effect */
.input-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 217, 255, 0.1),
    transparent
  );
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 1;
}

.input-container:hover:not(.input-disabled)::before {
  left: 100%;
}

.input-container:hover:not(.input-disabled) {
  border-color: rgba(0, 217, 255, 0.5);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.2),
              inset 0 0 15px rgba(0, 0, 0, 0.5);
}

/* Focus state - Neon cyan glow */
.input-focused {
  border-color: var(--primary-500);
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.4),
              0 0 30px rgba(0, 217, 255, 0.2),
              inset 0 0 20px rgba(0, 217, 255, 0.05);
  background: rgba(0, 217, 255, 0.05);
}

.input-focused::before {
  display: none;
}

/* Terminal cursor effect on focus */
.input-focused::after {
  content: '';
  position: absolute;
  right: var(--spacing-3);
  width: 2px;
  height: 16px;
  background: var(--primary-500);
  animation: terminalBlink 1s step-end infinite;
  box-shadow: 0 0 5px rgba(0, 217, 255, 0.8);
}

/* Error state - Critical red glow */
.input-error {
  border-color: var(--error);
  box-shadow: 0 0 10px var(--error-glow),
              inset 0 0 10px rgba(255, 46, 99, 0.1);
  background: rgba(255, 46, 99, 0.05);
}

.input-error:focus-within {
  border-color: var(--error);
  box-shadow: 0 0 15px var(--error-glow),
              0 0 30px rgba(255, 46, 99, 0.2),
              inset 0 0 15px rgba(255, 46, 99, 0.08);
}

/* Disabled state - Deactivated terminal */
.input-disabled {
  background: rgba(0, 0, 0, 0.5);
  border-color: var(--border-weak);
  cursor: not-allowed;
  opacity: 0.5;
}

.input-disabled::before {
  display: none;
}

.input-field {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  color: var(--text-primary);
  outline: none;
  min-width: 0;
  position: relative;
  z-index: 2;
}

.input-field::placeholder {
  color: var(--text-disabled);
  opacity: 0.6;
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

/* Prefix and Suffix Icons */
.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  color: var(--primary-400);
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 3px rgba(0, 217, 255, 0.5));
}

.input-error .input-prefix,
.input-error .input-suffix {
  color: var(--error);
  filter: drop-shadow(0 0 3px var(--error-glow));
}

.input-icon {
  width: 16px;
  height: 16px;
}

/* Helper text - Terminal readout */
.input-helper {
  font-size: 10px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  margin: 0;
  padding-left: var(--spacing-1);
  letter-spacing: 0.03em;
}

.input-helper::before {
  content: '> ';
  color: var(--primary-500);
  opacity: 0.6;
}

.helper-error {
  color: var(--error);
  text-shadow: 0 0 5px var(--error-glow);
}

.helper-error::before {
  content: '! ';
  color: var(--error);
  font-weight: var(--font-bold);
}

/* Light Mode Adjustments */
:root[data-theme='light'] .input-container {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}

:root[data-theme='light'] .input-container:hover:not(.input-disabled) {
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.15),
              inset 0 0 10px rgba(0, 0, 0, 0.1);
}

:root[data-theme='light'] .input-focused {
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.3),
              inset 0 0 10px rgba(0, 217, 255, 0.05);
}

:root[data-theme='light'] .input-disabled {
  background: var(--gray-100);
  opacity: 0.7;
}

:root[data-theme='light'] .input-label {
  text-shadow: none;
}
</style>
