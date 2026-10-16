import test from 'node:test';
import assert from 'node:assert/strict';
import {
  findActiveLineIndex,
  formatTimestamp,
  parseTimestamp,
  cleanWord,
  checkSentenceOrder,
  calculateProgress,
} from './pureLogic.ts';
import type { LyricLine } from './types.ts';

test('formatTimestamp formats seconds accurately', () => {
  assert.equal(formatTimestamp(74.3), '01:14.3');
  assert.equal(formatTimestamp(74.3, false), '01:14');
  assert.equal(formatTimestamp(0), '00:00.0');
  assert.equal(formatTimestamp(null), '--:--');
});

test('parseTimestamp handles mm:ss, mm:ss.s, and raw seconds', () => {
  assert.equal(parseTimestamp('01:14.3'), 74.3);
  assert.equal(parseTimestamp('01:14'), 74);
  assert.equal(parseTimestamp('74.5'), 74.5);
  assert.equal(parseTimestamp('invalid'), null);
});

test('cleanWord strips punctuation marks', () => {
  assert.equal(cleanWord('¡hola!'), 'hola');
  assert.equal(cleanWord('¿cómo?'), 'cómo');
  assert.equal(cleanWord('sueño,'), 'sueño');
  assert.equal(cleanWord('fronteras.'), 'fronteras');
});

test('checkSentenceOrder verifies array of words', () => {
  const target = ['Soy', 'del', 'Río', 'de', 'la', 'Plata'];
  assert.equal(checkSentenceOrder(['Soy', 'del', 'Río', 'de', 'la', 'Plata'], target), true);
  assert.equal(checkSentenceOrder(['soy', 'del', 'río', 'de', 'la', 'plata'], target), true);
  assert.equal(checkSentenceOrder(['Soy', 'Río', 'del'], target), false);
});

test('calculateProgress returns bounded percentage', () => {
  assert.equal(calculateProgress(5, 10), 50);
  assert.equal(calculateProgress(0, 10), 0);
  assert.equal(calculateProgress(10, 10), 100);
  assert.equal(calculateProgress(0, 0), 0);
});

test('findActiveLineIndex locates correct line in sequence', () => {
  const mockLines: LyricLine[] = [
    {
      id: 'v1_1',
      section: 'VERSO 1',
      sectionTitle: 'Куплет 1',
      startTime: 10,
      endTime: 15,
      spanish: 'Con lágrimas en los ojos',
      russian: 'Со слезами на глазах',
    },
    {
      id: 'v1_2',
      section: 'VERSO 1',
      sectionTitle: 'Куплет 1',
      startTime: 15,
      endTime: 20,
      spanish: 'Viví lo duro que fue',
      russian: 'Я пережила',
    },
  ];

  assert.equal(findActiveLineIndex(mockLines, 5), -1);
  assert.equal(findActiveLineIndex(mockLines, 12), 0);
  assert.equal(findActiveLineIndex(mockLines, 17), 1);
  assert.equal(findActiveLineIndex(mockLines, 25), -1);
});
