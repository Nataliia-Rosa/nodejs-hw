export const calculatePaginationData = (totalItems, perPage) => {
  if (totalItems === 0) {
    return 0;
  }

  return Math.ceil(totalItems / perPage);
};
