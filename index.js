var main = require('./main.js');
main.ask("Rows", /^[1-9]\d*$/, function(rows) {
  main.ask("Columns", /^[1-9]\d*$/, function(cols) {
    main.ask("Iterations", /^[1-9]\d*$/, function(iters) {
      rows = parseInt(rows);
      cols = parseInt(cols);
      iters = parseInt(iters);
      var rect = main.find_avg(iters, rows, cols, 'rectangular');
      var lin = main.find_avg(iters, rows*cols, 1, 'linear');
      console.log('Rectangle Ratio: ' + main.find_ratio(rows, cols));
      console.log('Turns ratio: ' + main.find_ratio(rect, lin));
      console.log('');
      process.exit();
    });
  });
});

