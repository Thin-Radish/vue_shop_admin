/**
 * 函数防抖
 * @param {function} func    要防抖的函数
 * @param {number} [wait=200] 需要延迟的毫秒数
 * @returns {Function} 返回一个具有防抖动功能的函数
 */

export default function debounce(func, wait=200) {
  // 记录上一次的延时器
  var timer = null;
  return function () {
    var args = arguments;
    var that = this;
    // 清除上一次延时器
    clearTimeout(timer)
    timer = setTimeout(function () {
      func.apply(that, args)
    }, wait);
  }
}


