(function() {
  function Timeline(key, session, options) {
    this.key = key;
    this.session = session;
    this.events = [];
    this.options = options || {};
    this.sent = 0;
    this.uniqueID = 0;
  }
  var prototype = Timeline.prototype;

  // Log levels
  Timeline.ERROR = 3;
  Timeline.INFO = 6;
  Timeline.DEBUG = 7;

  prototype.log = function(level, event) {
    if (this.options.level === undefined || level <= this.options.level) {
      this.events.push(
        Pusher.Util.extend({}, event, {
          timestamp: Pusher.Util.now(),
          level: level
        })
      );
      if (this.options.limit && this.events.length > this.options.limit) {
        this.events.shift();
      }
    }
  };

  prototype.error = function(event) {
    this.log(Timeline.ERROR, event);
  };

  prototype.info = function(event) {
    this.log(Timeline.INFO, event);
  };

  prototype.debug = function(event) {
    this.log(Timeline.DEBUG, event);
  };

  prototype.isEmpty = function() {
    return this.events.length === 0;
  };

  prototype.send = function(sendJSONP, callback) {
    var self = this;

    var data = {};
    if (this.sent === 0) {
      data = Pusher.Util.extend({
        key: this.key,
        features: this.options.features,
        version: this.options.version
      }, this.options.params || {});
    }
    data.session = this.session;
    data.timeline = this.events;
    data = Pusher.Util.filterObject(data, function(v) {
      return v !== undefined;
    });

    this.events = [];
    sendJSONP(data, function(error, result) {
      if (!error) {
        self.sent++;
      }
      if (callback) {
        callback(error, result);
      }
    });

    return true;
  };

  prototype.generateUniqueID = function() {
    this.uniqueID++;
    return this.uniqueID;
  };

  Pusher.Timeline = Timeline;
}).call(this);
