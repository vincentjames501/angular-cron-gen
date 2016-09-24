const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const templateCache = require('gulp-angular-templatecache');
const concat = require('gulp-concat');
const addStream = require('add-stream');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const clean = require('gulp-clean');

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
    return gulp.src('src/cron-gen.js')
        .pipe(addStream.obj(() => gulp.src('src/cron-gen.html')
            .pipe(templateCache({
                root: 'angular-cron-gen',
                module: 'angular-cron-gen'
            }))))
        .pipe(concat('app.js'))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('cron-gen.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'));
});

gulp.task('default', ['clean', 'src', 'less']);