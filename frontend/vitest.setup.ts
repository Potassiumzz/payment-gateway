import { beforeEach, vi } from 'vitest';

const createStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string): string | null => store[key] ?? null),
    setItem: vi.fn((key: string, value: string): void => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string): void => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number): string | null => Object.keys(store)[index] ?? null),
  };
};

const localMock = createStorageMock();
const sessionMock = createStorageMock();

Object.defineProperty(globalThis, 'localStorage', { value: localMock, configurable: true, writable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: sessionMock, configurable: true, writable: true });

beforeEach(() => {
  localMock.clear();
  sessionMock.clear();
  vi.clearAllMocks();
});

(globalThis as any).localStorageMock = localMock;
(globalThis as any).sessionStorageMock = sessionMock;

declare global {
  var localStorageMock: typeof localMock;
  var sessionStorageMock: typeof sessionMock;
}
