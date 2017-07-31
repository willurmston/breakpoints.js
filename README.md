# breakpoints.js
Tiny library that fires callbacks when the browser window enters or exits width breakpoints. Yes, I know, there are several things that do this already. But they all either depend on jQuery or have ugly APIs. So here you go. See an example [here](http://urmston.xyz/breakpoints-js-example/example.html).

## How 2 use
```javascript
// the constructor is exposed as window.Breakpoints
// valid operators: <=, >=, <, >
var breakpoints = new Breakpoints({
  'xs' : '<=767',
  'sm' : '>768',
  'md' : '>992',
  'lg' : '>1200'
})

// or use a built in preset (bootstrap 3 only at this time)
var breakpoints = new Breakpoints('bootstrap3')

// or add more after instantiation
breakpoints.add({
  'xs' : '<=767',
  'sm' : '>768',
  'md' : '>992',
  'lg' : '>1200'
})

// add callbacks
breakpoints
    // add a callback to one breakpoint
    .onEnter( 'sm', myCallback )
    .onExit(  'lg', myCallback )
    .while(   'md', myCallback )
    // add callbacks to all breakpoints
    .onAllEnter( myCallback )
    .onAllExit(  myCallback )
    // log all entrances and exits
    .debug()

```
