<template>
  <div class="showcase">
    <div class="showcase-header">
      <h1>Component Showcase</h1>
      <p>Preview of all base components in the design system</p>
    </div>

    <!-- Buttons Section -->
    <section class="showcase-section">
      <h2>Buttons</h2>

      <div class="showcase-group">
        <h3>Variants</h3>
        <div class="showcase-row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>

      <div class="showcase-group">
        <h3>Sizes</h3>
        <div class="showcase-row">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div class="showcase-group">
        <h3>States</h3>
        <div class="showcase-row">
          <Button :loading="true">Loading</Button>
          <Button :disabled="true">Disabled</Button>
          <Button :full-width="true">Full Width</Button>
        </div>
      </div>
    </section>

    <!-- Input Section -->
    <section class="showcase-section">
      <h2>Input Fields</h2>

      <div class="showcase-group">
        <h3>Basic Inputs</h3>
        <div class="showcase-column">
          <Input
            v-model="inputs.basic"
            label="Basic Input"
            placeholder="Enter text..."
          />
          <Input
            v-model="inputs.required"
            label="Required Input"
            placeholder="This is required"
            :required="true"
          />
          <Input
            v-model="inputs.helper"
            label="With Helper Text"
            helper-text="This is a helpful message"
            placeholder="Type something"
          />
          <Input
            v-model="inputs.error"
            label="With Error"
            error="This field has an error"
            placeholder="Error state"
          />
          <Input
            v-model="inputs.disabled"
            label="Disabled"
            :disabled="true"
            placeholder="Cannot edit"
          />
        </div>
      </div>

      <div class="showcase-group">
        <h3>Input Types</h3>
        <div class="showcase-column">
          <Input
            v-model="inputs.email"
            type="email"
            label="Email"
            placeholder="your@email.com"
          />
          <Input
            v-model="inputs.password"
            type="password"
            label="Password"
            placeholder="Enter password"
          />
          <Input
            v-model="inputs.number"
            type="number"
            label="Number"
            placeholder="Enter number"
          />
          <Input
            v-model="inputs.search"
            type="search"
            label="Search"
            placeholder="Search..."
          />
        </div>
      </div>
    </section>

    <!-- Badge Section -->
    <section class="showcase-section">
      <h2>Badges</h2>

      <div class="showcase-group">
        <h3>Semantic Variants</h3>
        <div class="showcase-row">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      <div class="showcase-group">
        <h3>Status Variants</h3>
        <div class="showcase-row">
          <Badge variant="na">N/A</Badge>
          <Badge variant="dev">DEV</Badge>
          <Badge variant="qa">QA</Badge>
          <Badge variant="uat">UAT</Badge>
          <Badge variant="done">DONE</Badge>
          <Badge variant="blocked">BLOCKED</Badge>
        </div>
      </div>

      <div class="showcase-group">
        <h3>Sizes</h3>
        <div class="showcase-row">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </div>
    </section>

    <!-- Dropdown Section -->
    <section class="showcase-section">
      <h2>Dropdowns</h2>

      <div class="showcase-group">
        <h3>Basic Dropdown</h3>
        <div class="showcase-row">
          <Dropdown>
            <template #trigger>
              <Button variant="secondary">Open Menu</Button>
            </template>
            <DropdownItem>Menu Item 1</DropdownItem>
            <DropdownItem>Menu Item 2</DropdownItem>
            <DropdownItem>Menu Item 3</DropdownItem>
            <DropdownItem variant="danger">Delete</DropdownItem>
          </Dropdown>

          <Dropdown placement="bottom-end">
            <template #trigger>
              <Button variant="ghost">Actions</Button>
            </template>
            <DropdownItem>Edit</DropdownItem>
            <DropdownItem>Duplicate</DropdownItem>
            <DropdownItem :disabled="true">Disabled Item</DropdownItem>
            <DropdownItem variant="danger">Remove</DropdownItem>
          </Dropdown>
        </div>
      </div>
    </section>

    <!-- Modal Section -->
    <section class="showcase-section">
      <h2>Modals</h2>

      <div class="showcase-group">
        <h3>Modal Sizes</h3>
        <div class="showcase-row">
          <Button @click="modals.small = true">Small Modal</Button>
          <Button @click="modals.medium = true">Medium Modal</Button>
          <Button @click="modals.large = true">Large Modal</Button>
          <Button @click="modals.xl = true">Extra Large Modal</Button>
        </div>
      </div>

      <!-- Small Modal -->
      <Modal
        v-model:show="modals.small"
        title="Small Modal"
        size="sm"
        description="This is a small modal dialog"
      >
        <p>This modal is sized for brief messages or simple confirmations.</p>
        <template #footer>
          <Button variant="ghost" @click="modals.small = false">Cancel</Button>
          <Button variant="primary" @click="modals.small = false">Confirm</Button>
        </template>
      </Modal>

      <!-- Medium Modal -->
      <Modal
        v-model:show="modals.medium"
        title="Medium Modal"
        size="md"
        description="This is a medium-sized modal dialog"
      >
        <p>This is the default modal size, suitable for most use cases.</p>
        <Input v-model="inputs.modalTest" label="Example Input" placeholder="Type here..." />
        <template #footer>
          <Button variant="ghost" @click="modals.medium = false">Cancel</Button>
          <Button variant="primary" @click="modals.medium = false">Save</Button>
        </template>
      </Modal>

      <!-- Large Modal -->
      <Modal
        v-model:show="modals.large"
        title="Large Modal"
        size="lg"
      >
        <p>This large modal provides more space for complex forms or detailed content.</p>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <Input v-model="inputs.field1" label="Field 1" />
          <Input v-model="inputs.field2" label="Field 2" />
          <Input v-model="inputs.field3" label="Field 3" />
        </div>
        <template #footer>
          <Button variant="ghost" @click="modals.large = false">Cancel</Button>
          <Button variant="primary" @click="modals.large = false">Submit</Button>
        </template>
      </Modal>

      <!-- Extra Large Modal -->
      <Modal
        v-model:show="modals.xl"
        title="Extra Large Modal"
        size="xl"
      >
        <p>This extra large modal is designed for comprehensive forms or data tables.</p>
        <div style="height: 400px; display: flex; align-items: center; justify-content: center; background: var(--surface); border-radius: var(--radius-md);">
          <p style="color: var(--text-secondary);">Large content area</p>
        </div>
        <template #footer>
          <Button variant="ghost" @click="modals.xl = false">Close</Button>
        </template>
      </Modal>
    </section>

    <!-- Toast Section -->
    <section class="showcase-section">
      <h2>Toasts</h2>

      <div class="showcase-group">
        <h3>Toast Notifications</h3>
        <div class="showcase-row">
          <Button variant="primary" @click="showSuccessToast">Success Toast</Button>
          <Button variant="secondary" @click="showErrorToast">Error Toast</Button>
          <Button variant="tertiary" @click="showWarningToast">Warning Toast</Button>
          <Button variant="ghost" @click="showInfoToast">Info Toast</Button>
        </div>
      </div>

      <div class="showcase-group">
        <h3>Toast Duration</h3>
        <div class="showcase-row">
          <Button @click="toast.success('Quick toast (1s)', 1000)">1 Second</Button>
          <Button @click="toast.success('Normal toast (3s)', 3000)">3 Seconds</Button>
          <Button @click="toast.success('Long toast (5s)', 5000)">5 Seconds</Button>
          <Button @click="toast.success('Persistent toast', 0)">No Auto-dismiss</Button>
        </div>
      </div>
    </section>

    <!-- Theme Toggle -->
    <section class="showcase-section">
      <h2>Theme</h2>
      <div class="showcase-group">
        <div class="showcase-row">
          <Button @click="toggleTheme">
            Toggle Theme (Current: {{ currentTheme }})
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from '@/components/common/Button.vue';
import Input from '@/components/common/Input.vue';
import Badge from '@/components/common/Badge.vue';
import Dropdown from '@/components/common/Dropdown.vue';
import DropdownItem from '@/components/common/DropdownItem.vue';
import Modal from '@/components/common/Modal.vue';
import { useToast } from '@/composables/useToast';

