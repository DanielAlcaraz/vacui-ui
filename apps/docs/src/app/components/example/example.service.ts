import { Injectable, Type } from '@angular/core';

// Define the component cache entry structure
export interface ComponentCacheEntry {
  component: Type<unknown>;
  tsCode: string | null;
}

// Define the available demo components
const demoComponents = {
  accordion: () => import('../demo/accordion.component'),
  aspectRatio: () => import('../demo/aspect-ratio.component'),
  avatar: () => import('../demo/avatar.component'),
  checkbox: () => import('../demo/checkbox.component'),
  collapsible: () => import('../demo/collapsible.component'),
  dialog: () => import('../demo/dialog.component'),
  keyboardNavigation: () => import('../demo/keyboard-navigation.component'),
  label: () => import('../demo/label.component'),
  progress: () => import('../demo/progress.component'),
  radioGroup: () => import('../demo/radio-group.component'),
  select: () => import('../demo/select.component'),
  separator: () => import('../demo/separator.component'),
  slider: () => import('../demo/slider.component'),
  switch: () => import('../demo/switch.component'),
  tabs: () => import('../demo/tabs.component'),
  toggleGroup: () => import('../demo/toggle-group.component'),
  toggle: () => import('../demo/toggle.component'),
  tooltip: () => import('../demo/tooltip.component'),
};

export type DemoComponentName = keyof typeof demoComponents;

/**
 * Service that loads and caches demo components to prevent redundant imports
 */
@Injectable({
  providedIn: 'root'
})
export class DemoComponentService {
  // Cache to store loaded components
  private componentCache = new Map<DemoComponentName, ComponentCacheEntry>();

  /**
   * Loads a demo component, using cache when available
   * @param name Component name to load
   * @returns Promise with the component and its source code
   */
  async loadComponent(name: DemoComponentName): Promise<ComponentCacheEntry> {
    // Return from cache if available
    if (this.componentCache.has(name)) {
      const cachedComponent = this.componentCache.get(name);
      // Use a safe approach instead of non-null assertion
      if (cachedComponent) {
        return cachedComponent;
      }
    }
    
    try {
      // Import the component dynamically
      const demoModule = await demoComponents[name]();
      
      // Get component class from the module with proper typing
      const componentName = `${this.capitalizeFirstLetter(name)}Component`;
      
      // Use a type-safe approach for accessing dynamic module exports
      const component = this.getComponentFromModule(demoModule, componentName);
      
      if (!component) {
        throw new Error(`Component ${componentName} not found in module`);
      }
      
      // Get TypeScript code (can be implemented later)
      const tsCode = null; // Placeholder for actual code loading
      
      // Store in cache
      const entry = { component, tsCode };
      this.componentCache.set(name, entry);
      
      return entry;
    } catch (error) {
      console.error(`Failed to load component ${name}:`, error);
      throw error;
    }
  }
  
  /**
   * Safely get a component from a dynamically imported module
   * @param module The imported module
   * @param componentName The name of the component to extract
   * @returns The component class or undefined if not found
   */
  private getComponentFromModule(module: any, componentName: string): Type<unknown> | undefined {
    // Check if the module has the component
    if (module && typeof module === 'object' && componentName in module) {
      return module[componentName];
    }
    return undefined;
  }
  
  /**
   * Utility method to capitalize first letter
   */
  private capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  
  /**
   * Get all available component names
   */
  getAvailableComponents(): DemoComponentName[] {
    return Object.keys(demoComponents) as DemoComponentName[];
  }
  
  /**
   * Clear the component cache
   */
  clearCache(): void {
    this.componentCache.clear();
  }
}
