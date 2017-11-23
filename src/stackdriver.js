import StackTrace from "stacktrace-js";

/**
 * URL endpoint of the Stackdriver Error Reporting report API.
 */
var baseAPIUrl = "https://clouderrorreporting.googleapis.com/v1beta1/projects/";

/**
 * An Error handler that sends errors to the Stackdriver Error Reporting API.
 */
const StackdriverErrorReporter = function() {};

/**
 * Initialize the StackdriverErrorReporter object.
 * @param {Object} config - the init configuration.
 * @param {Object} [config.context={}] - the context in which the error occurred.
 * @param {string} [config.context.user] - the user who caused or was affected by the error.
 * @param {String} config.key - the API key to use to call the API.
 * @param {String} config.projectId - the Google Cloud Platform project ID to report errors to.
 * @param {String} [config.service=web] - service identifier.
 * @param {String} [config.version] - version identifier.
 * @param {Boolean} [config.reportUncaughtExceptions=true] - Set to false to stop reporting unhandled exceptions.
 * @param {Boolean} [config.disabled=false] - Set to true to not report errors when calling report(), this can be used when developping locally.
 */
StackdriverErrorReporter.prototype.start = function(config) {
  if(!config.key) {
    throw new Error('Cannot initialize: No API key provided.');
  }
  if(!config.projectId) {
    throw new Error('Cannot initialize: No project ID provided.');
  }

  this.apiKey = config.key;
  this.projectId = config.projectId;
  this.context = config.context || {};
  this.serviceContext = {service: config.service || 'web'};
  if(config.version) {
    this.serviceContext.version = config.version;
  }
  this.reportUncaughtExceptions = config.reportUncaughtExceptions !== false;
  this.disabled = config.disabled || false;

  // Register as global error handler if requested
  var that = this;
  if(this.reportUncaughtExceptions) {
    var oldErrorHandler = window.onerror || function(){};

    window.onerror = function(message, source, lineno, colno, error) {
      if(error){
        that.report(error);
      }
      oldErrorHandler(message, source, lineno, colno, error);
      return true;
    };
  }
};

/**
 * Report an error to the Stackdriver Error Reporting API
 * @param {Error|String} err - The Error object or message string to report.
 * @param callback - Calback function to be called once error has been reported.
 */
StackdriverErrorReporter.prototype.report = function(err, callback) {
  if(this.disabled) {
    return typeof callback === 'function' && callback();
  }
  if(!err) {
    return typeof callback === 'function' && callback('no error to report');
  }

  var payload = {};
  payload.serviceContext = this.serviceContext;
  payload.context = this.context;
  payload.context.httpRequest = {
    userAgent: window.navigator.userAgent,
    url: window.location.href
  };

  var firstFrameIndex = 0;
  if(typeof err === 'string' || err instanceof String) {
    // Transform the message in an error, use try/catch to make sure the stacktrace is populated.
    try {
      throw new Error(err);
    } catch(e) {
      err = e;
    }
    // the first frame when using report() is always this library
    firstFrameIndex = 1;
  }
  var that = this;
  // This will use sourcemaps and normalize the stack frames
  StackTrace.fromError(err).then(function(stack){
    payload.message = err.toString();
    for(var s = firstFrameIndex; s < stack.length; s++) {
      payload.message += '\n';
      // Reconstruct the stackframe to a JS stackframe as expected by Error Reporting parsers.
      // stack[s].source should not be used because not populated when created from source map.
      payload.message += ['    at ', stack[s].getFunctionName(), ' (', stack[s].getFileName(), ':', stack[s].getLineNumber() ,':', stack[s].getColumnNumber() , ')'].join('');
    }
    that.sendErrorPayload(payload, callback);
  }, function(reason) {
    // Failure to extract stacktrace
    payload.message = [
      'Error extracting stack trace: ', reason, '\n',
      err.toString(), '\n',
      '    (', err.file, ':', err.line, ':', err.column, ')',
    ].join('');
    that.sendErrorPayload(payload, callback);
  });
};

StackdriverErrorReporter.prototype.sendErrorPayload = function(payload, callback) {
  var url = baseAPIUrl + this.projectId + "/events:report?key=" + this.apiKey;

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.onloadend = function() {
    return typeof callback === 'function' && callback();
  };
  xhr.onerror = function(e) {
    return typeof callback === 'function' && callback(e);
  };
  xhr.send(JSON.stringify(payload));
};

/**
 * Set the user for the current context.
 *
 * @param {string} user - the unique identifier of the user (can be ID, email or custom token) or `undefined` if not logged in.
 */
StackdriverErrorReporter.prototype.setUser = function(user) {
  this.context.user = user;
};

export default StackdriverErrorReporter;