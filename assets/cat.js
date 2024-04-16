!(function(win) {

/**
 * FastDom
 *
 * Eliminates layout thrashing
 * by batching DOM read/write
 * interactions.
 *
 * @author Wilson Page <wilsonpage@me.com>
 * @author Kornel Lesinski <kornel.lesinski@ft.com>
 */

'use strict';

/**
 * Mini logger
 *
 * @return {Function}
 */
var debug = 0 ? console.log.bind(console, '[fastdom]') : function() {};

/**
 * Normalized rAF
 *
 * @type {Function}
 */
var raf = win.requestAnimationFrame
  || win.webkitRequestAnimationFrame
  || win.mozRequestAnimationFrame
  || win.msRequestAnimationFrame
  || function(cb) { return setTimeout(cb, 16); };

/**
 * Initialize a `FastDom`.
 *
 * @constructor
 */
function FastDom() {
  var self = this;
  self.reads = [];
  self.writes = [];
  self.raf = raf.bind(win); // test hook
  debug('initialized', self);
}

FastDom.prototype = {
  constructor: FastDom,

  /**
   * We run this inside a try catch
   * so that if any jobs error, we
   * are able to recover and continue
   * to flush the batch until it's empty.
   *
   * @param {Array} tasks
   */
  runTasks: function(tasks) {
    debug('run tasks');
    var task; while (task = tasks.shift()) task();
  },

  /**
   * Adds a job to the read batch and
   * schedules a new frame if need be.
   *
   * @param  {Function} fn
   * @param  {Object} ctx the context to be bound to `fn` (optional).
   * @public
   */
  measure: function(fn, ctx) {
    debug('measure');
    var task = !ctx ? fn : fn.bind(ctx);
    this.reads.push(task);
    scheduleFlush(this);
    return task;
  },

  /**
   * Adds a job to the
   * write batch and schedules
   * a new frame if need be.
   *
   * @param  {Function} fn
   * @param  {Object} ctx the context to be bound to `fn` (optional).
   * @public
   */
  mutate: function(fn, ctx) {
    debug('mutate');
    var task = !ctx ? fn : fn.bind(ctx);
    this.writes.push(task);
    scheduleFlush(this);
    return task;
  },

  /**
   * Clears a scheduled 'read' or 'write' task.
   *
   * @param {Object} task
   * @return {Boolean} success
   * @public
   */
  clear: function(task) {
    debug('clear', task);
    return remove(this.reads, task) || remove(this.writes, task);
  },

  /**
   * Extend this FastDom with some
   * custom functionality.
   *
   * Because fastdom must *always* be a
   * singleton, we're actually extending
   * the fastdom instance. This means tasks
   * scheduled by an extension still enter
   * fastdom's global task queue.
   *
   * The 'super' instance can be accessed
   * from `this.fastdom`.
   *
   * @example
   *
   * var myFastdom = fastdom.extend({
   *   initialize: function() {
   *     // runs on creation
   *   },
   *
   *   // override a method
   *   measure: function(fn) {
   *     // do extra stuff ...
   *
   *     // then call the original
   *     return this.fastdom.measure(fn);
   *   },
   *
   *   ...
   * });
   *
   * @param  {Object} props  properties to mixin
   * @return {FastDom}
   */
  extend: function(props) {
    debug('extend', props);
    if (typeof props != 'object') throw new Error('expected object');

    var child = Object.create(this);
    mixin(child, props);
    child.fastdom = this;

    // run optional creation hook
    if (child.initialize) child.initialize();

    return child;
  },

  // override this with a function
  // to prevent Errors in console
  // when tasks throw
  catch: null
};

/**
 * Schedules a new read/write
 * batch if one isn't pending.
 *
 * @private
 */
function scheduleFlush(fastdom) {
  if (!fastdom.scheduled) {
    fastdom.scheduled = true;
    fastdom.raf(flush.bind(null, fastdom));
    debug('flush scheduled');
  }
}

/**
 * Runs queued `read` and `write` tasks.
 *
 * Errors are caught and thrown by default.
 * If a `.catch` function has been defined
 * it is called instead.
 *
 * @private
 */
function flush(fastdom) {
  debug('flush');

  var writes = fastdom.writes;
  var reads = fastdom.reads;
  var error;

  try {
    debug('flushing reads', reads.length);
    fastdom.runTasks(reads);
    debug('flushing writes', writes.length);
    fastdom.runTasks(writes);
  } catch (e) { error = e; }

  fastdom.scheduled = false;

  // If the batch errored we may still have tasks queued
  if (reads.length || writes.length) scheduleFlush(fastdom);

  if (error) {
    debug('task errored', error.message);
    if (fastdom.catch) fastdom.catch(error);
    else throw error;
  }
}

/**
 * Remove an item from an Array.
 *
 * @param  {Array} array
 * @param  {*} item
 * @return {Boolean}
 */
function remove(array, item) {
  var index = array.indexOf(item);
  return !!~index && !!array.splice(index, 1);
}

/**
 * Mixin own properties of source
 * object into the target.
 *
 * @param  {Object} target
 * @param  {Object} source
 */
function mixin(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) target[key] = source[key];
  }
}

// There should never be more than
// one instance of `FastDom` in an app
var exports = win.fastdom = (win.fastdom || new FastDom()); // jshint ignore:line

// Expose to CJS & AMD
if ((typeof define) == 'function') define(function() { return exports; });
else if ((typeof module) == 'object') module.exports = exports;

})( typeof window !== 'undefined' ? window : this);

/** jQuery_T4NT pjax https://raw.githubusercontent.com/defunkt/jQuery_T4NT-pjax/master/jQuery_T4NT.pjax.js 
 * Copyright 2012, Chris Wanstrath
 * Released under the MIT License
 * https://github.com/defunkt/jQuery_T4NT-pjax
 **/

(function($){

// When called on a container with a selector, fetches the href with
// ajax into the container or with the data-pjax attribute on the link
// itself.
//
// Tries to make sure the back button and ctrl+click work the way
// you'd expect.
//
// Exported as $.fn.pjax
//
// Accepts a jQuery_T4NT ajax options object that may include these
// pjax specific options:
//
//
// container - String selector for the element where to place the response body.
//      push - Whether to pushState the URL. Defaults to true (of course).
//   replace - Want to use replaceState instead? That's cool.
//
// For convenience the second parameter can be either the container or
// the options object.
//
// Returns the jQuery_T4NT object
function fnPjax(selector, container, options) {
  options = optionsFor(container, options)
  return this.on('click.pjax', selector, function(event) {
    var opts = options
    if (!opts.container) {
      opts = $.extend({}, options)
      opts.container = $(this).attr('data-pjax')
    }
    handleClick(event, opts)
  })
}

// Public: pjax on click handler
//
// Exported as $.pjax.click.
//
// event   - "click" jQuery_T4NT.Event
// options - pjax options
//
// Examples
//
//   $(document).on('click', 'a', $.pjax.click)
//   // is the same as
//   $(document).pjax('a')
//
// Returns nothing.
function handleClick(event, container, options) {
  options = optionsFor(container, options)

  var link = event.currentTarget
  var $link = $(link)

  if (link.tagName.toUpperCase() !== 'A')
    throw "$.fn.pjax or $.pjax.click requires an anchor element"

  // Middle click, cmd click, and ctrl click should open
  // links in a new tab as normal.
  if ( event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey )
    return

  // Ignore cross origin links
  if ( location.protocol !== link.protocol || location.hostname !== link.hostname )
    return

  // Ignore case when a hash is being tacked on the current URL
  if ( link.href.indexOf('#') > -1 && stripHash(link) == stripHash(location) )
    return

  // Ignore event with default prevented
  if (event.isDefaultPrevented())
    return

  var defaults = {
    url: link.href,
    container: $link.attr('data-pjax'),
    target: link
  }

  var opts = $.extend({}, defaults, options)
  var clickEvent = $.Event('pjax:click')
  $link.trigger(clickEvent, [opts])

  if (!clickEvent.isDefaultPrevented()) {
    pjax(opts)
    event.preventDefault()
    $link.trigger('pjax:clicked', [opts])
  }
}

// Public: pjax on form submit handler
//
// Exported as $.pjax.submit
//
// event   - "click" jQuery_T4NT.Event
// options - pjax options
//
// Examples
//
//  $(document).on('submit', 'form', function(event) {
//    $.pjax.submit(event, '[data-pjax-container]')
//  })
//
// Returns nothing.
function handleSubmit(event, container, options) {
  options = optionsFor(container, options)

  var form = event.currentTarget
  var $form = $(form)

  if (form.tagName.toUpperCase() !== 'FORM')
    throw "$.pjax.submit requires a form element"

  var defaults = {
    type: ($form.attr('method') || 'GET').toUpperCase(),
    url: $form.attr('action'),
    container: $form.attr('data-pjax'),
    target: form
  }

  if (defaults.type !== 'GET' && window.FormData !== undefined) {
    defaults.data = new FormData(form)
    defaults.processData = false
    defaults.contentType = false
  } else {
    // Can't handle file uploads, exit
    if ($form.find(':file').length) {
      return
    }

    // Fallback to manually serializing the fields
    defaults.data = $form.serializeArray()
  }

  pjax($.extend({}, defaults, options))

  event.preventDefault()
}

// Loads a URL with ajax, puts the response body inside a container,
// then pushState()'s the loaded URL.
//
// Works just like $.ajax in that it accepts a jQuery_T4NT ajax
// settings object (with keys like url, type, data, etc).
//
// Accepts these extra keys:
//
// container - String selector for where to stick the response body.
//      push - Whether to pushState the URL. Defaults to true (of course).
//   replace - Want to use replaceState instead? That's cool.
//
// Use it just like $.ajax:
//
//   var xhr = $.pjax({ url: this.href, container: '#main' })
//   console.log( xhr.readyState )
//
// Returns whatever $.ajax returns.
function pjax(options) {
  options = $.extend(true, {}, $.ajaxSettings, pjax.defaults, options)

  if ($.isFunction(options.url)) {
    options.url = options.url()
  }

  var hash = parseURL(options.url).hash

  var containerType = $.type(options.container)
  if (containerType !== 'string') {
    throw "expected string value for 'container' option; got " + containerType
  }
  var context = options.context = $(options.container)
  if (!context.length) {
    throw "the container selector '" + options.container + "' did not match anything"
  }

  // We want the browser to maintain two separate internal caches: one
  // for pjax'd partial page loads and one for normal page loads.
  // Without adding this secret parameter, some browsers will often
  // confuse the two.
  if (!options.data) options.data = {}
  if ($.isArray(options.data)) {
    options.data.push({name: '_pjax', value: options.container})
  } else {
    options.data._pjax = options.container
  }

  function fire(type, args, props) {
    if (!props) props = {}
    props.relatedTarget = options.target
    var event = $.Event(type, props)
    context.trigger(event, args)
    return !event.isDefaultPrevented()
  }

  var timeoutTimer

  options.beforeSend = function(xhr, settings) {
    // No timeout for non-GET requests
    // Its not safe to request the resource again with a fallback method.
    if (settings.type !== 'GET') {
      settings.timeout = 0
    }

    xhr.setRequestHeader('X-PJAX', 'true')
    xhr.setRequestHeader('X-PJAX-Container', options.container)

    if (!fire('pjax:beforeSend', [xhr, settings]))
      return false

    if (settings.timeout > 0) {
      timeoutTimer = setTimeout(function() {
        if (fire('pjax:timeout', [xhr, options]))
          xhr.abort('timeout')
      }, settings.timeout)

      // Clear timeout setting so jQuery_T4NTs internal timeout isn't invoked
      settings.timeout = 0
    }

    var url = parseURL(settings.url)
    if (hash) url.hash = hash
    options.requestUrl = stripInternalParams(url)
  }

  options.complete = function(xhr, textStatus) {
    if (timeoutTimer)
      clearTimeout(timeoutTimer)

    fire('pjax:complete', [xhr, textStatus, options])

    fire('pjax:end', [xhr, options])
  }

  options.error = function(xhr, textStatus, errorThrown) {
    //var container = extractContainer("", xhr, options)
    var container = extractContainer("", xhr, options),
    container_url = container.url,
    container_url = container_url.split('&section_id=')[0];

    var allowed = fire('pjax:error', [xhr, textStatus, errorThrown, options])
    if (options.type == 'GET' && textStatus !== 'abort' && allowed) {
      //locationReplace(container.url)
      locationReplace(container_url)
    }
  }

  options.success = function(data, status, xhr) {
    var previousState = pjax.state

    // If $.pjax.defaults.version is a function, invoke it first.
    // Otherwise it can be a static string.
    var currentVersion = typeof $.pjax.defaults.version === 'function' ?
      $.pjax.defaults.version() :
      $.pjax.defaults.version

    var latestVersion = xhr.getResponseHeader('X-PJAX-Version')
    
    // nathan edit 
    // var container = extractContainer(data, xhr, options),
    // container_url = container.url;
    var container = extractContainer(data, xhr, options),
        container_url = container.url,
        container_url = container_url.split('&section_id=')[0],
        url = parseURL(container_url);

    //var url = parseURL(container.url)
    // console.log(container.url)
    // console.log(url)
    if (hash) {
      url.hash = hash
      container_url = url.href
    }
    //console.log(container_url)

    // If there is a layout version mismatch, hard load the new url
    if (currentVersion && latestVersion && currentVersion !== latestVersion) {
      locationReplace(container_url)
      return
    }

    // If the new response is missing a body, hard load the page
    if (!container.contents) {
      locationReplace(container_url)
      return
    }

    pjax.state = {
      id: options.id || uniqueId(),
      url: container_url,
      title: container.title,
      offset: options.offset,
      container: options.container,
      fragment: options.fragment,
      timeout: options.timeout
    }

    if (options.push || options.replace) {
      window.history.replaceState(pjax.state, container.title, container_url)
    }

    // Only blur the focus if the focused element is within the container.
    var blurFocus = $.contains(context, document.activeElement)

    // Clear out any focused controls before inserting new page contents.
    if (blurFocus) {
      try {
        document.activeElement.blur()
      } catch (e) { /* ignore */ }
    }

    if (container.title) document.title = container.title

    fire('pjax:beforeReplace', [container.contents, options], {
      state: pjax.state,
      previousState: previousState
    })
    context.html(container.contents)

    // FF bug: Won't autofocus fields that are inserted via JS.
    // This behavior is incorrect. So if theres no current focus, autofocus
    // the last field.
    //
    // http://www.w3.org/html/wg/drafts/html/master/forms.html
    var autofocusEl = context.find('input[autofocus], textarea[autofocus]').last()[0]
    if (autofocusEl && document.activeElement !== autofocusEl) {
      autofocusEl.focus()
    }

    executeScriptTags(container.scripts)

    var scrollTo = options.scrollTo

    // Ensure browser scrolls to the element referenced by the URL anchor
    if (hash) {
      var name = decodeURIComponent(hash.slice(1))
      var target = document.getElementById(name) || document.getElementsByName(name)[0]
      if (target) scrollTo = $(target).offset().top
    }

    if (typeof scrollTo == 'number') $(window).scrollTop(scrollTo)

    fire('pjax:success', [data, status, xhr, options])
  }


  // Initialize pjax.state for the initial page load. Assume we're
  // using the container and options of the link we're loading for the
  // back button to the initial page. This ensures good back button
  // behavior.
  if (!pjax.state) {
    pjax.state = {
      id: uniqueId(),
      url: window.location.href,
      title: document.title,
      offset: options.offset,
      container: options.container,
      fragment: options.fragment,
      timeout: options.timeout
    }
    window.history.replaceState(pjax.state, document.title)
  }

  // Cancel the current request if we're already pjaxing
  abortXHR(pjax.xhr)

  pjax.options = options
  var xhr = pjax.xhr = $.ajax(options)

  if (xhr.readyState > 0) {
    if (options.push && !options.replace) {
      // Cache current container element before replacing it
      cachePush(pjax.state.id, [options.container, cloneContents(context)])
      
      // nathan edit 
      var requestUrl = options.requestUrl,
        requestUrl = requestUrl.split('&section_id=')[0];
      //console.log(requestUrl);
      //window.history.pushState(null, "", options.requestUrl)
      window.history.pushState(null, "", requestUrl)
    }

    fire('pjax:start', [xhr, options])
    fire('pjax:send', [xhr, options])
  }

  return pjax.xhr
}

// Public: Reload current page with pjax.
//
// Returns whatever $.pjax returns.
function pjaxReload(container, options) {
  var defaults = {
    url: window.location.href,
    push: false,
    replace: true,
    scrollTo: false
  }

  return pjax($.extend(defaults, optionsFor(container, options)))
}

// Internal: Hard replace current state with url.
//
// Work for around WebKit
//   https://bugs.webkit.org/show_bug.cgi?id=93506
//
// Returns nothing.
function locationReplace(url) {
  window.history.replaceState(null, "", pjax.state.url)
  window.location.replace(url)
}


var initialPop = true
var initialURL = window.location.href
var initialState = window.history.state

// Initialize $.pjax.state if possible
// Happens when reloading a page and coming forward from a different
// session history.
if (initialState && initialState.container) {
  pjax.state = initialState
}

// Non-webkit browsers don't fire an initial popstate event
if ('state' in window.history) {
  initialPop = false
}

// popstate handler takes care of the back and forward buttons
//
// You probably shouldn't use pjax on pages with other pushState
// stuff yet.
function onPjaxPopstate(event) {

  // Hitting back or forward should override any pending PJAX request.
  if (!initialPop) {
    abortXHR(pjax.xhr)
  }

  var previousState = pjax.state
  var state = event.state
  var direction

  if (state && state.container) {
    // When coming forward from a separate history session, will get an
    // initial pop with a state we are already at. Skip reloading the current
    // page.
    if (initialPop && initialURL == state.url) return

    if (previousState) {
      // If popping back to the same state, just skip.
      // Could be clicking back from hashchange rather than a pushState.
      if (previousState.id === state.id) return

      // Since state IDs always increase, we can deduce the navigation direction
      direction = previousState.id < state.id ? 'forward' : 'back'
    }

    var cache = cacheMapping[state.id] || []
    var containerSelector = cache[0] || state.container
    var container = $(containerSelector), contents = cache[1]

    if (container.length) {
      if (previousState) {
        // Cache current container before replacement and inform the
        // cache which direction the history shifted.
        cachePop(direction, previousState.id, [containerSelector, cloneContents(container)])
      }

      var popstateEvent = $.Event('pjax:popstate', {
        state: state,
        direction: direction
      })
      container.trigger(popstateEvent)

      var options = {
        id: state.id,
        url: state.url,
        container: containerSelector,
        push: false,
        offset: state.offset,
        fragment: state.fragment,
        timeout: state.timeout,
        scrollTo: false
      }

      if (contents) {
        container.trigger('pjax:start', [null, options])

        pjax.state = state
        if (state.title) document.title = state.title
        var beforeReplaceEvent = $.Event('pjax:beforeReplace', {
          state: state,
          previousState: previousState
        })
        container.trigger(beforeReplaceEvent, [contents, options])
        container.html(contents)

        container.trigger('pjax:end', [null, options])
      } else {
        pjax(options)
      }

      // Force reflow/relayout before the browser tries to restore the
      // scroll position.
      container[0].offsetHeight // eslint-disable-line no-unused-expressions
    } else {
      locationReplace(location.href)
    }
  }
  initialPop = false
}

// Fallback version of main pjax function for browsers that don't
// support pushState.
//
// Returns nothing since it retriggers a hard form submission.
function fallbackPjax(options) {
  var url = $.isFunction(options.url) ? options.url() : options.url,
      method = options.type ? options.type.toUpperCase() : 'GET'

  var form = $('<form>', {
    method: method === 'GET' ? 'GET' : 'POST',
    action: url,
    style: 'display:none'
  })

  if (method !== 'GET' && method !== 'POST') {
    form.append($('<input>', {
      type: 'hidden',
      name: '_method',
      value: method.toLowerCase()
    }))
  }

  var data = options.data
  if (typeof data === 'string') {
    $.each(data.split('&'), function(index, value) {
      var pair = value.split('=')
      form.append($('<input>', {type: 'hidden', name: pair[0], value: pair[1]}))
    })
  } else if ($.isArray(data)) {
    $.each(data, function(index, value) {
      form.append($('<input>', {type: 'hidden', name: value.name, value: value.value}))
    })
  } else if (typeof data === 'object') {
    var key
    for (key in data)
      form.append($('<input>', {type: 'hidden', name: key, value: data[key]}))
  }

  $(document.body).append(form)
  form.submit()
}

// Internal: Abort an XmlHttpRequest if it hasn't been completed,
// also removing its event handlers.
function abortXHR(xhr) {
  if ( xhr && xhr.readyState < 4) {
    xhr.onreadystatechange = $.noop
    xhr.abort()
  }
}

// Internal: Generate unique id for state object.
//
// Use a timestamp instead of a counter since ids should still be
// unique across page loads.
//
// Returns Number.
function uniqueId() {
  return (new Date).getTime()
}

function cloneContents(container) {
  var cloned = container.clone()
  // Unmark script tags as already being eval'd so they can get executed again
  // when restored from cache. HAXX: Uses jQuery_T4NT internal method.
  cloned.find('script').each(function(){
    if (!this.src) $._data(this, 'globalEval', false)
  })
  return cloned.contents()
}

// Internal: Strip internal query params from parsed URL.
//
// Returns sanitized url.href String.
function stripInternalParams(url) {
  url.search = url.search.replace(/([?&])(_pjax|_)=[^&]*/g, '').replace(/^&/, '')
  return url.href.replace(/\?($|#)/, '$1')
}

// Internal: Parse URL components and returns a Locationish object.
//
// url - String URL
//
// Returns HTMLAnchorElement that acts like Location.
function parseURL(url) {
  var a = document.createElement('a')
  a.href = url
  return a
}

// Internal: Return the `href` component of given URL object with the hash
// portion removed.
//
// location - Location or HTMLAnchorElement
//
// Returns String
function stripHash(location) {
  return location.href.replace(/#.*/, '')
}

// Internal: Build options Object for arguments.
//
// For convenience the first parameter can be either the container or
// the options object.
//
// Examples
//
//   optionsFor('#container')
//   // => {container: '#container'}
//
//   optionsFor('#container', {push: true})
//   // => {container: '#container', push: true}
//
//   optionsFor({container: '#container', push: true})
//   // => {container: '#container', push: true}
//
// Returns options Object.
function optionsFor(container, options) {
  if (container && options) {
    options = $.extend({}, options)
    options.container = container
    return options
  } else if ($.isPlainObject(container)) {
    return container
  } else {
    return {container: container}
  }
}

// Internal: Filter and find all elements matching the selector.
//
// Where $.fn.find only matches descendants, findAll will test all the
// top level elements in the jQuery_T4NT object as well.
//
// elems    - jQuery_T4NT object of Elements
// selector - String selector to match
//
// Returns a jQuery_T4NT object.
function findAll(elems, selector) {
  return elems.filter(selector).add(elems.find(selector))
}

function parseHTML(html) {
  return $.parseHTML(html, document, true)
}

// Internal: Extracts container and metadata from response.
//
// 1. Extracts X-PJAX-URL header if set
// 2. Extracts inline <title> tags
// 3. Builds response Element and extracts fragment if set
//
// data    - String response data
// xhr     - XHR response
// options - pjax options Object
//
// Returns an Object with url, title, and contents keys.
function extractContainer(data, xhr, options) {
  var obj = {}, fullDocument = /<html/i.test(data)

  // Prefer X-PJAX-URL header if it was set, otherwise fallback to
  // using the original requested url.
  var serverUrl = xhr.getResponseHeader('X-PJAX-URL')
  obj.url = serverUrl ? stripInternalParams(parseURL(serverUrl)) : options.requestUrl

  var $head, $body
  // Attempt to parse response html into elements
  if (fullDocument) {
    $body = $(parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]))
    var head = data.match(/<head[^>]*>([\s\S.]*)<\/head>/i)
    $head = head != null ? $(parseHTML(head[0])) : $body
  } else {
    $head = $body = $(parseHTML(data))
  }

  // If response data is empty, return fast
  if ($body.length === 0)
    return obj

  // If there's a <title> tag in the header, use it as
  // the page's title.
  obj.title = findAll($head, 'title').last().text()

  if (options.fragment) {
    var $fragment = $body
    // If they specified a fragment, look for it in the response
    // and pull it out.
    if (options.fragment !== 'body') {
      $fragment = findAll($fragment, options.fragment).first()
    }

    if ($fragment.length) {
      obj.contents = options.fragment === 'body' ? $fragment : $fragment.contents()

      // If there's no title, look for data-title and title attributes
      // on the fragment
      if (!obj.title)
        obj.title = $fragment.attr('title') || $fragment.data('title')
    }

  } else if (!fullDocument) {
    obj.contents = $body
  }

  // Clean up any <title> tags
  if (obj.contents) {
    // Remove any parent title elements
    obj.contents = obj.contents.not(function() { return $(this).is('title') })

    // Then scrub any titles from their descendants
    obj.contents.find('title').remove()

    // Gather all script[src] elements
    obj.scripts = findAll(obj.contents, 'script[src]').remove()
    obj.contents = obj.contents.not(obj.scripts)
  }

  // Trim any whitespace off the title
  if (obj.title) obj.title = $.trim(obj.title)

  return obj
}

// Load an execute scripts using standard script request.
//
// Avoids jQuery_T4NT's traditional $.getScript which does a XHR request and
// globalEval.
//
// scripts - jQuery_T4NT object of script Elements
//
// Returns nothing.
function executeScriptTags(scripts) {
  if (!scripts) return

  var existingScripts = $('script[src]')

  scripts.each(function() {
    var src = this.src
    var matchedScripts = existingScripts.filter(function() {
      return this.src === src
    })
    if (matchedScripts.length) return

    var script = document.createElement('script')
    var type = $(this).attr('type')
    if (type) script.type = type
    script.src = $(this).attr('src')
    document.head.appendChild(script)
  })
}

// Internal: History DOM caching class.
var cacheMapping      = {}
var cacheForwardStack = []
var cacheBackStack    = []

// Push previous state id and container contents into the history
// cache. Should be called in conjunction with `pushState` to save the
// previous container contents.
//
// id    - State ID Number
// value - DOM Element to cache
//
// Returns nothing.
function cachePush(id, value) {
  cacheMapping[id] = value
  cacheBackStack.push(id)

  // Remove all entries in forward history stack after pushing a new page.
  trimCacheStack(cacheForwardStack, 0)

  // Trim back history stack to max cache length.
  trimCacheStack(cacheBackStack, pjax.defaults.maxCacheLength)
}

// Shifts cache from directional history cache. Should be
// called on `popstate` with the previous state id and container
// contents.
//
// direction - "forward" or "back" String
// id        - State ID Number
// value     - DOM Element to cache
//
// Returns nothing.
function cachePop(direction, id, value) {
  var pushStack, popStack
  cacheMapping[id] = value

  if (direction === 'forward') {
    pushStack = cacheBackStack
    popStack  = cacheForwardStack
  } else {
    pushStack = cacheForwardStack
    popStack  = cacheBackStack
  }

  pushStack.push(id)
  id = popStack.pop()
  if (id) delete cacheMapping[id]

  // Trim whichever stack we just pushed to to max cache length.
  trimCacheStack(pushStack, pjax.defaults.maxCacheLength)
}

// Trim a cache stack (either cacheBackStack or cacheForwardStack) to be no
// longer than the specified length, deleting cached DOM elements as necessary.
//
// stack  - Array of state IDs
// length - Maximum length to trim to
//
// Returns nothing.
function trimCacheStack(stack, length) {
  while (stack.length > length)
    delete cacheMapping[stack.shift()]
}

// Public: Find version identifier for the initial page load.
//
// Returns String version or undefined.
function findVersion() {
  return $('meta').filter(function() {
    var name = $(this).attr('http-equiv')
    return name && name.toUpperCase() === 'X-PJAX-VERSION'
  }).attr('content')
}

// Install pjax functions on $.pjax to enable pushState behavior.
//
// Does nothing if already enabled.
//
// Examples
//
//     $.pjax.enable()
//
// Returns nothing.
function enable() {
  $.fn.pjax = fnPjax
  $.pjax = pjax
  $.pjax.enable = $.noop
  $.pjax.disable = disable
  $.pjax.click = handleClick
  $.pjax.submit = handleSubmit
  $.pjax.reload = pjaxReload
  $.pjax.defaults = {
    timeout: 650,
    push: true,
    replace: false,
    type: 'GET',
    dataType: 'html',
    scrollTo: 0,
    maxCacheLength: 20,
    version: findVersion
  }
  $(window).on('popstate.pjax', onPjaxPopstate)
}

// Disable pushState behavior.
//
// This is the case when a browser doesn't support pushState. It is
// sometimes useful to disable pushState for debugging on a modern
// browser.
//
// Examples
//
//     $.pjax.disable()
//
// Returns nothing.
function disable() {
  $.fn.pjax = function() { return this }
  $.pjax = fallbackPjax
  $.pjax.enable = enable
  $.pjax.disable = $.noop
  $.pjax.click = $.noop
  $.pjax.submit = $.noop
  $.pjax.reload = function() { window.location.reload() }

  $(window).off('popstate.pjax', onPjaxPopstate)
}


// Add the state property to jQuery_T4NT's event object so we can use it in
// $(window).bind('popstate')
if ($.event.props && $.inArray('state', $.event.props) < 0) {
  $.event.props.push('state')
} else if (!('state' in $.Event.prototype)) {
  $.event.addProp('state')
}

// Is pjax supported by this browser?
$.support.pjax =
  window.history && window.history.pushState && window.history.replaceState &&
  // pushState isn't reliable on iOS until 5.
  !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)

if ($.support.pjax) {
  enable()
} else {
  disable()
}

})(jQuery_T4NT);


