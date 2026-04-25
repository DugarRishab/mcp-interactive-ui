<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div v-if="data.title || data.description" class="flex flex-col space-y-1.5 p-6 pb-0">
      <h3 v-if="data.title" class="text-2xl font-semibold leading-none tracking-tight">{{ data.title }}</h3>
      <p v-if="data.description" class="text-sm text-muted-foreground">{{ data.description }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="p-6">
      <div :class="layoutClass">
        <div v-for="field in data.fields" :key="field.name" class="space-y-2">
          <!-- Label for non-checkbox fields -->
          <label
            v-if="field.type !== 'checkbox'"
            :for="`${blockId}-${field.name}`"
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {{ field.label }}
            <span v-if="field.required" class="text-destructive ml-1">*</span>
          </label>

          <!-- Text/Email/Password/Number/etc input -->
          <input
            v-if="isTextField(field.type)"
            :id="`${blockId}-${field.name}`"
            :type="field.type"
            v-model="values[field.name]"
            :placeholder="field.placeholder"
            :disabled="field.disabled || isSubmitting"
            :required="field.required"
            @change="handleFieldChange(field)"
            @blur="handleFieldBlur(field)"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <!-- Textarea -->
          <textarea
            v-if="field.type === 'textarea'"
            :id="`${blockId}-${field.name}`"
            v-model="values[field.name]"
            :placeholder="field.placeholder"
            :disabled="field.disabled || isSubmitting"
            :required="field.required"
            @change="handleFieldChange(field)"
            @blur="handleFieldBlur(field)"
            rows="4"
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <!-- Select -->
          <select
            v-if="field.type === 'select'"
            :id="`${blockId}-${field.name}`"
            v-model="values[field.name]"
            :disabled="field.disabled || isSubmitting"
            :required="field.required"
            @change="handleFieldChange(field); handleFieldBlur(field)"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">{{ field.placeholder ?? 'Select...' }}</option>
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- Checkbox -->
          <div v-if="field.type === 'checkbox'" class="flex items-center space-x-2">
            <input
              :id="`${blockId}-${field.name}`"
              type="checkbox"
              v-model="values[field.name]"
              :disabled="field.disabled || isSubmitting"
              @change="handleFieldChange(field)"
              class="h-4 w-4 rounded border-primary text-primary focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <label
              :for="`${blockId}-${field.name}`"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {{ field.label }}
              <span v-if="field.required" class="text-destructive ml-1">*</span>
            </label>
          </div>

          <!-- Radio -->
          <div v-if="field.type === 'radio'" class="space-y-2">
            <div
              v-for="option in field.options"
              :key="option.value"
              class="flex items-center space-x-2"
            >
              <input
                :id="`${blockId}-${field.name}-${option.value}`"
                type="radio"
                :name="field.name"
                :value="option.value"
                v-model="values[field.name]"
                :disabled="field.disabled || option.disabled || isSubmitting"
                :required="field.required"
                @change="handleFieldChange(field)"
                class="h-4 w-4 border-primary text-primary focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <label
                :for="`${blockId}-${field.name}-${option.value}`"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {{ option.label }}
              </label>
            </div>
          </div>

          <!-- Multiselect -->
          <select
            v-if="field.type === 'multiselect'"
            :id="`${blockId}-${field.name}`"
            v-model="values[field.name]"
            multiple
            :disabled="field.disabled || isSubmitting"
            @change="handleFieldChange(field); handleFieldBlur(field)"
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- Error message -->
          <p v-if="errors[field.name]" class="text-sm font-medium text-destructive">{{ errors[field.name] }}</p>

          <!-- Help text -->
          <p v-if="!errors[field.name] && field.helpText" class="text-sm text-muted-foreground">{{ field.helpText }}</p>
        </div>
      </div>

      <!-- Form actions -->
      <div class="flex justify-end gap-2 mt-6">
        <button
          v-if="data.resetLabel"
          type="button"
          @click="handleReset"
          :disabled="isSubmitting"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          {{ data.resetLabel }}
        </button>
        <button
          v-if="data.cancelLabel"
          type="button"
          @click="handleCancel"
          :disabled="isSubmitting"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          {{ data.cancelLabel }}
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {{ isSubmitting ? 'Submitting...' : (data.submitLabel ?? 'Submit') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { FormInputData, FormField } from '@mcp-interactive-ui/types';

interface Props {
  data: FormInputData;
  blockId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string, payload: unknown];
}>();

// Default values for form fields
const getDefaultValue = (field: FormField): unknown => {
  if (field.defaultValue !== undefined) return field.defaultValue;
  if (field.type === 'checkbox') return false;
  if (field.type === 'multiselect') return [];
  return '';
};

// Initialize form values
const initialValues: Record<string, unknown> = {};
props.data.fields.forEach((field) => {
  initialValues[field.name] = getDefaultValue(field);
});

const values = ref<Record<string, unknown>>({ ...initialValues });
const errors = ref<Record<string, string | null>>({});
const isSubmitting = ref(false);

// Validate a single field
const validateField = (field: FormField, value: unknown): string | null => {
  if (field.required && (value === '' || value === undefined || value === null)) {
    return `${field.label} is required`;
  }

  if (field.validation && value !== '' && value !== undefined && value !== null) {
    const { min, max, minLength, maxLength, pattern, customError } = field.validation;

    if (min !== undefined && typeof value === 'number' && value < min) {
      return customError || `${field.label} must be at least ${min}`;
    }
    if (max !== undefined && typeof value === 'number' && value > max) {
      return customError || `${field.label} must be at most ${max}`;
    }
    if (minLength !== undefined && typeof value === 'string' && value.length < minLength) {
      return customError || `${field.label} must be at least ${minLength} characters`;
    }
    if (maxLength !== undefined && typeof value === 'string' && value.length > maxLength) {
      return customError || `${field.label} must be at most ${maxLength} characters`;
    }
    if (pattern !== undefined && typeof value === 'string' && !new RegExp(pattern).test(value)) {
      return customError || `${field.label} format is invalid`;
    }
  }

  return null;
};

const isTextField = (type: string) =>
  ['text', 'email', 'password', 'number', 'url', 'tel', 'date', 'datetime-local', 'time', 'color'].includes(type);

const layoutClass = computed(() => {
  const layout = props.data.layout ?? 'vertical';
  const columns = props.data.columns ?? 1;

  switch (layout) {
    case 'vertical':
      return 'space-y-4';
    case 'horizontal':
      return 'grid grid-cols-2 gap-4';
    case 'grid':
      return `grid grid-cols-${columns} gap-4`;
    default:
      return 'space-y-4';
  }
});

const handleFieldChange = (field: FormField) => {
  const value = values.value[field.name];
  const error = validateField(field, value);
  errors.value[field.name] = error;

  emit('action', 'field_change', {
    fieldName: field.name,
    value,
    isValid: !error,
  });
};

const handleFieldBlur = (field: FormField) => {
  const value = values.value[field.name];
  const error = validateField(field, value);
  errors.value[field.name] = error;

  emit('action', 'field_blur', {
    fieldName: field.name,
    value,
  });
};

const handleSubmit = async () => {
  // Validate all fields
  let isValid = true;
  const newErrors: Record<string, string | null> = {};

  props.data.fields.forEach((field) => {
    const error = validateField(field, values.value[field.name]);
    newErrors[field.name] = error;
    if (error) isValid = false;
  });

  errors.value = newErrors;

  if (!isValid) return;

  isSubmitting.value = true;

  try {
    emit('action', 'submit', {
      values: { ...values.value },
      isValid: true,
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  emit('action', 'cancel', {});
};

const handleReset = () => {
  const resetValues: Record<string, unknown> = {};
  props.data.fields.forEach((field) => {
    resetValues[field.name] = getDefaultValue(field);
  });
  values.value = resetValues;
  errors.value = {};
  emit('action', 'reset', {});
};
</script>
