var _ = require('lodash');

var QueueCommander = function(options) {

    var Wrapper = function() {
        this._queuedItems = [];
        this._paused = false;
        this._dataCallbacks = [];
    };

    Wrapper.prototype.on = function(evt, callback) {
        if (evt === 'data' && _.isFunction(callback)) {
            this._dataCallbacks.push(callback);
        }
        return this;
    };

    Wrapper.prototype.start = function() {
        this._paused = false;
        this.next();
        return this;
    };

    Wrapper.prototype.stop = function() {
        this._queuedItems = [];
        return this;
    };

    Wrapper.prototype.pause = function() {
        this._paused = true;
        return this;
    };

    Wrapper.prototype.resume = function() {
        this._paused = false;
        this.next();
        return this;
    };

    Wrapper.prototype.load = function(items) {
        if (_.isArray(items)) {
            this._queuedItems = this._queuedItems.concat(items);
        } else {
            this._queuedItems.push(items);
        }
        return this;
    };

    Wrapper.prototype.next = function() {
        if ( ! this._paused && this._queuedItems.length > 0) {
            var item = this._queuedItems.shift();

            _.each(this._dataCallbacks, function(callback) {
                callback(item);
            });
        }
        return this;
    };

    return new Wrapper();
};

module.exports = QueueCommander;
