var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var jasmine  = require('gulp-jasmine-phantom');
var concat	= require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');





gulp.task('default', ['serve']);

gulp.task('serve',['copy-html', 'copy-images','styles'], function() {

    browserSync.init({
        server: "./dist"
    });
    gulp.watch('scss/**/*.scss', ['styles']);
    

    gulp.watch('/index.html',['copy-html']);
    gulp.watch('./dist/index.html').on('change', browserSync.reload);
});


gulp.task('dist', [
		'copy-html',
		'copy-images',
		'styles',
		'scripts-dist'
]);

gulp.task('styles', function() {
    gulp.src('scss/**/*.scss')
    	.pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('copy-html', function(){
		gulp.src('./index.html')
			.pipe(gulp.dest('./dist'));
	});

gulp.task('copy-images', function(){
		gulp.src('img/*')
			.pipe(gulp.dest('dist/img'));
	});

gulp.task('tests', function(){
	gulp.src('tests/spec/checkWindowHeight.js')
		.pipe(jasmine({
				integration:true,
				vendor: 'js/**/*.js'
			}));
	});

gulp.task('scripts',function(){
	gulp.src('js/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist/js'));	
	});

gulp.task('scripts-dist', function(){
	gulp.src('js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/js'));
	});