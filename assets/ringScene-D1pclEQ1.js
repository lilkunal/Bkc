import{S as e,_ as t,b as n,d as r,f as i,h as a,l as ee,m as o,o as s,r as c,s as l,x as te,y as ne}from"./three-BwkiqhBp.js";import{t as u}from"./types-BXXJ9F8V.js";var d=2.3,f=d*1.25,p=`
  uniform float uRadius;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vDepth = world.z / uRadius;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,m=`
  uniform sampler2D uMap;
  uniform vec3 uBack;
  uniform vec3 uGold;
  uniform float uFocus;
  uniform float uReflection;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    float light = mix(0.16, 1.0, smoothstep(-0.9, 0.96, vDepth));
    vec3 col = gl_FrontFacing ? texture2D(uMap, vUv).rgb : uBack;
    col *= light;

    // Thin gold frame that draws in as a card reaches the front.
    vec2 edge = min(vUv, 1.0 - vUv) * vec2(${d.toFixed(2)}, ${f.toFixed(3)});
    float frame = 1.0 - smoothstep(0.0, 0.012, min(edge.x, edge.y));
    col = mix(col, uGold, frame * uFocus * 0.9);

    float alpha = 1.0;
    if (uReflection > 0.5) alpha = smoothstep(0.55, 0.0, vUv.y) * 0.2;
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;function re(e){let t=new a(d,f,24,1),n=t.attributes.position;for(let t=0;t<n.count;t++){let r=n.getX(t)/e;n.setX(t,Math.sin(r)*e),n.setZ(t,Math.cos(r)*e-e)}return n.needsUpdate=!0,t.computeBoundingSphere(),t}var ie=(e,t)=>(e%t+t)%t;function h(a,h){let{count:g,reducedMotion:_}=h,v=new c({canvas:a,alpha:!0,antialias:!0,powerPreference:`low-power`});v.setPixelRatio(u()),v.setClearColor(0,0);let ae=Math.min(v.capabilities.getMaxAnisotropy(),8),y=new n,b=new o(30,1,.1,80),x=Math.PI*2/g,S=Math.max(g*2.8499999999999996/(Math.PI*2),2.8),C=re(S),w=new ee;y.add(w);let T=document.createElement(`canvas`);T.width=T.height=4;let oe=T.getContext(`2d`);oe.fillStyle=h.colors?.tile??`#1D1A15`,oe.fillRect(0,0,4,4);let E=[];for(let e=0;e<g;e++){let t=new s(T);t.colorSpace=ne;let n={uMap:{value:t},uRadius:{value:S},uBack:{value:new l(h.colors?.back??`#14120F`)},uGold:{value:new l(h.colors?.accent??`#C9A24A`)},uFocus:{value:0},uReflection:{value:0}},r=new te({vertexShader:p,fragmentShader:m,uniforms:n,side:2}),a=new te({vertexShader:p,fragmentShader:m,uniforms:{...n,uReflection:{value:1}},side:2,transparent:!0,depthWrite:!1}),o=new ee;o.rotation.y=e*x;let c=new i(C,r);c.position.z=S,c.userData.index=e;let u=new i(C,a);u.position.set(0,-2.955,S),u.scale.y=-1,o.add(c,u),w.add(o),E.push({pivot:o,card:c,mirror:u,material:r,mirrorMaterial:a,texture:t})}let D=0,O=0,k=-1,A=!_,j=!1,M=performance.now(),se=performance.now(),N=e=>Math.round(e/x)*x,P=e=>{let t=-e*x;O=t+Math.PI*2*Math.round((D-t)/(Math.PI*2)),M=performance.now(),_&&(D=O),$()},F=e=>{O=N(O)-e*x,_&&(D=O),$()},I=new e,L=new t,R=!1,z=-1,B=0,V=0,H=0,U=e=>{let t=a.getBoundingClientRect();I.set((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height*2-1)),L.setFromCamera(I,b);let n=L.intersectObjects(E.map(e=>e.card),!1)[0];return n?n.object.userData.index:-1},W=e=>{e.button===0&&(R=!0,z=e.pointerId,B=e.clientX,V=0,H=0,M=performance.now())},G=e=>{if(R&&e.pointerId===z){let t=e.clientX-B;B=e.clientX,V+=Math.abs(t),V>6&&!a.hasPointerCapture(e.pointerId)&&a.setPointerCapture(e.pointerId);let n=x/Math.max(a.clientWidth*.3,120);D+=t*n,O=D,H=t*n,M=performance.now(),$()}else e.pointerType===`mouse`&&(a.style.cursor=U(e)>=0?`pointer`:`grab`)},K=e=>{if(!(!R||e.pointerId!==z)){if(R=!1,a.hasPointerCapture(e.pointerId)&&a.releasePointerCapture(e.pointerId),V<6){let t=U(e);t>=0&&(t===k?h.onSelect(t):P(t))}else O=N(D+H*10),_&&(D=O);M=performance.now(),$()}},q=()=>{R=!1,O=N(D),$()},J=()=>j=!0,ce=()=>j=!1;a.addEventListener(`pointerdown`,W),a.addEventListener(`pointermove`,G),a.addEventListener(`pointerup`,K),a.addEventListener(`pointercancel`,q),a.addEventListener(`pointerenter`,J),a.addEventListener(`pointerleave`,ce);let le=()=>{let e=a.clientWidth,t=a.clientHeight;if(!e||!t)return;v.setSize(e,t,!1),b.aspect=e/t;let n=Math.tan(b.fov*Math.PI/360),r=Math.max(d*2.35/(2*n*b.aspect),f*1.5/(2*n));b.position.set(0,.2,S+r),b.lookAt(0,-.45,S),b.updateProjectionMatrix(),$()},Y=!1,X=!1,Z=0,Q=0,ue=e=>{let t=performance.now();A&&!R&&!j&&t-M>4500&&t-se>3800&&(se=t,F(1)),R||(D+=(O-D)*(1-Math.exp(-e*5.5))),w.rotation.y=D;for(let e=0;e<g;e++){let t=E[e],n=Math.max(0,Math.cos(e*x+D))**12;t.material.uniforms.uFocus.value=n,t.card.position.y=n*.08,t.card.scale.setScalar(1+n*.04)}let n=ie(Math.round(-D/x),g);return n!==k&&(k=n,h.onFront(k)),R||Math.abs(O-D)>5e-4},de=e=>{let t=Q?Math.min((e-Q)/1e3,.05):.016;Q=e;let n=ue(t);v.render(y,b),X&&(n||A)?Z=requestAnimationFrame(de):Y=!1};function $(){!X||Y||(Y=!0,Q=0,Z=requestAnimationFrame(de))}let fe=new ResizeObserver(le);return fe.observe(a),le(),ue(0),v.render(y,b),h.onReady?.(),{goTo:P,step:F,setAutoplay(e){A=e&&!_,A&&(M=performance.now(),$())},setTexture(e,t){let n=E[e];if(!n)return;let i=new s(t);i.colorSpace=ne,i.anisotropy=ae,i.minFilter=r,n.material.uniforms.uMap.value=i,n.mirrorMaterial.uniforms.uMap.value=i,n.texture.dispose(),n.texture=i,Y||v.render(y,b)},setActive(e){X=e,e?$():(cancelAnimationFrame(Z),Y=!1)},dispose(){X=!1,cancelAnimationFrame(Z),fe.disconnect(),a.removeEventListener(`pointerdown`,W),a.removeEventListener(`pointermove`,G),a.removeEventListener(`pointerup`,K),a.removeEventListener(`pointercancel`,q),a.removeEventListener(`pointerenter`,J),a.removeEventListener(`pointerleave`,ce),C.dispose();for(let e of E)e.material.dispose(),e.mirrorMaterial.dispose(),e.texture.dispose();v.dispose(),v.forceContextLoss()}}}export{h as createCollectionRing};