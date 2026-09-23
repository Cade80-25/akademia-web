import{j as e,aX as k,J as T}from"./index-hfm3eGvV.js";import{r as a}from"./vendor-react-D9qRVFlT.js";import{A as V,B as L,C as O,S as w}from"./SimParticles-BYuapL78.js";import{C as W,u as H,O as U}from"./MilkyWaySkybox-2LlMx8V5.js";import{S as X,a as Z}from"./SimPostProcessing-CsFxzssK.js";import{V as j,b as $,B as K,U as J,f as q,g as Q,C as Y,T as ee}from"./vendor-three-CRpGNpdy.js";import{S as M}from"./slider-CZ_7bO5A.js";import{P as te}from"./play-x4ATmATW.js";import{R as se}from"./rotate-ccw-DOb46y8r.js";import{_ as z}from"./vendor-charts-bJ_Mv4iN.js";import{v as oe}from"./constants-BeAs8cw2.js";import{T as ae}from"./Text-CwmJmPNP.js";import"./vendor-mermaid-CMKCYLRq.js";import"./Aula-C_NJ7al7.js";import"./index.esm-CwVpX3PT.js";import"./BackButton-Bn-aEPON.js";import"./pdfExtract-DlV9gkYx.js";import"./vendor-pdf-BDB91jp3.js";import"./download-D1-PEWRA.js";import"./fileUpload-BNlmyJj8.js";import"./AuthImage-C_JkPSvE.js";import"./offlineCache-DiCqZYZ1.js";import"./image-BqG1jx6l.js";import"./external-link-C5sNKRIs.js";import"./zoom-out-kDDLdlGj.js";import"./eye-01tB4fZU.js";import"./index-BfQEwyWT.js";import"./circle-check-DiWxFtam.js";import"./circle-x-8L9dgPQS.js";import"./imageMetrics-DH88rHaB.js";import"./chevron-right-BRSUGVSY.js";import"./use-immersive-settings-Ch7tHhkn.js";import"./plus-FvS15f4I.js";import"./pencil-BtE8gsrw.js";import"./eraser-C82P_0gG.js";import"./minus-DPB72P3d.js";import"./trash-2-DFfc2iwe.js";import"./geoNormalize-BQORpVdj.js";import"./tabs-bG6Nl4jI.js";import"./index-CaBdk8fe.js";import"./PlanetariumSky-DYFMciGI.js";import"./SolarSystem3D-xz1Aaoqt.js";import"./mic-BX5Bfptg.js";import"./rocket-oATsM2FZ.js";import"./lock-CUIOJrvI.js";import"./key-round-DhzyNSbF.js";import"./camera-DlezQ3Lu.js";import"./circle-alert-PHfpCn55.js";import"./mic-off-sjL5IAww.js";import"./progress-BqKfMK-M.js";import"./index-BdQq_4o_.js";import"./index-CKuo88o6.js";var re=Object.defineProperty,ie=(s,o,t)=>o in s?re(s,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[o]=t,B=(s,o,t)=>(ie(s,typeof o!="symbol"?o+"":o,t),t);const ne=(()=>{const s={uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new j},up:{value:new j(0,1,0)}},vertexShader:`
      uniform vec3 sunPosition;
      uniform float rayleigh;
      uniform float turbidity;
      uniform float mieCoefficient;
      uniform vec3 up;

      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      // constants for atmospheric scattering
      const float e = 2.71828182845904523536028747135266249775724709369995957;
      const float pi = 3.141592653589793238462643383279502884197169;

      // wavelength of used primaries, according to preetham
      const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
      // this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
      // (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
      const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

      // mie stuff
      // K coefficient for the primaries
      const float v = 4.0;
      const vec3 K = vec3( 0.686, 0.678, 0.666 );
      // MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
      const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

      // earth shadow hack
      // cutoffAngle = pi / 1.95;
      const float cutoffAngle = 1.6110731556870734;
      const float steepness = 1.5;
      const float EE = 1000.0;

      float sunIntensity( float zenithAngleCos ) {
        zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
        return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
      }

      vec3 totalMie( float T ) {
        float c = ( 0.2 * T ) * 10E-18;
        return 0.434 * c * MieConst;
      }

      void main() {

        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        gl_Position.z = gl_Position.w; // set z to camera.far

        vSunDirection = normalize( sunPosition );

        vSunE = sunIntensity( dot( vSunDirection, up ) );

        vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

        float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

      // extinction (absorbtion + out scattering)
      // rayleigh coefficients
        vBetaR = totalRayleigh * rayleighCoefficient;

      // mie coefficients
        vBetaM = totalMie( turbidity ) * mieCoefficient;

      }
    `,fragmentShader:`
      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      uniform float mieDirectionalG;
      uniform vec3 up;

      const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );

      // constants for atmospheric scattering
      const float pi = 3.141592653589793238462643383279502884197169;

      const float n = 1.0003; // refractive index of air
      const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

      // optical length at zenith for molecules
      const float rayleighZenithLength = 8.4E3;
      const float mieZenithLength = 1.25E3;
      // 66 arc seconds -> degrees, and the cosine of that
      const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

      // 3.0 / ( 16.0 * pi )
      const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
      // 1.0 / ( 4.0 * pi )
      const float ONE_OVER_FOURPI = 0.07957747154594767;

      float rayleighPhase( float cosTheta ) {
        return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
      }

      float hgPhase( float cosTheta, float g ) {
        float g2 = pow( g, 2.0 );
        float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
        return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
      }

      void main() {

        vec3 direction = normalize( vWorldPosition - cameraPos );

      // optical length
      // cutoff angle at 90 to avoid singularity in next formula.
        float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
        float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
        float sR = rayleighZenithLength * inverse;
        float sM = mieZenithLength * inverse;

      // combined extinction factor
        vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

      // in scattering
        float cosTheta = dot( direction, vSunDirection );

        float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
        vec3 betaRTheta = vBetaR * rPhase;

        float mPhase = hgPhase( cosTheta, mieDirectionalG );
        vec3 betaMTheta = vBetaM * mPhase;

        vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
        Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

      // nightsky
        float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
        float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
        vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
        vec3 L0 = vec3( 0.1 ) * Fex;

      // composition + solar disc
        float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
        L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

        vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

        vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

        gl_FragColor = vec4( retColor, 1.0 );

      #include <tonemapping_fragment>
      #include <${oe>=154?"colorspace_fragment":"encodings_fragment"}>

      }
    `},o=new $({name:"SkyShader",fragmentShader:s.fragmentShader,vertexShader:s.vertexShader,uniforms:J.clone(s.uniforms),side:K,depthWrite:!1});class t extends q{constructor(){super(new Q(1,1,1),o)}}return B(t,"SkyShader",s),B(t,"material",o),t})();function le(s,o){const t=s+"Geometry";return a.forwardRef(({args:r,children:c,...i},u)=>{const n=a.useRef(null);return a.useImperativeHandle(u,()=>n.current),a.useLayoutEffect(()=>void(o==null?void 0:o(n.current))),a.createElement("mesh",z({ref:n},i),a.createElement(t,{attach:"geometry",args:r}),c)})}const _=le("plane");function ce(s,o,t=new j){const r=Math.PI*(s-.5),c=2*Math.PI*(o-.5);return t.x=Math.cos(c),t.y=Math.sin(r),t.z=Math.sin(c),t}const me=a.forwardRef(({inclination:s=.6,azimuth:o=.1,distance:t=1e3,mieCoefficient:r=.005,mieDirectionalG:c=.8,rayleigh:i=.5,turbidity:u=10,sunPosition:n=ce(s,o),...h},l)=>{const v=a.useMemo(()=>new j().setScalar(t),[t]),[m]=a.useState(()=>new ne);return a.createElement("primitive",z({object:m,ref:l,"material-uniforms-mieCoefficient-value":r,"material-uniforms-mieDirectionalG-value":c,"material-uniforms-rayleigh-value":i,"material-uniforms-sunPosition-value":n,"material-uniforms-turbidity-value":u,scale:v},h))}),ue=({measurements:s,title:o="📊 Mediciones"})=>s.length===0?null:e.jsxs("div",{className:"p-2.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm",children:[e.jsxs("div",{className:"flex items-center gap-1.5 mb-1.5",children:[e.jsx(k,{className:"w-3 h-3 text-accent"}),e.jsx("span",{className:"text-[10px] font-semibold text-accent",children:o})]}),e.jsx("div",{className:"grid grid-cols-2 gap-x-4 gap-y-1",children:s.map((t,r)=>e.jsxs("div",{className:"flex items-baseline justify-between gap-1",children:[e.jsx("span",{className:"text-[10px] text-muted-foreground truncate",children:t.label}),e.jsxs("span",{className:"text-[11px] font-mono font-semibold",style:{color:t.color},children:[typeof t.value=="number"?t.value.toFixed(2):t.value,t.unit&&e.jsx("span",{className:"text-[9px] text-muted-foreground ml-0.5",children:t.unit})]})]},r))})]}),I=({position:s})=>e.jsxs("mesh",{position:s,castShadow:!0,children:[e.jsx("sphereGeometry",{args:[.3,32,32]}),e.jsx("meshPhysicalMaterial",{color:"#1C1917",metalness:.95,roughness:.15,clearcoat:.4,clearcoatRoughness:.1,reflectivity:.9})]}),he=({angle:s})=>{const o=s*Math.PI/180;return e.jsxs("group",{position:[-8,.5,0],children:[[.6,-.6].map(t=>e.jsxs("mesh",{position:[0,-.2,t],castShadow:!0,children:[e.jsx("cylinderGeometry",{args:[.4,.4,.1,24]}),e.jsx("meshPhysicalMaterial",{color:"#3F2305",metalness:.05,roughness:.7,clearcoat:.15})]},t)),e.jsxs("mesh",{position:[0,0,0],castShadow:!0,children:[e.jsx("boxGeometry",{args:[1.5,.3,.8]}),e.jsx("meshPhysicalMaterial",{color:"#5C3D1A",metalness:.05,roughness:.6,clearcoat:.25,clearcoatRoughness:.3})]}),e.jsxs("group",{rotation:[0,0,o],children:[e.jsxs("mesh",{position:[1,.3,0],rotation:[0,0,-Math.PI/2],castShadow:!0,children:[e.jsx("cylinderGeometry",{args:[.18,.25,2.2,24]}),e.jsx("meshPhysicalMaterial",{color:"#27272A",metalness:.92,roughness:.2,clearcoat:.3,clearcoatRoughness:.15})]}),[.3,.9,1.5].map(t=>e.jsxs("mesh",{position:[t,.3,0],rotation:[0,0,-Math.PI/2],children:[e.jsx("torusGeometry",{args:[.26,.02,8,24]}),e.jsx("meshPhysicalMaterial",{color:"#52525B",metalness:.95,roughness:.25})]},t))]})]})},pe=({points:s})=>{const o=a.useMemo(()=>{if(s.length<2)return null;const t=new Y(s);return new ee(t,s.length*2,.06,8,!1)},[s]);return o?e.jsx("mesh",{geometry:o,children:e.jsx("meshPhysicalMaterial",{color:"#FF8C00",transparent:!0,opacity:.6,emissive:"#FF6600",emissiveIntensity:.5,transmission:.1,roughness:.15})}):null},de=({position:s,progress:o})=>{if(o<=0)return null;const t=o*3;return e.jsxs("group",{position:s,children:[e.jsxs("mesh",{scale:[t,t,t],children:[e.jsx("sphereGeometry",{args:[.5,16,16]}),e.jsx("meshPhysicalMaterial",{color:"#FF4400",emissive:"#FF8800",emissiveIntensity:3*(1-o),transparent:!0,opacity:1-o})]}),e.jsxs("mesh",{scale:[t*1.5,t*1.5,t*1.5],position:[0,t*.3,0],children:[e.jsx("sphereGeometry",{args:[.4,12,12]}),e.jsx("meshPhysicalMaterial",{color:"#71717A",transparent:!0,opacity:(1-o)*.5,roughness:.9})]})]})},fe=()=>e.jsxs("group",{children:[e.jsx(_,{args:[60,30],rotation:[-Math.PI/2,0,0],position:[0,0,0],receiveShadow:!0,children:e.jsx("meshPhysicalMaterial",{color:"#4A7C2F",roughness:.85,metalness:.02,clearcoat:.05})}),[[-5,.01,3],[4,.01,-2],[10,.01,4],[15,.01,-1]].map((s,o)=>e.jsx(_,{args:[2,2],rotation:[-Math.PI/2,0,Math.random()],position:s,receiveShadow:!0,children:e.jsx("meshPhysicalMaterial",{color:"#6B5B3A",roughness:.9,metalness:.02})},o))]}),ve=({range:s,maxH:o,time:t})=>e.jsx(ae,{position:[0,9,0],fontSize:.5,color:"white",anchorX:"center",outlineWidth:.03,outlineColor:"#000",children:`Alcance: ${s.toFixed(1)}m | Alt: ${o.toFixed(1)}m | t: ${t.toFixed(2)}s`}),xe=({velocity:s,angle:o,gravity:t,running:r,onFinish:c})=>{const i=a.useRef(0),u=a.useRef([]),[n,h]=a.useState([-8,.8,0]),[l,v]=a.useState([]),[m,p]=a.useState(null),[x,y]=a.useState(0),[b,S]=a.useState(0),d=a.useRef(!1),f=o*Math.PI/180,E=s*Math.cos(f),P=s*Math.sin(f),D=2*E*P/t,G=P*P/(2*t);return a.useEffect(()=>{r&&(i.current=0,u.current=[],v([]),p(null),y(0),d.current=!1,L())},[r]),H((ge,C)=>{if(x>0&&x<1){y(Math.min(1,x+C*2));return}if(!r||d.current)return;i.current+=C;const g=i.current;S(g);const R=-8+E*g*.5,F=(P*g-.5*t*g*g)*.5;if(F<0&&g>.1){d.current=!0;const A=[R,.1,0];h(A),p(A),y(.01),O(),c();return}const N=[R,Math.max(F,0)+.5,0];h(N),u.current.push(new j(...N)),v([...u.current])}),e.jsxs(e.Fragment,{children:[e.jsx(me,{sunPosition:[100,50,100],turbidity:8,rayleigh:.5}),e.jsx(X,{preset:"park",showContactShadows:!1}),e.jsx(Z,{bloomIntensity:.3,aoIntensity:.8}),e.jsx(w,{mode:"ambient",count:30,color:"#F5E6CC",size:.015,spread:8,speed:.2,opacity:.25,origin:[0,4,0]}),e.jsx(w,{mode:"embers",count:25,color:"#FF6600",size:.03,spread:2,speed:.8,opacity:.5,origin:[-8,1,0],active:r}),m&&e.jsx(w,{mode:"burst",count:40,color:"#FF4400",size:.05,spread:1.5,speed:2,opacity:.8,origin:m}),e.jsx(fe,{}),e.jsx(he,{angle:o}),r&&e.jsx(I,{position:n}),!r&&!m&&e.jsx(I,{position:[-8,.8,0]}),e.jsx(pe,{points:l}),m&&e.jsx(de,{position:m,progress:x}),e.jsx(ve,{range:D,maxH:G,time:b}),e.jsx(U,{enablePan:!0,enableZoom:!0,enableRotate:!0,maxPolarAngle:Math.PI/2.1,minDistance:5,maxDistance:35,target:[5,2,0]})]})},gt=({config:s})=>{const[o,t]=a.useState((s==null?void 0:s.velocity)??40),[r,c]=a.useState((s==null?void 0:s.angle)??45),[i,u]=a.useState((s==null?void 0:s.gravity)??9.8),[n,h]=a.useState(!1),l=a.useRef(null);a.useEffect(()=>(n?l.current=V():l.current&&(l.current(),l.current=null),()=>{l.current&&(l.current(),l.current=null)}),[n]);const v=r*Math.PI/180,m=o*Math.cos(v),p=o*Math.sin(v),x=2*m*p/i,y=p*p/(2*i),b=2*p/i,S=()=>h(!0),d=()=>h(!1);return e.jsxs("div",{className:"space-y-3",children:[e.jsx("div",{className:"w-full aspect-video max-w-2xl mx-auto rounded-xl border border-border shadow-lg overflow-hidden bg-gradient-to-b from-sky-300 to-sky-100",children:e.jsx(W,{shadows:!0,camera:{position:[0,8,18],fov:50},children:e.jsx(xe,{velocity:o,angle:r,gravity:i,running:n,onFinish:()=>h(!1)})})}),e.jsx(ue,{measurements:[{label:"Alcance",value:x,unit:"m",color:"#60A5FA"},{label:"Altura máx.",value:y,unit:"m",color:"#10B981"},{label:"Tiempo vuelo",value:b,unit:"s",color:"#F59E0B"},{label:"Vel. horizontal",value:m,unit:"m/s",color:"#A855F7"},{label:"Vel. vertical",value:p,unit:"m/s",color:"#EC4899"},{label:"Energía cinética",value:.5*1*o*o,unit:"J",color:"#EF4444"}]}),e.jsxs("div",{className:"flex gap-2 justify-center",children:[e.jsxs(T,{size:"sm",variant:"outline",onClick:S,disabled:n,children:[e.jsx(te,{className:"w-3.5 h-3.5 mr-1"})," 🔥 Disparar"]}),e.jsxs(T,{size:"sm",variant:"outline",onClick:d,children:[e.jsx(se,{className:"w-3.5 h-3.5 mr-1"})," Reiniciar"]})]}),e.jsxs("div",{className:"space-y-2 text-xs",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-20 text-muted-foreground",children:"Velocidad"}),e.jsx(M,{value:[o],onValueChange:([f])=>{t(f),d()},min:10,max:80,step:1,className:"flex-1"}),e.jsxs("span",{className:"w-12 text-right",children:[o," m/s"]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-20 text-muted-foreground",children:"Ángulo"}),e.jsx(M,{value:[r],onValueChange:([f])=>{c(f),d()},min:5,max:85,step:1,className:"flex-1"}),e.jsxs("span",{className:"w-12 text-right",children:[r,"°"]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-20 text-muted-foreground",children:"Gravedad"}),e.jsx(M,{value:[i],onValueChange:([f])=>{u(f),d()},min:1,max:25,step:.5,className:"flex-1"}),e.jsxs("span",{className:"w-12 text-right",children:[i," m/s²"]})]})]})]})};export{gt as default};
