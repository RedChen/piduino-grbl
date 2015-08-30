var _ = require('lodash');

var MotionQueue = function(options) {

    var Wrapper = function() {
        this._queue = [];
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
        this._queue = [];
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

    Wrapper.prototype.add = function(data) {
        if (_.isArray(data)) {
            this._queue = this._queue.concat(data);
        } else {
            this._queue.push(data);
        }
        return this;
    };

    Wrapper.prototype.next = function() {
        if ( ! this._paused && this._queue.length > 0) {
            var item = this._queue.shift();

            _.each(this._dataCallbacks, function(callback) {
                callback(item);
            });
        }
        return this;
    };

    Wrapper.prototype.size = function() {
        return this._queue.length;
    };

    return new Wrapper();
};

module.exports = MotionQueue;