/* Waypoints - 4.0.1 */
!function(){"use strict";function t(o){if(!o)throw new Error("No options passed to Waypoint constructor");if(!o.element)throw new Error("No element option passed to Waypoint constructor");if(!o.handler)throw new Error("No handler option passed to Waypoint constructor");this.key="waypoint-"+e,this.options=t.Adapter.extend({},t.defaults,o),this.element=this.options.element,this.adapter=new t.Adapter(this.element),this.callback=o.handler,this.axis=this.options.horizontal?"horizontal":"vertical",this.enabled=this.options.enabled,this.triggerPoint=null,this.group=t.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=t.Context.findOrCreateByElement(this.options.context),t.offsetAliases[this.options.offset]&&(this.options.offset=t.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),i[this.key]=this,e+=1}var e=0,i={};t.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t)},t.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t)},t.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete i[this.key]},t.prototype.disable=function(){return this.enabled=!1,this},t.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},t.prototype.next=function(){return this.group.next(this)},t.prototype.previous=function(){return this.group.previous(this)},t.invokeAll=function(t){var e=[];for(var o in i)e.push(i[o]);for(var n=0,r=e.length;r>n;n++)e[n][t]()},t.destroyAll=function(){t.invokeAll("destroy")},t.disableAll=function(){t.invokeAll("disable")},t.enableAll=function(){t.Context.refreshAll();for(var e in i)i[e].enabled=!0;return this},t.refreshAll=function(){t.Context.refreshAll()},t.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},t.viewportWidth=function(){return document.documentElement.clientWidth},t.adapters=[],t.defaults={context:window,continuous:!0,enabled:!0,group:"default",horizontal:!1,offset:0},t.offsetAliases={"bottom-in-view":function(){return this.context.innerHeight()-this.adapter.outerHeight()},"right-in-view":function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=t}(),function(){"use strict";function t(t){window.setTimeout(t,1e3/60)}function e(t){this.element=t,this.Adapter=n.Adapter,this.adapter=new this.Adapter(t),this.key="waypoint-context-"+i,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,o[t.waypointContextKey]=this,i+=1,n.windowContext||(n.windowContext=!0,n.windowContext=new e(window)),this.createThrottledScrollHandler(),this.createThrottledResizeHandler()}var i=0,o={},n=window.Waypoint,r=window.onload;e.prototype.add=function(t){var e=t.options.horizontal?"horizontal":"vertical";this.waypoints[e][t.key]=t,this.refresh()},e.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical),i=this.element==this.element.window;t&&e&&!i&&(this.adapter.off(".waypoints"),delete o[this.key])},e.prototype.createThrottledResizeHandler=function(){function t(){e.handleResize(),e.didResize=!1}var e=this;this.adapter.on("resize.waypoints",function(){e.didResize||(e.didResize=!0,n.requestAnimationFrame(t))})},e.prototype.createThrottledScrollHandler=function(){function t(){e.handleScroll(),e.didScroll=!1}var e=this;this.adapter.on("scroll.waypoints",function(){(!e.didScroll||n.isTouch)&&(e.didScroll=!0,n.requestAnimationFrame(t))})},e.prototype.handleResize=function(){n.Context.refreshAll()},e.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};for(var i in e){var o=e[i],n=o.newScroll>o.oldScroll,r=n?o.forward:o.backward;for(var s in this.waypoints[i]){var a=this.waypoints[i][s];if(null!==a.triggerPoint){var l=o.oldScroll<a.triggerPoint,h=o.newScroll>=a.triggerPoint,p=l&&h,u=!l&&!h;(p||u)&&(a.queueTrigger(r),t[a.group.id]=a.group)}}}for(var c in t)t[c].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll}},e.prototype.innerHeight=function(){return this.element==this.element.window?n.viewportHeight():this.adapter.innerHeight()},e.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty()},e.prototype.innerWidth=function(){return this.element==this.element.window?n.viewportWidth():this.adapter.innerWidth()},e.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var o=0,n=t.length;n>o;o++)t[o].destroy()},e.prototype.refresh=function(){var t,e=this.element==this.element.window,i=e?void 0:this.adapter.offset(),o={};this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};for(var r in t){var s=t[r];for(var a in this.waypoints[r]){var l,h,p,u,c,d=this.waypoints[r][a],f=d.options.offset,w=d.triggerPoint,y=0,g=null==w;d.element!==d.element.window&&(y=d.adapter.offset()[s.offsetProp]),"function"==typeof f?f=f.apply(d):"string"==typeof f&&(f=parseFloat(f),d.options.offset.indexOf("%")>-1&&(f=Math.ceil(s.contextDimension*f/100))),l=s.contextScroll-s.contextOffset,d.triggerPoint=Math.floor(y+l-f),h=w<s.oldScroll,p=d.triggerPoint>=s.oldScroll,u=h&&p,c=!h&&!p,!g&&u?(d.queueTrigger(s.backward),o[d.group.id]=d.group):!g&&c?(d.queueTrigger(s.forward),o[d.group.id]=d.group):g&&s.oldScroll>=d.triggerPoint&&(d.queueTrigger(s.forward),o[d.group.id]=d.group)}}return n.requestAnimationFrame(function(){for(var t in o)o[t].flushTriggers()}),this},e.findOrCreateByElement=function(t){return e.findByElement(t)||new e(t)},e.refreshAll=function(){for(var t in o)o[t].refresh()},e.findByElement=function(t){return o[t.waypointContextKey]},window.onload=function(){r&&r(),e.refreshAll()},n.requestAnimationFrame=function(e){var i=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||t;i.call(window,e)},n.Context=e}(),function(){"use strict";function t(t,e){return t.triggerPoint-e.triggerPoint}function e(t,e){return e.triggerPoint-t.triggerPoint}function i(t){this.name=t.name,this.axis=t.axis,this.id=this.name+"-"+this.axis,this.waypoints=[],this.clearTriggerQueues(),o[this.axis][this.name]=this}var o={vertical:{},horizontal:{}},n=window.Waypoint;i.prototype.add=function(t){this.waypoints.push(t)},i.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]}},i.prototype.flushTriggers=function(){for(var i in this.triggerQueues){var o=this.triggerQueues[i],n="up"===i||"left"===i;o.sort(n?e:t);for(var r=0,s=o.length;s>r;r+=1){var a=o[r];(a.options.continuous||r===o.length-1)&&a.trigger([i])}}this.clearTriggerQueues()},i.prototype.next=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints),o=i===this.waypoints.length-1;return o?null:this.waypoints[i+1]},i.prototype.previous=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints);return i?this.waypoints[i-1]:null},i.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t)},i.prototype.remove=function(t){var e=n.Adapter.inArray(t,this.waypoints);e>-1&&this.waypoints.splice(e,1)},i.prototype.first=function(){return this.waypoints[0]},i.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},i.findOrCreate=function(t){return o[t.axis][t.name]||new i(t)},n.Group=i}(),function(){"use strict";function t(t){this.$element=e(t)}var e=window.jQuery_T4NT,i=window.Waypoint;e.each(["innerHeight","innerWidth","off","offset","on","outerHeight","outerWidth","scrollLeft","scrollTop"],function(e,i){t.prototype[i]=function(){var t=Array.prototype.slice.call(arguments);return this.$element[i].apply(this.$element,t)}}),e.each(["extend","inArray","isEmptyObject"],function(i,o){t[o]=e[o]}),i.adapters.push({name:"jQuery_T4NT",Adapter:t}),i.Adapter=t}(),function(){"use strict";function t(t){return function(){var i=[],o=arguments[0];return t.isFunction(arguments[0])&&(o=t.extend({},arguments[1]),o.handler=arguments[0]),this.each(function(){var n=t.extend({},o,{element:this});"string"==typeof n.context&&(n.context=t(this).closest(n.context)[0]),i.push(new e(n))}),i}}var e=window.Waypoint;window.jQuery_T4NT&&(window.jQuery_T4NT.fn.waypoint=t(window.jQuery_T4NT)),window.Zepto&&(window.Zepto.fn.waypoint=t(window.Zepto))}();

/* ResizeSensor.js */
!function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.ResizeSensor=t()}("undefined"!=typeof window?window:this,function(){if("undefined"==typeof window)return null;var m=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(e){return window.setTimeout(e,20)};function n(e,t){var i=Object.prototype.toString.call(e),n="[object Array]"===i||"[object NodeList]"===i||"[object HTMLCollection]"===i||"[object Object]"===i||"undefined"!=typeof jQuery_T4NT&&e instanceof jQuery_T4NT||"undefined"!=typeof Elements&&e instanceof Elements,o=0,s=e.length;if(n)for(;o<s;o++)t(e[o]);else t(e)}var o=function(t,i){function y(){var i,n,o=[];this.add=function(e){o.push(e)},this.call=function(){for(i=0,n=o.length;i<n;i++)o[i].call()},this.remove=function(e){var t=[];for(i=0,n=o.length;i<n;i++)o[i]!==e&&t.push(o[i]);o=t},this.length=function(){return o.length}}n(t,function(e){!function(e,t){if(e)if(e.resizedAttached)e.resizedAttached.add(t);else{e.resizedAttached=new y,e.resizedAttached.add(t),e.resizeSensor=document.createElement("div"),e.resizeSensor.className="resize-sensor";var i="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;",n="position: absolute; left: 0; top: 0; transition: 0s;";e.resizeSensor.style.cssText=i,e.resizeSensor.innerHTML='<div class="resize-sensor-expand" style="'+i+'"><div style="'+n+'"></div></div><div class="resize-sensor-shrink" style="'+i+'"><div style="'+n+' width: 200%; height: 200%"></div></div>',e.appendChild(e.resizeSensor),e.resizeSensor.offsetParent!==e&&(e.style.position="relative");var o,s,r,d,c=e.resizeSensor.childNodes[0],l=c.childNodes[0],f=e.resizeSensor.childNodes[1],a=e.offsetWidth,h=e.offsetHeight,u=function(){l.style.width="100000px",l.style.height="100000px",c.scrollLeft=1e5,c.scrollTop=1e5,f.scrollLeft=1e5,f.scrollTop=1e5};u();var z=function(){s=0,o&&(a=r,h=d,e.resizedAttached&&e.resizedAttached.call())},v=function(){r=e.offsetWidth,d=e.offsetHeight,(o=r!=a||d!=h)&&!s&&(s=m(z)),u()},p=function(e,t,i){e.attachEvent?e.attachEvent("on"+t,i):e.addEventListener(t,i)};p(c,"scroll",v),p(f,"scroll",v)}}(e,i)}),this.detach=function(e){o.detach(t,e)}};return o.detach=function(e,t){n(e,function(e){e&&(e.resizedAttached&&"function"==typeof t&&(e.resizedAttached.remove(t),e.resizedAttached.length())||e.resizeSensor&&(e.contains(e.resizeSensor)&&e.removeChild(e.resizeSensor),delete e.resizeSensor,delete e.resizedAttached))})},o});

