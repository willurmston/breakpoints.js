# breakpoints.js
Tiny library that fires callbacks when the browser window enters or exits width breakpoints. Yes, I know, there are several things that do this already. But they all either depend on jQuery or have ugly APIs. So here you go.

## How 2 use
```javascript
// the main object is exposed as window.breakpoints

// use a built in preset
  window.breakpoints.add('bootstrap3')

  // or add your own breakpoints
  breakpoints.add({
    'xs' : '<=767',
    'sm' : '>768',
    'md' : '>992',
    'lg' : '>1200'
  })
  
// add callbacks
breakpoints
    // add a callback to one breakpoint
    .onEnter( 'sm', console.log )
    .onExit(  'lg', console.log )
    .while(   'md', console.log )
    // add callbacks to all breakpoints
    .onAllEnter( console.log )
    .onAllExit(  console.log )
    // log all entrances and exits
    .debug()

```
