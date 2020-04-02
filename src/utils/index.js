export const getColor = (x, y) => {
  let color = 'black';
  if (x % 2 === y % 2) {
    color = 'white';
  }
  return color;
};
