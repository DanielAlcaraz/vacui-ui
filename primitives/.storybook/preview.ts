import type { Preview, StoryContext } from '@storybook/angular';
import { StoryFnAngularReturnType } from '@storybook/angular/dist/client/types';

//  class="bg-gradient-to-r from-cyan-500 to-blue-500 p-10"
export const backgroundStories = (
  storyFn: (context: StoryContext, storyArgs?: Record<string, any>) => StoryFnAngularReturnType,
  context: StoryContext,
) => {
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
