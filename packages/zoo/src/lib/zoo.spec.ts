import { vi } from 'vitest';
import { zoo } from './zoo.js';

vi.mock('@org/animal', () => ({
  getRandomAnimal: () => ({ name: 'dog', sound: 'woof' }),
}));

describe('zoo', () => {
  it('should work', () => {
    expect(zoo()).toEqual('[ZOO] dog says woof!');
  });
});
