const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

/**
 * Building config using function,
 * function parameter env='production' or 'development'
 */
module.exports = (env) => {
  const config = {};
  const isDevelopment = env === 'development';
  const isProduction = env === 'production';

  const CleanPlugin = new CleanWebpackPlugin();

  const HtmlPlugin = new HtmlWebpackPlugin({
    template: './src/index.html',
    favicon: './src/assets/img/favicon.ico',
    chunksSortMode: 'none'
  });

  const DefinePlugin = new webpack.DefinePlugin({
    ENVIRONMENT: JSON.stringify(env),
  });

  config.entry = ['babel-polyfill', './src/index.js'];

  config.module = {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: {
                mode: 'local',
                localIdentName: '[name]_[local]',
              }
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2|gif|png)$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      }
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-inline-loader?removeSVGTagAttrs=false&removeTags=true&removingTags[]=title&removingTags[]=desc&idPrefix=[sha512:hash:hex:5]-',
      // },
    ]
  };

  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial'
        }
      }
    },
    runtimeChunk: {
      name: 'manifest'
    },
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: false,
        uglifyOptions: {
          ecma: 8,
          mangle: false,
          keep_classname: true,
          keep_fnames: true
        }
      })
    ]
  };

  if (isProduction) {
    config.mode = 'production';

    config.output = {
      path: path.join(__dirname, 'dist'),
      chunkFilename: '[name].[chunkhash].bundle.js',
      filename: '[name].[chunkhash].bundle.js'
    };

    config.plugins = [CleanPlugin, HtmlPlugin, DefinePlugin];
  }

  if (isDevelopment) {
    const AnalyzerPlugin = new BundleAnalyzerPlugin({
      analyzerMode: 'none'
    });

    config.mode = 'development';

    config.devtool = 'eval-source-map';

    config.output = {
      path: path.join(__dirname, 'dist'),
      chunkFilename: '[name].bundle.js',
      filename: '[name].bundle.js'
    };

    config.plugins = [CleanPlugin, HtmlPlugin, AnalyzerPlugin, DefinePlugin];
  }

  return config;
};