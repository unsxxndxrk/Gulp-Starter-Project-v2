const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync");
const autoprefixer = require("gulp-autoprefixer");
const notify = require("gulp-notify");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const uglify = require("gulp-uglify-es").default;
const cleanCSS = require("gulp-clean-css");
const cache = require("gulp-cache");

gulp.task("browser-sync", (done) => {
  browserSync({
    server: {
      baseDir: "src",
    },
    notify: false,
  });
  done();
});

gulp.task("sass", () => {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(sass({ outputStyle: "expanded" }).on("error", notify.onError()))
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(cleanCSS())
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("watch", (cb) => {
  gulp.parallel("sass", "browser-sync")(cb);
  gulp.watch("src/scss/**/*.scss", gulp.series("sass"));
  gulp.watch("src/*.html").on("change", browserSync.reload);
});

gulp.task("img", () => {
  return gulp
    .src("src/img/**/*")
    .pipe(
      cache(
        imagemin({
          interlaced: true,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()],
        })
      )
    )
    .pipe(gulp.dest("dist/img"));
});

gulp.task("clear", () => {
  return cache.clearAll();
});

gulp.task(
  "build",
  gulp.series("clear", "img", (cb) => {
    gulp.src(["src/css/**/*"]).pipe(gulp.dest("dist/css"));
    gulp.src("src/fonts/**/*").pipe(gulp.dest("dist/fonts"));
    gulp.src("src/libs/**/*").pipe(gulp.dest("dist/libs"));
    gulp.src(["src/js/**/*"]).pipe(uglify()).pipe(gulp.dest("dist/js"));
    gulp.src("src/*.html").pipe(gulp.dest("dist"));
    cb();
  })
);

gulp.task("default", gulp.series("watch"));
