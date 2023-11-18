function isCodeValid(code, timestamp) {
    const currentTime = Date.now();
    const codeTimestamp = parseInt(timestamp);
    const validityPeriod = 5 * 60 * 1000; // 5 minute în milisecunde
    return currentTime - codeTimestamp <= validityPeriod && code !== '';
  }

  

module.exports = isCodeValid