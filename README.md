# arcgen

Minimalist static site generator, powered by  [Node.js](https://nodejs.org/en/) & [nanogen](https://github.com/doug2k1/nanogen/)

This version has a focus on archiving original media, meaning it has tools to re-format media allowing for originals to live along side compressed versions.

more documentation and template recipe examples coming soon!

## Features
* Generate HTML pages from Markdown files.
* EJS templates files
* Support for site metadata from a global file and specific data for individual pages via YAML frontmatter.
* Support for partials, blocks of reusable interface components.
* Compression and generation of web-ready srcset images from full res images.
* Copies local media to exact locations in the build process, inside subdirectories and on a page by page basis
* Support for page ordering using `00_` style numbered filename prefixes, the prefixes will be removed from filenames on build to keep paths tidy.
* A `page` JSON object, available in your template, to get access to the current page's YAML front matter and the keys outlined below.
* A `pages` array, available in your template, containing json objects for each of the `page` definitions across the entire site. (useful for navigation and collections) 

The `page` & `pages` objects have a few reserved keys you should not use in your front matter (they will be overwritten).
  * `url` – the root relative absolute url to the page
  * `media` – an array of root relative absolute paths to the media files associated with the page
  * `depth` – the depth of the page in the orginizational folder structure
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

Inside the `pages` folder is where you put .md and media files that will generate the pages of the final site. Any file name and folder structure used here will be transposed to the resulting site.


### Build the current site and open with a live reload server
builds the site from the `srcPath` specified in `site.config.js` and launches a live reload server.

```
$ arcgen start [options]
```
#### options
* `-c`, `--config` <file-path> Path to the config file (default: site.config.js)
* `-p`, `--port` <port-number>  Port to use for local server (default: 3000)


### Build the current site without a server
builds the site from the `srcPath` specified in `site.config.js` 

```
$ arcgen build [options]
```
Same options as start.


### generate srcset compressed & optimized images
This feature will take all source images and create three versions at smaller sizes and place them into a specified subdirectory. Do this before building or starting the site as a two step process since it's unlikely you will need to re-compress images regularly, and is a significant resource drain.

```
$ arcgen compress [options]
```
#### options
* `-t`, `--type` <image-file-extension>  Force the image type for the compression, none respects the original filetype .jpg | .png | .webp | none (default: none)
* `-d`, `--directory` <file-path>        Set the path for compressed images to be saved to (default: /srcset)
* `-s`, `--maxsize` <integer>            Set the maximum image size in pixels, srcset will be divided down from this (default: 2000)
* `-q`, `--quality` <integer>            Set the quality of the image exports; 1-100. Image type dependent. (default: 80)



### Batch delete srcset subdirectories
deletes folder and all contents recursively in the `srcPath` directory.
```
$ arcgen clean [options]
```
#### options
* `-d`, `--directory` <file-path>        subdirectory to search for and delete. (default: /srcset)


### arcgen global options

* `-h`, `--help`     Display the help text in the terminal
* `-v`, `--version`  Display arcgen version


## Authors
* [Ben Moren](https://github.com/bmoren) – arcgen
* [Derek Anderson](https://github.com/mediaupstream) & [Ben Moren](https://github.com/bmoren) – mcadgen
* [Douglas Matoso](https://github.com/doug2k1) - nanogen 
