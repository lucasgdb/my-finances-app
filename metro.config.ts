/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

export = {
   transformer: {
      getTransformOptions: async () => ({
         transform: {
            experimentalImportSupport: false,
            inlineRequires: false,
         },
      }),
   },
};
