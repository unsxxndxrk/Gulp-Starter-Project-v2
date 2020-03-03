var 	
	gulp         = require('gulp'),
	sass         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	autoprefixer = require('gulp-autoprefixer'),
	notify       = require('gulp-notify'),
	imagemin     = require('gulp-imagemin'), 
    pngquant     = require('imagemin-pngquant'), 
    uglify       = require('gulp-uglify-es').default,
    cleanCSS     = require('gulp-clean-css'),
    cache        = require('gulp-cache');

// localhost and autoreaload
gulp.task('browser-sync', function(done) {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
	done();
});

gulp.task('sass', function() {
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', function(cb) {
	gulp.parallel(
		'sass', 
		'browser-sync'
	)(cb);
	gulp.watch('app/scss/**/*.scss', gulp.series('sass'));
	gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
  		.pipe(cache(imagemin({ 
	    	interlaced: true,
		    progressive: true,
		    svgoPlugins: [{removeViewBox: false}],
		    use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('clear', function() {
    return cache.clearAll();
});

gulp.task('build', gulp.series('clear', 'img', function(cb) {
    var buildCss = gulp.src([
        'app/css/**/*'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    var buildLibs = gulp.src('app/libs/**/*')
    .pipe(gulp.dest('dist/libs'))

    var buildJs = gulp.src([
        'app/js/**/*'
        ]) 
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
    cb();
}));

gulp.task('default', gulp.series('watch'));