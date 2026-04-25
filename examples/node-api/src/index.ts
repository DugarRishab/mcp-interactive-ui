import express from 'express';
import { blockRegistry, normalizeLLMResponse } from '@mcp-interactive-ui/core';

const app = express();
app.use(express.json());

// Mock registry
const mockRegistry = {
  getAvailableBlocks: () => ['data_table', 'kv_card', 'button_group', 'notice'],
  getBlockDefinition: () => undefined
};

// Mock LLM responses for different endpoints
const mockResponses: Record<string, object> = {
  '/api/orders': {
    text: 'Here are your recent orders:',
    blocks: [
      {
        type: 'data_table',
        id: 'orders-table',
        data: {
          title: 'Orders',
          columns: [
            { key: 'id', title: 'Order ID' },
            { key: 'customer', title: 'Customer' },
            { key: 'items', title: 'Items' },
            { key: 'total', title: 'Total' },
            { key: 'status', title: 'Status' }
          ],
          rows: [
            { id: '#1234', customer: 'Alice', items: '3', total: '$99.98', status: 'Shipped' },
            { id: '#1235', customer: 'Bob', items: '1', total: '$49.99', status: 'Processing' },
            { id: '#1236', customer: 'Carol', items: '5', total: '$249.95', status: 'Delivered' }
          ]
        }
      },
      {
        type: 'button_group',
        id: 'order-actions',
        data: {
          buttons: [
            { id: 'export', label: 'Export CSV', variant: 'secondary' },
            { id: 'new-order', label: 'New Order', variant: 'primary' }
          ]
        }
      }
    ]
  },
  '/api/user/profile': {
    text: 'Your profile information:',
    blocks: [
      {
        type: 'kv_card',
        id: 'profile-info',
        data: {
          title: 'User Profile',
          items: [
            { label: 'Name', value: 'John Doe' },
            { label: 'Email', value: 'john@example.com' },
            { label: 'Plan', value: 'Pro' },
            { label: 'Joined', value: '2023-01-15' }
          ]
        }
      },
      {
        type: 'button_group',
        id: 'profile-actions',
        data: {
          buttons: [
            { id: 'edit', label: 'Edit Profile', variant: 'primary' },
            { id: 'change-password', label: 'Change Password', variant: 'secondary' }
          ]
        }
      }
    ]
  },
  '/api/notifications': {
    text: 'You have 3 new notifications:',
    blocks: [
      {
        type: 'notice',
        id: 'welcome-notice',
        data: {
          type: 'info',
          title: 'Welcome!',
          message: 'Thanks for trying MCP Interactive UI. This is a notification example.'
        }
      },
      {
        type: 'notice',
        id: 'alert-notice',
        data: {
          type: 'warning',
          title: 'Storage Warning',
          message: 'You are using 85% of your storage quota.'
        }
      },
      {
        type: 'notice',
        id: 'success-notice',
        data: {
          type: 'success',
          title: 'Payment Successful',
          message: 'Your subscription has been renewed.'
        }
      }
    ]
  }
};

// Routes
app.get('/api/orders', (req, res) => {
  const response = normalizeLLMResponse(mockResponses['/api/orders'], mockRegistry);
  res.json(response);
});

app.get('/api/user/profile', (req, res) => {
  const response = normalizeLLMResponse(mockResponses['/api/user/profile'], mockRegistry);
  res.json(response);
});

app.get('/api/notifications', (req, res) => {
  const response = normalizeLLMResponse(mockResponses['/api/notifications'], mockRegistry);
  res.json(response);
});

// Dynamic endpoint with UI blocks
app.post('/api/generate-ui', (req, res) => {
  const { type, data } = req.body;

  let response;
  switch (type) {
    case 'stats':
      response = {
        text: 'Statistics generated:',
        blocks: [{
          type: 'kv_card',
          id: 'stats-card',
          data: {
            title: data.title || 'Statistics',
            items: data.items || []
          }
        }]
      };
      break;
    case 'table':
      response = {
        text: 'Data table:',
        blocks: [{
          type: 'data_table',
          id: 'data-table',
          data: {
            title: data.title || 'Data',
            columns: data.columns || [],
            rows: data.rows || []
          }
        }]
      };
      break;
    default:
      response = {
        text: 'Unknown block type. Use "stats" or "table".',
        blocks: []
      };
  }

  res.json(normalizeLLMResponse(response, mockRegistry));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'mcp-interactive-ui-example-api' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Node API Example running on http://localhost:${PORT}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`  GET  http://localhost:${PORT}/api/orders`);
  console.log(`  GET  http://localhost:${PORT}/api/user/profile`);
  console.log(`  GET  http://localhost:${PORT}/api/notifications`);
  console.log(`  POST http://localhost:${PORT}/api/generate-ui`);
  console.log(`  GET  http://localhost:${PORT}/health`);
});
