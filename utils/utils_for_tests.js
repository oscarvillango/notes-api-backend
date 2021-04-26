const palindrome = (text) => text.replace(' ', '').split('').reverse().join('')

const average = (numbers) => {
  let sum = 0

  numbers.forEach(element => {
    sum += element
  })

  return sum / numbers.length
}

module.exports = {
  palindrome,
  average
}
