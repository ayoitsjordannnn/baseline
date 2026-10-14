const React = require('react');
const h = (t) => ({ children }) => React.createElement(t, null, children);
module.exports = { __esModule: true, default: h('svg'), Svg: h('svg'), Circle: h('circle'), Rect: h('rect'), Path: h('path'), Defs: h('defs'), LinearGradient: h('lineargradient'), Stop: h('stop'), G: h('g'), Line: h('line') };
