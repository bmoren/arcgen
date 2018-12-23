# mcadgen

[![npm](https://img.shields.io/npm/v/mcadgen.svg)](https://www.npmjs.com/package/mcadgen)

Minimalist static site generator, powered by  [Node.js](https://nodejs.org/en/) & [nanogen](https://github.com/doug2k1/nanogen/) for use in [MCAD](http://mcad.edu) web & screen classes.

## Features
* Generate HTML pages from [EJS](http://ejs.co/) and/or Markdown files.
* The site can have a global layout (the common header, navigation, footer) and some pages may have a specific one.
* It can read site metadata from a global file and have specific data for individual pages.
* Allow partials (blocks of reusable interface components)

#### mcadgen expands upon nanogen with the following:
* copies local media to exact locations in the build process
* `page` is available in your template to get access to the current page's front matter & a list of local media as absolute files.
* generates a `pages` object, available in your template, containing all of the pages definitions across the entire site. The `pages` object has a few reserved keys you should not use in your front matter (they will be overwritten)
    * `url` – the url to the page
    * `media` – an array of absolute paths to the media files associated with each page
    * `depth` – the depth of each page in the folder structure

## Getting started

### Prerequisites

* [Node.js](https://nodejs.org/en/) installed (version 8 or above)

### Install

You may install it globally with:

```
npm i -g mcadgen
```

Or run the cli directly with npx (available with npm 5.2 or above):

```
npx mcadgen <command>
```

### Creating a new site

To create a brand new site, navigate to the folder you want your site to be and run:

```
mcadgen init
```

This will create a initial site structure like this:

```
/
  src/
    assets/
    layouts/
    pages/
    partials/
  site.config.js
```

To build the site and open it in a browser, run:

```
mcadgen start
```

There is already a default layout inside the `layouts` folder, but you may add more.

Read more about [Layouts](https://doug2k1.github.io/nanogen/docs/#layouts).

Inside the `pages` folder is where you put ejs, md or html files that will generate the pages of the final site. Any file name and folder structure used here will be transposed to the resulting site (without the `pages` part).

Read more about [Pages](https://doug2k1.github.io/nanogen/docs/#pages).

## Available commands and options

You may run `mcadgen -h` to see the available commands and options:

```
  Initialize a new site:

    $ mcadgen init

  Start the current site:

    $ mcadgen start [options]

  Build the current site:

    $ mcadgen build [options]

  Options
    -c, --config <file-path>  Path to the config file (default: site.config.js)
    -p, --port <port-number>  Port to use for local server (default: 3000)

    -h, --help                Display this help text
    -v, --version             Display mcadgen version
```

## Docs

[Read the full documentation for nanogen](https://doug2k1.github.io/nanogen)

## Running from a sub directory
MCADgen is intended to be used at the root of your site '/'. It's not advised but you can use it in a sub directory with the following steps:
+ upload your files to a subdirectory
+ [https://teamtreehouse.com/library/how-to-create-and-edit-an-htaccess-file](create a .htaccess file) (or modify the existing one) at the root subdirectory
+ add the rewrite settings below, while changing the subdirectory name (`coolsite`) to the appropriate sub directory name, and changing the url to your own url including the sub directory.

```
RewriteEngine on

RewriteCond %{HTTP_REFERER} ^http://mygreaturl.com/coolsite/
RewriteCond %{REQUEST_URI} !^/coolsite/
RewriteRule (.*) /coolsite/$1 [L,QSA]
```

## Authors
* **Derek Anderson && Ben Moren** – mcadgen
* **Douglas Matoso** - *Initial work* - [doug2k1](https://github.com/doug2k1)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
