const { average } = require('../utils/utils_for_tests')

describe('average', () => {
  test('of one number', () => {
    const received = average([1])
    expect(received).toBe(1)
  })
})
