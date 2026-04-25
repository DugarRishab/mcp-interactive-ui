<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <h3 v-if="data.title" class="text-lg font-semibold mb-4">{{ data.title }}</h3>

    <div class="space-y-1">
      <TreeNode
        v-for="node in data.nodes"
        :key="node.id"
        :node="node"
        :level="0"
        :expandable="data.expandable ?? true"
        @select="handleSelect"
        @toggle="handleToggle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed } from 'vue';
import type { TreeData, TreeNode as TreeNodeType } from '@mcp-interactive-ui/types';

interface Props {
  data: TreeData;
  blockId?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  action: [action: string, payload: unknown];
}>();

const expandedNodes = ref<Set<string>>(new Set());
const selectedNode = ref<string | null>(null);

const handleSelect = (node: TreeNodeType) => {
  selectedNode.value = node.id;
  emit('action', 'node_select', {
    nodeId: node.id,
    nodeLabel: node.label,
  });
};

const handleToggle = (node: TreeNodeType) => {
  const newSet = new Set(expandedNodes.value);
  if (newSet.has(node.id)) {
    newSet.delete(node.id);
  } else {
    newSet.add(node.id);
  }
  expandedNodes.value = newSet;

  emit('action', 'node_toggle', {
    nodeId: node.id,
    nodeLabel: node.label,
    expanded: newSet.has(node.id),
  });
};

// Tree Node Component
const TreeNode = {
  props: ['node', 'level', 'expandable'],
  emits: ['select', 'toggle'],
  setup(props: { node: TreeNodeType; level: number; expandable: boolean }, { emit }: { emit: (event: string, ...args: unknown[]) => void }) {
    const hasChildren = computed(() => props.node.children && props.node.children.length > 0);
    const isExpanded = computed(() => expandedNodes.value.has(props.node.id));
    const isSelected = computed(() => selectedNode.value === props.node.id);

    const indent = computed(() => `${props.level * 1.5}rem`);

    const toggle = () => {
      if (hasChildren.value && props.expandable) {
        emit('toggle', props.node);
      }
    };

    const select = () => {
      emit('select', props.node);
    };

    return () => h('div', {}, [
      h('div', {
        class: [
          'flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors',
          isSelected.value ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
        ],
        style: { paddingLeft: `calc(0.5rem + ${indent.value})` },
        onClick: select,
      }, [
        // Expand/collapse icon
        hasChildren.value && props.expandable
          ? h('button', {
              class: 'w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-foreground',
              onClick: (e: Event) => {
                e.stopPropagation();
                toggle();
              },
            }, isExpanded.value ? '▼' : '▶')
          : h('span', { class: 'w-4' }),

        // Node icon
        props.node.icon
          ? h('span', { class: 'text-muted-foreground' }, props.node.icon)
          : hasChildren.value
            ? h('span', { class: 'text-muted-foreground' }, isExpanded.value ? '📂' : '📁')
            : h('span', { class: 'text-muted-foreground' }, '📄'),

        // Label
        h('span', { class: 'text-sm' }, props.node.label),

        // Badge
        props.node.badge
          ? h('span', { class: 'ml-auto text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground' },
              props.node.badge)
          : null,
      ]),

      // Children
      hasChildren.value && isExpanded.value
        ? h('div', {},
            props.node.children!.map((child: TreeNodeType) =>
              h(TreeNode, {
                node: child,
                level: props.level + 1,
                expandable: props.expandable,
                onSelect: (node: TreeNodeType) => emit('select', node),
                onToggle: (node: TreeNodeType) => emit('toggle', node),
              })
            )
          )
        : null,
    ]);
  },
};
</script>
