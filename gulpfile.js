const gulp = require('gulp');
const path = require('path');
const runSequence = require('run-sequence');
const rimraf = require('rimraf');
const webpack = require('webpack');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const PROD = (process.env.NODE_ENV === 'production');

const compiler = webpack({
	mode: PROD ? 'production' : 'development',
	entry: './src/scripts/main.js',
	output: {
		path: path.resolve(__dirname, 'dist/scripts'),
		filename: 'main.js',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				use: 'babel-loader',
			}
		],
	},
});

gulp.task('start', [PROD ? 'serve:prod' : 'serve:dev']);

gulp.task('postinstall', PROD ? ['build'] : []);

gulp.task('serve:prod', [], (cb) => {
	browserSync.create('bs').init({
		server: {
			baseDir: 'dist',
		},
		ghostMode: false,
		files: ['dist/**/*'],
	}, cb);
});

gulp.task('serve:dev', ['watch'], (cb) => {
	browserSync.create('bs').init({
		server: {
			baseDir: 'dist',
		},
		ghostMode: false,
		files: ['dist/**/*'],
	}, cb);
});

gulp.task('clean', [], (done) => {
	rimraf(path.resolve(__dirname, 'dist'), done);
});

gulp.task('build', [], (done) => {
	runSequence('clean', 'build:all', done);
});

gulp.task('watch', ['watch:all']);

const types = ['html', 'static', 'styles', 'js'];

gulp.task('build:all', types.map(type => `build:${type}`));

gulp.task('watch:all', types.map(type => `watch:${type}`));

gulp.task('build:html', [], () => {
	return gulp.src('src/*.html')
		.pipe(gulp.dest('dist'))
		;
});

gulp.task('watch:html', ['build:html'], () => {
	gulp.watch('src/*.html', ['build:html']);
});

gulp.task('build:static', [], () => {
	return gulp.src('src/static/**/*')
		.pipe(gulp.dest('dist/static'));
});

gulp.task('watch:static', ['build:static'], () => {
	gulp.watch('src/static/**/*', ['build:static']);
});

gulp.task('build:js', [], (done) => {
	compiler.run((err, stats) => {
		var hasError = parseCompilationErrors(err, stats);
		if (hasError) {
			done(new Error('compilation failed'));
		}
		else {
			done();
		}
	});
});

gulp.task('watch:js', ['build:js'], () => {
	compiler.watch({}, (err, stats) => {
		parseCompilationErrors(err, stats);
	});
});

gulp.task('build:styles', [], () => {

	return gulp.src('src/styles/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded' // valid values: nested, expanded, compact, compressed
		}).on('error', handleError))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/styles'))
		;

	function handleError(err) {
		sass.logError.call(this, err);
		this.emit('end');
	}
});

gulp.task('watch:styles', ['build:styles'], () => {
	gulp.watch('src/styles/**/*.scss', ['build:styles']);
});

function parseCompilationErrors(err, stats) {
	if (err) {
		console.error(err.stack || err);
		if (err.details) {
			console.error(err.details);
		}
		return true;
	}
	else {
		const info = stats.toJson();

		if (stats.hasErrors()) {
			for (let error of info.errors) {
				console.error(error);
			}
			return true;
		}
		else {
			if (stats.hasWarnings()) {
				for (let warning of info.warnings) {
					console.warn(warning);
				}
			}
			return false;
		}
	}
}
