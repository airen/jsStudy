/**
 * Using ES2015 with gulp
 * 1. Rename your gulpfile.js to gulpfile.babel.js
 * 2. Add babel to your package.json (npm install babel --save-dev)
 * 3. Now start writing ES6 in your gulpfile!
 * https://markgoodyear.com/2015/06/using-es6-with-gulp/
 */
import gulp          from 'gulp'
import del           from 'del'
import fmt           from 'cssfmt'
import sass          from 'gulp-sass'
import size          from 'gulp-size'
import header        from 'gulp-header'
import rename        from 'gulp-rename'
import postcss       from 'gulp-postcss'
import {create}      from 'browser-sync'
import minifyCSS     from 'gulp-minify-css'
import sourcemaps    from 'gulp-sourcemaps'
import autoprefixer  from 'autoprefixer-core'
import inlineSource  from 'gulp-inline-source'
import runSequence   from 'run-sequence'
import gulpif        from 'gulp-if'
import pkg           from './package.json'
// import uglify       from 'gulp-uglify'
// import jshint       from 'gulp-jshint'
const browserSync = create()

// 路径配置
const path = {
  html: {
    dev: './src/html/**/',
    build: './app/'
  },
  css: {
    dev: './src/css/',
    build: './build/css/'
  },
  scss: {
    dev: './src/scss/',
    build: './build/css/'
  },
  js: {
    dev: './src/js/',
    build: './build/js'
  }
}

// 文件头部版权信息
const banner = [
`/**
  * <%= pkg.name %>
  * <%= pkg.title %>
  * @author <%= pkg.author %>
  * @version <%= pkg.version %>
  * Copyright ${new Date().getFullYear()} <%= pkg.license %> licensed.
  */
`
].join('')

const sassOptions = {
  outputStyle: 'expanded'
}

const browserOptions = {
  browsers: [
  'last 3 versions',
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 12.1',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10',
  'and_uc 9.9',
  ]
}

//PostCss gulp

var processors = [
  autoprefixer(browserOptions)
];


// Sass(libsass)
// sourcemaps: http://www.sitepoint.com/using-source-maps-debug-sass-chrome/
gulp.task('css', () => {
  return gulp.src([
    path.scss.dev + '**/*.scss'
  ])
  .pipe(sourcemaps.init())
  .pipe(sass(sassOptions).on('error', sass.logError))
  .pipe(postcss(processors))
  .pipe(sourcemaps.write('.', {
    //推荐开启(默认)，如果关闭，则需要开启 sourceRoot 中的 SCSS 文件所在的相对路径
    includeContent: true,
    // sourceRoot: '../scss/'
  }))

  .pipe(gulp.dest(path.css.dev))
  .pipe(browserSync.stream())
})

// Sass Debug(No PostCSS)
gulp.task('css:debug', () => {
  return gulp.src([
    path.scss.dev + '**/*.scss'
  ])
  .pipe(sourcemaps.init())
  .pipe(sass(sassOptions).on('error', sass.logError))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(path.css.dev))
  .pipe(browserSync.stream())
})

// CSS minify
gulp.task('minify-css', () => {
  return gulp.src(path.css.dev + '*.css')
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest(path.css.build))
    .pipe(minifyCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest(path.css.build))
    .pipe(size({title: 'CSS 压缩完成', showFiles: true}))
})

// css replace to style tag
// https://github.com/popeindustries/inline-source#usage
gulp.task('inline', ['css'], function() {
  let options = {
    compress: false
  }
  return gulp.src('./src/html/**/*.html')
    .pipe(inlineSource(options))
    .pipe(gulp.dest('./app/'))
})

gulp.task('html', () => {
  return gulp.src('./src/html/**/*.html')
    .pipe(gulp.dest('./app/'))
})

// atuo reload
gulp.task('serve', () => {
  browserSync.init({
    server: './'
  })
})

// clean file
gulp.task('clean', () => {
  del.sync(['./build/*'])
})

// watch
gulp.task('watch', () => {
  gulp.watch(path.html.dev + '*.html', ['html'])
  gulp.watch('./app/**/*.html').on('change', browserSync.reload)
  gulp.watch(path.scss.dev + '**/*.scss', ['css'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}`)
    })
})

gulp.task('default', (callback) => {
  runSequence(
    'css',
    'watch',
    ['html', 'serve'],
    callback)
})

// build file
gulp.task('build', (callback) => {
  runSequence(
    'clean',
    'minify-css',
    callback)
})

