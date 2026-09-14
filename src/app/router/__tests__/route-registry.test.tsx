import { describe, expect, it } from 'vitest';
import routeRegistry from '../route-registry';

describe('routeRegistry', () => {
  it('attaches a custom error element to every registered feature route', () => {
    expect(Array.isArray(routeRegistry)).toBe(true);

    for (const route of routeRegistry) {
      expect(route.path).toBeDefined();
      expect(route.errorElement).toBeDefined();
    }
  });
});