/* https://github.com/WeCodePixels/theia-sticky-sidebar */
!function(i){i.fn.theiaStickySidebar=function(t){function e(t,e){var a=o(t,e);a||(console.log("TSS: Body width smaller than options.minWidth. Init is delayed."),i(document).on("scroll."+t.namespace,function(t,e){return function(a){var n=o(t,e);n&&i(this).unbind(a)}}(t,e)),i(window).on("resize."+t.namespace,function(t,e){return function(a){var n=o(t,e);n&&i(this).unbind(a)}}(t,e)))}function o(t,e){return t.initialized===!0||!(i("body").width()<t.minWidth)&&(a(t,e),!0)}function a(t,e){t.initialized=!0;var o=i("#theia-sticky-sidebar-stylesheet-"+t.namespace);0===o.length&&i("head").append(i('<style id="theia-sticky-sidebar-stylesheet-'+t.namespace+'">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>')),e.each(function(){function e(){a.fixedScrollTop=0,a.sidebar.css({"min-height":"1px"}),a.stickySidebar.css({position:"static",width:"",transform:"none"})}function o(t){var e=t.height();return t.children().each(function(){e=Math.max(e,i(this).height())}),e}var a={};if(a.sidebar=i(this),a.options=t||{},a.container=i(a.options.containerSelector),0==a.container.length&&(a.container=a.sidebar.parent()),a.sidebar.parents().css("-webkit-transform","none"),a.sidebar.css({position:a.options.defaultPosition,overflow:"visible","-webkit-box-sizing":"border-box","-moz-box-sizing":"border-box","box-sizing":"border-box"}),a.stickySidebar=a.sidebar.find(".theiaStickySidebar"),0==a.stickySidebar.length){var s=/(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;a.sidebar.find("script").filter(function(i,t){return 0===t.type.length||t.type.match(s)}).remove(),a.stickySidebar=i("<div>").addClass("theiaStickySidebar").append(a.sidebar.children()),a.sidebar.append(a.stickySidebar)}a.marginBottom=parseInt(a.sidebar.css("margin-bottom")),a.paddingTop=parseInt(a.sidebar.css("padding-top")),a.paddingBottom=parseInt(a.sidebar.css("padding-bottom"));var r=a.stickySidebar.offset().top,d=a.stickySidebar.outerHeight();a.stickySidebar.css("padding-top",1),a.stickySidebar.css("padding-bottom",1),r-=a.stickySidebar.offset().top,d=a.stickySidebar.outerHeight()-d-r,0==r?(a.stickySidebar.css("padding-top",0),a.stickySidebarPaddingTop=0):a.stickySidebarPaddingTop=1,0==d?(a.stickySidebar.css("padding-bottom",0),a.stickySidebarPaddingBottom=0):a.stickySidebarPaddingBottom=1,a.previousScrollTop=null,a.fixedScrollTop=0,e(),a.onScroll=function(a){if(a.stickySidebar.is(":visible")){if(i("body").width()<a.options.minWidth)return void e();if(a.options.disableOnResponsiveLayouts){var s=a.sidebar.outerWidth("none"==a.sidebar.css("float"));if(s+50>a.container.width())return void e()}var r=i(document).scrollTop(),d="static";if(r>=a.sidebar.offset().top+(a.paddingTop-a.options.additionalMarginTop)){var c,p=a.paddingTop+t.additionalMarginTop,b=a.paddingBottom+a.marginBottom+t.additionalMarginBottom,l=a.sidebar.offset().top,f=a.sidebar.offset().top+o(a.container),h=0+t.additionalMarginTop,g=a.stickySidebar.outerHeight()+p+b<i(window).height();c=g?h+a.stickySidebar.outerHeight():i(window).height()-a.marginBottom-a.paddingBottom-t.additionalMarginBottom;var u=l-r+a.paddingTop,S=f-r-a.paddingBottom-a.marginBottom,y=a.stickySidebar.offset().top-r,m=a.previousScrollTop-r;"fixed"==a.stickySidebar.css("position")&&"modern"==a.options.sidebarBehavior&&(y+=m),"stick-to-top"==a.options.sidebarBehavior&&(y=t.additionalMarginTop),"stick-to-bottom"==a.options.sidebarBehavior&&(y=c-a.stickySidebar.outerHeight()),y=m>0?Math.min(y,h):Math.max(y,c-a.stickySidebar.outerHeight()),y=Math.max(y,u),y=Math.min(y,S-a.stickySidebar.outerHeight());var k=a.container.height()==a.stickySidebar.outerHeight();d=(k||y!=h)&&(k||y!=c-a.stickySidebar.outerHeight())?r+y-a.sidebar.offset().top-a.paddingTop<=t.additionalMarginTop?"static":"absolute":"fixed"}if("fixed"==d){var v=i(document).scrollLeft();a.stickySidebar.css({position:"fixed",width:n(a.stickySidebar)+"px",transform:"translateY("+y+"px)",left:a.sidebar.offset().left+parseInt(a.sidebar.css("padding-left"))-v+"px",top:"0px"})}else if("absolute"==d){var x={};"absolute"!=a.stickySidebar.css("position")&&(x.position="absolute",x.transform="translateY("+(r+y-a.sidebar.offset().top-a.stickySidebarPaddingTop-a.stickySidebarPaddingBottom)+"px)",x.top="0px"),x.width=n(a.stickySidebar)+"px",x.left="",a.stickySidebar.css(x)}else"static"==d&&e();"static"!=d&&1==a.options.updateSidebarHeight&&a.sidebar.css({"min-height":a.stickySidebar.outerHeight()+a.stickySidebar.offset().top-a.sidebar.offset().top+a.paddingBottom}),a.previousScrollTop=r}},a.onScroll(a),i(document).on("scroll."+a.options.namespace,function(i){return function(){i.onScroll(i)}}(a)),i(window).on("resize."+a.options.namespace,function(i){return function(){i.stickySidebar.css({position:"static"}),i.onScroll(i)}}(a)),"undefined"!=typeof ResizeSensor&&new ResizeSensor(a.stickySidebar[0],function(i){return function(){i.onScroll(i)}}(a))})}function n(i){var t;try{t=i[0].getBoundingClientRect().width}catch(i){}return"undefined"==typeof t&&(t=i.width()),t}var s={containerSelector:"",additionalMarginTop:0,additionalMarginBottom:0,updateSidebarHeight:!0,minWidth:0,disableOnResponsiveLayouts:!0,sidebarBehavior:"modern",defaultPosition:"relative",namespace:"TSS"};return t=i.extend(s,t),t.additionalMarginTop=parseInt(t.additionalMarginTop)||0,t.additionalMarginBottom=parseInt(t.additionalMarginBottom)||0,e(t,this),this}}(jQuery_T4NT);

/*! https://github.com/leongersen/wnumb */
//!function(e){"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?module.exports=e():window.wNumb=e()}(function(){"use strict";var o=["decimals","thousand","mark","prefix","suffix","encoder","decoder","negativeBefore","negative","edit","undo"];function w(e){return e.split("").reverse().join("")}function h(e,t){return e.substring(0,t.length)===t}function f(e,t,n){if((e[t]||e[n])&&e[t]===e[n])throw new Error(t)}function x(e){return"number"==typeof e&&isFinite(e)}function n(e,t,n,r,i,o,f,u,s,c,a,p){var d,l,h,g=p,v="",m="";return o&&(p=o(p)),!!x(p)&&(!1!==e&&0===parseFloat(p.toFixed(e))&&(p=0),p<0&&(d=!0,p=Math.abs(p)),!1!==e&&(p=function(e,t){return e=e.toString().split("e"),(+((e=(e=Math.round(+(e[0]+"e"+(e[1]?+e[1]+t:t)))).toString().split("e"))[0]+"e"+(e[1]?e[1]-t:-t))).toFixed(t)}(p,e)),-1!==(p=p.toString()).indexOf(".")?(h=(l=p.split("."))[0],n&&(v=n+l[1])):h=p,t&&(h=w((h=w(h).match(/.{1,3}/g)).join(w(t)))),d&&u&&(m+=u),r&&(m+=r),d&&s&&(m+=s),m+=h,m+=v,i&&(m+=i),c&&(m=c(m,g)),m)}function r(e,t,n,r,i,o,f,u,s,c,a,p){var d,l="";return a&&(p=a(p)),!(!p||"string"!=typeof p)&&(u&&h(p,u)&&(p=p.replace(u,""),d=!0),r&&h(p,r)&&(p=p.replace(r,"")),s&&h(p,s)&&(p=p.replace(s,""),d=!0),i&&function(e,t){return e.slice(-1*t.length)===t}(p,i)&&(p=p.slice(0,-1*i.length)),t&&(p=p.split(t).join("")),n&&(p=p.replace(n,".")),d&&(l+="-"),""!==(l=(l+=p).replace(/[^0-9\.\-.]/g,""))&&(l=Number(l),f&&(l=f(l)),!!x(l)&&l))}function i(e,t,n){var r,i=[];for(r=0;r<o.length;r+=1)i.push(e[o[r]]);return i.push(n),t.apply("",i)}return function e(t){if(!(this instanceof e))return new e(t);"object"==typeof t&&(t=function(e){var t,n,r,i={};for(void 0===e.suffix&&(e.suffix=e.postfix),t=0;t<o.length;t+=1)if(void 0===(r=e[n=o[t]]))"negative"!==n||i.negativeBefore?"mark"===n&&"."!==i.thousand?i[n]=".":i[n]=!1:i[n]="-";else if("decimals"===n){if(!(0<=r&&r<8))throw new Error(n);i[n]=r}else if("encoder"===n||"decoder"===n||"edit"===n||"undo"===n){if("function"!=typeof r)throw new Error(n);i[n]=r}else{if("string"!=typeof r)throw new Error(n);i[n]=r}return f(i,"mark","thousand"),f(i,"prefix","negative"),f(i,"prefix","negativeBefore"),i}(t),this.to=function(e){return i(t,n,e)},this.from=function(e){return i(t,r,e)})}});

/*! nouislider - 14.6.0 - 6/27/2020 */
!function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():window.noUiSlider=t()}(function(){"use strict";var lt="14.6.0";function ut(t){t.parentElement.removeChild(t)}function a(t){return null!=t}function ct(t){t.preventDefault()}function o(t){return"number"==typeof t&&!isNaN(t)&&isFinite(t)}function pt(t,e,r){0<r&&(ht(t,e),setTimeout(function(){mt(t,e)},r))}function ft(t){return Math.max(Math.min(t,100),0)}function dt(t){return Array.isArray(t)?t:[t]}function e(t){var e=(t=String(t)).split(".");return 1<e.length?e[1].length:0}function ht(t,e){t.classList&&!/\s/.test(e)?t.classList.add(e):t.className+=" "+e}function mt(t,e){t.classList&&!/\s/.test(e)?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," ")}function gt(t){var e=void 0!==window.pageXOffset,r="CSS1Compat"===(t.compatMode||"");return{x:e?window.pageXOffset:r?t.documentElement.scrollLeft:t.body.scrollLeft,y:e?window.pageYOffset:r?t.documentElement.scrollTop:t.body.scrollTop}}function c(t,e){return 100/(e-t)}function p(t,e,r){return 100*e/(t[r+1]-t[r])}function f(t,e){for(var r=1;t>=e[r];)r+=1;return r}function r(t,e,r){if(r>=t.slice(-1)[0])return 100;var n,i,o=f(r,t),s=t[o-1],a=t[o],l=e[o-1],u=e[o];return l+(i=r,p(n=[s,a],n[0]<0?i+Math.abs(n[0]):i-n[0],0)/c(l,u))}function n(t,e,r,n){if(100===n)return n;var i,o,s=f(n,t),a=t[s-1],l=t[s];return r?(l-a)/2<n-a?l:a:e[s-1]?t[s-1]+(i=n-t[s-1],o=e[s-1],Math.round(i/o)*o):n}function s(t,e,r){var n;if("number"==typeof e&&(e=[e]),!Array.isArray(e))throw new Error("noUiSlider ("+lt+"): 'range' contains invalid value.");if(!o(n="min"===t?0:"max"===t?100:parseFloat(t))||!o(e[0]))throw new Error("noUiSlider ("+lt+"): 'range' value isn't numeric.");r.xPct.push(n),r.xVal.push(e[0]),n?r.xSteps.push(!isNaN(e[1])&&e[1]):isNaN(e[1])||(r.xSteps[0]=e[1]),r.xHighestCompleteStep.push(0)}function l(t,e,r){if(e)if(r.xVal[t]!==r.xVal[t+1]){r.xSteps[t]=p([r.xVal[t],r.xVal[t+1]],e,0)/c(r.xPct[t],r.xPct[t+1]);var n=(r.xVal[t+1]-r.xVal[t])/r.xNumSteps[t],i=Math.ceil(Number(n.toFixed(3))-1),o=r.xVal[t]+r.xNumSteps[t]*i;r.xHighestCompleteStep[t]=o}else r.xSteps[t]=r.xHighestCompleteStep[t]=r.xVal[t]}function i(t,e,r){var n;this.xPct=[],this.xVal=[],this.xSteps=[r||!1],this.xNumSteps=[!1],this.xHighestCompleteStep=[],this.snap=e;var i=[];for(n in t)t.hasOwnProperty(n)&&i.push([t[n],n]);for(i.length&&"object"==typeof i[0][0]?i.sort(function(t,e){return t[0][0]-e[0][0]}):i.sort(function(t,e){return t[0]-e[0]}),n=0;n<i.length;n++)s(i[n][1],i[n][0],this);for(this.xNumSteps=this.xSteps.slice(0),n=0;n<this.xNumSteps.length;n++)l(n,this.xNumSteps[n],this)}i.prototype.getDistance=function(t){var e,r=[];for(e=0;e<this.xNumSteps.length-1;e++){var n=this.xNumSteps[e];if(n&&t/n%1!=0)throw new Error("noUiSlider ("+lt+"): 'limit', 'margin' and 'padding' of "+this.xPct[e]+"% range must be divisible by step.");r[e]=p(this.xVal,t,e)}return r},i.prototype.getAbsoluteDistance=function(t,e,r){var n,i=0;if(t<this.xPct[this.xPct.length-1])for(;t>this.xPct[i+1];)i++;else t===this.xPct[this.xPct.length-1]&&(i=this.xPct.length-2);r||t!==this.xPct[i+1]||i++;var o=1,s=e[i],a=0,l=0,u=0,c=0;for(n=r?(t-this.xPct[i])/(this.xPct[i+1]-this.xPct[i]):(this.xPct[i+1]-t)/(this.xPct[i+1]-this.xPct[i]);0<s;)a=this.xPct[i+1+c]-this.xPct[i+c],100<e[i+c]*o+100-100*n?(l=a*n,o=(s-100*n)/e[i+c],n=1):(l=e[i+c]*a/100*o,o=0),r?(u-=l,1<=this.xPct.length+c&&c--):(u+=l,1<=this.xPct.length-c&&c++),s=e[i+c]*o;return t+u},i.prototype.toStepping=function(t){return t=r(this.xVal,this.xPct,t)},i.prototype.fromStepping=function(t){return function(t,e,r){if(100<=r)return t.slice(-1)[0];var n,i=f(r,e),o=t[i-1],s=t[i],a=e[i-1],l=e[i];return n=[o,s],(r-a)*c(a,l)*(n[1]-n[0])/100+n[0]}(this.xVal,this.xPct,t)},i.prototype.getStep=function(t){return t=n(this.xPct,this.xSteps,this.snap,t)},i.prototype.getDefaultStep=function(t,e,r){var n=f(t,this.xPct);return(100===t||e&&t===this.xPct[n-1])&&(n=Math.max(n-1,1)),(this.xVal[n]-this.xVal[n-1])/r},i.prototype.getNearbySteps=function(t){var e=f(t,this.xPct);return{stepBefore:{startValue:this.xVal[e-2],step:this.xNumSteps[e-2],highestStep:this.xHighestCompleteStep[e-2]},thisStep:{startValue:this.xVal[e-1],step:this.xNumSteps[e-1],highestStep:this.xHighestCompleteStep[e-1]},stepAfter:{startValue:this.xVal[e],step:this.xNumSteps[e],highestStep:this.xHighestCompleteStep[e]}}},i.prototype.countStepDecimals=function(){var t=this.xNumSteps.map(e);return Math.max.apply(null,t)},i.prototype.convert=function(t){return this.getStep(this.toStepping(t))};var u={to:function(t){return void 0!==t&&t.toFixed(2)},from:Number},d={target:"target",base:"base",origin:"origin",handle:"handle",handleLower:"handle-lower",handleUpper:"handle-upper",touchArea:"touch-area",horizontal:"horizontal",vertical:"vertical",background:"background",connect:"connect",connects:"connects",ltr:"ltr",rtl:"rtl",textDirectionLtr:"txt-dir-ltr",textDirectionRtl:"txt-dir-rtl",draggable:"draggable",drag:"state-drag",tap:"state-tap",active:"active",tooltip:"tooltip",pips:"pips",pipsHorizontal:"pips-horizontal",pipsVertical:"pips-vertical",marker:"marker",markerHorizontal:"marker-horizontal",markerVertical:"marker-vertical",markerNormal:"marker-normal",markerLarge:"marker-large",markerSub:"marker-sub",value:"value",valueHorizontal:"value-horizontal",valueVertical:"value-vertical",valueNormal:"value-normal",valueLarge:"value-large",valueSub:"value-sub"};function h(t){if("object"==typeof(e=t)&&"function"==typeof e.to&&"function"==typeof e.from)return!0;var e;throw new Error("noUiSlider ("+lt+"): 'format' requires 'to' and 'from' methods.")}function m(t,e){if(!o(e))throw new Error("noUiSlider ("+lt+"): 'step' is not numeric.");t.singleStep=e}function g(t,e){if(!o(e))throw new Error("noUiSlider ("+lt+"): 'keyboardPageMultiplier' is not numeric.");t.keyboardPageMultiplier=e}function v(t,e){if(!o(e))throw new Error("noUiSlider ("+lt+"): 'keyboardDefaultStep' is not numeric.");t.keyboardDefaultStep=e}function b(t,e){if("object"!=typeof e||Array.isArray(e))throw new Error("noUiSlider ("+lt+"): 'range' is not an object.");if(void 0===e.min||void 0===e.max)throw new Error("noUiSlider ("+lt+"): Missing 'min' or 'max' in 'range'.");if(e.min===e.max)throw new Error("noUiSlider ("+lt+"): 'range' 'min' and 'max' cannot be equal.");t.spectrum=new i(e,t.snap,t.singleStep)}function x(t,e){if(e=dt(e),!Array.isArray(e)||!e.length)throw new Error("noUiSlider ("+lt+"): 'start' option is incorrect.");t.handles=e.length,t.start=e}function S(t,e){if("boolean"!=typeof(t.snap=e))throw new Error("noUiSlider ("+lt+"): 'snap' option must be a boolean.")}function w(t,e){if("boolean"!=typeof(t.animate=e))throw new Error("noUiSlider ("+lt+"): 'animate' option must be a boolean.")}function y(t,e){if("number"!=typeof(t.animationDuration=e))throw new Error("noUiSlider ("+lt+"): 'animationDuration' option must be a number.")}function E(t,e){var r,n=[!1];if("lower"===e?e=[!0,!1]:"upper"===e&&(e=[!1,!0]),!0===e||!1===e){for(r=1;r<t.handles;r++)n.push(e);n.push(!1)}else{if(!Array.isArray(e)||!e.length||e.length!==t.handles+1)throw new Error("noUiSlider ("+lt+"): 'connect' option doesn't match handle count.");n=e}t.connect=n}function C(t,e){switch(e){case"horizontal":t.ort=0;break;case"vertical":t.ort=1;break;default:throw new Error("noUiSlider ("+lt+"): 'orientation' option is invalid.")}}function P(t,e){if(!o(e))throw new Error("noUiSlider ("+lt+"): 'margin' option must be numeric.");0!==e&&(t.margin=t.spectrum.getDistance(e))}function N(t,e){if(!o(e))throw new Error("noUiSlider ("+lt+"): 'limit' option must be numeric.");if(t.limit=t.spectrum.getDistance(e),!t.limit||t.handles<2)throw new Error("noUiSlider ("+lt+"): 'limit' option is only supported on linear sliders with 2 or more handles.")}function k(t,e){var r;if(!o(e)&&!Array.isArray(e))throw new Error("noUiSlider ("+lt+"): 'padding' option must be numeric or array of exactly 2 numbers.");if(Array.isArray(e)&&2!==e.length&&!o(e[0])&&!o(e[1]))throw new Error("noUiSlider ("+lt+"): 'padding' option must be numeric or array of exactly 2 numbers.");if(0!==e){for(Array.isArray(e)||(e=[e,e]),t.padding=[t.spectrum.getDistance(e[0]),t.spectrum.getDistance(e[1])],r=0;r<t.spectrum.xNumSteps.length-1;r++)if(t.padding[0][r]<0||t.padding[1][r]<0)throw new Error("noUiSlider ("+lt+"): 'padding' option must be a positive number(s).");var n=e[0]+e[1],i=t.spectrum.xVal[0];if(1<n/(t.spectrum.xVal[t.spectrum.xVal.length-1]-i))throw new Error("noUiSlider ("+lt+"): 'padding' option must not exceed 100% of the range.")}}function U(t,e){switch(e){case"ltr":t.dir=0;break;case"rtl":t.dir=1;break;default:throw new Error("noUiSlider ("+lt+"): 'direction' option was not recognized.")}}function A(t,e){if("string"!=typeof e)throw new Error("noUiSlider ("+lt+"): 'behaviour' must be a string containing options.");var r=0<=e.indexOf("tap"),n=0<=e.indexOf("drag"),i=0<=e.indexOf("fixed"),o=0<=e.indexOf("snap"),s=0<=e.indexOf("hover"),a=0<=e.indexOf("unconstrained");if(i){if(2!==t.handles)throw new Error("noUiSlider ("+lt+"): 'fixed' behaviour must be used with 2 handles");P(t,t.start[1]-t.start[0])}if(a&&(t.margin||t.limit))throw new Error("noUiSlider ("+lt+"): 'unconstrained' behaviour cannot be used with margin or limit");t.events={tap:r||o,drag:n,fixed:i,snap:o,hover:s,unconstrained:a}}function V(t,e){if(!1!==e)if(!0===e){t.tooltips=[];for(var r=0;r<t.handles;r++)t.tooltips.push(!0)}else{if(t.tooltips=dt(e),t.tooltips.length!==t.handles)throw new Error("noUiSlider ("+lt+"): must pass a formatter for all handles.");t.tooltips.forEach(function(t){if("boolean"!=typeof t&&("object"!=typeof t||"function"!=typeof t.to))throw new Error("noUiSlider ("+lt+"): 'tooltips' must be passed a formatter or 'false'.")})}}function D(t,e){h(t.ariaFormat=e)}function M(t,e){h(t.format=e)}function O(t,e){if("boolean"!=typeof(t.keyboardSupport=e))throw new Error("noUiSlider ("+lt+"): 'keyboardSupport' option must be a boolean.")}function L(t,e){t.documentElement=e}function z(t,e){if("string"!=typeof e&&!1!==e)throw new Error("noUiSlider ("+lt+"): 'cssPrefix' must be a string or `false`.");t.cssPrefix=e}function H(t,e){if("object"!=typeof e)throw new Error("noUiSlider ("+lt+"): 'cssClasses' must be an object.");if("string"==typeof t.cssPrefix)for(var r in t.cssClasses={},e)e.hasOwnProperty(r)&&(t.cssClasses[r]=t.cssPrefix+e[r]);else t.cssClasses=e}function vt(e){var r={margin:0,limit:0,padding:0,animate:!0,animationDuration:300,ariaFormat:u,format:u},n={step:{r:!1,t:m},keyboardPageMultiplier:{r:!1,t:g},keyboardDefaultStep:{r:!1,t:v},start:{r:!0,t:x},connect:{r:!0,t:E},direction:{r:!0,t:U},snap:{r:!1,t:S},animate:{r:!1,t:w},animationDuration:{r:!1,t:y},range:{r:!0,t:b},orientation:{r:!1,t:C},margin:{r:!1,t:P},limit:{r:!1,t:N},padding:{r:!1,t:k},behaviour:{r:!0,t:A},ariaFormat:{r:!1,t:D},format:{r:!1,t:M},tooltips:{r:!1,t:V},keyboardSupport:{r:!0,t:O},documentElement:{r:!1,t:L},cssPrefix:{r:!0,t:z},cssClasses:{r:!0,t:H}},i={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal",keyboardSupport:!0,cssPrefix:"noUi-",cssClasses:d,keyboardPageMultiplier:5,keyboardDefaultStep:10};e.format&&!e.ariaFormat&&(e.ariaFormat=e.format),Object.keys(n).forEach(function(t){if(!a(e[t])&&void 0===i[t]){if(n[t].r)throw new Error("noUiSlider ("+lt+"): '"+t+"' is required.");return!0}n[t].t(r,a(e[t])?e[t]:i[t])}),r.pips=e.pips;var t=document.createElement("div"),o=void 0!==t.style.msTransform,s=void 0!==t.style.transform;r.transformRule=s?"transform":o?"msTransform":"webkitTransform";return r.style=[["left","top"],["right","bottom"]][r.dir][r.ort],r}function j(t,b,o){var l,u,s,c,i,a,e,p,f=window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"},d=window.CSS&&CSS.supports&&CSS.supports("touch-action","none")&&function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("test",null,e)}catch(t){}return t}(),h=t,y=b.spectrum,x=[],S=[],m=[],g=0,v={},w=t.ownerDocument,E=b.documentElement||w.documentElement,C=w.body,P=-1,N=0,k=1,U=2,A="rtl"===w.dir||1===b.ort?0:100;function V(t,e){var r=w.createElement("div");return e&&ht(r,e),t.appendChild(r),r}function D(t,e){var r=V(t,b.cssClasses.origin),n=V(r,b.cssClasses.handle);return V(n,b.cssClasses.touchArea),n.setAttribute("data-handle",e),b.keyboardSupport&&(n.setAttribute("tabindex","0"),n.addEventListener("keydown",function(t){return function(t,e){if(O()||L(e))return!1;var r=["Left","Right"],n=["Down","Up"],i=["PageDown","PageUp"],o=["Home","End"];b.dir&&!b.ort?r.reverse():b.ort&&!b.dir&&(n.reverse(),i.reverse());var s,a=t.key.replace("Arrow",""),l=a===i[0],u=a===i[1],c=a===n[0]||a===r[0]||l,p=a===n[1]||a===r[1]||u,f=a===o[0],d=a===o[1];if(!(c||p||f||d))return!0;if(t.preventDefault(),p||c){var h=b.keyboardPageMultiplier,m=c?0:1,g=at(e),v=g[m];if(null===v)return!1;!1===v&&(v=y.getDefaultStep(S[e],c,b.keyboardDefaultStep)),(u||l)&&(v*=h),v=Math.max(v,1e-7),v*=c?-1:1,s=x[e]+v}else s=d?b.spectrum.xVal[b.spectrum.xVal.length-1]:b.spectrum.xVal[0];return rt(e,y.toStepping(s),!0,!0),J("slide",e),J("update",e),J("change",e),J("set",e),!1}(t,e)})),n.setAttribute("role","slider"),n.setAttribute("aria-orientation",b.ort?"vertical":"horizontal"),0===e?ht(n,b.cssClasses.handleLower):e===b.handles-1&&ht(n,b.cssClasses.handleUpper),r}function M(t,e){return!!e&&V(t,b.cssClasses.connect)}function r(t,e){return!!b.tooltips[e]&&V(t.firstChild,b.cssClasses.tooltip)}function O(){return h.hasAttribute("disabled")}function L(t){return u[t].hasAttribute("disabled")}function z(){i&&(G("update.tooltips"),i.forEach(function(t){t&&ut(t)}),i=null)}function H(){z(),i=u.map(r),$("update.tooltips",function(t,e,r){if(i[e]){var n=t[e];!0!==b.tooltips[e]&&(n=b.tooltips[e].to(r[e])),i[e].innerHTML=n}})}function j(e,i,o){var s=w.createElement("div"),a=[];a[N]=b.cssClasses.valueNormal,a[k]=b.cssClasses.valueLarge,a[U]=b.cssClasses.valueSub;var l=[];l[N]=b.cssClasses.markerNormal,l[k]=b.cssClasses.markerLarge,l[U]=b.cssClasses.markerSub;var u=[b.cssClasses.valueHorizontal,b.cssClasses.valueVertical],c=[b.cssClasses.markerHorizontal,b.cssClasses.markerVertical];function p(t,e){var r=e===b.cssClasses.value,n=r?a:l;return e+" "+(r?u:c)[b.ort]+" "+n[t]}return ht(s,b.cssClasses.pips),ht(s,0===b.ort?b.cssClasses.pipsHorizontal:b.cssClasses.pipsVertical),Object.keys(e).forEach(function(t){!function(t,e,r){if((r=i?i(e,r):r)!==P){var n=V(s,!1);n.className=p(r,b.cssClasses.marker),n.style[b.style]=t+"%",N<r&&((n=V(s,!1)).className=p(r,b.cssClasses.value),n.setAttribute("data-value",e),n.style[b.style]=t+"%",n.innerHTML=o.to(e))}}(t,e[t][0],e[t][1])}),s}function F(){c&&(ut(c),c=null)}function R(t){F();var m,g,v,b,e,r,x,S,w,n=t.mode,i=t.density||1,o=t.filter||!1,s=function(t,e,r){if("range"===t||"steps"===t)return y.xVal;if("count"===t){if(e<2)throw new Error("noUiSlider ("+lt+"): 'values' (>= 2) required for mode 'count'.");var n=e-1,i=100/n;for(e=[];n--;)e[n]=n*i;e.push(100),t="positions"}return"positions"===t?e.map(function(t){return y.fromStepping(r?y.getStep(t):t)}):"values"===t?r?e.map(function(t){return y.fromStepping(y.getStep(y.toStepping(t)))}):e:void 0}(n,t.values||!1,t.stepped||!1),a=(m=i,g=n,v=s,b={},e=y.xVal[0],r=y.xVal[y.xVal.length-1],S=x=!1,w=0,(v=v.slice().sort(function(t,e){return t-e}).filter(function(t){return!this[t]&&(this[t]=!0)},{}))[0]!==e&&(v.unshift(e),x=!0),v[v.length-1]!==r&&(v.push(r),S=!0),v.forEach(function(t,e){var r,n,i,o,s,a,l,u,c,p,f=t,d=v[e+1],h="steps"===g;if(h&&(r=y.xNumSteps[e]),r||(r=d-f),!1!==f&&void 0!==d)for(r=Math.max(r,1e-7),n=f;n<=d;n=(n+r).toFixed(7)/1){for(u=(s=(o=y.toStepping(n))-w)/m,p=s/(c=Math.round(u)),i=1;i<=c;i+=1)b[(a=w+i*p).toFixed(5)]=[y.fromStepping(a),0];l=-1<v.indexOf(n)?k:h?U:N,!e&&x&&n!==d&&(l=0),n===d&&S||(b[o.toFixed(5)]=[n,l]),w=o}}),b),l=t.format||{to:Math.round};return c=h.appendChild(j(a,o,l))}function T(){var t=l.getBoundingClientRect(),e="offset"+["Width","Height"][b.ort];return 0===b.ort?t.width||l[e]:t.height||l[e]}function B(n,i,o,s){var e=function(t){return!!(t=function(t,e,r){var n,i,o=0===t.type.indexOf("touch"),s=0===t.type.indexOf("mouse"),a=0===t.type.indexOf("pointer");0===t.type.indexOf("MSPointer")&&(a=!0);if(o){var l=function(t){return t.target===r||r.contains(t.target)||t.target.shadowRoot&&t.target.shadowRoot.contains(r)};if("touchstart"===t.type){var u=Array.prototype.filter.call(t.touches,l);if(1<u.length)return!1;n=u[0].pageX,i=u[0].pageY}else{var c=Array.prototype.find.call(t.changedTouches,l);if(!c)return!1;n=c.pageX,i=c.pageY}}e=e||gt(w),(s||a)&&(n=t.clientX+e.x,i=t.clientY+e.y);return t.pageOffset=e,t.points=[n,i],t.cursor=s||a,t}(t,s.pageOffset,s.target||i))&&(!(O()&&!s.doNotReject)&&(e=h,r=b.cssClasses.tap,!((e.classList?e.classList.contains(r):new RegExp("\\b"+r+"\\b").test(e.className))&&!s.doNotReject)&&(!(n===f.start&&void 0!==t.buttons&&1<t.buttons)&&((!s.hover||!t.buttons)&&(d||t.preventDefault(),t.calcPoint=t.points[b.ort],void o(t,s))))));var e,r},r=[];return n.split(" ").forEach(function(t){i.addEventListener(t,e,!!d&&{passive:!0}),r.push([t,e])}),r}function q(t){var e,r,n,i,o,s,a=100*(t-(e=l,r=b.ort,n=e.getBoundingClientRect(),i=e.ownerDocument,o=i.documentElement,s=gt(i),/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(s.x=0),r?n.top+s.y-o.clientTop:n.left+s.x-o.clientLeft))/T();return a=ft(a),b.dir?100-a:a}function X(t,e){"mouseout"===t.type&&"HTML"===t.target.nodeName&&null===t.relatedTarget&&_(t,e)}function Y(t,e){if(-1===navigator.appVersion.indexOf("MSIE 9")&&0===t.buttons&&0!==e.buttonsProperty)return _(t,e);var r=(b.dir?-1:1)*(t.calcPoint-e.startCalcPoint);Z(0<r,100*r/e.baseSize,e.locations,e.handleNumbers)}function _(t,e){e.handle&&(mt(e.handle,b.cssClasses.active),g-=1),e.listeners.forEach(function(t){E.removeEventListener(t[0],t[1])}),0===g&&(mt(h,b.cssClasses.drag),et(),t.cursor&&(C.style.cursor="",C.removeEventListener("selectstart",ct))),e.handleNumbers.forEach(function(t){J("change",t),J("set",t),J("end",t)})}function I(t,e){if(e.handleNumbers.some(L))return!1;var r;1===e.handleNumbers.length&&(r=u[e.handleNumbers[0]].children[0],g+=1,ht(r,b.cssClasses.active));t.stopPropagation();var n=[],i=B(f.move,E,Y,{target:t.target,handle:r,listeners:n,startCalcPoint:t.calcPoint,baseSize:T(),pageOffset:t.pageOffset,handleNumbers:e.handleNumbers,buttonsProperty:t.buttons,locations:S.slice()}),o=B(f.end,E,_,{target:t.target,handle:r,listeners:n,doNotReject:!0,handleNumbers:e.handleNumbers}),s=B("mouseout",E,X,{target:t.target,handle:r,listeners:n,doNotReject:!0,handleNumbers:e.handleNumbers});n.push.apply(n,i.concat(o,s)),t.cursor&&(C.style.cursor=getComputedStyle(t.target).cursor,1<u.length&&ht(h,b.cssClasses.drag),C.addEventListener("selectstart",ct,!1)),e.handleNumbers.forEach(function(t){J("start",t)})}function n(t){if(!t.buttons&&!t.touches)return!1;t.stopPropagation();var i,o,s,e=q(t.calcPoint),r=(i=e,s=!(o=100),u.forEach(function(t,e){if(!L(e)){var r=S[e],n=Math.abs(r-i);(n<o||n<=o&&r<i||100===n&&100===o)&&(s=e,o=n)}}),s);if(!1===r)return!1;b.events.snap||pt(h,b.cssClasses.tap,b.animationDuration),rt(r,e,!0,!0),et(),J("slide",r,!0),J("update",r,!0),J("change",r,!0),J("set",r,!0),b.events.snap&&I(t,{handleNumbers:[r]})}function W(t){var e=q(t.calcPoint),r=y.getStep(e),n=y.fromStepping(r);Object.keys(v).forEach(function(t){"hover"===t.split(".")[0]&&v[t].forEach(function(t){t.call(a,n)})})}function $(t,e){v[t]=v[t]||[],v[t].push(e),"update"===t.split(".")[0]&&u.forEach(function(t,e){J("update",e)})}function G(t){var n=t&&t.split(".")[0],i=n&&t.substring(n.length);Object.keys(v).forEach(function(t){var e=t.split(".")[0],r=t.substring(e.length);n&&n!==e||i&&i!==r||delete v[t]})}function J(r,n,i){Object.keys(v).forEach(function(t){var e=t.split(".")[0];r===e&&v[t].forEach(function(t){t.call(a,x.map(b.format.to),n,x.slice(),i||!1,S.slice(),a)})})}function K(t,e,r,n,i,o){var s;return 1<u.length&&!b.events.unconstrained&&(n&&0<e&&(s=y.getAbsoluteDistance(t[e-1],b.margin,0),r=Math.max(r,s)),i&&e<u.length-1&&(s=y.getAbsoluteDistance(t[e+1],b.margin,1),r=Math.min(r,s))),1<u.length&&b.limit&&(n&&0<e&&(s=y.getAbsoluteDistance(t[e-1],b.limit,0),r=Math.min(r,s)),i&&e<u.length-1&&(s=y.getAbsoluteDistance(t[e+1],b.limit,1),r=Math.max(r,s))),b.padding&&(0===e&&(s=y.getAbsoluteDistance(0,b.padding[0],0),r=Math.max(r,s)),e===u.length-1&&(s=y.getAbsoluteDistance(100,b.padding[1],1),r=Math.min(r,s))),!((r=ft(r=y.getStep(r)))===t[e]&&!o)&&r}function Q(t,e){var r=b.ort;return(r?e:t)+", "+(r?t:e)}function Z(t,n,r,e){var i=r.slice(),o=[!t,t],s=[t,!t];e=e.slice(),t&&e.reverse(),1<e.length?e.forEach(function(t,e){var r=K(i,t,i[t]+n,o[e],s[e],!1);!1===r?n=0:(n=r-i[t],i[t]=r)}):o=s=[!0];var a=!1;e.forEach(function(t,e){a=rt(t,r[t]+n,o[e],s[e])||a}),a&&e.forEach(function(t){J("update",t),J("slide",t)})}function tt(t,e){return b.dir?100-t-e:t}function et(){m.forEach(function(t){var e=50<S[t]?-1:1,r=3+(u.length+e*t);u[t].style.zIndex=r})}function rt(t,e,r,n){return!1!==(e=K(S,t,e,r,n,!1))&&(function(t,e){S[t]=e,x[t]=y.fromStepping(e);var r="translate("+Q(10*(tt(e,0)-A)+"%","0")+")";u[t].style[b.transformRule]=r,nt(t),nt(t+1)}(t,e),!0)}function nt(t){if(s[t]){var e=0,r=100;0!==t&&(e=S[t-1]),t!==s.length-1&&(r=S[t]);var n=r-e,i="translate("+Q(tt(e,n)+"%","0")+")",o="scale("+Q(n/100,"1")+")";s[t].style[b.transformRule]=i+" "+o}}function it(t,e){return null===t||!1===t||void 0===t?S[e]:("number"==typeof t&&(t=String(t)),t=b.format.from(t),!1===(t=y.toStepping(t))||isNaN(t)?S[e]:t)}function ot(t,e){var r=dt(t),n=void 0===S[0];e=void 0===e||!!e,b.animate&&!n&&pt(h,b.cssClasses.tap,b.animationDuration),m.forEach(function(t){rt(t,it(r[t],t),!0,!1)});for(var i=1===m.length?0:1;i<m.length;++i)m.forEach(function(t){rt(t,S[t],!0,!0)});et(),m.forEach(function(t){J("update",t),null!==r[t]&&e&&J("set",t)})}function st(){var t=x.map(b.format.to);return 1===t.length?t[0]:t}function at(t){var e=S[t],r=y.getNearbySteps(e),n=x[t],i=r.thisStep.step,o=null;if(b.snap)return[n-r.stepBefore.startValue||null,r.stepAfter.startValue-n||null];!1!==i&&n+i>r.stepAfter.startValue&&(i=r.stepAfter.startValue-n),o=n>r.thisStep.startValue?r.thisStep.step:!1!==r.stepBefore.step&&n-r.stepBefore.highestStep,100===e?i=null:0===e&&(o=null);var s=y.countStepDecimals();return null!==i&&!1!==i&&(i=Number(i.toFixed(s))),null!==o&&!1!==o&&(o=Number(o.toFixed(s))),[o,i]}return ht(e=h,b.cssClasses.target),0===b.dir?ht(e,b.cssClasses.ltr):ht(e,b.cssClasses.rtl),0===b.ort?ht(e,b.cssClasses.horizontal):ht(e,b.cssClasses.vertical),ht(e,"rtl"===getComputedStyle(e).direction?b.cssClasses.textDirectionRtl:b.cssClasses.textDirectionLtr),l=V(e,b.cssClasses.base),function(t,e){var r=V(e,b.cssClasses.connects);u=[],(s=[]).push(M(r,t[0]));for(var n=0;n<b.handles;n++)u.push(D(e,n)),m[n]=n,s.push(M(r,t[n+1]))}(b.connect,l),(p=b.events).fixed||u.forEach(function(t,e){B(f.start,t.children[0],I,{handleNumbers:[e]})}),p.tap&&B(f.start,l,n,{}),p.hover&&B(f.move,l,W,{hover:!0}),p.drag&&s.forEach(function(t,e){if(!1!==t&&0!==e&&e!==s.length-1){var r=u[e-1],n=u[e],i=[t];ht(t,b.cssClasses.draggable),p.fixed&&(i.push(r.children[0]),i.push(n.children[0])),i.forEach(function(t){B(f.start,t,I,{handles:[r,n],handleNumbers:[e-1,e]})})}}),ot(b.start),b.pips&&R(b.pips),b.tooltips&&H(),$("update",function(t,e,s,r,a){m.forEach(function(t){var e=u[t],r=K(S,t,0,!0,!0,!0),n=K(S,t,100,!0,!0,!0),i=a[t],o=b.ariaFormat.to(s[t]);r=y.fromStepping(r).toFixed(1),n=y.fromStepping(n).toFixed(1),i=y.fromStepping(i).toFixed(1),e.children[0].setAttribute("aria-valuemin",r),e.children[0].setAttribute("aria-valuemax",n),e.children[0].setAttribute("aria-valuenow",i),e.children[0].setAttribute("aria-valuetext",o)})}),a={destroy:function(){for(var t in b.cssClasses)b.cssClasses.hasOwnProperty(t)&&mt(h,b.cssClasses[t]);for(;h.firstChild;)h.removeChild(h.firstChild);delete h.noUiSlider},steps:function(){return m.map(at)},on:$,off:G,get:st,set:ot,setHandle:function(t,e,r){if(!(0<=(t=Number(t))&&t<m.length))throw new Error("noUiSlider ("+lt+"): invalid handle number, got: "+t);rt(t,it(e,t),!0,!0),J("update",t),r&&J("set",t)},reset:function(t){ot(b.start,t)},__moveHandles:function(t,e,r){Z(t,e,S,r)},options:o,updateOptions:function(e,t){var r=st(),n=["margin","limit","padding","range","animate","snap","step","format","pips","tooltips"];n.forEach(function(t){void 0!==e[t]&&(o[t]=e[t])});var i=vt(o);n.forEach(function(t){void 0!==e[t]&&(b[t]=i[t])}),y=i.spectrum,b.margin=i.margin,b.limit=i.limit,b.padding=i.padding,b.pips?R(b.pips):F(),b.tooltips?H():z(),S=[],ot(e.start||r,t)},target:h,removePips:F,removeTooltips:z,getTooltips:function(){return i},getOrigins:function(){return u},pips:R}}return{__spectrum:i,version:lt,cssClasses:d,create:function(t,e){if(!t||!t.nodeName)throw new Error("noUiSlider ("+lt+"): create requires a single element, got: "+t);if(t.noUiSlider)throw new Error("noUiSlider ("+lt+"): Slider was already initialized.");var r=j(t,vt(e),e);return t.noUiSlider=r}}});

