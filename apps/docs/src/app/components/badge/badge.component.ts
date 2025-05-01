import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

type Color =
  | 'gray'
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink';

interface ColorStyles {
  background: string;
  text: string;
  ring: string;
}

@Component({
  selector: 'docs-badge',
  imports: [NgClass],
  standalone: true,
  template: `
    <span
      class="no-prose inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset"
      [ngClass]="[style.background, style.text, style.ring]"
    >
      {{ text }}
    </span>
  `,
})
export class BadgeComponent {
  @Input() color: Color = 'blue';
  @Input() text = 'Badge';

  private colors: Record<Color, ColorStyles> = {
    gray: {
      background: 'bg-gray-50 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-300',
      ring: 'ring-gray-500/10 dark:ring-gray-400/30',
    },
    red: {
      background: 'bg-red-50 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
      ring: 'ring-red-600/10 dark:ring-red-500/30',
    },
    yellow: {
      background: 'bg-yellow-50 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      ring: 'ring-yellow-600/20 dark:ring-yellow-500/30',
    },
    green: {
      background: 'bg-green-50 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
      ring: 'ring-green-600/20 dark:ring-green-500/30',
    },
    blue: {
      background: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      ring: 'ring-blue-700/10 dark:ring-blue-500/30',
    },
    indigo: {
      background: 'bg-indigo-50 dark:bg-indigo-900/30',
      text: 'text-indigo-700 dark:text-indigo-300',
      ring: 'ring-indigo-700/10 dark:ring-indigo-500/30',
    },
    purple: {
      background: 'bg-purple-50 dark:bg-purple-900/30',
      text: 'text-purple-700 dark:text-purple-300',
      ring: 'ring-purple-700/10 dark:ring-purple-500/30',
    },
    pink: {
      background: 'bg-pink-50 dark:bg-pink-900/30',
      text: 'text-pink-700 dark:text-pink-300',
      ring: 'ring-pink-700/10 dark:ring-pink-500/30',
    },
  };

  get style(): ColorStyles {
    return this.colors[this.color] || this.colors['gray'];
  }
}
