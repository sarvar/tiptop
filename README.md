# Template Project

## Short review
This template is used by me just for creating sites without javascript frameworks(like react, angular, vue).
For automating is used [Gulp 4](http://gulpjs.org/)
Tools using in this template are:
  - [Nunjucks](https://mozilla.github.io/nunjucks/)
  - [SCSS](https://sass-lang.com/)
  - [Babel](https://babeljs.io/)
  - [BrowserSync](https://www.browsersync.io/)

## Commands

- `npm run build` for generatimg production build.
  When running, gulp:
    - compresses images;
    - compresses styles and scripts;
    - concatenates styles and scripts, so they are inserted in page like single file;
    - makes versions for styles and scripts;
- `npm run dev` for generating development build. Will start development sever with live changes

## About system

### Pages

Folder for pages: `src/pages/`
Pages have `.html` extension instead `.njk` for compability
`layout/layout.html` is simple template for other pages that has insertion for header/footer, metadata, scripts
  Other pages extend this file
`partials/_macro.html` is file for macroses

### Styles

Folder for styles: `src/styles/`

#### About some files
`partials/_mixins.scss` contains mixins, like:
  - simplier adding fonts
  - convert text from px to em/rem
  - calculating element size from container size
  - etc.
`partials/_base.scss` contains additional classes and little style reseting(when [reset.css](https://gist.github.com/DavidWells/18e73022e723037a50d6) is too large)
`partials/_reset.scss` [reset.css](https://gist.github.com/DavidWells/18e73022e723037a50d6)
`partials/_vars.scss` variables for styles, contains parameters like(there is little mess):
  -container width
  -media queries
  -etc.

### Scripts

Folder for scripts: `src/scripts/`
Script system based on [gulp-rigger](https://github.com/kuzyk/gulp-rigger).
Browserify didn't use here because it's too complex for simple site creating

### Icons

Source folder for icons: `src/icons/`
The icon system is based on svg sprites through symbol defining.
The result is file `icon.svg` in `build/img/`
Unfortunally, I didn't do system for removing `fill` and `stroke` attributes.

### Images

Folder for images: `src/img/`
Images copy 'as is' while developing. When using `npm build` they are compressed

### Libraries

Folder for libraries: `src/libs/`
`libs/libs.css` and `libs/libs.js` support `import` directive for css and js accordingly

### Dependencies

Folder for dependencies: `src/dependencies/`
Here dependencies are other files for project that don't need transformation
They simple copy into build folder
