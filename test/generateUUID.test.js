const generateUUID = require('../modules/generateUUID');

describe('generateUUID', () => {
  test('should generate a valid UUID', () => {
    const uuid = generateUUID("test@test.com");
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    expect(uuid.uuid).toMatch(uuidRegex);
  });

  test('should generate unique UUIDs', () => {
    const uuid1 = generateUUID("test1@test.com");
    const uuid2 = generateUUID("test2@test.com");
    expect(uuid1.uuid).not.toBe(uuid2.uuid);
  });

  test('shouldn\'t generate unique UUIDs', () => {
    const notEmail = "notanemail";
    const uuid1 = generateUUID(notEmail);
    expect(uuid1.email).toBe(notEmail);
    expect(uuid1.email).not.toBe(null);
    expect(uuid1.uuid).toBe(null);
  });
});