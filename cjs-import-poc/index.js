const store = require('./store');

const add = require('./other');

store.counter = 12;

add();

console.log(store.counter);
