const glob = require('glob');
require('./init');
global.__base = __dirname.replace(/test$/, 'src/');

// Require test files
glob.sync('./spec/**/*-test.js', {cwd: __dirname}).map(require);
