
// little lib to fire callbacks when entering a certain breakpoint

;(function() {

  // OPTIONS
  var options = {
    debug: false
  }

  function getViewportSize() {
    return {
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      // height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) // maybe add height functionality
    }
  }

  function iterate(obj, func) {
    for (var key in obj) {
      if ( obj.hasOwnProperty(key) ) {
        func(obj[key], key )
      }
    }
  }

  var Breakpoints = function() {}
  window.breakpoints = new Breakpoints()

  // PRESETS
  Breakpoints.prototype.presets = {
    'bootstrap3': {
      'xs' : '<=767',
      'sm' : '>768',
      'md' : '>992',
      'lg' : '>1200'
    }
  }


  // return accessible array of active breakpoints
  Object.defineProperty( Breakpoints.prototype, 'active', {
    get: function() {
      return Object.keys(this)
    }
  })

  Breakpoints.prototype.firstResize = true

  Breakpoints.prototype.resizeHandler = function() {
    var width = getViewportSize().width

    iterate(breakpoints, function(bp, name) {

      // IF WE ARE INSIDE THIS BREAKPOINT NOW
      if ( eval(String(width) + String(bp.operator) + String(bp.pixels) )) {

        // IF WE JUST ENTERED THE BP
        if (bp.isActive === false ) {

          // activate breakpoint
          bp.isActive = true

          if (breakpoints.firstResize) {
            for (var i=0;i<bp.enter.length;i++) {
              bp.enter[i](bp)
            }
          } else {
            breakpoints.firstResize = false
          }

          if (options.debug) debug('enter', bp)
        }

        // call WHILE callbacks
        for (var i=0;i<bp.while.length;i++) {
          bp.while[i](bp)
        }

      } else {

        // IF WE JUST LEFT THE BP
        if (bp.isActive === true) {

          // deactivate breakpoint
          bp.isActive = false

          // call exit callbacks
          for (var i=0;i<bp.exit.length;i++) {
            bp.exit[i](bp)
          }

          if (options.debug) debug('exit', bp)
        }
      }
    })
  }

  // the operators that we will search the strings for
  Breakpoints.prototype.operators = ['<=','>=','<','>']

  Breakpoints.prototype.add = function(obj) {
    var _this = this

    if (typeof obj === 'string') {

      iterate(_this.presets, function(preset, name) {
        if (obj === name) _this.add(preset)
      })

    } else { // it's an object
      iterate(obj, function(bp, name) {

        // parse strings
        var pixels, operator
        // check string for operators
        for (var i=0; i<=_this.operators.length; i++) {
          if (bp.indexOf(_this.operators[i]) !== -1) {
            pixels = bp.split(_this.operators[i])[1]
            operator = _this.operators[i]

            // break out of loop
            break
          }
        }

        if (pixels && operator ) {
          _this[name] = {
            name: name,
            pixels: pixels,
            operator: operator,
            isActive: false,
            enter: [],
            exit: [],
            while: []
          }

        } else {
          throw new Error('Invalid Breakpoint string: "'+bp+'"')
        }

      })
    }

    this.resizeHandler()

    return this
  }

  Breakpoints.prototype.onEnter = function(name, callback) {
    this[name].enter.push(callback)

    return this
  }

  Breakpoints.prototype.onExit = function(name, callback) {
    this[name].exit.push(callback)

    return this
  }

  Breakpoints.prototype.onAllEnter = function( callback) {
    for(var name in this) {
      if(this.hasOwnProperty(name)) {
        this[name].enter.push(callback)
      }
    }

    return this
  }

  Breakpoints.prototype.onAllExit = function( callback) {
    for(var name in this) {
      if(this.hasOwnProperty(name)) {
        this[name].exit.push(callback)
      }
    }

    return this
  }

  Breakpoints.prototype.while = function(name, callback) {
    this[name].while.push(callback)

    return this
  }

  // DEBUG

  Breakpoints.prototype.debug = function() {
    options.debug = true

    return this
  }

  var debugColors = {
    enter: 'forestgreen',
    exit: 'darkred'
  }
  // internal debug callback
  function debug(type, bp) {
    console.log('%c '+type.toUpperCase()+'ED BREAKPOINT: "'+bp.name+'" ('+bp.operator+bp.pixels+')', 'color: '+debugColors[type]+';')
  }

  window.addEventListener('resize', breakpoints.resizeHandler)


})();
