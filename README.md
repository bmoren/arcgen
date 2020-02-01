# arcgen

Minimalist static site generator, powered by  [Node.js](https://nodejs.org/en/) & [nanogen](https://github.com/doug2k1/nanogen/)

This version has a focus on archiving original media, meaning it has tools to re-format media allowing for originals to live along side compressed versions.

## Features
* Generate HTML pages from [EJS](http://ejs.co/) and/or Markdown files.
* The site can have a global layout (the common header, navigation, footer) and some pages may have a specific one.
* It can read site metadata from a global file and have specific data for individual pages.
* Allow partials (blocks of reusable interface components)

#### arcgen expands upon nanogen/mcadgen with the following:
* copies local media to exact locations in the build process (inside subdirectories on a page by page basis)
* `page` is available in your template to get access to the current page's front matter & a list of local media as root relative absolute file paths.
* generates a `pages` array, available in your template, containing json objects for each of the page definitions across the entire site. The `pages` objects has a few reserved keys you should not use in your front matter (they will be overwritten).
    * `url` – the root relative absolute url to the page
    * `media` – an array of root relative absolute paths to the media files associated with the page
    * `depth` – the depth of the page in the folder structure

## Getting started

### Prerequisites

* [Node.js](https://nodejs.org/en/) installed (version 8 or above)

### Install

You may install it globally with:

```
npm i -g arcgen
```

Or run the cli directly with npx (available with npm 5.2 or above):

```
npx arcgen <command>
```

### Creating a new site

To create a brand new site, navigate to the folder you want your site to be and run:

```
arcgen init
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
arcgen start
```

There is already a default layout inside the `layouts` folder, but you may add more.

Read more about [Layouts](https://doug2k1.github.io/nanogen/docs/#layouts).

Inside the `pages` folder is where you put ejs, md or html files that will generate the pages of the final site. Any file name and folder structure used here will be transposed to the resulting site (without the `pages` part).

Read more about [Pages](https://doug2k1.github.io/nanogen/docs/#pages).

## Available commands and options

You may run `arcgen -h` to see the available commands and options:

```
  Initialize a new site:

    $ arcgen init

  Start the current site:

    $ arcgen start [options]

  Build the current site:

    $ arcgen build [options]

  Options
    -c, --config <file-path>  Path to the config file (default: site.config.js)
    -p, --port <port-number>  Port to use for local server (default: 3000)

    -h, --help                Display this help text
    -v, --version             Display arcgen version
```

## Docs

[Read the full documentation for nanogen](https://doug2k1.github.io/nanogen)

## Authors
* **Ben Moren** – arcgen
* **Derek Anderson && Ben Moren** – mcadgen
* **Douglas Matoso** - *Initial work* - [doug2k1](https://github.com/doug2k1)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
