import{c as m}from"./index-hfm3eGvV.js";import{_ as d,a as f}from"./vendor-pdf-BDB91jp3.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=m("BookOpenCheck",[["path",{d:"M12 21V7",key:"gj6g52"}],["path",{d:"m16 12 2 2 4-4",key:"mdajum"}],["path",{d:"M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3",key:"8arnkb"}]]);f.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";async function g(p,t){const r=await p.arrayBuffer(),e=await d({data:r}).promise,o=e.numPages,n=[];for(let a=1;a<=o;a++){const s=(await(await e.getPage(a)).getTextContent()).items.map(i=>i.str).join(" ");n.push(s),t==null||t(Math.round(a/o*100))}return n.map((a,c)=>`--- Página ${c+1} ---
${a}`).join(`

`)}export{_ as B,g as e};
