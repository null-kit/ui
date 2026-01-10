import plugin from 'tailwindcss/plugin';

const PROPERTIES = {
  bg: 'background-color',
  text: 'color',
  border: 'border-color',
  'border-t': 'border-top-color',
  'border-b': 'border-bottom-color',
  'border-l': 'border-left-color',
  'border-r': 'border-right-color',
  ring: '--tw-ring-color',
  divide: 'border-color',
  outline: 'outline-color',
  from: '--tw-gradient-from',
  via: '--tw-gradient-via',
  to: '--tw-gradient-to'
} as const;

export default plugin(({ matchUtilities, theme }) => {
  const colors = Object.keys(theme('colors') || {}).reduce<Record<string, string>>((acc, key) => {
    acc[key] = `var(--color-${key})`;
    return acc;
  }, {});

  for (const [prefix, cssProp] of Object.entries(PROPERTIES)) {
    matchUtilities(
      {
        [`${prefix}-shade`]: (value, { modifier }) => ({
          [cssProp]: `color-mix(in oklab, ${value}, black ${modifier || '10'}%)`
        }),
        [`${prefix}-tint`]: (value, { modifier }) => ({
          [cssProp]: `color-mix(in oklab, ${value}, white ${modifier || '10'}%)`
        })
      },
      {
        values: colors,
        modifiers: 'any',
        type: 'any'
      }
    );
  }
});
