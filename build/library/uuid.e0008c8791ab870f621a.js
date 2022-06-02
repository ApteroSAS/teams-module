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
(self.webpackChunkaxolotis_module_teams=self.webpackChunkaxolotis_module_teams||[]).push([[141],{5327:r=>{for(var t=[],n=0;n<256;++n)t[n]=(n+256).toString(16).substr(1);r.exports=function bytesToUuid(r,n){var o=n||0,e=t;return[e[r[o++]],e[r[o++]],e[r[o++]],e[r[o++]],"-",e[r[o++]],e[r[o++]],"-",e[r[o++]],e[r[o++]],"-",e[r[o++]],e[r[o++]],"-",e[r[o++]],e[r[o++]],e[r[o++]],e[r[o++]],e[r[o++]],e[r[o++]]].join("")}},5217:r=>{var t="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(t){var n=new Uint8Array(16);r.exports=function whatwgRNG(){return t(n),n}}else{var o=new Array(16);r.exports=function mathRNG(){for(var r,t=0;t<16;t++)0==(3&t)&&(r=4294967296*Math.random()),o[t]=r>>>((3&t)<<3)&255;return o}}},1171:(r,t,n)=>{var o=n(5217),e=n(5327);r.exports=function v4(r,t,n){var a=t&&n||0;"string"==typeof r&&(t="binary"===r?new Array(16):null,r=null);var s=(r=r||{}).random||(r.rng||o)();if(s[6]=15&s[6]|64,s[8]=63&s[8]|128,t)for(var u=0;u<16;++u)t[a+u]=s[u];return t||e(s)}}}]);
//# sourceMappingURL=uuid.e0008c8791ab870f621a.js.map