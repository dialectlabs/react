/**
 * Combines CSS class names into `class` attribute string
 * @param  {...any} classNames
 */
export default function classNames(
  ...classNames: Array<string | boolean | null | undefined>
): string {
  return classNames
    .filter(Boolean)
    .map((item) => (Array.isArray(item) ? item.join(' ') : item))
    .join(' ');
}
