;(function(window) {

var svgSprite = '<svg>' +
  ''+
    '<symbol id="icon-qiehuan" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M648.343 349.045v-144.645l255.466 231.301-255.466 215.762v-122.898h-238.897v-179.519zM349.377 479.199v108.74h239.587v179.521h-239.587v111.504l-227.848-204.024zM921.422 302.784z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-tuichu" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M888.988 492.01l-128-160c-6.192-7.739-15.458-12.012-24.994-12.012-3.54 0-7.115 0.588-10.586 1.806C712.584 326.302 704 338.41 704 352l0 96L448 448c-35.346 0-64 28.654-64 64 0 35.347 28.654 64 64 64l256 0 0 96c0 13.59 8.584 25.697 21.408 30.196 3.47 1.217 7.047 1.806 10.586 1.806 9.537 0 18.802-4.271 24.994-12.012l128-160C898.338 520.304 898.338 503.697 888.988 492.01z"  ></path>'+
      ''+
      '<path d="M576 768 384 768l-64 0 0-0.01c-0.168 0.001-0.333 0.01-0.5 0.01-35.071 0-63.5-28.654-63.5-64l0-64L256 384l0-64 0.01 0c-0.001-0.167-0.01-0.333-0.01-0.5 0-35.07 28.653-63.5 64-63.5l64 0 192 0c35.346 0 64-28.653 64-64 0-35.346-28.654-64-64-64L256 128c-70.692 0-128 57.308-128 128l0 512c0 70.691 57.308 128 128 128l320 0c35.346 0 64-28.654 64-64C640 796.653 611.346 768 576 768z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
    '<symbol id="icon-tuichu1" viewBox="0 0 1024 1024">'+
      ''+
      '<path d="M512.00256 512.13056"  ></path>'+
      ''+
      '<path d="M524.66688 567.23584"  ></path>'+
      ''+
      '<path d="M289.92 402.56l450.56 0 0 0-450.56 0 0 0Z"  ></path>'+
      ''+
      '<path d="M904.32 567.23584 904.32 824.96c0 12.704-10.336 23.04-23.04 23.04l-737.28 0c-12.704 0-23.04-10.336-23.04-23.04L120.96 567.23584l-56.32 0L64.64 824.96c0 43.75936 35.60064 79.36 79.36 79.36l737.28 0c43.75936 0 79.36-35.60064 79.36-79.36L960.64 567.23584 904.32 567.23584z"  ></path>'+
      ''+
      '<path d="M456.32 256.92928 456.32 680.96 568.96 680.96 568.96 256.92928 653.98784 341.95584 733.63456 341.95584 512.64 120.96 291.64544 341.95584 371.29344 341.95584Z"  ></path>'+
      ''+
    '</symbol>'+
  ''+
'</svg>'
var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
var shouldInjectCss = script.getAttribute("data-injectcss")

/**
 * document ready
 */
var ready = function(fn){
  if(document.addEventListener){
      document.addEventListener("DOMContentLoaded",function(){
          document.removeEventListener("DOMContentLoaded",arguments.callee,false)
          fn()
      },false)
  }else if(document.attachEvent){
     IEContentLoaded (window, fn)
  }

  function IEContentLoaded (w, fn) {
      var d = w.document, done = false,
      // only fire once
      init = function () {
          if (!done) {
              done = true
              fn()
          }
      }
      // polling for no errors
      ;(function () {
          try {
              // throws errors until after ondocumentready
              d.documentElement.doScroll('left')
          } catch (e) {
              setTimeout(arguments.callee, 50)
              return
          }
          // no errors, fire

          init()
      })()
      // trying to always fire before onload
      d.onreadystatechange = function() {
          if (d.readyState == 'complete') {
              d.onreadystatechange = null
              init()
          }
      }
  }
}

/**
 * Insert el before target
 *
 * @param {Element} el
 * @param {Element} target
 */

var before = function (el, target) {
  target.parentNode.insertBefore(el, target)
}

/**
 * Prepend el to target
 *
 * @param {Element} el
 * @param {Element} target
 */

var prepend = function (el, target) {
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

function appendSvg(){
  var div,svg

  div = document.createElement('div')
  div.innerHTML = svgSprite
  svg = div.getElementsByTagName('svg')[0]
  if (svg) {
    svg.setAttribute('aria-hidden', 'true')
    svg.style.position = 'absolute'
    svg.style.width = 0
    svg.style.height = 0
    svg.style.overflow = 'hidden'
    prepend(svg,document.body)
  }
}

if(shouldInjectCss && !window.__iconfont__svg__cssinject__){
  window.__iconfont__svg__cssinject__ = true
  try{
    document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
  }catch(e){
    console && console.log(e)
  }
}

ready(appendSvg)


})(window)
