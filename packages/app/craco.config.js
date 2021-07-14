const path = require('path');

module.exports = {
  babel: {
    loaderOptions: (babelLoaderOptions, { env, paths }) => {

      const arr = babelLoaderOptions.include || [];
      babelLoaderOptions.include = [
        ...arr,
        path.resolve('src'),
        path.resolve('../common'),
      ];

      return babelLoaderOptions;
    }
  },
};
