/*!
 * 
 *   @aptero/axolotis-module-teams v1.0.0
 *
 *   Copyright (c) Aptero  and project contributors.
 *
 *   This source code is licensed under the undefined license found in the
 *   LICENSE file in the root directory of this source tree.
 *
 */
(self.webpackChunkaxolotis_module_teams=self.webpackChunkaxolotis_module_teams||[]).push([[785],{6808:(e,t,n)=>{var o,i;
/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */!function(r){if(void 0===(i="function"==typeof(o=r)?o.call(t,n,t,e):o)||(e.exports=i),!0,e.exports=r(),!!0){var c=window.Cookies,a=window.Cookies=r();a.noConflict=function(){return window.Cookies=c,a}}}((function(){function extend(){for(var e=0,t={};e<arguments.length;e++){var n=arguments[e];for(var o in n)t[o]=n[o]}return t}function decode(e){return e.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent)}return function init(e){function api(){}function set(t,n,o){if("undefined"!=typeof document){"number"==typeof(o=extend({path:"/"},api.defaults,o)).expires&&(o.expires=new Date(1*new Date+864e5*o.expires)),o.expires=o.expires?o.expires.toUTCString():"";try{var i=JSON.stringify(n);/^[\{\[]/.test(i)&&(n=i)}catch(e){}n=e.write?e.write(n,t):encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),t=encodeURIComponent(String(t)).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[\(\)]/g,escape);var r="";for(var c in o)o[c]&&(r+="; "+c,!0!==o[c]&&(r+="="+o[c].split(";")[0]));return document.cookie=t+"="+n+r}}function get(t,n){if("undefined"!=typeof document){for(var o={},i=document.cookie?document.cookie.split("; "):[],r=0;r<i.length;r++){var c=i[r].split("="),a=c.slice(1).join("=");n||'"'!==a.charAt(0)||(a=a.slice(1,-1));try{var p=decode(c[0]);if(a=(e.read||e)(a,p)||decode(a),n)try{a=JSON.parse(a)}catch(e){}if(o[p]=a,t===p)break}catch(e){}}return t?o[t]:o}}return api.set=set,api.get=function(e){return get(e,!1)},api.getJSON=function(e){return get(e,!0)},api.remove=function(e,t){set(e,"",extend(t,{expires:-1}))},api.defaults={},api.withConverter=init,api}((function(){}))}))}}]);
//# sourceMappingURL=js-cookie.e0008c8791ab870f621a.js.map