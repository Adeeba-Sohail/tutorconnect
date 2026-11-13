// Automated test for RULE 1 (maximum 4 bookings per tutor per date/time slot).
// Run with:  npm test      (which runs: node --test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_BOOKINGS_PER_SLOT,
  checkSlotCapacity,
  countBookingsForSlot,
} from './capacityRule.js';

test('the limit is 4 bookings per slot', () => {
  assert.equal(MAX_BOOKINGS_PER_SLOT, 4);
});

test('valid: a slot with 1 booking can accept another', () => {
  const result = checkSlotCapacity(1);
  assert.equal(result.allowed, true);
  assert.equal(result.remaining, 3);
  assert.equal(result.status, 'open');
});

test('at the limit: a slot with 3 bookings still accepts the 4th (last place)', () => {
  const result = checkSlotCapacity(3);
  assert.equal(result.allowed, true);
  assert.equal(result.remaining, 1);
  assert.equal(result.status, 'last-place');
});

test('breaks the rule: a slot with 4 bookings is full and rejects a 5th', () => {
  const result = checkSlotCapacity(4);
  assert.equal(result.allowed, false);
  assert.equal(result.remaining, 0);
  assert.equal(result.status, 'full');
});

test('breaks the rule: more than 4 existing bookings is still rejected', () => {
  assert.equal(checkSlotCapacity(7).allowed, false);
});

test('invalid input (negative or fractional) is rejected safely', () => {
  assert.equal(checkSlotCapacity(-1).allowed, false);
  assert.equal(checkSlotCapacity(1.5).status, 'invalid');
});

test('countBookingsForSlot counts only the matching tutor, date and time', () => {
  const bookings = [
    { tutorId: 't01', date: '2026-12-01', time: '16:00' },
    { tutorId: 't01', date: '2026-12-01', time: '16:00' },
    { tutorId: 't01', date: '2026-12-01', time: '17:00' },
    { tutorId: 't02', date: '2026-12-01', time: '16:00' },
  ];
  assert.equal(countBookingsForSlot(bookings, 't01', '2026-12-01', '16:00'), 2);
  assert.equal(countBookingsForSlot(bookings, 't03', '2026-12-01', '16:00'), 0);
});
