import { ref, computed, provide, inject, type InjectionKey, type Component } from 'vue';
import type { BlockType } from '@mcp-interactive-ui/types';

export type BlockComponent = Component;

export interface BlockRegistry {
  components: Map<BlockType, BlockComponent>;
  register: (type: BlockType, component: BlockComponent) => void;
  unregister: (type: BlockType) => void;
  get: (type: BlockType) => BlockComponent | undefined;
  has: (type: BlockType) => boolean;
}

const BlockRegistryKey: InjectionKey<BlockRegistry> = Symbol('BlockRegistry');

export function useBlockRegistryProvider(customComponents: Partial<Record<BlockType, BlockComponent>> = {}) {
  const components = ref(new Map<BlockType, BlockComponent>());

  // Initialize with custom components
  Object.entries(customComponents).forEach(([type, component]) => {
    components.value.set(type as BlockType, component);
  });

  const register = (type: BlockType, component: BlockComponent) => {
    components.value.set(type, component);
  };

  const unregister = (type: BlockType) => {
    components.value.delete(type);
  };

  const get = (type: BlockType): BlockComponent | undefined => {
    return components.value.get(type);
  };

  const has = (type: BlockType): boolean => {
    return components.value.has(type);
  };

  const registry: BlockRegistry = {
    components: computed(() => components.value).value,
    register,
    unregister,
    get,
    has,
  };

  provide(BlockRegistryKey, registry);

  return registry;
}

export function useBlockRegistry(): BlockRegistry {
  const registry = inject(BlockRegistryKey);
  if (!registry) {
    throw new Error('useBlockRegistry must be used within a BlockRegistryProvider');
  }
  return registry;
}
