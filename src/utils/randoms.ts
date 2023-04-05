const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
} 

const randomNumbers = (target: number, min: number, max: number) => {
  const numbers: number[] = []
  while (numbers.length < 4) {

    const number = randomIntFromInterval(min, max)
      if(numbers.includes(number)) continue; else numbers.push(number)
  }
  return numbers
}

export { randomIntFromInterval, randomNumbers}