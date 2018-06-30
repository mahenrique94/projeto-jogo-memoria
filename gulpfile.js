const autoprefixer = require("gulp-autoprefixer")
const cleanCss = require("gulp-clean-css")
const concat = require("gulp-concat")
const del = require("del")
const gulp = require("gulp")
const htmlmin = require("gulp-htmlmin")
const htmlReplace = require("gulp-html-replace")
const minify = require("gulp-minify")
const sourcemaps = require("gulp-sourcemaps")

const CONFIG = {
    css_prefixes : [
        "ie >= 10",
        "ie_mob >= 10",
        "ff >= 30",
        "chrome >= 34",
        "safari >= 7",
        "opera >= 23",
        "ios >= 7",
        "android >= 4.4",
        "bb >= 10"
    ],
    dest : {
        css : "./build/assets/css",
        html : "./build/",
        icons : "./build/assets/css/fontello/font/",
        js : "./build/assets/js/",
        tracks : "./build/assets/tracks/"
    },
    path : {
        css : "./assets/css/**/*.css",
        html : "./index.html",
        icons : "./assets/css/fontello/font/*",
        js : "./assets/js/**/*.js",
        tracks : "./assets/tracks/**/*.mp3"
    }
}

gulp.task("clean", function() {
    return del(CONFIG.dest.html)
})

gulp.task("copyicons", function() {
    return gulp.src(CONFIG.path.icons)
        .pipe(gulp.dest(CONFIG.dest.icons))
})

gulp.task("copytracks", function() {
    return gulp.src(CONFIG.path.tracks)
        .pipe(gulp.dest(CONFIG.dest.tracks))
})

gulp.task("copy", gulp.series("copyicons", "copytracks"))

gulp.task("cssmin", function() {
    return gulp.src(CONFIG.path.css)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({ browsers : CONFIG.css_prefixes }))
        .pipe(cleanCss())
        .pipe(concat(`game.min.css`))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(CONFIG.dest.css))
})

gulp.task("htmlmin", function() {
    return gulp.src(CONFIG.path.html)
        .pipe(htmlReplace({
            css : "./assets/css/game.min.css",
            js : "./assets/js/game.min.js"
        }))
        .pipe(htmlmin({ collapseWhitespace : true, removeComments : true }))
        .pipe(gulp.dest(CONFIG.dest.html))
})

gulp.task("jsmin", function() {
    return gulp.src(CONFIG.path.js)
        .pipe(sourcemaps.init())
        .pipe(minify({ 
            ext : {
                min : ".min.js"
            },
            noSource : true
         }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(CONFIG.dest.js))
})

gulp.task("minify", gulp.series("clean", "cssmin", "jsmin", "htmlmin"))
gulp.task("build", gulp.series("minify", "copy"))
gulp.task("default", gulp.series("build"))