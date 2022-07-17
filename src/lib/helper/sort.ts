const stringSort = (a: string, b: string): number => {
  if (isNaN(+a) && isNaN(+b)) {
    return a.localeCompare(b);
  }

  if (isNaN(+a)) {
    return 1;
  }

  if (isNaN(+b)) {
    return -1;
  }

  return +a - +b;
};

export { stringSort };
