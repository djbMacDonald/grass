// jshint devel:true
var ProgressBar = require('progress');

var field;
var green_list = [];

function ask(question, format, callback) {
 var stdin = process.stdin, stdout = process.stdout;

 stdin.resume();
 stdout.write(question + ": ");

 stdin.once('data', function(data) {
   data = data.toString().trim();

   if (format.test(data)) {
     callback(data);
   } else {
     stdout.write("It should match: "+ format +"\n");
     ask(question, format, callback);
   }
 });
}

var create_field = function(rows, cols){
  field = [];
  update_green_list();
  for (var i = 0; i < rows; i++){
    field.push([]);
    for (var j = 0; j < cols; j++){
      field[i].push(0);
    };
  };
  field[0][0] = 1;
};

var find_dry_adj = function(x,y){
  var neighbors = [];

  if (x-1 >= 0 && field[x-1][y] === 0){
    neighbors.push([x-1,y]);
  };
  if (x+1 < field.length && field[x+1][y] === 0){
    neighbors.push([x+1,y]);
  };
  if (y-1 >= 0 && field[x][y-1] === 0){
    neighbors.push([x,y-1]);
  };
  if (y+1 < field[0].length && field[x][y+1] === 0){
    neighbors.push([x,y+1]);
  };
  return neighbors;
};

var update_green_list = function(){
  green_list = [];
  for (var i = 0; i < field.length; i++){
    for (var j = 0; j < field[0].length; j++){
      if (field[i][j] === 1){
        green_list.push([i,j]);
      };
    };
  };
};

var grow_grass = function(x,y){
  if (field[x][y] === 0) {
    var chance = Math.floor(Math.random() * 2);
    if (chance === 1){
      field[x][y] = 1;
    };
  };
};

var take_turn = function(){
  update_green_list();
  for (var i = 0; i < green_list.length; i++){
    var x = green_list[i][0];
    var y = green_list[i][1];
    var adj = find_dry_adj(x, y);
    for (var j = 0; j < adj.length; j++){
      var ax = adj[j][0];
      var ay = adj[j][1];
      grow_grass(ax, ay);
    };
  };
};

var run_test = function(x,y){
  create_field(x, y);
  var turns = 0;
  while (green_list.length < field.length * field[0].length){
    turns += 1;
    take_turn();
  };
  return(turns);
};

var find_ratio = function(x, y){
  if (x < y){
    return (x/y).toFixed(2);
  } else {
    return (y/x).toFixed(2);
  };
};

var find_avg = function(n, rows, cols, type){
  var bar = new ProgressBar(':bar', { total: n });
  var total = 0;
  for (var i = 0; i < n; i++){
    total += run_test(rows, cols);
    bar.tick();
  };
  var turns = (total/n).toFixed(2);
  console.log('Average turns (' + type + '): ' + turns);
  return parseFloat(turns);
};

module.exports = {
  ask: function(question, format, callback){
    return ask(question, format, callback);
  },
  find_avg: function(n, rows, cols, type){
    return find_avg(n, rows, cols, type);
  },
  find_ratio: function(x, y){
    return find_ratio(x, y);
  }
};
