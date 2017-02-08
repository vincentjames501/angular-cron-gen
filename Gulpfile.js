const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const templateCache = require('gulp-angular-templatecache');
const concat = require('gulp-concat');
const addStream = require('add-stream');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const clean = require('gulp-clean');
const rollup = require('gulp-rollup');
const rollupBabel = require("rollup-plugin-babel");
const ngAnnotate = require('gulp-ng-annotate');

gulp.task('clean', () => {
    return gulp.src('build/*', {read: false})
        .pipe(clean());
});

gulp.task('less', () => {
    return gulp.src('src/cron-gen.less')
        .pipe(less())
        .pipe(uglifycss())
        .pipe(concat('cron-gen.min.css'))
        .pipe(gulp.dest('build'));
});

gulp.task('src', () => {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(rollup({
            format: 'iife',
            plugins: [
                rollupBabel({
                    presets: [['es2015', {modules: false}]],
                    plugins: ['external-helpers']
                })
            ],
            entry: 'src/cron-gen.module.js'
        }))
        .pipe(ngAnnotate())
        .pipe(addStream.obj(() => gulp.src('src/templates/*.html')
            .pipe(templateCache({
                root: 'angular-cron-gen',
                module: 'angular-cron-gen'
            }))))
        .pipe(gulp.dest('build'))
        .pipe(concat('cron-gen.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
});

gulp.task('default', ['clean', 'src', 'less']);