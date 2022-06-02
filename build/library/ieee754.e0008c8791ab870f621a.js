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
(self.webpackChunkaxolotis_module_teams=self.webpackChunkaxolotis_module_teams||[]).push([[422],{645:(a,o)=>{
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
o.read=function(a,o,t,h,e){var r,M,p=8*e-h-1,w=(1<<p)-1,f=w>>1,s=-7,i=t?e-1:0,l=t?-1:1,u=a[o+i];for(i+=l,r=u&(1<<-s)-1,u>>=-s,s+=p;s>0;r=256*r+a[o+i],i+=l,s-=8);for(M=r&(1<<-s)-1,r>>=-s,s+=h;s>0;M=256*M+a[o+i],i+=l,s-=8);if(0===r)r=1-f;else{if(r===w)return M?NaN:1/0*(u?-1:1);M+=Math.pow(2,h),r-=f}return(u?-1:1)*M*Math.pow(2,r-h)},o.write=function(a,o,t,h,e,r){var M,p,w,f=8*r-e-1,s=(1<<f)-1,i=s>>1,l=23===e?Math.pow(2,-24)-Math.pow(2,-77):0,u=h?0:r-1,n=h?1:-1,N=o<0||0===o&&1/o<0?1:0;for(o=Math.abs(o),isNaN(o)||o===1/0?(p=isNaN(o)?1:0,M=s):(M=Math.floor(Math.log(o)/Math.LN2),o*(w=Math.pow(2,-M))<1&&(M--,w*=2),(o+=M+i>=1?l/w:l*Math.pow(2,1-i))*w>=2&&(M++,w/=2),M+i>=s?(p=0,M=s):M+i>=1?(p=(o*w-1)*Math.pow(2,e),M+=i):(p=o*Math.pow(2,i-1)*Math.pow(2,e),M=0));e>=8;a[t+u]=255&p,u+=n,p/=256,e-=8);for(M=M<<e|p,f+=e;f>0;a[t+u]=255&M,u+=n,M/=256,f-=8);a[t+u-n]|=128*N}}}]);
//# sourceMappingURL=ieee754.e0008c8791ab870f621a.js.map