(function( $ ) {
   "use strict";
    var body = $('body'),
      sp_hover = Modernizr.hovermq,
      sp_sticky = Modernizr.csspositionsticky,
      type_filters = nt_settings.type_filters,
      shop_filters = nt_settings.shop_filters,
      type_shop_filters = (type_filters == '1' || !shop_filters),
      $ld = $('#ld_cl_bar'),
      _rtl = body.hasClass('rtl_true'),
      $window = $(window),
      window_w = $window.width(),
      small767 = (window_w < 768 && $(window).height() < 768),
      wis_ntjs = $('#wis_ntjs'),
      wis_view = wis_ntjs.data('get'),
      cp_ntjs = $('#cp_ntjs'),
      cp_view = cp_ntjs.data('get'),
      js_isotope = '.products.js_isotope',
      geckoTheme = {
          popupAnimation: 'mfp-move-horizontal',
          ajaxSelector: '.nt_filter_block a,.nt_ajaxsortby a, .paginate_ajax a, a.clear_filter, a.clear_filter_js',
          scrollSelector: '.shopify-error a[href^="#"]',
          nt_btn_load_more : '.load-on-scroll:not(.jscl_ld)',
          url_currency : 'https://api.teathemes.net/currency',
          money_format : '${{amount}}'
    };
    

    geckoShopify.pin__type = function () {
      if ( window_w < 1024 ) return;

      body.on('click', '.pin_tt_js', function (e) {
         e.preventDefault();
         e.stopPropagation();

           var ck = 0,
               cl = 'pin__opened',
               _this = $( this ).parent('.pin__type');
           if (_this.hasClass('pin__opened')) { ck = 1}
           $('.pin__type.pin__opened').removeClass('pin__opened');
           $('.pin__slider.pin_slider_opened').removeClass('pin_slider_opened');
           //(ck) ?  _this.addClass('pin__opened') :  _this.removeClass('pin__opened');
           if ( ck ) return;
            
           var sp_section = $( this ).closest('.shopify-section');
           _this.addClass('pin__opened');
           sp_section.find('.pin__slider').addClass('pin_slider_opened');
           
           if ( _this.hasClass('has_calc_pos') ) return;

           var pos = _this.offset(),
               pin_pp = _this.find('.pin__popup'),
               pin_parent = _this.find('.pin_lazy_js');
               //console.log(pos);
            if (pin_parent.length == 0) {pin_parent = pin_pp;}
               //console.log(pin_parent);

            if (pin_parent.hasClass('pin__popup--left')) {
               var w_popup = pin_pp.width() + 20;
               if ( pos.left < w_popup ) {
                  //pin_parent.removeClass('pin__popup--left').addClass('pin__popup--right');
                  var mrRight = w_popup - pos.left + 10;
                  pin_pp.css("margin-right", '-' + mrRight + 'px');
               }
            } else if (pin_parent.hasClass('pin__popup--right')) {
               var w_popup = pin_pp.width() + 20,
                   posRight = $(window).width() - pos.left - _this.width();
               if ( posRight < w_popup ) {
                  ///pin_parent.removeClass('pin__popup--right').addClass('pin__popup--left');
                  var mrLeft = w_popup - posRight + 10;
                  pin_pp.css("margin-left", '-' + mrLeft + 'px');
               }
            }

            // } else if (pin_parent.hasClass('pin__popup--top') && sp_section.hasClass('type_pin_owl')) {
            //    var h_popup = pin_pp.height() + 20;
            //    //console.log(h_popup);

            //    if ( pos.top < h_popup ) {
            //       //pin_parent.removeClass('pin__popup--top').addClass('pin__popup--bottom');
            //       var mrBotom = h_popup - pos.top + 10;
            //       pin_pp.css("margin-bottom", '-' + mrBotom + 'px');
            //    }
               
            // } else if (pin_parent.hasClass('pin__popup--bottom') && sp_section.hasClass('type_pin_owl')) {
            //    var h_popup = pin_pp.height() + 20,
            //        posBottom = sp_section.height() - (pos.top+25) - _this.width();
            //        //console.log(posBottom);

            //    if ( posBottom < h_popup ) {
            //       //pin_parent.removeClass('pin__popup--bottom').addClass('pin__popup--top');
            //       var mrTop = h_popup - posBottom + 10;
            //       pin_pp.css("margin-top", '-' + mrTop + 'px');
            //    }

            // }
            if (!designMode) { _this.addClass('has_calc_pos') }

      });

      body.on('click', function (e) {
        var target = $(e.target);
        if (target.closest('.pin__type').length > 0 || target.closest('.mfp-wrap').length > 0) return;
        $('.pin__type.pin__opened').removeClass('pin__opened');
        $('.pin__slider.pin_slider_opened').removeClass('pin_slider_opened');
      });
      // body.on('lazyincluded', '.pin_lazy_js', function (e) {
      //   console.log($(e.target))
      // });

      // $('.pin__type .pin__popup').each(function () {
      //   geckoShopify.pin__pos($(this));
      // });

    };

    // geckoShopify.pin__pos = function (content) {
    //   if ( content.length == 0 || true) return;
    //     var num = 0;
    //     var offset = content.offset(),
    //         content_w = content.outerWidth() || 260,
    //         offsetTop = offset.top,
    //         offsetLeft = offset.left - num,
    //         offsetRight = $(window).width() - (offsetLeft + content_w);

    //       if (offsetLeft <= 0 ) {
    //         content.closest('.pin__type').find('.pin__popup--left').addClass('pin__popup--right').removeClass('pin__popup--left');
    //       }
    //       if (offsetTop <= 0) {
    //         content.closest('.pin__type').find('.pin__popup--top').addClass('pin__popup--bottom').removeClass('pin__popup--top');
    //       }

    //       offset = content.offset();
    //       offsetTop = offset.top;
    //       offsetLeft = offset.left - num;
    //       offsetRight = $(window).width() - (offsetLeft + content_w);

    //       if (offsetLeft <= 0) content.css('marginLeft', Math.abs(offsetLeft - 15) + 'px');
    //       if (offsetRight <= 0) content.css('marginLeft', offsetRight - 15 + 'px');
    // };

   //  geckoShopify.refresh_columns =  function (el) {
   //     var option = el.attr("data-clcolumn") || '{}';
   //     if (el.length == 0 || option == '{}') return;

   //     var json_sett = JSON.parse(option), column = json_sett.mb, i, arr = $.makeArray( $(el.html()) );
   //      if ( window_w > 1024 ) {
   //        column = json_sett.dp
   //      } else if ( window_w > 767 ) {
   //        column = json_sett.tb
   //      }
   //       // remove sparse Array
      // //arr = arr.filter(e => e.nodeName !== "#text");
   //      // console.log(arr);

   //      var columnCount = parseInt(column || 0),l = arr.length;
   //      (columnCount == 15) ? columnCount = 5 : columnCount = 12/columnCount;
   //      // console.log(l);
   //      // console.log(columnCount);

   //      // if (l <= columnCount || columnCount == 0) return;
   //      if (columnCount == 0) return;
   //      el.html('').attr("data-columns", columnCount).addClass('js_cls_done');
   //      for (i = 0; i < columnCount; i++) { el.append('<div class="ntcols_js"></div>'); }
   //      var holderChild = el.children();
   //      for (i = 0; i < l; i++) { holderChild[i % columnCount].append(arr[i]); }
   //      el.find('.lazyloading,.lazyload').addClass('lazyload');
   //      //el.find('.lazyloading').addClass('lazyload');
   //  };

   //  geckoShopify.MiniColumns = function () {
   //   var $mini = $('.nt_minimasonry');
   //    if ($mini.length == 0) return;

   //    $mini.each(function () {
   //        geckoShopify.refresh_columns($(this));
   //    });
   //  };

   //  geckoShopify.ProductPakery = function () {
   //    if ($('.products.nt_packery').length == 0 || window_w > 1024) return;
   //    $('.products.nt_packery').each(function () {
   //        $(this).packery('destroy');
   //        geckoShopify.refresh_columns($(this));
   //    });
   //  };

    // Sticky menu
    geckoShopify.initStickyMenu = function () {
      if ( body.hasClass('header_sticky_false') || (body.hasClass('des_header_7') && window_w > 1400) ) return;
      var $header = $('#ntheader'),
         //offset = $header.find('.sticky_top').offset().top,
         offset = 0,
         Timeout = 0,
         check = false,
         ck_sticky = true,
         prevScrollpos = window.pageYOffset,
         isHideOnScroll = body.hasClass('hide_scrolld_true'),
         // $cart = $('#nt_cart_canvas'),
         headerHeight = $header.outerHeight(),
         offset = headerHeight,
         txt_header_banner = '#shopify-section-header_banner';
         //console.log(offset)

      $window.on('resize', function () {
          //console.log('resizeIs');
          ck_sticky = true;
          $header.removeClass('sticky_prepared').css("height", "");
          if (headerHeight < $header.outerHeight() ) {
            headerHeight = $header.outerHeight();
          }

          if (body.hasClass('des_header_7') && $(window).width() > 1024 ) return;
          ck_sticky = false;
        $header.addClass('sticky_prepared').css({ height: headerHeight });

        if ($(txt_header_banner).length > 0) {
          offset += $(txt_header_banner).outerHeight();
        }
        // if ($('#shopify-section-header_top').length > 0) {
        //   offset += $('#shopify-section-header_top').outerHeight();
        // }
        // console.log('bbb')
      });

      $window.on('scroll', function () {
         if (ck_sticky ) return;
         var currentScroll = $(window).scrollTop();

       //console.log(currentScroll, offset)
         if (currentScroll > offset) {
            stickAddclass();
         } else {
            stickRemoveClass();
         }

        if ( isHideOnScroll ) {
          //console.log('isHideOnScroll')

       //console.log('isHideOnScroll scroll')
          var currentScrollPos = window.pageYOffset;
          if (prevScrollpos > currentScrollPos && currentScroll > offset ) {
            //stickAddclass();
            $header.addClass('h_scroll_up').removeClass('h_scroll_down');
          } else if (currentScroll <= offset ) {
            $header.removeClass('h_scroll_down h_scroll_up');
          } else {
            //stickRemoveClass();
            $header.addClass('h_scroll_down').removeClass('h_scroll_up');
          }
          prevScrollpos = currentScrollPos;
        }

      }); 

      function stickAddclass() {
         if (check) return
         //alert('stickAddclass')
         check = true;
         $header.addClass('live_stuck');
      $header.on('animationend webkitAnimationEnd oAnimationEnd', function() { 
           $header.addClass('ani_none');
      });
         // if ( $cart.hasClass('current_hover')) {
         //   $cart.css("top", $('.ntheader_wrapper').outerHeight());
         // }
      }

      function stickRemoveClass() {
         if (!check) return
         //alert('stickRemoveClass')
         check = false;
         //clearTimeout(Timeout);
         $header.addClass('trs_stuck').removeClass('live_stuck h_scroll_down');
         $header.removeClass('ani_none trs_stuck');
         //Timeout = setTimeout(function(){ $header.removeClass('trs_stuck'); }, 100);;
         // if ( $cart.hasClass('current_hover')) {
         //   $cart.css("top", $('.dropdown_cart').offset().top);
         // }
      }
    };

    geckoShopify.initStickyCat = function () {
      if ( !body.hasClass('template-collection') || $('.cat_toolbar').length == 0 || body.hasClass('cat_sticky_false') || window_w > 1024 ) return;

      var _header = $('#ntheader'),
          _cat= $('.cat_toolbar'),
          _height = _cat.outerHeight(),
          _top = _cat.offset().top + _height,
          _h_container = $('.container_cat').outerHeight() + _cat.offset().top;

      _cat.before('<div class="clone_h_cat dn"></div>');

      var _clone = $('.clone_h_cat');
      _clone.css({ height: _height });
      _cat.addClass('cat_stuck_prepared');

//       var documentHeight = $(document).height();
      
//       $window.on('scroll', function () {
//         var currentScroll = $(window).scrollTop();
//         var windowHeight = $(window).height();
//         _top = _cat.offset().top + _height;

//         if ( currentScroll > _top && _h_container > currentScroll ) {
//           var _h = $('.live_stuck:not(.h_scroll_down)');

//           _clone.show();
//           if ( _h.length > 0 ) {
//             _cat.addClass('cat_stuck').css({ top: $('.ntheader_wrapper').outerHeight() });
//           } else {
//             _cat.addClass('cat_stuck').css({ top: 0 });
//           }
//         } else {
//           _cat.css({ top: 0 });
//           _cat.removeClass('cat_stuck');
//           _clone.hide();
//         }

//       });
      
      $window.on('scroll', function () {
        var after = 0;
        var currentScroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        var documentHeight = $(document).height();

        if (currentScroll > _top) {
          _clone.show();
          if ($('.live_stuck:not(.h_scroll_down)').length > 0 && body.hasClass('header_sticky_true')) {
            after += $('.ntheader_wrapper').outerHeight();
          }
          _cat.addClass('cat_stuck').css({ top: after });
        } else {
          _clone.hide();
          _cat.removeClass('cat_stuck').css({ top: 0 });
        }

//         var startAfter = 100;

//         if ($header.hasClass('whb-scroll-stick')) {
//           startAfter = 500;
//         }

//         if (isHideOnScroll) {
//           if (previousScroll - currentScroll > 0 && currentScroll > after ) {
//             $header.addClass('whb-scroll-up');
//             $header.removeClass('whb-scroll-down');
//           } else if (currentScroll - previousScroll > 0 && currentScroll + windowHeight != documentHeight && currentScroll > (after + startAfter)) {
//             $header.addClass('whb-scroll-down');
//             $header.removeClass('whb-scroll-up');
//           } else if (currentScroll <= after) {
//             $header.removeClass('whb-scroll-down');
//             $header.removeClass('whb-scroll-up');
//           } else if (currentScroll + windowHeight >= documentHeight - 5) {
//             $header.addClass('whb-scroll-up');
//             $header.removeClass('whb-scroll-down');
//           }
//         }

//         previousScroll = currentScroll;
      });


    };

    geckoShopify.touchMegaMenu = function() {
      if (sp_hover) return;

      var openedClass = 'is_hover',
          mainMenu = $('.nt_menu');

      $(document).on('click', function (e) {
        var target = e.target;
        //if ($('.' + openedClass).length > 0 && !$(target).is('.item-event-hover') && !$(target).parents().is('.item-event-hover') && !$(target).parents().is('.' + openedClass + '')) {
        if ($('.' + openedClass).length > 0 && !$(target).parents().is('.' + openedClass + '')) {
          mainMenu.find('.' + openedClass + '').removeClass(openedClass);
          return false;
        }
      });
      
      mainMenu.on('click', '.menu-item.has-children>a', function (e) {
        //console.log('click',$(this),$(this).siblings('.sub-menu'))
        if ($(this).siblings('.sub-menu').length == 0) return;
          e.preventDefault();
          //e.stopPropagation();
          var $el = $(this).closest('.has-children');
            
          //$('.nt_menu .menu-item.is_hover').removeClass('is_hover');

          // if ( $el.hasClass('is_hover')) {
          //   //console.log(1)
          //   $el.parent().find('.is_hover').removeClass('is_hover');
          // } else {
          //   //console.log(2)
          //   $el.parent().find('.is_hover').removeClass('is_hover');
          //   $el.addClass('is_hover');
          // }

          //e.preventDefault();
          if (!$el.hasClass(openedClass)) {
            //$('.' + openedClass).removeClass(openedClass);
            $el.parent().find('.' + openedClass).removeClass(openedClass);
          }
          $el.toggleClass(openedClass);
      });

    };

    geckoShopify.initMegaMenu = function(li) {

      if( $(window).width() <= 767 ) return;

        var $window = $(window),
            h7Check = body.hasClass('des_header_7'),
            MenuSection = $('#nt_menu_id'),
            Menuoffsets = MenuSection.find(' > li.menu_has_offsets'),
            screenWidth = $window.width(),
            global_wrapper = $('#nt_wrapper'),
            bodyRight = global_wrapper.outerWidth() + global_wrapper.offset().left,
            viewportWidth = ( body.hasClass('wrapper-boxed') || body.hasClass('wrapper-boxed-small') ) ? bodyRight : screenWidth;

              var nav_dropdown = li.find(' > .sub-menu');


              nav_dropdown.addClass('calc_pos').attr('style', '');
              if( h7Check ) {

                  var bottom = nav_dropdown.offset().top + nav_dropdown.outerHeight(),
                      viewportBottom = $window.scrollTop() + $window.outerHeight();

                  if( bottom > viewportBottom ) {
                      nav_dropdown.css({
                          top: viewportBottom - bottom - 10
                      });
                  }
              }

              if( h7Check ) return;

              var nav_dropdownWidth = nav_dropdown.outerWidth(),
                  // nav_dropdownWidth = (li.hasClass('menu_wid_full')) ? screenWidth : nav_dropdown.outerWidth(),
                  nav_dropdownOffset = nav_dropdown.offset(),
                  extraSpace = (li.hasClass('menu_wid_full')) ? 0 : 10;

                  if( ! nav_dropdownWidth || ! nav_dropdownOffset ) return;
                  var dropdownOffsetRight = screenWidth - nav_dropdownOffset.left - nav_dropdownWidth;
                  
                  if( nav_dropdownWidth >= 0 && li.hasClass( 'menu_center' ) ) {
                      //console.log('center');
                      var toLeft = (nav_dropdownOffset.left + (nav_dropdownWidth/2)) - screenWidth/2;
                      if (_rtl) {
                        nav_dropdown.css({
                            right: toLeft
                        });
                      } else {
                        nav_dropdown.css({
                            left: - toLeft
                        });
                      }

                  } else if ( _rtl && (dropdownOffsetRight + nav_dropdownWidth >= viewportWidth || li.hasClass('menu_wid_full') ) && li.hasClass( 'menu_has_offsets' ) ) {

            // If right point is not in the viewport
            var toLeft = dropdownOffsetRight + nav_dropdownWidth - viewportWidth;

            nav_dropdown.css({
              right: - toLeft - extraSpace
            });

                  } else if ( (nav_dropdownOffset.left + nav_dropdownWidth >= viewportWidth || li.hasClass('menu_wid_full') ) && li.hasClass( 'menu_has_offsets' ) ) {
                      var toRight = nav_dropdownOffset.left + nav_dropdownWidth - viewportWidth;
                      nav_dropdown.css({
                          left: - toRight - extraSpace
                      });
                  }
    };

    geckoShopify.cat_view = function () {
      body.on('click', '.cat_view a:not(.active)', function (e) {
         e.preventDefault();
         var _this = $( this ),
            _col  = _this.data( 'col' ),
            _dev = _this.data( 'dev' ),
            _parent = _this.closest('div'),
            _products = $('.container_cat .nt_pr'),
            holder = $('.container_cat .nt_products_holder'),
            catView_holder = $('.cat_view,.container_cat .nt_products_holder');
         // holder.addClass('loadingview');
         // holder.siblings('.nt_svg_loader').show();
         
         if (_col == 'listt4') {
           catView_holder.removeClass('on_list_view_false').addClass('on_list_view_true')
         } else {
           catView_holder.removeClass('on_list_view_false').addClass('on_list_view_true')
         }
         (_col == 'listt4') ? catView_holder.removeClass('on_list_view_false').addClass('on_list_view_true') : catView_holder.removeClass('on_list_view_true').addClass('on_list_view_false');

         _parent.removeClass('dev_view_cat').find('a').removeClass('active');
         _this.addClass('active');

         switch(_dev) {
           case 'mb':
             _products.removeClass('col-2 col-3 col-4 col-6 col-12 col-15 col-listt4 done').addClass('done col-' + _col);
             break;
           case 'tb':
              _products.removeClass('col-md-2 col-md-3 col-md-4 col-md-6 col-md-12 col-md-15 col-md-listt4 done').addClass('done col-md-' + _col);
             break;
           default:
             // desktop
             _products.removeClass('col-lg-2 col-lg-3 col-lg-4 col-lg-6 col-lg-12 col-lg-15 col-lg-listt4 done').addClass('done col-lg-' + _col);
         }
         
         if (holder.hasClass('js_isotope')) {
          holder.isotope('layout');
         }
         lazySizesT4.autoSizer.checkElems();
         //_products.addClass('done');
         //setTimeout(function(){ holder.siblings('.nt_svg_loader').hide();holder.removeClass('loadingview'); }, 1000);

         //  var clearTuttimer = function () {
         //     for (var i = 0; i < tuttimer.length; i++) {
         //       //console.log(tuttimer[i]);
         //         clearTimeout(tuttimer[i]);
         //     }
         // }
         // clearTuttimer()
         // geckoShopify.class_sequentially();
         // if (tuttimer.length > 100 ) {
         //    var half_length = Math.ceil(tuttimer.length / 2);    
         //    tuttimer.splice(0,half_length); 
         // }

         // In order to prevent reflow and provide better user experience, we save into cart attributes (those are removed before the checkout
         // is submitted) the user choices so they are preserved on page reload, without the need to use JavaScript
         fetch('/cart/update.js', {
           body: JSON.stringify({
             attributes: geckoShopify.defineProperty({}, 'cat_' + _dev + '_items_per_row', _col)
           }),
           credentials: 'same-origin',
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header
           }
         });
      });
    };

    //Categories toggle accordion
    geckoShopify.catAccordion = function () {
      //console.log('catAccordion')
      //var time = 300, current = $('.widget_product_categories  .product-categories> li.current-cat');
      var time = 300
      body.on('click', '.btn_cats_toggle,.has_cats_toggle', function (e) {
        e.preventDefault();
        e.stopPropagation();

         var $btn = $(this),
            $btn2 = $btn.siblings('.btn_cats_toggle'),
            $subList = $btn.siblings('ul');

         if ($subList.hasClass('cat_shown')) {
            $btn.removeClass('active');
            $btn2.removeClass('active');
            $subList.stop().slideUp(time).removeClass('cat_shown');
         } else {
            $subList.parent().parent().find('> li > .cat_shown').slideUp().removeClass('list-shown');
            $subList.parent().parent().find('> li > .active').removeClass('active');
            $btn.addClass('active');
            $btn2.addClass('active');
            $subList.stop().slideDown(time).addClass('cat_shown');
         }
      });

    };

    geckoShopify.updateResizeProductCard = function() {
      // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

      if ($(js_isotope).length == 0) return;

      // Options for the observer (which mutations to observe)
      // var config = { attributes: true, childList: true, subtree: true };
      var config = { childList: true, subtree: true };

      var callback = function (mutationsList, observe) {
        $(js_isotope).isotope('layout');
      };

      // Create an observerIsotope instance linked to the callback function
      var observerIsotope = new MutationObserver(callback);

      $.each($(js_isotope+' .product-info:not(.on_live)'), function(idx, el) {
        // Start observing the target node for configured mutations
        observerIsotope.observe(this, config);
        $(this).addClass('on_live');
      });

    };

    geckoShopify.loadMorePr = function () {
      var nt_btn_load_more = geckoTheme.nt_btn_load_more,
          _btn = $(nt_btn_load_more),
          _holder = _btn.parent().siblings('.nt_products_holder'),
          prevOnHref = nt_settings.prevOnHref,
          process = false;
      
      geckoShopify.clickOnScrollButton( _btn, _holder );
     
      body.on('click', '.nt_cat_lm:not(.jscl_ld)', function(e) {
         e.preventDefault();
         //if (process && $(this).hasClass('load-on-scroll')) return;

          var $this = $(this),
              _parent = $this.parent(),
              is_prev_btn = _parent.hasClass('is_prev_cat_js'),
              action_ = is_prev_btn ? 'prepended' : 'appended',
              ck_un_paginate = _parent[0].hasAttribute("data-js-paginate"),
              holder = _parent.siblings('.nt_products_holder'),
              ck_changeURL = holder[0].hasAttribute("data-change-url"),
              get_url = $this.attr('data-get'),
              get_offset = $this.attr('data-offset'),
              nt_ajaxurl = get_url + '&section_id='+$this.attr('data-id'),
              windowScrollTop =$(window).scrollTop(); // Window's current scroll position
          //    isSection = $this.hasClass('se_cat_lm');

          // if (isSection) { nt_ajaxurl = nt_ajaxurl + '&section_id='+$this.attr('data-id') }
          // else { nt_ajaxurl = nt_ajaxurl + '&view=ajax' }

          //console.log(ck_un_paginate);
          
          loadProducts(holder, nt_ajaxurl, $this, get_url, function(data) {
            var arrPr = data.split("<!--split-->"),
                paginate = is_prev_btn ? arrPr[4] : arrPr[3],
                arrPr2 = arrPr[2];
            //console.log(data);
            //console.log(arrPr);
            if ((!is_prev_btn || prevOnHref) && ck_changeURL) {
              geckoShopify.replaceStateURL(get_url);
            }

            // if ( holder.hasClass('nt_packery') ) {
            //   packeryAppend(holder, arrPr[1],action_);
            // } else if ( holder.hasClass('nt_isotope') ) {
            //   isotopeAppend(holder, arrPr[1],action_);
            // } else if (is_prev_btn) {
            //     holder.prepend(arrPr[1]);
            // } else {
            //     holder.append(arrPr[1]);
            // }

            // if ( holder.hasClass('nt_isotope') ) {
            //   AppendPrependFns.isotopejs(holder, arrPr[1], action_);
            // } else if ( holder.hasClass('nt_packery') ) {
            //   AppendPrependFns.packeryjs(holder, arrPr[1], action_);
            // } else {
            //   AppendPrependFns.Defaultjs(holder, arrPr[1], action_);
            // }
            
            var namefns = 'Defaultjs';
            if ( holder.hasClass('nt_isotope') ) {
              namefns = 'isotopejs';
            } else if ( holder.hasClass('nt_packery') ) {
              namefns = 'packeryjs';
            }
            AppendPrependFns[namefns](holder, arrPr[1], action_);

            // fix error scroll to bottom
            if (windowScrollTop){                           
                $(window).scrollTop(windowScrollTop); // add the delta to the scroll position
            }
            // if (windowScrollTop && !$this.hasClass('load-on-scroll')){                           
            //     $(window).scrollTop(windowScrollTop); // add the delta to the scroll position
            // }

            var js_progress_bar = $this.siblings(".js_progress_bar");
            // console.log(js_progress_bar);
            if (!ck_un_paginate) {
              //console.log('arrPr22: ')
              if (js_progress_bar.length > 0 && !is_prev_btn) {
                // 10/80*100.0
                js_progress_bar.find(".js_current_bar").html(arrPr2);
                 var results_count = js_progress_bar.data('tt');
                js_progress_bar.find('.current_bar').css("width", arrPr2/results_count*100+"%");
              }
              if ( body.hasClass('template-collection') && !is_prev_btn) {
                $(".js_current_bar").html(arrPr2);
              }
              
              if( paginate != 'no_prs' ) {
                $this.attr("data-get", paginate);
                process = false;
                geckoShopify.clickOnScrollButton( $this, holder );
              } else {
                process = true;
                //$this.hide().removeClass('load-on-scroll').waypoint('destroy');
                $this.hide().attr("data-get", '').removeClass('load-on-scroll');
                $this.siblings(".js_progress_bar").hide();
              }
            } else {
              //console.log('arrPr33: ')
              var js_arr_offsets = $('[data-js-arr_offsets]'),
                  get_html_offset = js_arr_offsets.html() || '',
                  arr_offsets = get_html_offset.split(';;;'),
                  current_pr_count = holder.find('.nt_pr').length,
                  indexOfnum = arr_offsets.indexOf(get_offset);

              if (js_progress_bar.length > 0 && !is_prev_btn) {
                // 10/80*100.0
                js_progress_bar.find(".js_current_bar").html(current_pr_count);
                 var results_count = js_progress_bar.data('tt');
                js_progress_bar.find('.current_bar').css("width", current_pr_count/results_count*100+"%");
              }
              if ( body.hasClass('template-collection') && !is_prev_btn) {
                $(".js_current_bar").html(current_pr_count);
              }
              
              // get_offset
              //console.log('indexOfnum',indexOfnum)
              if (!is_prev_btn) {
                holder.attr('data-offset',get_offset);
                var current_offset = arr_offsets[indexOfnum+1];
                //js_arr_offsets.html(arr_offsets.join(';;;'));
              } else {
                var current_offset = arr_offsets[indexOfnum-1];
              }
              holder.find('.nt_pr:not(.got_offset)').attr('data-page',get_offset).addClass('got_offset');
              //console.log('current_offset: ',current_offset)
              if(typeof current_offset !== 'undefined') {
                paginate = get_url.replace('for_offest%3d'+get_offset,'for_offest%3d'+current_offset);
                $this.attr("data-get", paginate).attr("data-offset", current_offset);
                process = false;
                geckoShopify.clickOnScrollButton( $this, holder );
              } else {
                process = true;
                //$this.hide().removeClass('load-on-scroll').waypoint('destroy');
                $this.hide().attr("data-get", '').removeClass('load-on-scroll');
                $this.siblings(".js_progress_bar").hide();
              }
            }
          });
      });
      
      // check khi click o quicview, quickshop nua de chay nua pp_t4_opended
      var _cat_page = '#shopify-section-collection_page',
          _wis_page = '#shopify-section-wishlist_page',
          _ser_page = '#shopify-section-search_page',
          _body = 'body.template-search',
          cat_page_id,w_href,
          ck_on_click = false;

      if ( $(_cat_page).length > 0 ) {
         ck_on_click =true;
         cat_page_id = _cat_page;
         _body = 'body.template-collection';

      } else if ( $(_ser_page).length > 0 ) {
         ck_on_click =true;
         cat_page_id = _ser_page;

      } else if ( $(_wis_page).length > 0 ) {
         ck_on_click =true;
         cat_page_id = _wis_page;

      }

      if (ck_on_click) {
        $(_body).on('click',cat_page_id+' [data-linkhref],'+cat_page_id+' .product-image>a,'+cat_page_id+' .product-brand>a,'+cat_page_id+' .sw_click_go>a,'+cat_page_id+' .product-title>a,'+cat_page_id+' .js_add_qv,'+cat_page_id+' .js__qs', function(e) {
          //e.preventDefault(); 
          w_href = window.location.href;
          var _this = $(this).closest('.nt_pr'),
              _w_href = w_href,
              getPage = getParameterByName('page') || 1,
              SetPage = _this.attr('data-page');
          
          if (SetPage == '') return;
          // $(window).on('beforeunload', function(){
          //   $(cat_page_id+'.nt_pr:not([data-page="'+SetPage+'"])').hide();
          //   //$(window).off('beforeunload');
          // });

          
          var offset = $(cat_page_id+' .nt_products_holder').attr('data-offset');
          //console.log('offset: ',offset,_w_href)
          geckoShopify.replaceStateURL(_w_href.replace('page='+ getPage,'page='+SetPage).replace('for_offest%3d'+ offset,'for_offest%3d'+SetPage));
          
        });

        body.on('refresh_hreft4', function() {
          //console.log('refresh_hreft4',w_href)
          geckoShopify.replaceStateURL(w_href);
        });
      }

      var loadProducts = function(holder, ajaxurl, btn, get_url,callback) {
        holder.addClass('loading').parent().addClass('element-loading');
        var cl = 'jscl_ld';
        btn.addClass(cl);
        $.ajax({
            dataType: "html",
            type: 'GET',
            url: ajaxurl,
            success: function(data) {
                btn.removeClass(cl);
                callback( data );
            },
            error: function(data) {
                console.log('ajax error');
            },
            complete: function() {
                geckoShopify.recalculateSwatches();
                geckoShopify.updateResizeProductCard();
                //countDown
                geckoShopify.InitCountdown();
                holder.removeClass('loading').parent().removeClass('element-loading');
                btn.removeClass(cl);
                
               //currency
               body.trigger('refresh_currency');
               geckoShopify.lazyWishUpdate();
               
               geckoShopify.class_sequentially();

               //product review
               geckoShopify.review();
            },
        });
      };

      // Append or Prepend functions
      // AppendPrependFns.isotopejs(el, items, action)
      // AppendPrependFns['isotopejs'](el, items, action)
      var AppendPrependFns = {
        isotopejs: function(el, items, action) {
          var items = $(items);
          if (action == 'appended') {
            el.append(items).isotope('appended', items);
          } else {
            el.prepend(items).isotope('prepended', items);
          }
        },
        packeryjs: function(el, items, action) {
          var items = $(items);
          if (action == 'appended') {
            el.append(items).packery('appended', items);
          } else {
            el.prepend(items).packery('prepended', items);
          }
        },
        Defaultjs: function(el, items, action) {
          if (action == 'appended') {
            el.append(items);
          } else {
            el.prepend(items);
          }
        }
      };
      
      // action:'prepended' or action:'appended'
      // var packeryAppend = function (el, items, action) {
      //    // initialize Packery after all images have loaded
      //   var items = $(items);
      //   if (action == 'appended') {
      //     el.append(items).packery('appended', items);
      //   } else {
      //     el.prepend(items).packery('prepended', items);
      //   }
      //   //el.isotope('layout');
      // };

      // var isotopeAppend = function (el, items, action) {
      //    // initialize Masonry after all images have loaded
      //   var items = $(items);
      //   if (action == 'appended') {
      //     el.append(items).isotope('appended', items);
      //   } else {
      //     el.prepend(items).isotope('prepended', items);
      //   }
      //   //el.isotope('layout');
      // };

    };

    /**
     * Get the query params in a Url
     * Ex
     * https://mysite.com/search?q=noodles&b
     * getParameterByName('q') = "noodles"
     * getParameterByName('b') = "" (empty value)
     * getParameterByName('test') = null (absent)
     */
    function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };

     geckoShopify.replaceStateURL = function(url) {
       if (!history.replaceState) return;
       window.history.replaceState({}, document.title, url);
    };

    geckoShopify.clickOnScrollButton = function( $btn, $holder, destroy, offset ) {

      if ( $btn.length == 0 || $holder.length == 0 || !$btn.hasClass('load-on-scroll') ) return;
      
      //console.log('run clickOnScrollButton')

      new Waypoint({
        element: $holder[0],
        handler: function(direction) {
          //console.log('handlerhandlerhandler '+this.key)
          this.destroy();
          $btn.trigger('click');
        },
        offset: "bottom-in-view" 
      });
      //offset: "100%"
    };

    //Products tabs element AJAX loading
    geckoShopify.catTabs = function () {
      $("ul.tab_cat_title li a").click(function(ev){
         ev.preventDefault();
         var _this = $(this),
             bid  = _this.data( 'bid' ),
             _se = $('#shopify-section-'+ _this.data( 'id' )),
             _tabActive = _se.find('.tab_se_header .tt_active'),
             _contentActive = _se.find('.tab_se_content .ct_active'),
             _curentContent = $('#'+bid),
             el = _curentContent.find('.js_carousel');

            _tabActive.removeClass('tt_active');
            _this.addClass('tt_active');

            _contentActive.removeClass('ct_active');
           _curentContent.addClass('ct_active');

            if (el.length == 0) return;
            el.flickity('resize');
      });
    };

    // geckoShopify.loadTab = function(btn,bid,$holder) {
    //   var res = null, $inner = $holder.find('.tab_se_element');
    //   //$panel.addClass('loading');
    //   $holder.addClass('element-loading');
    //   btn.addClass('loading');


    //   if (sp_nt_storage) {res = sessionStorage.getItem('tab'+bid)}


    //   var loadTabJS = function (bl,dt) {
    //      $inner.html(dt);
    //      geckoShopify.InitCountdown();
    //      btn.removeClass('loading');
    //      //$panel.removeClass('loading');
    //      $holder.removeClass('element-loading');
    //      body.trigger('refresh_currency');

    //      var el = $holder.find('#nt_'+bid.split('-')[0]+'-0 .js_carousel');
    //      geckoShopify.refresh_flickity(el);
    //      //setTimeout(function(){ geckoShopify.refresh_flickity(el); }, 300);

    //      if(sp_nt_storage && bl) {sessionStorage.setItem('tab'+bid, dt)}
    //      geckoShopify.review();
    //   }; 

    //   if (res !== null) {
    //      loadTabJS(false,res)
    //   } else {
    //      var id  = btn.data( 'id' ), href = btn.attr('href');
    //      $.ajax({
    //         dataType: "html",
    //         type: 'GET',
    //         url: href+'&section_id='+id,
    //         success: function(data) {
    //            var $data = $(data).html();
    //            // console.log($data.html())
    //            // asdasa
    //            loadTabJS(true,$data)
    //         },
    //         error: function (data) {
    //            console.log('ajax error');
    //         },
    //         complete: function () {
    //         },
    //      });
    //   }

    // };

    // refresh istope position
    if (body.hasClass('swatch_list_size_large')) {
      var ck_height = 63;
    } else if (body.hasClass('swatch_list_size_small')) {
      var ck_height = 28;
    } else {
      var ck_height = 38;
    }
    //console.log(ck_height);
    geckoShopify.isotopeResposition = function (bl,el) {
      if (  $('.container_cat .nt_isotope').length == 0 || typeof ($.fn.isotope) == 'undefined' ) return; 
        
        var $grid = el || $('.container_cat .nt_isotope');
         
         if (bl) {
           $grid.find('.swatch__list_js.lazyloaded').each(function() {
               if ($(this).height() > ck_height) { $grid.isotope('layout') }
           });
         }

        $grid.find('.swatch__list_js').on('lazyincluded', function(e) {
         if ($(this).height() > ck_height) { 
          //console.log($(this));
          $grid.isotope('layout') 
         }
        });
    };

    geckoShopify.flickityResposition = function (bl,el) {

      if (  $('.nt_products_holder.nt_slider').length == 0 || typeof ($.fn.flickity) == 'undefined' ) return;
      
        var $grid = el || $('.nt_products_holder.flickity-enabled');
         
         if (bl) {
           $grid.find('.swatch__list_js.lazyloaded').each(function() {
               $grid.flickity('resize');
               //if ($(this).height() > ck_height) { $grid.flickity('resize') }
           });
         }

        $grid.find('.swatch__list_js').on('lazyincluded', function(e) {
          $grid.flickity('resize');
         // if ($(this).height() > ck_height) { 
         //  //console.log($(this));
         //  $grid.flickity('resize')
         // }
        });

    };

    // Ajax filters
    geckoShopify.ajaxFilters = function () {
      if ( !nt_settings.ajax_shop || $('.container_cat').length == 0 || typeof ($.fn.pjax) == 'undefined' ) return;
      var that = this,
          collection_page_id = '#shopify-section-collection_page';

      $(document).pjax('#cat_shopify a,.nt_ajaxFilter .widget_product_categories a:not(.has_cats_toggle)', '#nt_content', {
        fragment: '#nt_content',
        timeout: nt_settings.pjaxTimeout,
        scrollTo: false
      });

      $(document).pjax(geckoTheme.ajaxSelector, '.container_cat:not(.cat_des_ntt4)', {
        fragment: '.container_cat:not(.cat_des_ntt4)',
        timeout: nt_settings.pjaxTimeout,
        scrollTo: false
      });


        
      // body.pjax('.paginate_ajax a', '.nt_products_holder', {
      //    fragment: '.nt_products_holder',
      //    timeout: nt_settings.pjaxTimeout,
      //    scrollTo: false
      // });
      
      //var ck_disable_js = false;
      body.on('click', collection_page_id+' .paginate_ajax a', function(event) {

        var url = $(this).attr('href')+'&section_id=collection_page',
            offset = $(this).attr('data-offset');
        
        $('[data-js-arr_offsetscurent]').html(offset);
        
        //console.log($(this).attr('data-offset'))
        $.pjax.click(event, collection_page_id, {
           url: url,
           offset: offset,
           fragment: collection_page_id,
           timeout: nt_settings.pjaxTimeout,
           scrollTo: false
        });

      });

      $(document).on('pjax:beforeSend', function(xhr,options) { });
      $(document).on('pjax:timeout', function(e) {
        // Prevent default timeout redirection behavior
        e.preventDefault()
      });

      $(document).on('pjax:error', function (xhr, textStatus, error, options) {
         // console.log('pjax error ' + xhr);
         // console.log('pjax error ' + textStatus);
         console.log('pjax error ' + error);
         // console.log('pjax error ' + options);
      });

      $(document).on('pjax:start', function (xhr, textStatus, options) {
        
        body.addClass('ajax_loading');
        scrollToTop();
        $.magnificPopup.close();

        //if (ck_disable_js) return;
        //console.log(options)
        var fragment = options.fragment;
        if (fragment == collection_page_id) return;
          $( ".js_filter.opened" ).removeClass('opened');
          $( ".filter_area_js .section_nt_filter" ).slideUp(200);
      });

      $(document).on('pjax:beforeReplace', function (contents, options) { });

      $(document).on('pjax:complete', function (xhr, textStatus, options) { });

      // $(document).on('ready pjax:end', function(event) {
      //   console.log('ready pjax:end')
      // });

      $(document).on('pjax:end', function (xhr, textStatus, options) {
         // console.log('ready pjax:end');
         // console.log(xhr)
         // console.log(textStatus)
         // console.log(options)
        //console.log('document pjax end');
        //body.trigger('refresh_currency');
        //that.shopPageInit();
        geckoShopify.InitCountdown();
        geckoShopify.lazyWishUpdate();
        geckoShopify.recalculateSwatches();
        var holder = $('.container_cat .nt_products_holder'),
            fragment = options.fragment,
            nt_btn_load_more = geckoTheme.nt_btn_load_more,
            _btn = $(nt_btn_load_more),
            _holder = _btn.parent().siblings('.nt_products_holder');
        
        geckoShopify.clickOnScrollButton( _btn,_holder );

        if ( holder.hasClass('nt_packery') ) {
          geckoShopify.refresh_packery(holder);
        } else if ( holder.hasClass('nt_isotope') ) {
          geckoShopify.refresh_isotope(holder);
          //geckoShopify.isotopeResposition(false);
          geckoShopify.updateResizeProductCard();
        }
        holder.find('.lazyloading').addClass('lazyload');
        //geckoShopify.SortbyPicker();

        if (fragment == collection_page_id) {
          
          $('[data-js-arr_offsetscurent]').html(options.offset);
          geckoShopify.VariantFilterRefresh();

        } else {

          //geckoShopify.popupMFP();
          geckoShopify.initStickyCat();
          geckoShopify.instagram();
          var check_run = true;
          $('.js_sidebar').one('lazyincluded', function(e) {
            //console.log('js_sidebar load');
            geckoShopify.tbScrollLeft();
            geckoShopify.instagram();
            body.trigger('refresh_currency'); 
            geckoShopify.RefreshPriceTitle($('.js_sidebar'));
            if(check_run) {check_run = false;geckoShopify.VariantFilterRefresh();}
            var current = $('.widget_product_categories  .product-categories> li.current-cat');
            //console.log(current)
            if (current.length > 0) {
              current.find('> .btn_cats_toggle, .menu_nested2.current-cat:first > .btn_cats_toggle, .menu_nested2.current-cat:first li.current-cat > .btn_cats_toggle').click();
            }
          });
          $('.filter_area_js').one('lazyincluded', function(e) {
            geckoShopify.tbScrollLeft(); 
            geckoShopify.RefreshPriceTitle($('.filter_area_js'));
            if(check_run) {check_run = false;geckoShopify.VariantFilterRefresh();}
          });

          //if (xhr.target.id == 'nt_content' ) {
          if (fragment == "#nt_content") {
             //console.log('nt_content')
             geckoShopify.ideaIntent();
             geckoShopify.mobileNav();

             $('.nt_parallax_true_true').each(function() {
               $(this).parallaxBackground();
             });
          }

        }

        body.trigger('refresh_currency'); 
        geckoShopify.class_sequentially();
        geckoShopify.FilterUpdateJS();
        geckoShopify.review();
        body.removeClass('ajax_loading');

      });

      var scrollToTop = function () {
         if (nt_settings.ajax_scroll) return;
         //console.log('ajax_scroll')
         var $scrollTo = $('.container_cat:not(.cat_des_ntt4)'),
            scrollTo = $scrollTo.offset().top - nt_settings.ajax_scroll_offset;

         $('html, body').stop().animate({
            scrollTop: scrollTo
         }, 400);
      };

    };



    // Init sidebar filter
    geckoShopify.InitSidebarFilter = function() {
      if ($('.js_filter' ).length == 0) return;

      body.on('click','.js_filter',function(e) {
        var _this = $( this );
         _this.toggleClass('opened');
         var $filter = $(_this.data('id'));

         if ( $filter.is( ":hidden" ) ) {
            $filter.stop().slideDown(200);
         } else {
            $filter.slideUp(200);
         }
         e.preventDefault();
      });
    };

    // geckoShopify.InitSidebarFilter = function() {
    //   if ($('.js_filter' ).length == 0) return;

    //   body.on('click','.js_filter',function(e) {
    //      $( this ).toggleClass('opened');
    //      var $filter = $( "#shopify-section-nt_filter" );

    //      if ( $filter.is( ":hidden" ) ) {
    //         $filter.stop().slideDown(200);
    //      } else {
    //         $filter.slideUp(200);
    //      }
    //      e.preventDefault();
    //   });
    // };
         
   geckoShopify.DropdownPicker = function () {

      if ($('.dropdown_picker_js').length == 0) return;

      var dropjs = $('.dropdown_picker_js');
      dropjs.on('click', '.header_picker', function(e){
        e.preventDefault();
        //e.stopPropagation();
        
        //console.log('cliked')
        var $this = $(this),
            pr = $this.closest('.nt_lt_fake');
         
         if ($(pr).hasClass('opended')) {
            $(pr).removeClass('opended');
         } else {
            $(pr.closest('.dropdown_picker_js')).find('.nt_lt_fake.opended').removeClass('opended');
            $(pr).addClass('opended');
         }

      });

      body.click(function (e) {
         //console.log($(e.target))
         if ($(e.target).hasClass('header_picker')) return;
         $('.nt_lt_fake.opended').removeClass('opended');
      });
   };

   geckoShopify.SortbyPicker = function () {
     
     if ($('.cat_sortby_js').length == 0) return;

      body.on('click', 'a.sortby_pick', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this),
            pr = $this.closest('.cat_sortby_js');
         
         if ($(pr).hasClass('opended')) {
            $(pr).removeClass('opended');
         } else {
            //$(pr.closest('.dropdown_picker_js')).find('.nt_lt_fake.opended').removeClass('opended');
            $(pr).addClass('opended');
         }
      });

      body.click(function (e) {
         //console.log($(e.target));
         if ($(e.target).hasClass('sortby_pick')) return;
         $('.cat_sortby_js.opended').removeClass('opended');
      });

   };

   geckoShopify.stickyJS = function () {

      if ( $('.is_sticky_sidebar').length == 0 || small767 ) return;

     var offset = 20,
        $img = $('.is_sticky_content'),
        $su = $('.is_sticky_sidebar'),
        img_h = $img.find('.theiaStickySidebar').outerHeight(),
        su_h = $su.find('.theiaStickySidebar').outerHeight();

    if ( img_h > su_h ) {
       var offsetHeight = img_h - su_h, el = $su;
    } else if ( img_h == null ) {
       var offsetHeight = su_h, el = $su;
    } else {
       var offsetHeight = su_h - img_h, el = $img;
    }
    // console.log(offsetHeight);
    if ( offsetHeight <= 200) return;
    if (body.hasClass('header_sticky_true')) { offset = $('.sp_header_mid').outerHeight() + 20; }

     el.addClass('is_sticky').theiaStickySidebar({
        additionalMarginTop: offset,
        additionalMarginBottom: 20,
        minWidth: 768
    });
   };

   geckoShopify.productSticky = function () {
   
      if ( !body.hasClass('template-product') || !nt_settings.use_sticky_des || small767 ) return;

     var offset = 20, stickySidebar,
        $img = $('.pr_sticky_img'),
        $su = $('.pr_sticky_su'),
        img_h = $img.find('.theiaStickySidebar').outerHeight(),
        su_h = $su.find('.theiaStickySidebar').outerHeight();
     
    if ( img_h > su_h ) {
       var offsetHeight = img_h - su_h, el = $su;
    } else if ( img_h == null ) {
       var offsetHeight = su_h, el = $su;
    } else {
       var offsetHeight = su_h - img_h, el = $img;
    }
    // console.log(offsetHeight);
     if ( offsetHeight <= 200) return;
      if (body.hasClass('header_sticky_true')) { offset = $('.sp_header_mid').outerHeight() + 20; }

     $su.addClass('is_sticky').theiaStickySidebar({
        additionalMarginTop: offset,
        additionalMarginBottom: 20,
        minWidth: 768
    });

   };
      
    //https://github.com/customd/jQuery_T4NT-visible/
    geckoShopify.isVisible = function(el,partial,hidden,direction,container) {

         if (el.length < 1) return;

         // Set direction default to 'both'.
         direction = direction || 'both';

         var $w = $(window),$t = el.length > 1 ? el.eq(0) : el,
            isContained = typeof container !== 'undefined' && container !== null,
            $c = isContained ? $(container) : $w,
            wPosition = isContained ? $c.position() : 0,
            t = $t.get(0),
            vpWidth = $c.outerWidth(),
            vpHeight = $c.outerHeight(),
            clientSize = hidden === true ? t.offsetWidth * t.offsetHeight : true;

         if (typeof t.getBoundingClientRect === 'function') {

            // Use el native browser method, if available.
            var rec = t.getBoundingClientRect(),
               tViz = isContained ?
               rec.top - wPosition.top >= 0 && rec.top < vpHeight + wPosition.top :
               rec.top >= 0 && rec.top < vpHeight,
               bViz = isContained ?
               rec.bottom - wPosition.top > 0 && rec.bottom <= vpHeight + wPosition.top :
               rec.bottom > 0 && rec.bottom <= vpHeight,
               lViz = isContained ?
               rec.left - wPosition.left >= 0 && rec.left < vpWidth + wPosition.left :
               rec.left >= 0 && rec.left < vpWidth,
               rViz = isContained ?
               rec.right - wPosition.left > 0 && rec.right < vpWidth + wPosition.left :
               rec.right > 0 && rec.right <= vpWidth,
               vVisible = partial ? tViz || bViz : tViz && bViz,
               hVisible = partial ? lViz || rViz : lViz && rViz,
               vVisible = (rec.top < 0 && rec.bottom > vpHeight) ? true : vVisible,
               hVisible = (rec.left < 0 && rec.right > vpWidth) ? true : hVisible;

            if (direction === 'both')
               return clientSize && vVisible && hVisible;
            else if (direction === 'vertical')
               return clientSize && vVisible;
            else if (direction === 'horizontal')
               return clientSize && hVisible;
         } else {

            var viewTop = isContained ? 0 : wPosition,
               viewBottom = viewTop + vpHeight,
               viewLeft = $c.scrollLeft(),
               viewRight = viewLeft + vpWidth,
               position = $t.position(),
               _top = position.top,
               _bottom = _top + $t.height(),
               _left = position.left,
               _right = _left + $t.width(),
               compareTop = partial === true ? _bottom : _top,
               compareBottom = partial === true ? _top : _bottom,
               compareLeft = partial === true ? _right : _left,
               compareRight = partial === true ? _left : _right;

            if (direction === 'both')
               return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop)) && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
            else if (direction === 'vertical')
               return !!clientSize && ((compareBottom <= viewBottom) && (compareTop >= viewTop));
            else if (direction === 'horizontal')
               return !!clientSize && ((compareRight <= viewRight) && (compareLeft >= viewLeft));
         }
    };
   
   geckoShopify.tbScrollLeft = function () {
      var $id = $('.kalles_toolbar_item:visible'),
          length = $id.length,
          tb_mb_cl = 'false';
      if(sp_nt_storage) {tb_mb_cl = sessionStorage.getItem('tb_mb_cl')}
      if (length < 6 || tb_mb_cl == 'true') return;

     var $tb = $('.kalles_toolbar'),
         l_minus = length-5;
     if (l_minus < 2) {
        var time = 400;
     } else {
        var time = 250;
     }
     $tb.addClass('pe_none');
     $tb.stop(true);
     $tb.animate({
       scrollLeft:  $id.last().offset().left
     },  time*l_minus, function() {
       // Animation complete.
       $tb.animate({ scrollLeft:  0 }, 150*l_minus, function() {
          // Animation complete.
          $tb.removeClass('pe_none');
          if(sp_nt_storage) {sessionStorage.setItem('tb_mb_cl', 'true')}
        });
     });
   };


   geckoShopify.inc_lz = function () {
      var $inc_lz = $('.inc_lz');

      if ( $inc_lz.length == 0 && $('.inl_cnt_js').length > 0 ) return;
      //inc_cat_laz inc_pr_laz inc_lb_laz inc_gl_laz inc_ins_laz
    // $inc_lz.on('lazyincludeloaded', function(e) {
    //   if (!e.detail.content) {
    //    $(e.target).hide().remove();
    //   }
    // });

      // category
      // $('.inc_cat_laz').each(function() {
      // $(this).addClass('lazyload').on('lazyincluded', function (e) {
      //  if (e.detail.content) {
       //   //console.log(e.detail.content);
       //     var el = $(e.target).find('.js_packery');
       //     if ( el.length == 0 ) return;
       //     geckoShopify.refresh_packery(el);
      //    } else {
      //       $(e.target).hide().remove();
      //    }
      // });

      // collection
      $('.inc_pr_laz').each(function() {
        $(this).addClass('lazyload').one('lazyincluded', function (e) {
          if (e.detail.content) {
             geckoShopify.InitCountdown();
             body.trigger('refresh_currency');
             geckoShopify.lazyWishUpdate();
             geckoShopify.review();

             var el = $(e.target).find('.js_carousel');
             if ( el.length == 0 ) return;
             
             geckoShopify.refresh_flickity(el);
           } else {
               $(e.target).hide().remove();
           }
          
        });
      });

      // lookbook
     $('.inc_lb_laz, .inc_cat_laz, .inc_gl_laz, .inc_ins_laz').each(function() {
       $(this).addClass('lazyload').one('lazyincluded', function (e) {

             if (e.detail.content) {
               //geckoShopify.popupMFP();
               var _target = $(e.target),
                   el = _target.find('.js_carousel'),
                   el2 = _target.find('.js_packery');

               if ( el.length > 0 ) {
                geckoShopify.refresh_flickity(el);
               } else if ( el2.length > 0 ) {
                  geckoShopify.refresh_packery(el2);
               }
             } else {
                 $(e.target).hide().remove();
             }
            
       });
     });

      // gallery
      // $('.inc_gl_laz').each(function() {
      // $(this).addClass('lazyload').on('lazyincluded', function (e) {
      //    if (e.detail.content) {
       //     var el = $(e.target).find('.js_packery');
       //     if ( el.length == 0 ) return;
           
       //     geckoShopify.refresh_packery(el);
      //    } else {
      //       $(e.target).hide().remove();
      //    }
        
      // });

      // instagram shop
      // $('.inc_ins_laz').each(function() {
      // $(this).addClass('lazyload').on('lazyincluded', function (e) {
      //    if (e.detail.content) {
       //     var el = $(e.target).find('.js_carousel');
       //     if ( el.length == 0 ) return;
           
       //     geckoShopify.refresh_flickity(el);
      //    } else {
      //       $(e.target).hide().remove();
      //    }
        
      // });

   };

   var ck_first_cp = ($('#shopify-section-wishlist_page').length > 0),
       wis_remve ='wis_remve',
       wis_txt_remve = wis_ntjs.find('.txt_remve').text(),
       wis_txt_view = wis_ntjs.find('.txt_view').text(),
       wis_added ='wis_added',
       wishlist_type = nt_settings.wishlist_type;
       if (!ck_first_cp && nt_settings.wis_atc_added == '2') {
          wis_added ='wis_added';
          //wis_added ='wis_added wis_remve';
          wis_txt_view = wis_txt_remve;
       }

   geckoShopify.wishlistUpdate = function (bl,id) {
      if (!sp_nt_storage || wishlist_type != '1') return;
     
      var ls = localStorage.getItem('nt_wis');
      if (ls == null) return;

      if (bl) {
        
        var arrls = ls.split(','),
        //var newArray = oldArray.filter(function(v){return v!==''});
            uri = ls.replace(/,/g, ' OR '),
            res = encodeURI(uri),
            url = wis_view+'?view=wish&type=product&options[unavailable_products]=last&q='+res;
        wis_ntjs.attr('href',url);
        if (ls != '') { $('.jswcount').text(arrls.length); } else { $('.jswcount').text(0); }
        if ($('#shopify-section-wishlist_page .empty_cart_page').length > 0 && arrls.length > 0 && !designMode && ls != '') {
           window.location.href = url;
        }

      } else {
        var str_id = ls.replace(/id:/g, ''),
            arrls = str_id.split(',');
        
        if (id) {
           // run when quickview
           //console.log('id: ',id)
           if (arrls.indexOf(id) > -1) {
             $('.wishlistadd[data-id="'+id+'"]:not(".wis_remve")').addClass(wis_added).removeClass('wishlistadd').find('.tt_txt').text(wis_txt_view);
           }
           return false;
        }

        if (ck_first_cp) {
            $('.products.prs_wis .wishlistadd').addClass(wis_remve).removeClass('wishlistadd').find('.tt_txt').text(wis_txt_remve);
        } else {
          arrls.forEach(function(item, index) {
            $('.wishlistadd[data-id="'+item+'"]').addClass(wis_added).removeClass('wishlistadd').find('.tt_txt').text(wis_txt_view);
          });
        }

      }
   };

   geckoShopify.wishlistUpdateApp = function (bl,id) {
      if (!sp_nt_storage || wishlist_type != '2') return;
     
      var ls = wis_ntjs.find('#arr_wis_id').text();
      if (ls == "") return;
      
     ls = $.trim(ls.replace(/id:/g, ''));
      if (bl) {
        
        //var newArray = oldArray.filter(function(v){return v!==''});
        var arrls = ls.split(' '),
            uri = ls.replace(/ /g, ' OR id:'),
            res = encodeURI('id:'+uri),
            url = wis_view+'?view=wish&type=product&options[unavailable_products]=last&q='+res;
         //console.log('res: '+res)
        wis_ntjs.attr('href',url);

        if (ls != '') { 
          $('.jswcount').text(arrls.length); 
        } else { 
          $('.jswcount').text(0); 
        }

        if ($('#shopify-section-wishlist_page .empty_cart_page').length > 0 && arrls.length > 0 && !designMode && ls != '') {
           window.location.href = url;
        }

      } else {
        var arrls = ls.split(' ');
        //console.log('arrls: '+arrls)
        if (id) {
           //console.log('id: ',id)
           if (arrls.indexOf(id) > -1) {
              $('.wishlistadd[data-id="'+id+'"]').addClass(wis_added).removeClass('wishlistadd').find('.tt_txt').text(wis_txt_view);
           }
           return false;
        }

        // if ($('#shopify-section-wishlist_page').length > 0) {
        //   var txt_view = wis_ntjs.find('.txt_remve').text(), vclass='wis_remve';
        // } else {
        //   var txt_view = nt_settings.added_text_cp, vclass='wis_added';
        // }
        if (ck_first_cp) {
            $('.products.prs_wis .wishlistadd').addClass(wis_remve).removeClass('wishlistadd').find('.tt_txt').text(wis_txt_remve);
        } else {
          arrls.forEach(function(item, index) {
            $('.wishlistadd[data-id="'+$.trim(item)+'"]').addClass(wis_added).removeClass('wishlistadd').find('.tt_txt').text(wis_txt_view);
          });
        }
        
      }
   };
  
   var added_text_cp = nt_settings.added_text_cp, cpt4_added='cpt4_added';
   geckoShopify.compareUpdate = function (bl,id) {
      if (!sp_nt_storage || cp_ntjs.length == 0) return;
     
      var ls = localStorage.getItem('nt_cp');
      if (ls == null) return;

      if (bl) {
        
        var arrls = ls.split(','),
        //var newArray = oldArray.filter(function(v){return v!==''});
            uri = ls.replace(/,/g, ' OR '),
            res = encodeURI(uri),
            url = cp_view+'?view=compe&type=product&options[unavailable_products]=last&q='+res;
        cp_ntjs.attr('href',url);
        if (ls != '') { $('.jscpcount').text(arrls.length); } else { $('.jscpcount').text(0); }

        if ($('#shopify-section-compare_page .empty_cart_page').length > 0 && arrls.length > 0 && !designMode && ls != '') {
           window.location.href = url;
        }

      } else {

        // if ($('#shopify-section-compare_page').length > 0) {
        //   var txt_view = cp_ntjs.find('.txt_remve').text(), vclass='cpt4_remve';
        // } else {
        //   var txt_view = nt_settings.added_text_cp, vclass='cpt4_added';
        // }

          

          var str_id = ls.replace(/id:/g, ''),
              arrls = str_id.split(',');

          if (id) {
             // console.log('id: ',id)
             // console.log(arrls.indexOf(id))
             if (arrls.indexOf(id) > -1) {
               $('.compare_add[data-id="'+id+'"]').addClass(cpt4_added).removeClass('compare_add').find('.tt_txt').text(added_text_cp);
             }
             return false;
          }
          //if ($('#shopify-section-compare_page').length > 0) return false;
          // var str_id = ls.replace(/id:/g, ''),
          //     arrls = str_id.split(',');
          arrls.forEach(function(item, index) {
            $('.compare_add[data-id="'+item+'"]').addClass(cpt4_added).removeClass('compare_add').find('.tt_txt').text(added_text_cp);
          });

      }
   };

   geckoShopify.lazyWishUpdate = function () {
      if (!sp_nt_storage || wishlist_type == '0' && cp_ntjs.length == 0) return;

      $('.nt_pr .product-image:not(.lazyloaded)').one('lazyincluded', function(e) {
        if (nt_settings.wishlist_type != '0') {
          geckoShopify.wishlistUpdate(0);
          geckoShopify.wishlistUpdateApp(0);
        }
        if (cp_ntjs.length > 0) {
          geckoShopify.compareUpdate(0);
        }
      });
   };
   
   geckoShopify.VariantFilterRefresh = function () {
    if (type_shop_filters) return;
    //console.log('run VariantFilterRefresh')
    // if (waypointScrollButton != undefined && bl) {
    //  waypointScrollButton.destroy();
    // }
    //console.log('run VariantFilterRefresh');
   
    // Update result count found
    $('.sp_result_html').html($('[data-js-getnumbertrue]').html());

    // Update pagination
    // https://stackoverflow.com/questions/46382109/limit-the-number-of-visible-pages-in-pagination
    var _data_paginate = $('[data-js-paginate]'),
        getpaginationHTML = $('[data-js-getpagination]').html(),
        nt_btn_load_more = geckoTheme.nt_btn_load_more,
        _btn = $(nt_btn_load_more),
        _holder = _btn.parent().siblings('.nt_products_holder');

    if ( _data_paginate.hasClass('use_pagination_default') && getpaginationHTML != 'no_page' ) {

      // Returns an array of maxLength (or less) page numbers
      // where a 0 in the returned array denotes a gap in the series.
      // Parameters:
      //   totalPages:     total number of pages
      //   page:           current page
      //   maxLength:      maximum size of returned array

      var range = function(start, end) {
          return Array.from(Array(end - start + 1), (_, i) => i + start); 
      };

      function getPageList(totalPages, page, maxLength) {
          if (maxLength < 5) throw "maxLength must be at least 5";

          function range(start, end) {
              return Array.from(Array(end - start + 1), (_, i) => i + start); 
          }

          //var sideWidth = maxLength < 9 ? 1 : 2;
          var sideWidth = 1;
          var leftWidth = (maxLength - sideWidth*2 - 3) >> 1;
          var rightWidth = (maxLength - sideWidth*2 - 2) >> 1;
          if (totalPages <= maxLength) {
              // no breaks in list
              return range(1, totalPages);
          }
          if (page <= maxLength - sideWidth - 1 - rightWidth) {
              // no break on left of page
              return range(1, maxLength - sideWidth - 1)
                  .concat(0, range(totalPages - sideWidth + 1, totalPages));
          }
          if (page >= totalPages - sideWidth - 1 - rightWidth) {
              // no break on right of page
              return range(1, sideWidth)
                  .concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
          }
          // Breaks on both sides
          return range(1, sideWidth)
              .concat(0, range(page - leftWidth, page + rightWidth),
                      0, range(totalPages - sideWidth + 1, totalPages));
      };
      
      //console.log($(getpaginationHTML).find('[data-js-arr_offsets]').html())
      var _getpaginationHTML = $(getpaginationHTML),
          get_arr_offsetsHTML = _getpaginationHTML.find('[data-js-arr_offsets]').html();

      if ( get_arr_offsetsHTML == null) return;

      var ArrPages = get_arr_offsetsHTML.split(';;;'),
          totalPages = ArrPages.length,
          GetcurrentPage = _getpaginationHTML.find('[data-js-arr_offsetscurent]').html(),
          URLpagination = _getpaginationHTML.find('[data-js-url-pagination]').html(),
          _pagination = $('[data-pagination-links]'),
          currentPageIndex = ArrPages.indexOf(GetcurrentPage),
          currentPage = currentPageIndex+1,
          maxLength = 5,i,j,HTMLpagination='';
          
          var PageCoLa = totalPages - currentPage;
          //console.log(GetcurrentPage)
          //console.log(PageCoLa);
          switch (true) {
              case currentPage == 1:
              case PageCoLa == 0:
                  break;
              case currentPage == 4 && totalPages>7:
              case PageCoLa == 3 && totalPages>7:
                  maxLength = 8
                  break;
              case currentPage == 3 && totalPages>6:
              case PageCoLa == 2 && totalPages>6:
                  maxLength = 7
                  break;
              case currentPage == 2 && totalPages>5:
              case PageCoLa == 1 && totalPages>5:
                  maxLength = 6
                  break;
              case currentPage > 4 && totalPages>8:
                  maxLength = 9
                  break;                 
          }
        
        //console.log(maxLength);
        if (totalPages > maxLength) {
          // console.log(totalPages);
          // console.log(currentPage);
          //console.log(getPageList(totalPages, currentPage, maxLength));
          var ArrPageList = getPageList(totalPages, currentPage, maxLength),
              ArrPageListSize = ArrPageList.length,
              GetValueArr;

          for (i = 0; i < ArrPageListSize; i++) {
            
            GetValueArr = ArrPages[ArrPageList[i]-1];
            if (ArrPageList[i] === 0) {
              HTMLpagination += '<li><span class="page-numbers lh__1">...</span></li>';
            } else if (GetValueArr == GetcurrentPage) {
              HTMLpagination += '<li><span class="page-numbers current">'+ArrPageList[i]+'</span></li>';
            } else {
              HTMLpagination += '<li><a data-offset="'+GetValueArr+'" class="page-numbers page-js-numbers" href="'+URLpagination.replace('js_number',GetValueArr)+'">'+ArrPageList[i]+'</a></li>';
            }
          }
          _data_paginate.html(getpaginationHTML);
          // console.log(getpaginationHTML);
          // console.log(HTMLpagination);
          //$('[data-pagination-links]').replaceWith(HTMLpagination);
          _data_paginate.find('[data-pagination-links]').replaceWith(HTMLpagination);
          $('[data-js-paginate]>*').fadeIn('slow');

        } else {

          for (i = 0,j=1; i < totalPages; i++,j++) {
            if (currentPageIndex == i) {
              HTMLpagination += '<li><span class="page-numbers current">'+j+'</span></li>';
            } else {
              HTMLpagination += '<li><a data-offset="'+ArrPages[i]+'" class="page-numbers page-js-numbers" href="'+URLpagination.replace('js_number',ArrPages[i])+'">'+j+'</a></li>';
            }
            
          }
          _data_paginate.html(getpaginationHTML);
          //_data_paginate.html(getpaginationHTML, 500);
          //$('[data-pagination-links]').replaceWith(HTMLpagination);
          _data_paginate.find('[data-pagination-links]').replaceWith(HTMLpagination);
          $('[data-js-paginate]>*').fadeIn('slow');

        }

        if (currentPage === 1) {
           _data_paginate.find("a.prev").addClass("hide");
        } else {
           _data_paginate.find("a.prev").attr('data-offset',ArrPages[currentPageIndex-1]).attr('href',URLpagination.replace('js_number',ArrPages[currentPageIndex-1]));
        }
        if (currentPage === totalPages) {
           _data_paginate.find("a.next").addClass("hide");
        } else {
           _data_paginate.find("a.next").attr('data-offset',ArrPages[currentPage]).attr('href',URLpagination.replace('js_number',ArrPages[currentPage]));
          
        }
        //_data_paginate.find("a.page-js-numbers").eq(currentPageIndex).addClass("current");

        //$('[data-js-paginate]').html(getpaginationHTML, 500);
        
      } else if (getpaginationHTML != 'no_page') {
        // case load more

        $('[data-js-getpagination]').remove();
        $('[data-js-paginate]').html(getpaginationHTML, 500);
        $('[data-js-paginate]>*').fadeIn('slow');

        _btn = $(nt_btn_load_more);
        _holder = _btn.parent().siblings('.nt_products_holder');
        geckoShopify.clickOnScrollButton( _btn,_holder );
        var _arr_offsets = $('[data-js-arr_offsets]'),
            get_arr_offsets = _arr_offsets.html() || '',
            offset = _arr_offsets.attr('data-offset');

        $('#shopify-section-collection_page .nt_pr').attr('data-page',offset).addClass('got_offset');
        if (get_arr_offsets.length > 0) {
          var arr_offsets_js = get_arr_offsets.split(';;;');

          // show prev button 
          if ($('.js_prev_url').length > 0) {
            $('#shopify-section-collection_page').prepend($('.js_prev_url').html());
          }
        }

      } else {
        _data_paginate.slideUp(350);
        // var get_fillter_offset = $('#shopify-section-collection_page .nt_products_holder').attr('data-offset') || 'notxt';
          
        // if (get_fillter_offset != 'notxt') {
            
        // }
        geckoShopify.clickOnScrollButton( _btn,_holder );
      }

   };

     // pjax or reload page
    function pjax_LoadHref(url) {

       if ( !nt_settings.ajax_shop || $('.container_cat').length == 0 || typeof ($.fn.pjax) == 'undefined' ) {
           window.location.href = url;
       } else {
         //location.href = currentUrlPrice;
         $.pjax({
          container: '.container_cat:not(.cat_des_ntt4)',
             fragment: '.container_cat:not(.cat_des_ntt4)',
             timeout: nt_settings.pjaxTimeout,
              url: url,
          scrollTo: false
         });
       }

    };
      
      // update cart attributes available
    function update_attributes(bl,url) {

      //if ( !nt_settings.auto_hide_ofsock ) return;
      $ld.trigger("ld_bar_star")
         fetch('/cart/update.js', {
           body: JSON.stringify({
             attributes: geckoShopify.defineProperty({}, 'auto_hide_ofsock', bl)
           }),
           credentials: 'same-origin',
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header
           }
         })
      .then(response => response.json())
      .then(data => {
        //console.log('Success:', data);
        $ld.trigger("ld_bar_end")
        pjax_LoadHref(url);
      })
      .catch((error) => {
        console.error('Error update_attributes:', error);
      });
     };

   geckoShopify.FilterUpdateJS = function () {

    if (type_shop_filters) return;
       
       var _dataFilterntt4 = $('[data-filterntt4]');

      if ( _dataFilterntt4.length == 0 ) return;
        var dataFilterntt4 = _dataFilterntt4.data('filterntt4'),
           StrFilterntt4 = JSON.stringify( dataFilterntt4 ),
           dataAttrsntt4 = JSON.stringify( _dataFilterntt4.data('attrsntt4')),
           limit_ntt4 = parseInt(dataFilterntt4.limit_ntt4),
           lengthProductItem = _dataFilterntt4.find('.nt_pr').length;
       
       if (lengthProductItem < limit_ntt4 && $('[data-js-paginate]').length == 0) {
          //$('[data-js-paginate]').slideUp();
          $('.sp_result_html .cp').html(lengthProductItem);
       }

       if (StrFilterntt4 != dataAttrsntt4) {
          fetch('/cart/update.js', {
            body: JSON.stringify({
               attributes: dataFilterntt4
            }),
            credentials: 'same-origin',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header
            }
          })
          .then(response => response.json())
          .then(data => {
            //console.log('Success:', data);
            $('.filter_area_js,.js_sidebar').addClass('lazyload');
          })
          .catch((error) => {
            $('.filter_area_js,.js_sidebar').addClass('lazyload');
            console.error('Error FilterUpdateJS:', error);
          });
       } else {
        $('.filter_area_js,.js_sidebar').addClass('lazyload');
       }

   };

  geckoShopify.ClearFilterStockt4 = function () {

    if (type_shop_filters) return;
    // checked available .nt_cat_available
    body.on('click', '.nt_cat_available', function (e) {
        // var _this = $(this),
        //    currentUrl = _this.data("url");

           if ( $(this).is(':checked') ) {
              //currentUrl = currentUrl.replace('js_bl_stock','true');
              update_attributes(true,location.href);
           } else {
             //currentUrl = currentUrl.replace('+nt+filternt_stockt4%3djs_bl_stock','').replace('filternt_stockt4%3djs_bl_stock','').replace('?q=&sort_by=','?sort_by=');
             update_attributes(false,location.href);
           }
           //console.log(currentUrl);
           
    });

    // filter product title .nt_cat_title
    body.on('click', '.filter_title_btn', function (e) {

      var _this = $(this),
         _title = _this.siblings('.nt_cat_title'),
         currentUrl = _title.data("url"),
         InputVal = _title.val();
         
         _this.show();
         // console.log(currentUrl);
         // console.log(InputVal.length);
         if ( InputVal.length > 0 ) {
            currentUrl = currentUrl.replace('js_q_title',InputVal);
         } else {
           currentUrl = currentUrl.replace('+nt+filternt_title%3djs_q_title','').replace('filternt_title%3djs_q_title','').replace('?q=&sort_by=','?sort_by=');
         }
         //console.log(currentUrl);
         pjax_LoadHref(currentUrl);
    });

     //Price slider init
    body.on('click', '.price_slider_btn', function (e) {

          var _this = $(this),
              _amount = _this.closest('.price_slider_amount'),
              _minPrice = _amount.find('.min_price'),
              _maxPrice = _amount.find('.max_price'),
              currentUrlPrice = _amount.find('.url_price').val(),
              minPrice = _minPrice.data("min"),
              maxPrice = _maxPrice.data("max"),
              currentMinPrice =  _amount.find(".min_price").val(),
              currentMaxPrice =  _amount.find(".max_price").val();

              if (minPrice == currentMinPrice && maxPrice == currentMaxPrice) {
                currentUrlPrice = currentUrlPrice.replace('+nt+filternt_price%3dmin_price+ntprice+max_price','').replace('filternt_price%3dmin_price+ntprice+max_price','').replace('?q=&sort_by','?sort_by');
              } else {
                currentUrlPrice = currentUrlPrice.replace('min_price',currentMinPrice).replace('max_price',currentMaxPrice)
              }
           pjax_LoadHref(currentUrlPrice);
    });

     
     // //$('.price_slider_wrapper').on("price_slider_create price_slider_slide", function(e, min_price, max_price) {
     //   body.on('price_slider_create price_slider_slide', '.price_slider_wrapper', function (e, min_price, max_price) {
     //   //console.log($(this))
     //   // console.log(e);
     //   // console.log(r);
     //   // console.log(i);
     //   $(this).find("span.from").html(geckoShopify.formatMoney(min_price));
     //   $(this).find("span.to").html(geckoShopify.formatMoney(max_price));
     //   //$(document.body).trigger("price_slider_updated", [r, i])
     // });

    if (!nt_settings.show_hide_ofsock) return;
    body.on('click', '.clear_filter_stockt4', function (e) {
       e.preventDefault();
       e.stopPropagation();
       update_attributes( false,location.href );
    });

  };

   geckoShopify.RefreshPriceTitle = function ($el) {
      
      //console.log($el)
      if ( type_shop_filters || $el.length < 1 ) return;

      // Search product title init
      $el.find('.filter_title_btn').show();
    
      //Price slider init
      //var _price_slider_wrapper = $el.find('.price_slider_wrapper');
      //console.log(_price_slider_wrapper)
      //_price_slider_wrapper.each(function() {
         var _this = $el.find('.price_slider_wrapper')
           //_this = $(this)
         , _amount = _this.find('.price_slider_amount')
         , _minPrice = _amount.find('.min_price')
         , _maxPrice = _amount.find('.max_price')
         , currentUrlPrice = _amount.find('.url_price').val()
         , minPrice = _minPrice.data("min")
         , maxPrice = _maxPrice.data("max")
         , stepPrice = _amount.data("step") || 1
         , currentMinPrice = _minPrice.val()
         , currentMaxPrice = _maxPrice.val()
         , direction = 'ltr';

        _amount.find("input.url_price, input.min_price, input.max_price").hide();
        _this.find(".price_slider, .price_label ,.price_slider_btn").show();

        var $stepsSlider = _this.find('.price_steps_slider'),
            stepsSlider = $stepsSlider[0],
            inputs = ["span.from", "span.to"],
            inputs2 = [".min_price", ".max_price"],
            check_dis = true;
        //console.log($stepsSlider)
        if ( $stepsSlider.length < 1 ) return;
        if (body.hasClass('rtl_true')) {
           direction = 'rtl';
        }

        noUiSlider.create(stepsSlider, {
            start: [currentMinPrice, currentMaxPrice],
            connect: true,
            step: stepPrice,
            direction: direction,
            //tooltips: [true, wNumb({decimals: 1})],
            range: {
                'min': minPrice,
                'max': maxPrice
            }
        });

        stepsSlider.noUiSlider.on('update', function (values, handle) {
          //console.log(values, handle)
           var value_curent = parseInt(values[handle]);

           _this.find(inputs[handle]).html(geckoShopify.formatMoney(value_curent));
           _amount.find(inputs2[handle]).val(value_curent);
          
          if ( check_dis ) {
             price_slider_create(values);
          }
           //inputs[handle].value = values[handle];
        });

     //$('.price_slider_wrapper').on("price_slider_create price_slider_slide", function(e, min_price, max_price) {
     function price_slider_create(values) {
          $('[data-js-minprice]').html(geckoShopify.formatMoney(parseInt(values[0])));
          $('[data-js-maxprice]').html(geckoShopify.formatMoney(parseInt(values[1])));
          check_dis = false;
       //$(document.body).trigger("price_slider_updated", [r, i])
     };



        // _this.find(".price_slider:not(.ui-slider)").slider({
        //    range: !0,
        //    animate: !0,
        //    min: minPrice,
        //    max: maxPrice,
        //    step: stepPrice,
        //    values: [currentMinPrice, currentMaxPrice],
        //    create: function() {
        //        _minPrice.val(currentMinPrice);
        //        _maxPrice.val(currentMaxPrice);
        //        // $(document.body)
        //        _this.trigger("price_slider_create", [currentMinPrice, currentMaxPrice]);
        //        // update min max on current tab
        //        // console.log('createe slider');        
        //         $('[data-js-minprice]').html(geckoShopify.formatMoney(currentMinPrice));
        //         $('[data-js-maxprice]').html(geckoShopify.formatMoney(currentMaxPrice));


        //    },
        //    slide: function(e, r) {
        //        _minPrice.val(r.values[0]);
        //       _maxPrice.val(r.values[1]);
        //        _this.trigger("price_slider_slide", [r.values[0], r.values[1]])
        //    },
        //    change: function(e, r) {
        //        //body.trigger("price_slider_change", [r.values[0], r.values[1]])
        //    }
        // });

        // _this.find(".price_slider_btn").on("click", function(e){

       //    var _this = $(this),
       //        _amount = _this.closest('.price_slider_amount'),
       //        currentMinPrice =  _amount.find(".min_price").val(),
       //        currentMaxPrice =  _amount.find(".max_price").val();

       //        if (minPrice == currentMinPrice && maxPrice == currentMaxPrice) {
       //          currentUrlPrice = currentUrlPrice.replace('+nt+filternt_price%3dmin_price+ntprice+max_price','').replace('filternt_price%3dmin_price+ntprice+max_price','').replace('?q=&sort_by','?sort_by');
       //        } else {
       //          currentUrlPrice = currentUrlPrice.replace('min_price',currentMinPrice).replace('max_price',currentMaxPrice)
       //        }
          //  pjax_LoadHref(currentUrlPrice);
       //  });


      //});
  };
 
  if (body.hasClass('swatch_list_size_large')) {
    var ck_w = 57;
  } else if (body.hasClass('swatch_list_size_small')) {
    var ck_w = 26;
  } else {
    var ck_w = 36; 
  }
  var sw_limit_true = body.hasClass('prs_sw_limit_true');
  if (sw_limit_true && nt_settings.sw_limit_click) {
      
      body.on('click', '.swatch__list--more>a', function(e) {
         e.preventDefault();
         var swatch__list_js = $(this).closest('.swatch__list--limit'),
             swatch__has_opended = swatch__list_js.hasClass('swatch__list--opended');
        
        if (swatch__has_opended) {
         swatch__list_js.addClass('swatch__list_js').removeClass('swatch__list--opended');
        } else {
         swatch__list_js.removeClass('swatch__list_js').addClass('swatch__list--opended');
         window.dispatchEvent(new Event('resize'));
        }   
      });
    
  }

 geckoShopify.recalculateSwatches = function (bl) {
    
    if (!sw_limit_true) return;

      if (bl) {
        var string_sl = '.swatch__list_js';
      } else {
        var string_sl = '.swatch__list_js:not(.swatch__list--calced)';
      }
      
      fastdom.measure(function () {
        $(string_sl).each(function( index ) {
          var swatchList = $(this),
              colorSwatchesLength = parseInt(swatchList.attr('data-colorcount')),
              maxFit = Math.floor(swatchList.outerWidth() / ck_w),
              Numsapce = colorSwatchesLength - maxFit;

              fastdom.mutate(function () {
                //console.log(swatchList,colorSwatchesLength,maxFit,Numsapce);
                swatchList.addClass('swatch__list--calced');
                swatchList.removeClass('swatch__list--limit');

                if ( Numsapce > 0 && Numsapce != colorSwatchesLength) {
                  Numsapce = Numsapce + 1;
                  swatchList.addClass('swatch__list--limit');
                  //swatchList.attr('data-limit',maxFit).attr('style', '--text : "+'+Numsapce+'"');
                  swatchList.attr('data-limit',maxFit).attr('style', '--text : "+'+Numsapce+'";--text2 : "-'+Numsapce+'"');

                  // var color_show_more = 'Show More +[count]',
                  // swatchList.attr('data-limit',maxFit).attr('style', '--text : "+'+Numsapce+'";--text2 : "'+color_show_more.replace('[count]',Numsapce)+'"');
                }

              });
              
        });
      });
 };

})( jQuery_T4NT );

