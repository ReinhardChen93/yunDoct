/* eslint-disable */
// ios
// 这段代码是固定的，必须要放到js中
function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge) }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback) }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
}
// 与OC交互的所有JS方法都要放在此处注册，才能调用通过JS调用OC或者让OC调用这里的JS
export default {
  callhandler(name, data, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.callHandler(name, data, callback)
    })
  },
  registerhandler(name, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
      bridge.registerHandler(name, function (data, responseCallback) {
        callback(data, responseCallback)
      })
    })
  }
}

// android
// 注册事件监听
function connectWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge)
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady'
      , function () {
        callback(WebViewJavascriptBridge)
      },
      false
    );
  }
}
// 注册回调函数，第一次连接时调用 初始化函数
connectWebViewJavascriptBridge(function (bridge) {
  bridge.init(function (message, responseCallback) {
    bridgeLog('默认接收收到来自Java数据： ' + message)
    var responseData = '默认接收收到来自Java的数据，回传数据给你'
    responseCallback(responseData)
  });

  bridge.registerHandler("functionInJs", function (data, responseCallback) {
    bridgeLog('指定接收收到来自Java数据： ' + data)
    var responseData = '指定接收收到来自Java的数据，回传数据给你'
    responseCallback(responseData)
  })
})