const toast = useToast();

// Input states
const inputs = ref({
  basic: '',
  required: '',
  helper: '',
  error: '',
  disabled: 'Cannot edit this',
  email: '',
  password: '',
  number: '',
  search: '',
  modalTest: '',
  field1: '',
  field2: '',
  field3: '',
});

// Modal states
const modals = ref({
  small: false,
  medium: false,
  large: false,
  xl: false,
});

// Toast functions
function showSuccessToast() {
  toast.success('Operation completed successfully!');
}

function showErrorToast() {
  toast.error('An error occurred. Please try again.');
}

function showWarningToast() {
  toast.warning('This action cannot be undone.');
}

function showInfoToast() {
  toast.info('Here is some useful information.');
}

// Theme toggle
const currentTheme = ref<'light' | 'dark'>('light');

function toggleTheme() {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme.value);
}
</script>

<style scoped>
.showcase {
  padding: var(--spacing-8);
  max-width: 1200px;
  margin: 0 auto;
}

.showcase-header {
  margin-bottom: var(--spacing-8);
}

.showcase-header h1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-2) 0;
}

.showcase-header p {
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin: 0;
}

.showcase-section {
  margin-bottom: var(--spacing-10);
  padding: var(--spacing-6);
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
}

.showcase-section h2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-6) 0;
  padding-bottom: var(--spacing-4);
  border-bottom: 2px solid var(--border);
}

.showcase-group {
  margin-bottom: var(--spacing-6);
}

.showcase-group:last-child {
  margin-bottom: 0;
}

.showcase-group h3 {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-4) 0;
}

.showcase-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  align-items: center;
}

.showcase-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  max-width: 400px;
}
</style>
