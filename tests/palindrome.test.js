const { palindrome } = require('../utils/utils_for_tests')

test('palindrome test', () => {
  const received = palindrome('oscar')
  expect(received).toBe('racso')
})
