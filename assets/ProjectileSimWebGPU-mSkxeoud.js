import{j as e,a2 as z,J as F}from"./index-hfm3eGvV.js";import{r as t}from"./vendor-react-D9qRVFlT.js";import{S as C}from"./slider-CZ_7bO5A.js";import{P as W}from"./play-x4ATmATW.js";import{R as X}from"./rotate-ccw-DOb46y8r.js";import"./vendor-mermaid-CMKCYLRq.js";import"./vendor-charts-bJ_Mv4iN.js";import"./index-BdQq_4o_.js";import"./index-CaBdk8fe.js";import"./index-CKuo88o6.js";const re=({config:a})=>{const R=t.useRef(null),m=t.useRef(0),G=t.useRef(null),j=t.useRef(null),B=t.useRef(null),S=t.useRef(null),D=t.useRef(null),[o,M]=t.useState((a==null?void 0:a.velocity)??40),[l,k]=t.useState((a==null?void 0:a.angle)??45),[i,L]=t.useState((a==null?void 0:a.gravity)??9.8),[p,u]=t.useState(!1),[P,y]=t.useState(null),n=t.useRef(0),U=600,A=340,E=`
struct Uniforms {
  time: f32,
  velocity: f32,
  angle: f32,
  gravity: f32,
  resolution: vec2<f32>,
  running: f32,
  _pad: f32,
};

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) idx: u32) -> VertexOutput {
  var positions = array<vec2<f32>, 6>(
    vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0),
    vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(1.0, 1.0)
  );
  var out: VertexOutput;
  out.position = vec4<f32>(positions[idx], 0.0, 1.0);
  out.uv = positions[idx] * 0.5 + 0.5;
  return out;
}

fn sdCircle(p: vec2<f32>, r: f32) -> f32 {
  return length(p) - r;
}

fn sdBox(p: vec2<f32>, b: vec2<f32>) -> f32 {
  let d = abs(p) - b;
  return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0);
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let aspect = u.resolution.x / u.resolution.y;
  var p = vec2(uv.x * aspect, uv.y);

  let groundLevel = 0.15;

  // Sky gradient
  var skyColor = mix(
    vec4(0.53, 0.81, 0.92, 1.0),
    vec4(0.25, 0.42, 0.88, 1.0),
    uv.y
  );

  // Sun
  let sunPos = vec2(1.4, 0.82);
  let sunDist = length(p - sunPos);
  let sunGlow = 0.03 / (sunDist + 0.01);
  skyColor += vec4(1.0, 0.9, 0.5, 0.0) * sunGlow * 0.15;

  // Ground
  var groundColor = vec4(0.35, 0.49, 0.23, 1.0);
  let dirtNoise = fract(sin(p.x * 43.0 + p.y * 17.0) * 4839.0);
  groundColor = mix(groundColor, vec4(0.48, 0.42, 0.23, 1.0), dirtNoise * 0.15);

  var color = select(groundColor, skyColor, uv.y > groundLevel);

  // Cannon
  let cannonBase = vec2(0.3, groundLevel + 0.02);
  let cannonDist = sdBox(p - cannonBase, vec2(0.06, 0.025));
  if cannonDist < 0.0 {
    color = vec4(0.3, 0.2, 0.1, 1.0);
  }

  // Barrel (simplified as box rotated)
  let rad = u.angle * 3.14159 / 180.0;
  let barrelCenter = cannonBase + vec2(cos(rad) * 0.06, sin(rad) * 0.06);
  let rotP = vec2(
    cos(-rad) * (p.x - cannonBase.x) - sin(-rad) * (p.y - cannonBase.y),
    sin(-rad) * (p.x - cannonBase.x) + cos(-rad) * (p.y - cannonBase.y)
  );
  let barrelDist = sdBox(rotP - vec2(0.05, 0.0), vec2(0.08, 0.012));
  if barrelDist < 0.0 {
    color = vec4(0.25, 0.25, 0.28, 1.0);
    // Metallic sheen
    color += vec4(0.1) * (1.0 - abs(rotP.y) * 40.0);
  }

  // Projectile
  if u.running > 0.5 {
    let vx = u.velocity * cos(rad);
    let vy = u.velocity * sin(rad);
    let t = u.time;
    let scale = 0.012;
    let ballX = 0.3 + vx * t * scale;
    let ballY = groundLevel + 0.03 + (vy * t - 0.5 * u.gravity * t * t) * scale;

    if ballY >= groundLevel {
      let ballDist = sdCircle(p - vec2(ballX, ballY), 0.012);
      if ballDist < 0.0 {
        color = vec4(0.15, 0.15, 0.15, 1.0);
        // Specular highlight
        color += vec4(0.3) * smoothstep(0.012, 0.0, ballDist + 0.006);
      }

      // Trail - smoke puffs
      for (var i = 0u; i < 30u; i++) {
        let ti = t * f32(i) / 30.0;
        let tx = 0.3 + vx * ti * scale;
        let ty = groundLevel + 0.03 + (vy * ti - 0.5 * u.gravity * ti * ti) * scale;
        let trailDist = sdCircle(p - vec2(tx, ty), 0.004 + f32(i) * 0.0003);
        if trailDist < 0.0 {
          let alpha = f32(i) / 30.0 * 0.3;
          color = mix(color, vec4(0.7, 0.7, 0.7, 1.0), alpha);
        }
      }
    } else {
      // Explosion
      let impactX = ballX;
      let expSize = 0.04 + fract(t * 0.3) * 0.02;
      let expDist = length(p - vec2(impactX, groundLevel));
      if expDist < expSize {
        let grad = 1.0 - expDist / expSize;
        color = mix(color, vec4(1.0, 0.6, 0.1, 1.0), grad * 0.8);
      }
    }
  }

  // HUD background
  if uv.x < 0.5 && uv.y > 0.88 {
    color = mix(color, vec4(0.0, 0.0, 0.0, 1.0), 0.6);
  }

  return color;
}
`,O=t.useCallback(async()=>{if(!navigator.gpu){y(!1);return}const r=await navigator.gpu.requestAdapter();if(!r){y(!1);return}const s=await r.requestDevice();j.current=s;const c=R.current.getContext("webgpu");if(!c){y(!1);return}G.current=c;const f=navigator.gpu.getPreferredCanvasFormat();c.configure({device:s,format:f,alphaMode:"premultiplied"});const x=s.createShaderModule({code:E}),b=s.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});S.current=b;const g=s.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT|GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),w=s.createBindGroup({layout:g,entries:[{binding:0,resource:{buffer:b}}]});D.current=w;const d=s.createRenderPipeline({layout:s.createPipelineLayout({bindGroupLayouts:[g]}),vertex:{module:x,entryPoint:"vs_main"},fragment:{module:x,entryPoint:"fs_main",targets:[{format:f}]},primitive:{topology:"triangle-list"}});B.current=d,y(!0),v(0)},[]),v=t.useCallback(r=>{const s=j.current,h=G.current,c=B.current,f=S.current,x=D.current;if(!s||!h||!c||!f||!x)return;const b=new Float32Array([r,o,l,i,U,A,p?1:0,0]);s.queue.writeBuffer(f,0,b);const g=s.createCommandEncoder(),w=h.getCurrentTexture().createView(),d=g.beginRenderPass({colorAttachments:[{view:w,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});d.setPipeline(c),d.setBindGroup(0,x),d.draw(6),d.end(),s.queue.submit([g.finish()])},[o,l,i,p]);if(t.useEffect(()=>(O(),()=>{var r;cancelAnimationFrame(m.current),(r=j.current)==null||r.destroy()}),[]),t.useEffect(()=>{if(P){if(p){n.current=0;const r=()=>{n.current+=.02;const s=l*(Math.PI/180);if(o*Math.sin(s)*n.current-.5*i*n.current*n.current<0&&n.current>.1){v(n.current),u(!1);return}v(n.current),m.current=requestAnimationFrame(r)};m.current=requestAnimationFrame(r)}else cancelAnimationFrame(m.current),v(0);return()=>cancelAnimationFrame(m.current)}},[p,P,o,l,i,v]),P===!1)return e.jsxs("div",{className:"text-center py-8 space-y-3",children:[e.jsx(z,{className:"w-10 h-10 mx-auto text-yellow-500"}),e.jsx("p",{className:"text-sm text-muted-foreground font-medium",children:"Tu navegador no soporta WebGPU"}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["Prueba con Chrome 113+ o Edge 113+ para usar el modo WebGPU.",e.jsx("br",{}),'Mientras tanto, selecciona el modo "3D Three.js" o "Isométrico".']})]});const V=l*(Math.PI/180),T=o*Math.cos(V),N=o*Math.sin(V),_=2*T*N/i,q=N*N/(2*i);return e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"relative",children:[e.jsx("canvas",{ref:R,width:U,height:A,className:"w-full max-w-2xl mx-auto rounded-xl border border-border shadow-lg"}),e.jsxs("div",{className:"absolute top-2 left-2 px-2 py-1 rounded bg-black/60 text-white text-[10px] font-mono",children:["⚡ WebGPU | Alcance: ",_.toFixed(1),"m | Alt: ",q.toFixed(1),"m"]})]}),e.jsxs("div",{className:"flex gap-2 justify-center",children:[e.jsxs(F,{size:"sm",variant:"outline",onClick:()=>{n.current=0,u(!0)},disabled:p,children:[e.jsx(W,{className:"w-3.5 h-3.5 mr-1"})," 🔥 Disparar"]}),e.jsxs(F,{size:"sm",variant:"outline",onClick:()=>{u(!1),n.current=0},children:[e.jsx(X,{className:"w-3.5 h-3.5 mr-1"})," Reiniciar"]})]}),e.jsxs("div",{className:"space-y-2 text-xs",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-20 text-muted-foreground",children:"Velocidad"}),e.jsx(C,{value:[o],onValueChange:([r])=>{M(r),u(!1)},min:10,max:80,step:1,className:"flex-1"}),e.jsxs("span",{className:"w-12 text-right",children:[o," m/s"]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-20 text-muted-foreground",children:"Ángulo"}),e.jsx(C,{value:[l],onValueChange:([r])=>{k(r),u(!1)},min:5,max:85,step:1,className:"flex-1"}),e.jsxs("span",{className:"w-12 text-right",children:[l,"°"]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-20 text-muted-foreground",children:"Gravedad"}),e.jsx(C,{value:[i],onValueChange:([r])=>{L(r),u(!1)},min:1,max:25,step:.5,className:"flex-1"}),e.jsxs("span",{className:"w-12 text-right",children:[i," m/s²"]})]})]})]})};export{re as default};
