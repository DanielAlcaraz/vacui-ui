import { generateRandomId } from './generate-id';

describe('generateRandomId', () => {
  test('should generate an ID of the correct length', () => {
    const length = 10;
    const id = generateRandomId(length);
    expect(id).toHaveLength(length);
  });

  test('should only contain valid alphanumeric characters', () => {
    const id = generateRandomId(20);
    expect(id).toMatch(/^[A-Za-z0-9]+$/);
  });

  test('should generate different IDs on subsequent calls', () => {
    const id1 = generateRandomId(15);
    const id2 = generateRandomId(15);
    expect(id1).not.toEqual(id2);
  });
});
