async function generatePassword(length = 10) {
  const sets = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    number: "0123456789",
    symbol: "!@#$%^&*",
  };

  let password = [
    sets.lower[Math.floor(Math.random() * sets.lower.length)],
    sets.upper[Math.floor(Math.random() * sets.upper.length)],
    sets.number[Math.floor(Math.random() * sets.number.length)],
    sets.symbol[Math.floor(Math.random() * sets.symbol.length)],
  ];

  const allChars = sets.lower + sets.upper + sets.number + sets.symbol;
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password.push(allChars.charAt(randomIndex));
  }

  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
}

module.exports = { generatePassword };
