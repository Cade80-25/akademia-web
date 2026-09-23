import{c as f}from"./index-hfm3eGvV.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s=f("File",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=f("WifiOff",[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}],["path",{d:"M5 12.859a10 10 0 0 1 5.17-2.69",key:"1dl1wf"}],["path",{d:"M19 12.859a10 10 0 0 0-2.007-1.523",key:"4k23kn"}],["path",{d:"M2 8.82a15 15 0 0 1 4.177-2.643",key:"1grhjp"}],["path",{d:"M22 8.82a15 15 0 0 0-11.288-3.764",key:"z3jwby"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]),n="au_offline_cache_v1",c=4*1024*1024;function r(){try{const t=localStorage.getItem(n);return t?JSON.parse(t):[]}catch{return[]}}function i(t){let e=JSON.stringify(t);for(;e.length>c&&t.length>1;)t.sort((a,l)=>a.savedAt-l.savedAt),t.shift(),e=JSON.stringify(t);try{localStorage.setItem(n,e)}catch{t.splice(0,Math.ceil(t.length/2)),localStorage.setItem(n,JSON.stringify(t))}}function d(t){const e=r().filter(a=>a.id!==t.id);e.push(t),i(e)}function y(t){i(r().filter(e=>e.id!==t))}function p(){return r().sort((t,e)=>e.savedAt-t.savedAt)}export{s as F,h as W,p as l,y as r,d as s};
