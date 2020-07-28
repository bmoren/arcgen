#!/usr/bin/env node
const chalk = require('chalk');
const meow = require('meow');
const cliProcess = require('./modules/cli-process');

const cli = meow(
  chalk`
    {underline {green Initialize a new site:}}

      {blue $ arcgen init}

    {underline {green Build the current site and open with a live reload server:}}

      {blue $ arcgen start [options]}

      {magenta options:}
        {cyan -c, --config <file-path>}  Path to the config file (default: site.config.js)
        {cyan -p, --port <port-number>}  Port to use for local server (default: 3000)

    {underline {green Build the current site without a server:}}

      {blue $ arcgen build [options]}

    {underline {green generate srcset optimized images:}}

      {blue $ arcgen compress [options]}

      {magenta options:}
        {cyan -t, --type <image-file-extension>}  Force the image type for the compression, none respects the original filetype .jpg|.png|.webp|none (default: none)
        {cyan -d, --directory <file-path>}        Set the path for compressed images to be saved to (default: /srcset)
        {cyan -s, --maxsize <integer>}            Set the maximum image size in pixels, srcset will be divided down from this (default: 2000)
        {cyan -q, --quality <integer>}            Set the quality of the image exports; 1-100. Image type dependent. (default: 100)

    {underline {green arcgen options}}

      {cyan -h, --help}     Display this help text
      {cyan -v, --version}  Display arcgen version
  `,
  {
    flags: {
      config: {
        type: 'string',
        default: 'site.config.js',
        alias: 'c'
      },
      port: {
        type: 'string',
        default: '3000',
        alias: 'p'
      },

      type: {
        type: 'string',
        default: 'none',
        alias: 't'
      },
      directory: {
        type: 'string',
        default: '/srcset',
        alias: 'd'
      },
      maxsize: {
        type: 'string',
        default: '2000',
        alias: 's'
      },
      quality: {
        type: 'string',
        default: '100',
        alias: 'q'
      },

      help: {
        type: 'boolean',
        alias: 'h'
      },
      version: {
        type: 'boolean',
        alias: 'v'
      }
    }
  }
);

cliProcess(cli.input, cli.flags);
