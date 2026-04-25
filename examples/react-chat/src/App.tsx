import { useState, useRef, useEffect } from 'react';
import { RenderAIContent } from '@mcp-interactive-ui/react';
import type { NormalizedAIResponse, BlockAction } from '@mcp-interactive-ui/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';

// Mock LLM responses showcasing various UI blocks
const mockResponses: Record<string, NormalizedAIResponse> = {
  'order status': {
    text: 'Here is your order status:',
    blocks: [{
      type: 'data_table',
      id: 'orders-table',
      data: {
        title: 'Recent Orders',
        columns: [
          { key: 'id', header: 'Order ID' },
          { key: 'items', header: 'Items' },
          { key: 'status', header: 'Status' },
          { key: 'total', header: 'Total' }
        ],
        rows: [
          { id: '#1234', items: 'Widget Pro x2', status: 'Shipped', total: '$99.98' },
          { id: '#1235', items: 'Gadget Mini', status: 'Processing', total: '$49.99' },
          { id: '#1236', items: 'Super Tool Kit', status: 'Delivered', total: '$149.99' }
        ]
      }
    }]
  },
  'contact form': {
    text: 'Please fill out the form below:',
    blocks: [{
      type: 'form_input',
      id: 'contact-form',
      data: {
        title: 'Contact Us',
        fields: [
          { name: 'name', type: 'text', label: 'Name', required: true },
          { name: 'email', type: 'email', label: 'Email', required: true },
          { name: 'subject', type: 'text', label: 'Subject', required: true },
          { name: 'message', type: 'textarea', label: 'Message', required: true }
        ],
        submitLabel: 'Send Message'
      }
    }]
  },
  'show stats': {
    text: 'Here are your key metrics for this month:',
    blocks: [{
      type: 'stat_group',
      id: 'monthly-stats',
      data: {
        items: [
          { label: 'Total Revenue', value: '$24,500', hint: 'Monthly revenue', delta: { value: 12, direction: 'up', label: 'vs last month' } },
          { label: 'Active Users', value: '1,234', hint: 'Current active users', delta: { value: 8, direction: 'up', label: 'vs last month' } },
          { label: 'Churn Rate', value: '2.4%', hint: 'Monthly churn', delta: { value: 0.5, direction: 'down', label: 'vs last month' } },
          { label: 'Support Tickets', value: '18', hint: 'Open tickets', delta: { value: 3, direction: 'down', label: 'vs last week' } }
        ]
      }
    }]
  },
  'show notice': {
    text: 'Here are different notice types:',
    blocks: [
      {
        type: 'notice',
        id: 'notice-info',
        data: { variant: 'info', title: 'Information', message: 'This is an informational notice to keep you informed.' }
      },
      {
        type: 'notice',
        id: 'notice-success',
        data: { variant: 'success', title: 'Success!', message: 'Your changes have been saved successfully.' }
      },
      {
        type: 'notice',
        id: 'notice-warning',
        data: { variant: 'warning', title: 'Warning', message: 'Please review your settings before continuing.' }
      },
      {
        type: 'notice',
        id: 'notice-error',
        data: { variant: 'error', title: 'Error', message: 'Something went wrong. Please try again later.' }
      }
    ]
  },
  'show actions': {
    text: 'Here are some actions you can take:',
    blocks: [{
      type: 'button_group',
      id: 'action-buttons',
      data: {
        title: 'Quick Actions',
        description: 'Select an action to perform',
        actions: [
          { id: 'approve', label: 'Approve', variant: 'primary', icon: 'check' },
          { id: 'review', label: 'Review', variant: 'secondary', icon: 'eye' },
          { id: 'reject', label: 'Reject', variant: 'danger', icon: 'x' },
          { id: 'archive', label: 'Archive', variant: 'outline', icon: 'archive' }
        ],
        layout: 'horizontal',
        align: 'start'
      }
    }]
  },
  'show profile': {
    text: 'Here is the user profile information:',
    blocks: [{
      type: 'kv_card',
      id: 'user-profile',
      data: {
        title: 'John Doe',
        subtitle: 'Senior Developer',
        fields: [
          { label: 'Email', value: 'john.doe@example.com', type: 'text' },
          { label: 'Department', value: 'Engineering', type: 'badge' },
          { label: 'Location', value: 'San Francisco, CA', type: 'text' },
          { label: 'Website', value: 'johndoe.dev', type: 'link', href: 'https://johndoe.dev' },
          { label: 'Status', value: 'Active', type: 'badge' },
          { label: 'Joined', value: 'March 2022', type: 'text' }
        ]
      }
    }]
  },
  'show chart': {
    text: 'Here is the sales data visualization:',
    blocks: [{
      type: 'chart',
      id: 'sales-chart',
      data: {
        type: 'bar',
        title: 'Monthly Sales',
        description: 'Sales performance for the current quarter',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            { label: 'Revenue', data: [12000, 19000, 15000, 22000, 24000, 28000] },
            { label: 'Expenses', data: [8000, 12000, 10000, 14000, 16000, 18000] }
          ]
        }
      }
    }]
  },
  'show docs': {
    text: 'Here is the documentation:',
    blocks: [{
      type: 'markdown',
      id: 'documentation',
      data: {
        content: `# Getting Started\n\n## Installation\n\nInstall the package using npm:\n\n\`\`\`bash\nnpm install @mcp-interactive-ui/react\n\`\`\`\n\n## Quick Start\n\nImport and use the \`RenderAIContent\` component:\n\n\`\`\`tsx\nimport { RenderAIContent } from '@mcp-interactive-ui/react';\n\nfunction App() {\n  return <RenderAIContent data={aiResponse} />;\n}\n\`\`\`\n\n## Features\n\n- 25+ built-in block types\n- Themeable and customizable\n- Type-safe with TypeScript\n- Accessible by default`
      }
    }]
  },
  'show code': {
    text: 'Here is a code example:',
    blocks: [{
      type: 'code',
      id: 'code-example',
      data: {
        language: 'typescript',
        filename: 'example.ts',
        content: `function greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n\nconst message = greet('World');\nconsole.log(message);`,
        showLineNumbers: true,
        copyable: true
      }
    }]
  }
};

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  response?: NormalizedAIResponse;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true
    };

    // Find mock response or use default
    const responseKey = Object.keys(mockResponses).find(key =>
      input.toLowerCase().includes(key)
    );

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: responseKey ? 'Here\'s what I found:' : 'I received your message. Try asking about "order status", "contact form", "show stats", "show notice", "show actions", "show profile", "show chart", "show docs", or "show code" to see UI blocks in action.',
      isUser: false,
      response: responseKey ? mockResponses[responseKey] : undefined
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBlockAction = (action: BlockAction) => {
    console.log('Block action:', action);
    // Add system message showing the action
    const systemMessage: Message = {
      id: Date.now().toString(),
      text: `Action triggered: \`${action.action}\` on block \`${action.blockId}\` (type: ${action.blockType})`,
      isUser: false
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <Card className="h-[80vh] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6" />
              MCP Interactive UI - Chat Example
            </CardTitle>
            <CardDescription>
              Try: "order status", "contact form", "show stats", "show notice", "show actions",
              "show profile", "show chart", "show docs", or "show code"
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Send a message to see AI response blocks in action!</p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {msg.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div className={`max-w-[80%] space-y-2 ${msg.isUser ? 'items-end' : 'items-start'}`}>
                      <div className={`inline-block rounded-lg px-4 py-2 ${
                        msg.isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {msg.text}
                      </div>

                      {msg.response && (
                        <div className="bg-card border rounded-lg p-4 shadow-sm">
                          <RenderAIContent
                            data={msg.response}
                            onBlockAction={handleBlockAction}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default App;
