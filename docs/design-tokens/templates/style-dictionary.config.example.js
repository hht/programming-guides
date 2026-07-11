/**
 * Example Style Dictionary config (specs-only).
 * Copy semantics into the implementation repo; adjust paths to INPUTS.
 * Source format: W3C DTCG ($value / $type). Single transform toolchain.
 */
export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            selector: ':root',
          },
        },
      ],
    },
    // Optional — only if INPUTS §5 enables js:
    // js: {
    //   transformGroup: 'js',
    //   buildPath: 'src/styles/',
    //   files: [{ destination: 'tokens.js', format: 'javascript/es6' }],
    // },
  },
};
