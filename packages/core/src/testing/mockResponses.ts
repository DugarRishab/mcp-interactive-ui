import type { NormalizedAIResponse, FormInputData, ButtonGroupData } from '@mcp-interactive-ui/types';

/**
 * Pre-built mock responses for testing interactive blocks.
 * These provide realistic LLM responses without requiring actual API calls.
 */

export const mockFormInputResponse: NormalizedAIResponse = {
  text: 'Please fill out the form below:',
  blocks: [
    {
      type: 'form_input',
      id: 'contact-form-1',
      data: {
        title: 'Contact Information',
        description: 'Please provide your contact details so we can reach you.',
        fields: [
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            placeholder: 'you@example.com',
            helpText: 'We will never share your email.',
            disabled: false,
          },
          {
            name: 'name',
            label: 'Full Name',
            type: 'text',
            required: true,
            placeholder: 'John Doe',
            disabled: false,
          },
          {
            name: 'phone',
            label: 'Phone Number',
            type: 'tel',
            required: false,
            placeholder: '+1 (555) 123-4567',
            disabled: false,
          },
          {
            name: 'newsletter',
            label: 'Subscribe to newsletter',
            type: 'checkbox',
            required: false,
            disabled: false,
          },
        ],
        submitLabel: 'Submit',
        cancelLabel: 'Cancel',
        layout: 'vertical',
      } as FormInputData,
    },
  ],
};

export const mockLoginFormResponse: NormalizedAIResponse = {
  text: 'Please sign in to continue:',
  blocks: [
    {
      type: 'form_input',
      id: 'login-form-1',
      data: {
        title: 'Sign In',
        fields: [
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            disabled: false,
          },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            required: true,
            disabled: false,
          },
          {
            name: 'remember',
            label: 'Remember me',
            type: 'checkbox',
            required: false,
            disabled: false,
          },
        ],
        submitLabel: 'Sign In',
        cancelLabel: 'Cancel',
        layout: 'vertical',
      } as FormInputData,
    },
  ],
};

export const mockSurveyFormResponse: NormalizedAIResponse = {
  text: 'Help us improve by answering a few questions:',
  blocks: [
    {
      type: 'form_input',
      id: 'survey-form-1',
      data: {
        title: 'Customer Satisfaction Survey',
        description: 'Your feedback helps us serve you better.',
        fields: [
          {
            name: 'satisfaction',
            label: 'How satisfied are you?',
            type: 'select',
            required: true,
            options: [
              { label: 'Very Satisfied', value: '5' },
              { label: 'Satisfied', value: '4' },
              { label: 'Neutral', value: '3' },
              { label: 'Dissatisfied', value: '2' },
              { label: 'Very Dissatisfied', value: '1' },
            ],
            disabled: false,
          },
          {
            name: 'recommend',
            label: 'Would you recommend us?',
            type: 'radio',
            required: true,
            options: [
              { label: 'Definitely', value: 'yes' },
              { label: 'Maybe', value: 'maybe' },
              { label: 'No', value: 'no' },
            ],
            disabled: false,
          },
          {
            name: 'feedback',
            label: 'Additional feedback',
            type: 'textarea',
            required: false,
            placeholder: 'Tell us more...',
            disabled: false,
          },
        ],
        submitLabel: 'Submit Survey',
        layout: 'vertical',
      } as FormInputData,
    },
  ],
};

export const mockButtonGroupResponse: NormalizedAIResponse = {
  text: 'What would you like to do?',
  blocks: [
    {
      type: 'button_group',
      id: 'action-buttons-1',
      data: {
        title: 'Choose an action',
        description: 'Select one of the following options:',
        actions: [
          {
            id: 'view-details',
            label: 'View Details',
            variant: 'primary',
            size: 'md',
            iconPosition: 'left',
            disabled: false,
            loading: false,
          },
          {
            id: 'edit',
            label: 'Edit',
            variant: 'secondary',
            size: 'md',
            iconPosition: 'left',
            disabled: false,
            loading: false,
          },
          {
            id: 'delete',
            label: 'Delete',
            variant: 'danger',
            size: 'md',
            iconPosition: 'left',
            disabled: false,
            loading: false,
            confirmation: {
              title: 'Confirm Delete',
              message: 'Are you sure you want to delete this item? This action cannot be undone.',
              confirmLabel: 'Delete',
              cancelLabel: 'Cancel',
              variant: 'danger',
            },
          },
          {
            id: 'cancel',
            label: 'Cancel',
            variant: 'ghost',
            size: 'md',
            iconPosition: 'left',
            disabled: false,
            loading: false,
          },
        ],
        layout: 'horizontal',
        align: 'start',
      } as ButtonGroupData,
    },
  ],
};

