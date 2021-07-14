const store = require('./store');

module.exports = () => {
	store.counter = store.counter + 1
}
