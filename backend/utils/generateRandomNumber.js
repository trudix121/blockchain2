function generateRandomNumber(length) {
    let min = 10 ** (length - 1);
    let max = 10 ** length - 1;
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    let timestamp = Date.now(); // Momentul generării codului
    return { code: randomNum, timestamp: timestamp };
  }
  

module.exports = generateRandomNumber