jQuery_T4NT(window).resize(function () {
  geckoShopify.recalculateSwatches(true);
});

jQuery_T4NT(document).ready(function($) {
  geckoShopify.updateResizeProductCard();
  geckoShopify.tbScrollLeft();
  geckoShopify.inc_lz();
  geckoShopify.productSticky();
  geckoShopify.stickyJS();
  geckoShopify.touchMegaMenu();
  geckoShopify.pin__type();
  // geckoShopify.ProductPakery();
  // geckoShopify.MiniColumns();
  geckoShopify.cat_view();
  geckoShopify.initStickyMenu();
  geckoShopify.initStickyCat();
  geckoShopify.catAccordion();
  geckoShopify.loadMorePr();
  geckoShopify.catTabs();
  geckoShopify.ajaxFilters();
  //geckoShopify.isotopeResposition(true);
  geckoShopify.flickityResposition(true);
  geckoShopify.recalculateSwatches();
  geckoShopify.DropdownPicker();
  geckoShopify.SortbyPicker();
  geckoShopify.InitSidebarFilter();
  geckoShopify.FilterUpdateJS();
  geckoShopify.ClearFilterStockt4();
  $(window).resize();
  var body = $('body');
  var liMegaUpdate = function (li) {
    //console.log(li);
    geckoShopify.initMegaMenu(li);
  };

  var $li = $('.lazy_menu:not(.calc_pos)');
  if ($li.length > 0) { 
    //console.log('ttt1');
    $li.each(function() { 
       geckoShopify.initMegaMenu($(this).closest('li.menu_has_offsets'));
       //liMegaUpdate($(this).closest('li.menu_has_offsets')); 
    }); 
  }
  
  $('.lazy_menu_mega').one('lazyincluded', function(e) {
    var el = $(e.target),
        option = JSON.parse(el.attr("data-jspackery")); 

    option.originLeft = body.hasClass('rtl_false');
    el.packery(option);

    body.trigger('refresh_currency');
    geckoShopify.review();
    geckoShopify.InitSeCountdown();
    if (el.find('.js_carousel.flickity-enabled').length > 0 ) return;
    var owl = el.find('.js_carousel');
    geckoShopify.lazyWishUpdate();
    geckoShopify.refresh_flickity(owl);
    geckoShopify.flickityResposition(false,owl);
    geckoShopify.recalculateSwatches();
  });

  if ( $('.unlazy_menu_mega').length > 0 ) {
      $('.unlazy_menu_mega').each(function() { 
        var el = $(this),
        option = JSON.parse(el.attr("data-jspackery")); 
        el.packery(option);
      }); 
  }

  $('.tab_se_element:not(.ct_active)').addClass('lazyload').one('lazyincludeloaded', function(e) {
    // console.log(e.detail.content);
      if (e.detail.content) {
        var html = e.detail.content,
           split = html.split('<!--split-->');
        e.detail.content = split[1] || html ;
        //e.preventDefault();
      }
  }).one('lazyincluded', function(e) {
    // console.log('222');
    // console.log('lazyloaded tMegaMenu');
    body.trigger('refresh_currency');
    geckoShopify.review();
    geckoShopify.InitCountdown();
    geckoShopify.lazyWishUpdate();
    geckoShopify.recalculateSwatches();
    var el = $(e.target)[0], 
        owl = $(el).find('.js_carousel'),
        istop = $(el).find('.js_isotope');
        
    if (istop.length > 0) {
      geckoShopify.refresh_isotope(istop);
      geckoShopify.isotopeResposition(false);
      //geckoShopify.recalculateSwatches();
    }

    if (owl.length > 0) {
      geckoShopify.refresh_flickity(owl);
      geckoShopify.flickityResposition(false,owl);
      //geckoShopify.recalculateSwatches();
    }

  });

  // $('.filter_area_js').one('lazyincluded', function(e) {
  //   //console.log('ttt2');
  //   geckoShopify.tbScrollLeft();
  // });

  // $('.js_sidebar').one('lazyincluded', function(e) {
  //   //console.log('ttt2');
  //   geckoShopify.tbScrollLeft();
  // });

  if ( $('#shopify-section-wishlist_page').length > 0 && history.replaceState ) {
    window.history.replaceState({}, document.title, $('#wis_ntjs').attr('href'));
  } else if ( $('#shopify-section-compare_page').length > 0 && history.replaceState ) {
    window.history.replaceState({}, document.title, $('#cp_ntjs').attr('href'));
  }
  
  var check_run = true;
  $('.filter_area_js').one('lazyincluded', function(e) {
        geckoShopify.RefreshPriceTitle($('.filter_area_js'));
        if(check_run) {check_run = false;geckoShopify.VariantFilterRefresh();}
        geckoShopify.tbScrollLeft();
   });


     $('.js_sidebar').one('lazyincluded', function(e) {
        geckoShopify.RefreshPriceTitle($('.js_sidebar'));
        if(check_run) {check_run = false;geckoShopify.VariantFilterRefresh();}
        geckoShopify.tbScrollLeft();
        var current = $('.widget_product_categories  .product-categories> li.current-cat');
        //console.log(current)
        if (current.length > 0) {
          current.find('> .btn_cats_toggle, .menu_nested2.current-cat:first > .btn_cats_toggle, .menu_nested2.current-cat:first li.current-cat > .btn_cats_toggle').click();
        }
    });

  // $('.pin_lazy_js').one('lazyincluded', function(e) {
  //   //console.log('pin_lazy_js');
  //   var el = $(e.target)[0], _e l = $(el).find('.pin__popup');
  //   if ( _el.length == 0 ) return;
  //   geckoShopify.pin__pos(_el);
  // });
 // if (!nt_settings.auto_hide_ofsock || t_name != 'collection') return;
 //  var href = window.location.href;
 //  if ( href.indexOf("/vendors?q=") != '-1' || href.indexOf("/types?q=") != '-1' || href.indexOf("filternt_stockt4") != '-1' ) return;
 //  window.location.href = href+'/?q=filternt_stockt4%3dtrue&sort_by=best-selling';

});


jQuery_T4NT(window).resize(function($){
  if( jQuery_T4NT(window).width() <= 767 ) return;
  var $li = jQuery_T4NT('.calc_pos .lazy_menu');
  if ($li.length > 0) { 
    //console.log('ttt1');
    $li.each(function() { 
       geckoShopify.initMegaMenu(jQuery_T4NT(this).closest('li.menu_has_offsets'));
       //liMegaUpdate($(this).closest('li.menu_has_offsets')); 
    }); 
  }
});
