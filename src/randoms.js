const MAX_VALUE = 1000;
const MIN_VALUE = 1;
const DEFAULT_QUANTITY = 10000000;

const getRandoms = (data) => {
  let cantidad = data ? parseInt(data) : DEFAULT_QUANTITY;
  const array = [];
  for (let i = 0; i < cantidad; i++) {
    array.push(Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE);
  }
  return array;
};

process.on("message", (data) => {
  if (data[0] === "start") {
    const randoms = getRandoms(data[1]);
    process.send(randoms);
  }
});
