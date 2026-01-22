import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../src/hooks/useTheme';
import { themeNames } from '../src/themes';
import '../src/styles/global.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'cupertino',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: themeNames.map((name) => ({
          value: name,
          title: name.charAt(0).toUpperCase() + name.slice(1),
        })),
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'cupertino';
      return (
        <ThemeProvider defaultTheme={theme} key={theme}>
          <div
            style={{
              padding: '2rem',
              minHeight: '100vh',
              background: 'var(--sk-color-background)',
              color: 'var(--sk-color-text)',
              fontFamily: 'var(--sk-font-family)',
            }}
          >
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
