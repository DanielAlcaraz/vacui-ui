import { ElementRef, Injectable, computed, signal } from '@angular/core';
import { ActivationMode, Direction, Orientation, Tab } from '../models/tabs.model';

@Injectable()
export class TabsStateService {
  value = signal<string | null>(null);
  automatic = signal<boolean>(true);
  orientation = signal<Orientation>('horizontal');

  readonly selectedTab = computed<Tab | null>(() => {
    const selectedId = this.value();
    return selectedId ? this.tabsMap.get(selectedId) || null : null;
  });

  private tabsMap = new Map<string, Tab>();

  registerTab(id: string, elementRef: ElementRef, disabled: boolean) {
    const tab: Tab = { id, elementRef, disabled };
    this.tabsMap.set(id, tab);
  }

  unregisterTab(tabId: string) {
    this.tabsMap.delete(tabId);
  }

  getTab(id: string): Tab | undefined {
    return this.tabsMap.get(id);
  }

  getAllTabs(): Tab[] {
    return Array.from(this.tabsMap.values());
  }

  setTabDisabled(tabId: string, disabled: boolean) {
    if (this.tabsMap.has(tabId)) {
      const tab = this.tabsMap.get(tabId)!;
      if (tab.disabled !== disabled) {
        tab.disabled = disabled;
      }
    }
  }

  getNextTab(currentTabId: string): Tab | null {
    const tabs = this.getAllTabs();
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
    for (let i = 1; i <= tabs.length; i++) {
      const nextIndex = (currentIndex + i) % tabs.length;
      if (!tabs[nextIndex].disabled) {
        return tabs[nextIndex];
      }
    }

    return null;
  }

  getPreviousTab(currentTabId: string): Tab | null {
    const tabs = this.getAllTabs();
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTabId);
    for (let i = 1; i <= tabs.length; i++) {
      const prevIndex = (currentIndex - i + tabs.length) % tabs.length;
      if (!tabs[prevIndex].disabled) {
        return tabs[prevIndex];
      }
    }

    return null;
  }
}
