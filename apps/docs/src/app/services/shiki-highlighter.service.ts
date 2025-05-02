import { Injectable } from '@angular/core';
import {
  createHighlighter,
  Highlighter,
  bundledLanguages,
  bundledThemes,
  BundledTheme,
  BundledLanguage,
} from 'shiki';

@Injectable({
  providedIn: 'root',
})
export class ShikiHighlighterService {
  private highlighter: Highlighter | null = null;
  private initializationPromise: Promise<Highlighter> | null = null;
  private loadedThemes = new Set<string>();
  private loadedLanguages = new Set<string>();

  /**
   * Get or initialize a highlighter with the given themes and languages
   */
  async getHighlighter(
    themes: string[] = [],
    langs: string[] = []
  ): Promise<Highlighter> {
    // If highlighter is already initialized, ensure themes/langs are loaded and return it
    if (this.highlighter) {
      await this.ensureLoaded(themes, langs);
      return this.highlighter;
    }

    // If initialization is in progress, wait for it to complete
    if (this.initializationPromise) {
      await this.initializationPromise;
      // Now highlighter should be initialized, so ensure themes/langs and return it
      if (this.highlighter) {
        await this.ensureLoaded(themes, langs);
        return this.highlighter;
      }
    }

    // Otherwise, initialize the highlighter
    this.initializationPromise = this.initializeHighlighter(themes, langs);
    this.highlighter = await this.initializationPromise;
    return this.highlighter;
  }

  /**
   * Initialize the highlighter with the given themes and languages
   */
  private async initializeHighlighter(
    themes: string[],
    langs: string[]
  ): Promise<Highlighter> {
    // Define default themes and languages if none provided
    const themesToLoad = themes.length > 0 ? themes : ['github-dark'];
    const langsToLoad = langs.length > 0 ? langs : ['text'];

    // Filter themes and languages to ensure they're valid bundled options
    const validThemes: BundledTheme[] = themesToLoad
      .filter((theme) => this.isThemeAvailable(theme))
      .map((theme) => theme as BundledTheme);

    const validLangs: BundledLanguage[] = langsToLoad
      .filter((lang) => this.isLanguageAvailable(lang))
      .map((lang) => lang as BundledLanguage);

    try {
      const highlighter = await createHighlighter({
        themes: validThemes,
        langs: validLangs,
      });

      // Record loaded themes and languages
      validThemes.forEach((theme) => this.loadedThemes.add(theme));
      validLangs.forEach((lang) => this.loadedLanguages.add(lang));

      return highlighter;
    } catch (error) {
      console.error('Failed to initialize Shiki highlighter:', error);
      throw error;
    } finally {
      // Clear the initialization promise to allow retries if failed
      this.initializationPromise = null;
    }
  }

  /**
   * Ensure all requested themes and languages are loaded
   */
  private async ensureLoaded(themes: string[], langs: string[]): Promise<void> {
    if (!this.highlighter) {
      console.warn(
        'Cannot load themes/languages: highlighter is not initialized'
      );
      return;
    }

    // Filter for only valid bundled themes that aren't already loaded
    const themesToLoad = themes
      .filter(
        (theme) => this.isThemeAvailable(theme) && !this.loadedThemes.has(theme)
      )
      .map((theme) => theme as BundledTheme);

    // Filter for only valid bundled languages that aren't already loaded
    const langsToLoad = langs
      .filter(
        (lang) =>
          this.isLanguageAvailable(lang) && !this.loadedLanguages.has(lang)
      )
      .map((lang) => lang as BundledLanguage);

    // Load any missing themes
    for (const theme of themesToLoad) {
      try {
        await this.highlighter.loadTheme(theme);
        this.loadedThemes.add(theme);
      } catch (error) {
        console.warn(`Failed to load theme "${theme}":`, error);
      }
    }

    // Load any missing languages
    for (const lang of langsToLoad) {
      try {
        await this.highlighter.loadLanguage(lang);
        this.loadedLanguages.add(lang);
      } catch (error) {
        console.warn(`Failed to load language "${lang}":`, error);
      }
    }
  }

  /**
   * Check if a theme is available in the bundled themes
   */
  isThemeAvailable(theme: string): boolean {
    return theme in bundledThemes;
  }

  /**
   * Check if a language is available in the bundled languages
   */
  isLanguageAvailable(lang: string): boolean {
    return lang in bundledLanguages;
  }

  /**
   * Get a list of all available theme names
   */
  getAvailableThemes(): string[] {
    return Object.keys(bundledThemes);
  }

  /**
   * Get a list of all available language names
   */
  getAvailableLanguages(): string[] {
    return Object.keys(bundledLanguages);
  }
}
