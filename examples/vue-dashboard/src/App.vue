<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div class="flex gap-2">
            <button
              v-for="view in views"
              :key="view.id"
              @click="currentView = view.id"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                currentView === view.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              {{ view.label }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <div class="mb-4">
        <p class="text-gray-600">
          Mock LLM-powered dashboard. Switch views to see different UI blocks.
        </p>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <RenderAIContent
          :response="currentResponse"
          @block-action="handleAction"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RenderAIContent } from '@mcp-interactive-ui/vue';
import type { NormalizedAIResponse } from '@mcp-interactive-ui/types';

const views = [
  { id: 'overview', label: 'Overview' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'comparison', label: 'Comparison' }
];

const currentView = ref('overview');

const mockResponses: Record<string, NormalizedAIResponse> = {
  overview: {
    version: '1.0',
    text: 'Here is your dashboard overview:',
    blocks: [
      {
        type: 'stat_group',
        id: 'key-metrics',
        data: {
          stats: [
            { label: 'Revenue', value: '$124,500', change: '+12%' },
            { label: 'Users', value: '8,432', change: '+5%' },
            { label: 'Orders', value: '1,234', change: '-2%' },
            { label: 'Conversion', value: '3.2%', change: '+0.5%' }
          ]
        }
      },
      {
        type: 'notice',
        id: 'alert',
        data: {
          type: 'info',
          title: 'Performance Update',
          message: 'Dashboard data refreshes every 5 minutes. Last updated: Just now'
        }
      }
    ]
  },
  metrics: {
    version: '1.0',
    text: 'Detailed metrics for this month:',
    blocks: [
      {
        type: 'metric_card',
        id: 'revenue-metric',
        data: {
          title: 'Monthly Revenue',
          value: '$124,500',
          subtitle: 'Target: $150,000',
          trend: { direction: 'up', value: '+12% vs last month' }
        }
      },
      {
        type: 'metric_card',
        id: 'users-metric',
        data: {
          title: 'Active Users',
          value: '8,432',
          subtitle: 'Daily active users',
          trend: { direction: 'up', value: '+5% vs last week' }
        }
      },
      {
        type: 'timeline',
        id: 'activity-timeline',
        data: {
          title: 'Recent Activity',
          events: [
            { id: '1', title: 'New order received', description: 'Order #1234 - $99.98', timestamp: '2024-01-15T10:30:00Z', status: 'completed' },
            { id: '2', title: 'Payment processed', description: 'Payment for Order #1233', timestamp: '2024-01-15T10:15:00Z', status: 'completed' },
            { id: '3', title: 'New user signup', description: 'user@example.com', timestamp: '2024-01-15T09:45:00Z', status: 'pending' }
          ]
        }
      }
    ]
  },
  tasks: {
    version: '1.0',
    text: 'Your task board:',
    blocks: [
      {
        type: 'kanban',
        id: 'task-board',
        data: {
          columns: [
            {
              id: 'todo',
              title: 'To Do',
              items: [
                { id: 't1', title: 'Review Q4 report', priority: 'high', tags: ['urgent'], dueDate: '2024-01-20' },
                { id: 't2', title: 'Update documentation', priority: 'medium' }
              ]
            },
            {
              id: 'in-progress',
              title: 'In Progress',
              items: [
                { id: 't3', title: 'Fix navigation bug', priority: 'high', assignee: { name: 'John', avatar: 'J' } }
              ]
            },
            {
              id: 'done',
              title: 'Done',
              items: [
                { id: 't4', title: 'Deploy v2.0', priority: 'high', tags: ['release'] }
              ]
            }
          ]
        }
      }
    ]
  },
  comparison: {
    version: '1.0',
    text: 'Plan comparison:',
    blocks: [
      {
        type: 'comparison_table',
        id: 'plan-comparison',
        data: {
          title: 'Subscription Plans',
          headers: ['Feature', 'Basic', 'Pro', 'Enterprise'],
          rows: [
            { Feature: 'Users', Basic: '5', Pro: '25', Enterprise: 'Unlimited' },
            { Feature: 'Storage', Basic: '10GB', Pro: '100GB', Enterprise: '1TB' },
            { Feature: 'Support', Basic: 'Email', Pro: 'Priority', Enterprise: '24/7 Dedicated' },
            { Feature: 'API Access', Basic: '✗', Pro: '✓', Enterprise: '✓' }
          ],
          highlightColumn: 2
        }
      },
      {
        type: 'button_group',
        id: 'plan-actions',
        data: {
          title: 'Choose your plan',
          buttons: [
            { id: 'basic', label: 'Start Basic', variant: 'secondary' },
            { id: 'pro', label: 'Start Pro', variant: 'primary' },
            { id: 'enterprise', label: 'Contact Sales', variant: 'secondary' }
          ]
        }
      }
    ]
  }
};

const currentResponse = computed(() => mockResponses[currentView.value]);

const handleAction = (action: string, payload: unknown) => {
  console.log('Dashboard action:', action, payload);
};
</script>
