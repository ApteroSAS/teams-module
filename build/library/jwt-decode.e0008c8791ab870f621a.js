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
"use strict";(self.webpackChunkaxolotis_module_teams=self.webpackChunkaxolotis_module_teams||[]).push([[96],{6245:(r,a,i)=>{function e(r){this.message=r}i.d(a,{Z:()=>s}),e.prototype=new Error,e.prototype.name="InvalidCharacterError";var c="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(r){var a=String(r).replace(/=+$/,"");if(a.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var i,c,s=0,d=0,l="";c=a.charAt(d++);~c&&(i=s%4?64*i+c:c,s++%4)?l+=String.fromCharCode(255&i>>(-2*s&6)):0)c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(c);return l};function t(r){var a=r.replace(/-/g,"+").replace(/_/g,"/");switch(a.length%4){case 0:break;case 2:a+="==";break;case 3:a+="=";break;default:throw"Illegal base64url string!"}try{return function(r){return decodeURIComponent(c(r).replace(/(.)/g,(function(r,a){var i=a.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i})))}(a)}catch(r){return c(a)}}function n(r){this.message=r}n.prototype=new Error,n.prototype.name="InvalidTokenError";const s=function o(r,a){if("string"!=typeof r)throw new n("Invalid token specified");var i=!0===(a=a||{}).header?0:1;try{return JSON.parse(t(r.split(".")[i]))}catch(r){throw new n("Invalid token specified: "+r.message)}}}}]);
//# sourceMappingURL=jwt-decode.e0008c8791ab870f621a.js.map