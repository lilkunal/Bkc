import{C as e,S as t,a as n,b as r,f as i,g as a,h as o,i as s,m as c,r as l,s as u,x as d}from"./three-BwkiqhBp.js";import{t as f}from"./types-BXXJ9F8V.js";var p=`
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec2 vUv;

  float height(vec2 p) {
    float t = uTime;
    float h = sin(p.x * 0.5 + t * 0.3) * 0.46;
    h += sin(p.y * 0.9 - t * 0.22 + p.x * 0.35) * 0.3;
    h += sin(p.x * 1.55 + p.y * 0.4 + t * 0.42) * 0.17;
    h += sin((p.x - p.y) * 2.3 - t * 0.5) * 0.05;
    float d = distance(p, uPointer);
    h += exp(-d * d * 0.3) * sin(d * 2.4 - t * 2.2) * 0.16 * uPointerStrength;
    return h;
  }

  void main() {
    vUv = uv;
    vec2 p = position.xy;
    float e = 0.04;
    float h = height(p);
    float dx = height(p + vec2(e, 0.0)) - height(p - vec2(e, 0.0));
    float dy = height(p + vec2(0.0, e)) - height(p - vec2(0.0, e));
    vec3 n = normalize(vec3(-dx / (2.0 * e), -dy / (2.0 * e), 1.0));
    vec4 world = modelMatrix * vec4(p, h, 1.0);
    vPosW = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * n);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,m=`
  uniform vec3 uBase;
  uniform vec3 uSheen;
  uniform vec3 uRim;
  uniform vec3 uLight;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying vec2 vUv;

  void main() {
    vec3 n = normalize(vNormalW);
    if (!gl_FrontFacing) n = -n;
    vec3 v = normalize(cameraPosition - vPosW);
    vec3 l = normalize(uLight);
    float diffuse = max(dot(n, l), 0.0);
    float nh = max(dot(n, normalize(l + v)), 0.0);
    // A tight highlight for the satin glint, a soft one for the sheen around it.
    float glint = pow(nh, 90.0);
    float sheen = pow(nh, 10.0);
    float rim = pow(1.0 - max(dot(n, v), 0.0), 4.0);
    vec3 col = uBase * (0.22 + 0.55 * diffuse) + uSheen * (glint * 1.25 + sheen * 0.12) + uRim * rim * 0.14;
    float edge = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.8, vUv.x) * smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
    gl_FragColor = vec4(col, edge);
    #include <colorspace_fragment>
  }
`,h=`
  attribute float aSeed;
  uniform float uTime;
  uniform float uScale;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * (0.05 + aSeed * 0.12) + 3.0, 6.0) - 3.0;
    p.x += sin(uTime * 0.3 + aSeed * 40.0) * 0.25;
    p.z += cos(uTime * 0.23 + aSeed * 30.0) * 0.2;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.6 + aSeed * 4.2) * uScale * (6.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.5 + 0.5 * sin(uTime * (0.7 + aSeed * 1.5) + aSeed * 90.0);
    vAlpha = twinkle * smoothstep(3.0, 2.0, abs(p.y));
  }
`,g=`
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(uColor, a * vAlpha * 0.55);
    #include <colorspace_fragment>
  }
`;function _(_,{reducedMotion:v,colors:y,onReady:b}){let x=new l({canvas:_,alpha:!0,antialias:!0,powerPreference:`low-power`});x.setPixelRatio(f()),x.setClearColor(0,0);let S=new r,C=new c(42,1,.1,60),w=new e(0,-.7,0),T=new d({vertexShader:p,fragmentShader:m,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:2.5},uPointer:{value:new t(99,99)},uPointerStrength:{value:0},uBase:{value:new u(y.base)},uSheen:{value:new u(y.sheen)},uRim:{value:new u(y.rim)},uLight:{value:new e(-.5,.9,.45)}}}),E=new i(new o(18,10,220,120),T);E.rotation.set(-1.02,0,-.1),E.position.set(0,-1.7,-1.2),S.add(E);let D=window.innerWidth<768?160:300,O=new Float32Array(D*3),k=new Float32Array(D);for(let e=0;e<D;e++)O[e*3]=(Math.random()-.5)*14,O[e*3+1]=(Math.random()-.5)*6,O[e*3+2]=-3+Math.random()*5.5,k[e]=Math.random();let A=new n;A.setAttribute(`position`,new s(O,3)),A.setAttribute(`aSeed`,new s(k,1));let j=new d({vertexShader:h,fragmentShader:g,transparent:!0,depthWrite:!1,blending:2,uniforms:{uTime:{value:2.5},uScale:{value:f()},uColor:{value:new u(y.dust)}}}),M=new a(A,j);S.add(M);let N=new t(0,0),P=new t(0,0),F=0,I=e=>{if(e.pointerType!==`mouse`)return;let t=_.getBoundingClientRect(),n=e.clientX>=t.left&&e.clientX<=t.right&&e.clientY>=t.top&&e.clientY<=t.bottom;F=+!!n,n&&P.set((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height*2-1))},L=!1,R=0,z=0,B=2.5,V=()=>{C.position.x=N.x*.55,C.position.y=.45+N.y*.3,C.lookAt(w),x.render(S,C)},H=()=>{let e=_.clientWidth,t=_.clientHeight;if(!e||!t)return;x.setSize(e,t,!1),C.aspect=e/t;let n=C.aspect>=1;C.position.z=n?7.6:10.5,E.position.x=n?2.6:0,M.position.x=n?2:0,C.updateProjectionMatrix(),L||V()},U=e=>{let t=z?Math.min((e-z)/1e3,.05):.016;z=e,B+=t;let n=1-Math.exp(-t*3);N.lerp(P,n);let r=T.uniforms.uPointerStrength;r.value+=(F-r.value)*n,T.uniforms.uPointer.value.set(N.x*7-E.position.x,N.y*2.5-1.2),T.uniforms.uTime.value=B,j.uniforms.uTime.value=B,V(),R=requestAnimationFrame(U)},W=new ResizeObserver(H);return W.observe(_),H(),V(),b?.(),v||window.addEventListener(`pointermove`,I,{passive:!0}),{setActive(e){v||e===L||(L=e,e?(z=0,R=requestAnimationFrame(U)):cancelAnimationFrame(R))},dispose(){L=!1,cancelAnimationFrame(R),W.disconnect(),window.removeEventListener(`pointermove`,I),E.geometry.dispose(),T.dispose(),A.dispose(),j.dispose(),x.dispose(),x.forceContextLoss()}}}export{_ as createHeroBackdrop};