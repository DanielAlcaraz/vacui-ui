import type { Preview, StoryContext, Decorator } from '@storybook/angular';

export const backgroundStories: Decorator = (storyFn, context) => {
  const story = storyFn(context);
  return {
    ...story,
    template: `
    <div>${story.template}</div>
    `,
  };
};

const preview: Preview = {
  decorators: [backgroundStories],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
