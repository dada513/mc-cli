const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
exports.ask = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (input) => {
      resolve(input);
    });
  });
};