export const mockConfirmationResponse: NormalizedAIResponse = {
  text: 'Please confirm your choice:',
  blocks: [
    {
      type: 'button_group',
      id: 'confirm-buttons-1',
      data: {
        title: 'Are you sure?',
        description: 'This will permanently delete the selected items.',
        actions: [
          {
            id: 'confirm',
            label: 'Yes, Delete',
            variant: 'danger',
            size: 'md',
            iconPosition: 'left',
            disabled: false,
            loading: false,
          },
          {
            id: 'cancel',
            label: 'Cancel',
            variant: 'outline',
            size: 'md',
            iconPosition: 'left',
            disabled: false,
            loading: false,
          },
        ],
        layout: 'horizontal',
        align: 'center',
      } as ButtonGroupData,
    },
  ],
};

export const mockGridButtonsResponse: NormalizedAIResponse = {
  text: 'Select a category:',
  blocks: [
    {
      type: 'button_group',
      id: 'category-buttons-1',
      data: {
        title: 'Categories',
        actions: [
          { id: 'tech', label: 'Technology', variant: 'secondary', size: 'md', iconPosition: 'left', disabled: false, loading: false },
          { id: 'finance', label: 'Finance', variant: 'secondary', size: 'md', iconPosition: 'left', disabled: false, loading: false },
          { id: 'health', label: 'Health', variant: 'secondary', size: 'md', iconPosition: 'left', disabled: false, loading: false },
          { id: 'education', label: 'Education', variant: 'secondary', size: 'md', iconPosition: 'left', disabled: false, loading: false },
          { id: 'travel', label: 'Travel', variant: 'secondary', size: 'md', iconPosition: 'left', disabled: false, loading: false },
          { id: 'food', label: 'Food', variant: 'secondary', size: 'md', iconPosition: 'left', disabled: false, loading: false },
        ],
        layout: 'grid',
        align: 'stretch',
      } as ButtonGroupData,
    },
  ],
};

/**
 * All mock responses for easy access.
 */
export const mockResponses = {
  form: mockFormInputResponse,
  login: mockLoginFormResponse,
  survey: mockSurveyFormResponse,
  buttons: mockButtonGroupResponse,
  confirmation: mockConfirmationResponse,
  gridButtons: mockGridButtonsResponse,
};

/**
 * Get a mock response by name.
 */
export function getMockResponse(name: keyof typeof mockResponses): NormalizedAIResponse {
  return mockResponses[name];
}

/**
 * Generate a mock response based on a user query.
 * This simulates what an LLM might return for common queries.
 */
export function generateMockResponse(query: string): NormalizedAIResponse {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('login') || lowerQuery.includes('sign in')) {
    return mockLoginFormResponse;
  }
  if (lowerQuery.includes('contact') || lowerQuery.includes('form')) {
    return mockFormInputResponse;
  }
  if (lowerQuery.includes('survey') || lowerQuery.includes('feedback')) {
    return mockSurveyFormResponse;
  }
  if (lowerQuery.includes('button') || lowerQuery.includes('choose') || lowerQuery.includes('select')) {
    return mockButtonGroupResponse;
  }
  if (lowerQuery.includes('confirm') || lowerQuery.includes('delete')) {
    return mockConfirmationResponse;
  }
  if (lowerQuery.includes('category') || lowerQuery.includes('grid')) {
    return mockGridButtonsResponse;
  }

  // Default response
  return {
    text: `I received your message: "${query}". Here is a generic response.`,
    blocks: [],
  };
}
