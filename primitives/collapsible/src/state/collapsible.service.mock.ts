import { signal } from '@angular/core';

export const mockCollapsibleStateService = () => {
  const open = signal(false);
  const disabled = signal(false);
  let contentId: string | null = null;

  function getContentId() {
    if (contentId) return contentId;

    contentId = 'collapsible-1';
    return contentId;
  }

  function toggleOpen() {
    if (!disabled()) {
      open.update((open) => !open);
    }
  }

  return {
    open,
    disabled,
    getContentId,
    toggleOpen,
  };
};
