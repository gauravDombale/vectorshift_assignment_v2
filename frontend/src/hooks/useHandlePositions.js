// useHandlePositions.js
// Helper to compute evenly distributed 'top' positions for handles on a node
export const useHandlePositions = (count, options = {}) => {
  // options: { singleCentered: true }
  const positions = [];
  if (!count || count <= 0) return positions;
  if (count === 1 || options.singleCentered) {
    positions.push('50%');
    return positions;
  }

  const spacing = 100 / (count + 1);
  for (let i = 0; i < count; i++) {
    positions.push(`${spacing * (i + 1)}%`);
  }

  return positions;
};

export default useHandlePositions;
