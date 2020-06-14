const { watch, src, dest, series, parallel, lastRun } = require('gulp'),
      autoprefixer = require('gulp-autoprefixer'),
      browserSync = require("browser-sync").create(),
      reload = browserSync.reload,
      cssnano = require('gulp-cssnano'),
      combineMq = require('gulp-combine-mq'),
      sass = require('gulp-sass'),
      nunjucks = require('gulp-nunjucks-render'),
      rimraf = require('rimraf'),
      plumber = require('gulp-plumber'),
      babel = require('gulp-babel'),
      cssimport = require('gulp-cssimport'),
      imagemin = require('gulp-imagemin'),
      cached = require("gulp-cached"),
      browserify = require('gulp-browserify'),
      rigger = require('gulp-rigger'),
      svgSprite = require("gulp-svg-sprite"),
      pngquant = require('imagemin-pngquant'),
      notify = require("gulp-notify"),
      concat = require("gulp-concat"),
      concatCss = require("gulp-concat-css"),
      jsminify = require('gulp-minify');

let production = {
  works: false,
  scriptsName: `main.js`,
  stylesName: `main.css`,
  scriptsUrl: [
    `scripts/main.js?v=${Date.now()}`
  ],
  stylesUrl: [
    `styles/main.css?v=${Date.now()}`
  ],
};
let develop = {
  scriptsUrl: [
    'scripts/libs.js',
    'scripts/main.js'
  ],
  stylesUrl: [
    'styles/libs.css',
    'styles/main.css'
  ],
};

const path = {
  build: {
    templates: 'build/',
    scripts: 'build/scripts/',
    styles: 'build/styles/',
    images: 'build/img/',
  },
  src: {
    templates: 'src/pages/*.html',
    scripts: 'src/scripts/main.js',
    styles: 'src/styles/main.scss',
    images: 'src/img/**/*.*',
    icons: 'src/icons/**/*.*',
    libs: {
      scripts: 'src/libs/libs.js',
      styles: 'src/libs/libs.css'
    },
    dependencies: 'src/dependencies/**/*.*'
  },
  watch: {
    templates_partials: "src/pages/*/*.html",
    templates: 'src/**/*.html',
    scripts: 'src/scripts/**/*.js',
    styles: 'src/styles/**/*.scss',
    images: 'src/img/**/*.*',
    icons: 'src/icons/**/*.*',
    libs: {
      scripts: 'src/libs/libs.js',
      styles: 'src/libs/libs.css'
    },
    dependencies: 'src/dependencies/**/*.*'
  },
  clean: './build'
}

function cleanTemplates(cb) {
  delete cached.caches['template'];
  cb();
}
function templates() {
  return src(path.src.templates)
    .pipe(cached('template'))
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(nunjucks({
      path: ['src/pages/'],
      data: {
        scripts: production.works ? production.scriptsUrl : develop.scriptsUrl,
        styles: production.works ? production.stylesUrl : develop.stylesUrl
      }
    }))
    .pipe(dest(path.build.templates))
    .pipe(reload({stream: true}));
}
function styles() {
  if(production.works) {
    return src(path.src.libs.styles)
      .pipe(cssimport({
        includePaths: ['node_modules']
      }))
      .pipe(src(path.src.styles))
      .pipe(sass({outputStyle: 'nested'}))
      .pipe(combineMq())
      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 11']))
      .pipe(concatCss(production.stylesName))
      .pipe(cssnano())
      .pipe(dest(path.build.styles))
  }
  return src(path.src.styles)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }) )
    .pipe(sass({outputStyle: 'nested'}))
    .pipe(combineMq())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 11']))
    .pipe(dest(path.build.styles))
    .pipe(reload({stream: true}));
}
function scripts() {
  if(production.works) {
    return src(path.src.libs.scripts)
      .pipe(browserify({transform: ['babelify']}))
      .pipe(src(path.src.scripts))
      .pipe(rigger())
      .pipe(babel({ presets: ['@babel/preset-env'] }))
      .pipe(jsminify({
        noSource: true,
        ext: {
          min: ".js"
        }
      }))
      .pipe(concat(production.scriptsName))
      .pipe(dest(path.build.scripts));
  }
  return src(path.src.scripts)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(rigger())
    .pipe(dest(path.build.scripts))
    .pipe(reload({stream: true}));
}
function images() {
  if(production.works) {
    return src(path.src.images)
      .pipe(imagemin([
        imagemin.gifsicle(),
        imagemin.mozjpeg(),
        pngquant(),
        imagemin.svgo({
          plugins: [
            {removeViewBox: false},
            {removeDimensions: true}
          ]
        })
      ], {
        quality: '80',
        speed: 1, 
        floyd: 1 
      }))
      .pipe(dest(path.build.images));
  }
  return src(path.src.images)
    .pipe(cached('images'))
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {removeDimensions: true}
        ]
      })
    ]))
    .pipe(dest(path.build.images))
    .pipe(reload({stream: true}));
}
function icons() {
  return src(path.src.icons)
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {removeDimensions: true},
          {removeXMLNS: true}
        ]
      })
    ]))
    .pipe(svgSprite({
      mode: {
        inline: true,
        symbol: {
          sprite: "../icons.svg"
        }
      }
    }))
    .pipe(dest(path.build.images))
    .pipe(reload({stream: true}));
}
function libScripts() {
  return src(path.src.libs.scripts)
    .pipe(browserify({transform: ['babelify']}))
    .pipe(jsminify({
      noSource: true,
      ext: {
        min: ".js"
      }
    }))
    .pipe(dest(path.build.scripts))
    .pipe(reload({stream: true}));
}
function libStyles() {
  return src(path.src.libs.styles)
    .pipe(plumber())
    .pipe(cssimport({
      includePaths: ['node_modules']
    }))
    .pipe(cssnano())
    .pipe(dest(path.build.styles))
    .pipe(reload({stream: true}));
}
function dependencies() {
  return src(path.src.dependencies)
    .pipe(dest(path.build.templates))
    .pipe(reload({stream: true}));
}
function watchChanges(cb) {
  watch(path.watch.templates, templates);
  watch(path.watch.templates_partials, series(cleanTemplates, templates));
  watch(path.watch.styles, styles);
  watch(path.watch.scripts, scripts);
  watch(path.watch.images, images);
  watch(path.watch.icons, icons);
  watch(path.watch.dependencies, dependencies);
  watch(path.watch.libs.scripts, libScripts);
  watch(path.watch.libs.styles, libStyles);
  cb();
}
function server(cb) {
  browserSync.init({
    server: {
      baseDir: './build'
    },
    tunnel: false,
    host: 'localhost',
    port: 3000,
    localOnly: true
  });
  cb();
}
function clean(cb) {
  rimraf(path.clean, cb);
}
const tasks = [templates, styles, icons, scripts, images, dependencies];
exports.dev = series(clean, libStyles, libScripts, ...tasks, server, watchChanges);
exports.build = series((cb) => {
  production.works = true;
  cb()
}, clean, ...tasks);