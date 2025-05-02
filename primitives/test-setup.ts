// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};
import 'jest-preset-angular/setup-jest';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))


// https://github.com/jsdom/jsdom/issues/1245
function getVisibleText(element: Element): string {
  const visibleText = Array.from(element.childNodes)
    .filter((node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const style = window.getComputedStyle(node as Element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }
      return node.nodeType === Node.TEXT_NODE;
    })
    .map((node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return getVisibleText(node as Element);
      }
      return node.textContent;
    })
    .join('');

  return visibleText.replace(/\s+/g, ' ').trim();
}

function setupInnerTextPatch() {
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    get() {
      return getVisibleText(this);
    },
    set(text: string) {
      this.textContent = text;
    },
    configurable: true,
  });
}

setupInnerTextPatch();
