import { capitalize } from '@app/utils/strings.utils';

test('The first letter is capitalized', () => {
  const titleLowerCase = 'hello world';
  const titleUpperCase = 'HELLO WORLD';
  const titleSentenceCase = 'Hello world';
  expect(capitalize(titleLowerCase)).toBe(titleSentenceCase);
  expect(capitalize(titleSentenceCase)).toBe(titleSentenceCase);
  expect(capitalize(titleUpperCase)).toBe(titleUpperCase);
});
