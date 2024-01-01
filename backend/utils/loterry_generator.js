function lotterygen() {
    const numereCastigatoare = [];
  
    while (numereCastigatoare.length < 6) {
      const numarGenerat = Math.floor(Math.random() * 49) + 1;
  
      // Verificăm dacă numărul generat nu există deja în array
      if (!numereCastigatoare.includes(numarGenerat)) {
        numereCastigatoare.push(numarGenerat);
      }
    }
  
    return numereCastigatoare.sort((a, b) => a - b);
  }

  module.exports = lotterygen