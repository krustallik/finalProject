const test = require('node:test');
const assert = require('node:assert/strict');
require('reflect-metadata');

const {
    DEFAULT_PUBLIC_OFFENSE_PAGE_SIZE,
    MAX_PUBLIC_OFFENSE_PAGE_SIZE,
    decodePublicOffenseCursor,
    encodePublicOffenseCursor,
    parsePublicOffenseListQuery,
} = require('../dist/utils/offense-pagination.js');
const { plainToInstance } = require('class-transformer');
const { validate } = require('class-validator');
const { UpdateOffenseDto } = require('../dist/dtos/offense.dto.js');

test('public list query applies the default and bounded page sizes', () => {
    assert.deepEqual(parsePublicOffenseListQuery(undefined, undefined), {
        limit: DEFAULT_PUBLIC_OFFENSE_PAGE_SIZE,
        cursor: undefined,
    });
    assert.equal(parsePublicOffenseListQuery('1', undefined).limit, 1);
    assert.equal(parsePublicOffenseListQuery(String(MAX_PUBLIC_OFFENSE_PAGE_SIZE), undefined).limit, MAX_PUBLIC_OFFENSE_PAGE_SIZE);
    assert.throws(() => parsePublicOffenseListQuery('0', undefined), /Invalid report list limit/);
    assert.throws(() => parsePublicOffenseListQuery(String(MAX_PUBLIC_OFFENSE_PAGE_SIZE + 1), undefined), /between 1 and/);
    assert.throws(() => parsePublicOffenseListQuery(['10'], undefined), /Invalid report list limit/);
});

test('public list cursor round-trips and rejects malformed payloads', () => {
    const createdAt = new Date('2025-01-02T03:04:05.000Z');
    const id = '66f100000000000000000001';
    const token = encodePublicOffenseCursor(createdAt, id);
    assert.deepEqual(decodePublicOffenseCursor(token), { createdAt, id });
    assert.throws(() => decodePublicOffenseCursor('not-a-cursor'), /Invalid report list cursor/);
});

test('PATCH update validation rejects ownership fields and accepts declared fields', async () => {
    const options = { skipMissingProperties: true, whitelist: true, forbidNonWhitelisted: true };
    const malicious = plainToInstance(UpdateOffenseDto, { description: 'updated', user: '66f000000000000000000001' });
    const maliciousErrors = await validate(malicious, options);
    assert.ok(maliciousErrors.some((error) => error.property === 'user'));

    const valid = plainToInstance(UpdateOffenseDto, { description: 'updated' });
    assert.deepEqual(await validate(valid, options), []);
});
