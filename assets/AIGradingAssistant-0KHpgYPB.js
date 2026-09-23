import{j as c,J as w,L as b,a1 as y,s as O,d as n}from"./index-hfm3eGvV.js";import{r as T}from"./vendor-react-D9qRVFlT.js";import"./vendor-mermaid-CMKCYLRq.js";import"./vendor-charts-bJ_Mv4iN.js";const P=({submissionContent:a,assignmentTitle:S,assignmentDescription:o,maxScore:i,onSuggest:x})=>{const[r,l]=T.useState(!1),A=async()=>{var d,u,f;l(!0);try{const E=`Eres un asistente de corrección para profesores. Analiza la siguiente entrega de un estudiante y sugiere una calificación y retroalimentación constructiva.

TAREA: "${S}"
${o?`DESCRIPCIÓN: "${o}"`:""}
PUNTAJE MÁXIMO: ${i}

RESPUESTA DEL ESTUDIANTE:
"${(a==null?void 0:a.slice(0,3e3))||"(Sin contenido de texto)"}"

Responde SOLO con un JSON: {"score": número, "feedback": "retroalimentación constructiva en español, máximo 200 palabras"}`,{data:N,error:m}=await O.functions.invoke("ai-tutor",{body:{messages:[{role:"user",content:E}],subject:"Corrección",level:"Profesor",mode:"default"}});if(m)throw m;const j=N,I=new TextDecoder,k=j.getReader();let p="";for(;;){const{done:e,value:t}=await k.read();if(e)break;const v=I.decode(t,{stream:!0}).split(`
`);for(const s of v)if(s.startsWith("data: ")&&s!=="data: [DONE]")try{const h=(f=(u=(d=JSON.parse(s.slice(6)).choices)==null?void 0:d[0])==null?void 0:u.delta)==null?void 0:f.content;h&&(p+=h)}catch{}}const g=p.match(/\{[\s\S]*\}/);if(g){const e=JSON.parse(g[0]),t=Math.min(Math.max(Number(e.score)||0,0),i);x(t,e.feedback||""),n.success("Sugerencia de IA generada ✨")}else n.error("La IA no pudo generar una sugerencia válida")}catch{n.error("Error al generar sugerencia con IA")}finally{l(!1)}};return c.jsxs(w,{variant:"outline",size:"sm",onClick:A,disabled:r,className:"w-full border-accent/30 text-accent hover:bg-accent/10",children:[r?c.jsx(b,{className:"w-3.5 h-3.5 animate-spin mr-1"}):c.jsx(y,{className:"w-3.5 h-3.5 mr-1"}),r?"Analizando entrega...":"Sugerir calificación con IA"]})};export{P as default};
