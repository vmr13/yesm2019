const path = require('path');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const clean_css = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const watch = require('gulp-watch');
const njkRender = require('gulp-nunjucks-render');
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

gulp.task('css', function() {
    return gulp.src(path.join('src', 'css', '*.scss'))
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer({cascade:false}))
            .pipe(clean_css())
            .pipe(gulp.dest(path.join('dist', 'css')));
});

gulp.task('js', function() {
    return gulp.src(path.join('src', 'js', '*.js'))
            .pipe(babel({presets: ['@babel/env']}))
            .pipe(uglify())
            .pipe(gulp.dest(path.join('dist', 'js')));
});

gulp.task('html', function() {
    return gulp.src(path.join('src', 'pages', '**', '*.njk'))
            .pipe(njkRender({ path: [path.join('src', 'templates')] }))
            .pipe(htmlmin({collapseWhitespace: true, minifyCSS: true}))
            .pipe(gulp.dest('dist'));
});

gulp.task('imgs', function() {
    return gulp.src(path.join('src', 'img', '**', '*'))
            .pipe(gulp.dest(path.join('dist', 'img')));
});

gulp.task('static', function() {
    return gulp.src(path.join('src', 'static', '*'))
            .pipe(gulp.dest('dist'));
});

gulp.task('clean-all', function() {
    return del(['dist']);
});

gulp.task('clean-css', function() {
    return del([path.join('dist', 'css')]);
});

gulp.task('clean-js', function() {
    return del([path.join('dist', 'js')]);
});

gulp.task('clean-html', function() {
    return del([path.join('dist', '**', '*.html')]);
});

gulp.task('clean-imgs', function() {
    return del([path.join('dist', 'img')]);
});

gulp.task('watch', function() {
    watch(path.join('src', 'css', '*.scss'), gulp.series('clean-css', 'css'));
    watch(path.join('src', 'js', '*.js'), gulp.series('clean-js', 'js'));
    watch(path.join('src', 'pages', '**', '*.njk'), gulp.series('clean-html', 'html'));
    watch(path.join('src', 'templates', '**', '*.njk'), gulp.series('clean-html', 'html'));
    watch(path.join('src', 'img', '*'), gulp.series('clean-imgs', 'imgs'));
});

gulp.task('default', gulp.series('clean-all', gulp.parallel('js', 'css', 'imgs', 'html', 'static')));
gulp.task('dev', gulp.series('default', 'watch'));
