export function isSelectionKey(event: KeyboardEvent, newKeys: Record<string, boolean> = {}): boolean {
  const specialKeys: Record<string, boolean> = {
    Enter: true,
    ' ': true,
    Spacebar: true,
    Space: true,
    Tab: true,
  };

  const keys: Record<string, boolean> = Object.assign({}, specialKeys, newKeys);
  return keys[event.key] || false;
}
