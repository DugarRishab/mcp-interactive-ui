import {
  blockTypeSchema,
  type BlockDefinition,
  type BlockType,
} from '@mcp-interactive-ui/types';
import { BUILTIN_BLOCKS } from './defaults.js';

/**
 * Read-only view of a finalized registry. Consumers should treat this as opaque
 * and use the provided accessors. Created by `buildRegistry()`.
 */
export interface FrozenRegistry {
  readonly version: number;
  has(type: string): boolean;
  get(type: BlockType): BlockDefinition | undefined;
  all(): readonly BlockDefinition[];
  byCategory(category: BlockDefinition['category']): readonly BlockDefinition[];
}

const REGISTRY_VERSION = 1;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pending = new Map<string, BlockDefinition<any>>();
let frozen: FrozenRegistry | null = null;

/** Reset state. Intended for tests only. */
export function __resetRegistryForTests(): void {
  pending.clear();
  frozen = null;
}

function assertNotFrozen(): void {
  if (frozen) {
    throw new Error(
      'Registry has already been frozen via buildRegistry(); register blocks before building.',
    );
  }
}

/**
 * Register a block definition. Must be called BEFORE `buildRegistry()`.
 * Built-in blocks are auto-registered when `buildRegistry()` is first called.
 *
 * Throws if:
 *  - the registry is already frozen,
 *  - `type` collides with an already-registered block.
 */
export function registerBlock<T extends BlockType>(def: BlockDefinition<T>): void {
  assertNotFrozen();
  if (pending.has(def.type)) {
    throw new Error(`Block type "${def.type}" is already registered.`);
  }
  pending.set(def.type, def);
}

function registerBuiltinsOnce(): void {
  for (const b of BUILTIN_BLOCKS) {
    if (!pending.has(b.type)) pending.set(b.type, b);
  }
}

/**
 * Finalize the registry. Idempotent: subsequent calls return the same frozen instance.
 * After calling, `registerBlock()` will throw.
 */
export function buildRegistry(): FrozenRegistry {
  if (frozen) return frozen;
  registerBuiltinsOnce();

  // Phase 1: every registered type MUST be a known BlockType. Extension blocks
  // introducing new types are Phase 2+ territory.
  for (const type of pending.keys()) {
    if (!blockTypeSchema.safeParse(type).success) {
      throw new Error(
        `Block type "${type}" is not part of the Phase 1 closed set (${blockTypeSchema.options.join(', ')}).`,
      );
    }
  }

  const snapshot = new Map(pending);
  frozen = {
    version: REGISTRY_VERSION,
    has: (type) => snapshot.has(type),
    get: (type) => snapshot.get(type),
    all: () => Array.from(snapshot.values()),
    byCategory: (category) =>
      Array.from(snapshot.values()).filter((b) => b.category === category),
  };
  return frozen;
}

/** Convenience: build (or return existing) registry with just the built-ins. */
export function getDefaultRegistry(): FrozenRegistry {
  return buildRegistry();
}
