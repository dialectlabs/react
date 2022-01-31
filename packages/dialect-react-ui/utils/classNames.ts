/**
 * Combines CSS class names into `class` attribute string
 * @param  {...any} classNames
 */
export default (...classNames) => {
  return classNames
    .filter(Boolean)
    .map((item) => (Array.isArray(item) ? item.join(' ') : item))
    .join(' ');
};
