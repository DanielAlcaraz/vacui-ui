# Vacui UI

<div align="center">

![Vacui UI](https://img.shields.io/badge/Vacui%20UI-Headless%20Angular%20UI%20Library-7B42BC?style=for-the-badge)
[![npm version](https://img.shields.io/npm/v/@vacui-kit/primitives?style=flat-square)](https://www.npmjs.com/package/@vacui-kit/primitives)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Angular](https://img.shields.io/badge/Angular-17.3.0+-DD0031?style=flat-square&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**A fully customizable headless UI library for Angular applications**

</div>

## Features

- **Headless Architecture**: All the functionality without the styling constraints.
- **Highly Performant**: Built with performance in mind.
- **Accessibility-First**: Designed with ARIA standards from the ground up.
- **Modular Design**: Tree-shaking. Import only what you need.
- **TypeScript Powered**: Full type safety and great developer experience.

## Version

| Vacui UI Version | Angular Version | Status |
|-----------------|----------------|----------|
| 0.0.1           | 17.3.x, 18.x   | Legacy   |
| 0.0.2           | 19.x           | Legacy   |
| 0.0.3           | 19.x           | Legacy   |
| 0.0.4           | 20.x           | Current  |

## Installation

```bash
npm install @vacui-kit/primitives
```

## Getting Started

### Basic Usage

Import the modules for the primitives you want to use:

```typescript
import { CollapsiblePrimitivesModule } from "@vacui-kit/primitives/collapsible";
```

For more granular control, you can import specific directives:

```typescript
import { 
  CollapsibleRootDirective, 
  CollapsibleContentDirective, 
  CollapsibleTriggerDirective 
} from "@vacui-kit/primitives/collapsible";
```

### Using in Templates

Here's a simple example using the Collapsible component:

```html
<div vacCollapsibleRoot [(open)]="open">
  <div>
    <h3>Header content</h3>
    <button vacCollapsibleTrigger class="toggle-button">
      <icon [name]="open ? 'Up' : 'Down'"></icon>
    </button>
  </div>
  <div vacCollapsibleContent class="content">
    This is the content that will be shown or hidden based on the collapsible state.
  </div>
</div>
```

## Documentation

For comprehensive documentation and examples, visit our documentation site [https://vacui-ui.com](https://vacui-ui.com).

## Contributing (Coming soon)

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

### Development Setup

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm nx serve docs

# Running unit tests
pnpm nx test primitives

# Running storybook
pnpm nx storybook primitive
```

## License

Vacui UI is [MIT licensed](LICENSE).

## Acknowledgements

- Inspired by other headless UI libraries like [Radix UI](https://www.radix-ui.com/), [Headless UI](https://headlessui.dev/) and more.
