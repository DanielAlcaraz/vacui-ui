export function isNavigationKey(event: KeyboardEvent): boolean {
  const navigationKeys: Record<string, boolean> = {
    PageUp: true,
    PageDown: true,
    ArrowUp: true,
    ArrowDown: true,
    ArrowLeft: true,
    ArrowRight: true,
    End: true,
    Home: true,
    Left: true,
    Right: true,
    Up: true,
    Down: true,
  };

  return navigationKeys[event.key] || false;
}
