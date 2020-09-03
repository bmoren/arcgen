# arcgen

Minimalist static site generator, powered by  [Node.js](https://nodejs.org/en/) & [nanogen](https://github.com/doug2k1/nanogen/)

This version has a focus on archiving original media, meaning it has tools to re-format media allowing for originals to live along side compressed versions.

## Features
* Generate HTML pages from Markdown files.
* EJS templates files
* Support for site metadata from a global file and specific data for individual pages.
* Support for partials, blocks of reusable interface components.
* Compression and Generation of web-ready srcset images from full res images.

#### arcgen expands upon nanogen/mcadgen with the following:
* copies local media to exact locations in the build process (inside subdirectories on a page by page basis)
* `page` is available in your template to get access to the current page's front matter & a list of local media as root relative absolute file paths.
* generates a `pages` array, available in your template, containing json objects for each of the page definitions across the entire site. The `pages` objects has a few reserved keys you should not use in your front matter (they will be overwritten).
    * `url` – the root relative absolute url to the page
    * `media` – an array of root relative absolute paths to the media files associated with the page
    * `depth` – the depth of the page in the folder structure
    * `parent` – the parent of the current page in the folder structure

## Getting started

### Prerequisites

* [Node.js](https://nodejs.org/en/) installed (version 8 or above)

### Install

You may install it globally with:

```
npm i -g arcgen
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

There is already a default layout inside the `layouts` folder, but you may add more.

Inside the `pages` folder is where you put md and media files that will generate the pages of the final site. Any file name and folder structure used here will be transposed to the resulting site.

### Build the site and open it in a browser

```
arcgen start
```

### compressing and generating web-ready images
```
arcgen compress
```

There are many options for compression, please run the help to see them all.

by default arcgen generates and looks for a `srcset` folder and will make this available inside the media array.

## Available commands and options

Please run `arcgen -h` to see the most updated available commands and options.

## Docs

coming soon?

## Authors
* **Ben Moren** – arcgen
* **Derek Anderson && Ben Moren** – mcadgen
* **Douglas Matoso** - *Initial work* - [doug2k1](https://github.com/doug2k1)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
