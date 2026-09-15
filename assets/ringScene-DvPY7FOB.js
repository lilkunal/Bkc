import{a as e,c as t,f as n,g as r,h as i,i as a,l as o,m as s,o as c,p as l,s as u,t as d,u as f}from"./three-D-c_qVlM.js";import{t as p}from"./types-BXXJ9F8V.js";var m=2.3,h=m*1.25,ee=`
  uniform float uRadius;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vDepth = world.z / uRadius;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`,te=`
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
    vec2 edge = min(vUv, 1.0 - vUv) * vec2(${m.toFixed(2)}, ${h.toFixed(3)});
    float frame = 1.0 - smoothstep(0.0, 0.012, min(edge.x, edge.y));
    col = mix(col, uGold, frame * uFocus * 0.9);

    float alpha = 1.0;
    if (uReflection > 0.5) alpha = smoothstep(0.55, 0.0, vUv.y) * 0.2;
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;function ne(e){let t=new f(m,h,24,1),n=t.attributes.position;for(let t=0;t<n.count;t++){let r=n.getX(t)/e;n.setX(t,Math.sin(r)*e),n.setZ(t,Math.cos(r)*e-e)}return n.needsUpdate=!0,t.computeBoundingSphere(),t}var re=(e,t)=>(e%t+t)%t;function g(f,g){let{count:_,reducedMotion:v}=g,y=new d({canvas:f,alpha:!0,antialias:!0,powerPreference:`low-power`});y.setPixelRatio(p()),y.setClearColor(0,0);let ie=Math.min(y.capabilities.getMaxAnisotropy(),8),b=new s,x=new o(30,1,.1,80),S=Math.PI*2/_,C=Math.max(_*2.8499999999999996/(Math.PI*2),2.8),w=ne(C),T=new c;b.add(T);let E=document.createElement(`canvas`);E.width=E.height=4;let D=E.getContext(`2d`);D.fillStyle=g.colors?.tile??`#1D1A15`,D.fillRect(0,0,4,4);let O=[];for(let n=0;n<_;n++){let r=new a(E);r.colorSpace=l;let o={uMap:{value:r},uRadius:{value:C},uBack:{value:new e(g.colors?.back??`#14120F`)},uGold:{value:new e(g.colors?.accent??`#C9A24A`)},uFocus:{value:0},uReflection:{value:0}},s=new i({vertexShader:ee,fragmentShader:te,uniforms:o,side:2}),u=new i({vertexShader:ee,fragmentShader:te,uniforms:{...o,uReflection:{value:1}},side:2,transparent:!0,depthWrite:!1}),d=new c;d.rotation.y=n*S;let f=new t(w,s);f.position.z=C,f.userData.index=n;let p=new t(w,u);p.position.set(0,-2.955,C),p.scale.y=-1,d.add(f,p),T.add(d),O.push({pivot:d,card:f,mirror:p,material:s,mirrorMaterial:u,texture:r})}let k=0,A=0,j=-1,M=!v,N=!1,P=performance.now(),ae=performance.now(),F=e=>Math.round(e/S)*S,oe=e=>{let t=-e*S;A=t+Math.PI*2*Math.round((k-t)/(Math.PI*2)),P=performance.now(),v&&(k=A),$()},I=e=>{A=F(A)-e*S,v&&(k=A),$()},L=new r,R=new n,z=!1,B=-1,V=0,H=0,U=0,W=e=>{let t=f.getBoundingClientRect();L.set((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height*2-1)),R.setFromCamera(L,x);let n=R.intersectObjects(O.map(e=>e.card),!1)[0];return n?n.object.userData.index:-1},G=e=>{e.button===0&&(z=!0,B=e.pointerId,V=e.clientX,H=0,U=0,P=performance.now())},K=e=>{if(z&&e.pointerId===B){let t=e.clientX-V;V=e.clientX,H+=Math.abs(t),H>6&&!f.hasPointerCapture(e.pointerId)&&f.setPointerCapture(e.pointerId);let n=S/Math.max(f.clientWidth*.3,120);k+=t*n,A=k,U=t*n,P=performance.now(),$()}else e.pointerType===`mouse`&&(f.style.cursor=W(e)>=0?`pointer`:`grab`)},q=e=>{if(!(!z||e.pointerId!==B)){if(z=!1,f.hasPointerCapture(e.pointerId)&&f.releasePointerCapture(e.pointerId),H<6){let t=W(e);t>=0&&(t===j?g.onSelect(t):oe(t))}else A=F(k+U*10),v&&(k=A);P=performance.now(),$()}},J=()=>{z=!1,A=F(k),$()},se=()=>N=!0,ce=()=>N=!1;f.addEventListener(`pointerdown`,G),f.addEventListener(`pointermove`,K),f.addEventListener(`pointerup`,q),f.addEventListener(`pointercancel`,J),f.addEventListener(`pointerenter`,se),f.addEventListener(`pointerleave`,ce);let le=()=>{let e=f.clientWidth,t=f.clientHeight;if(!e||!t)return;y.setSize(e,t,!1),x.aspect=e/t;let n=Math.tan(x.fov*Math.PI/360),r=Math.max(m*2.35/(2*n*x.aspect),h*1.5/(2*n));x.position.set(0,.2,C+r),x.lookAt(0,-.45,C),x.updateProjectionMatrix(),$()},Y=!1,X=!1,Z=0,Q=0,ue=e=>{let t=performance.now();M&&!z&&!N&&t-P>4500&&t-ae>3800&&(ae=t,I(1)),z||(k+=(A-k)*(1-Math.exp(-e*5.5))),T.rotation.y=k;for(let e=0;e<_;e++){let t=O[e],n=Math.max(0,Math.cos(e*S+k))**12;t.material.uniforms.uFocus.value=n,t.card.position.y=n*.08,t.card.scale.setScalar(1+n*.04)}let n=re(Math.round(-k/S),_);return n!==j&&(j=n,g.onFront(j)),z||Math.abs(A-k)>5e-4},de=e=>{let t=Q?Math.min((e-Q)/1e3,.05):.016;Q=e;let n=ue(t);y.render(b,x),X&&(n||M)?Z=requestAnimationFrame(de):Y=!1};function $(){!X||Y||(Y=!0,Q=0,Z=requestAnimationFrame(de))}let fe=new ResizeObserver(le);return fe.observe(f),le(),ue(0),y.render(b,x),g.onReady?.(),{goTo:oe,step:I,setAutoplay(e){M=e&&!v,M&&(P=performance.now(),$())},setTexture(e,t){let n=O[e];if(!n)return;let r=new a(t);r.colorSpace=l,r.anisotropy=ie,r.minFilter=u,n.material.uniforms.uMap.value=r,n.mirrorMaterial.uniforms.uMap.value=r,n.texture.dispose(),n.texture=r,Y||y.render(b,x)},setActive(e){X=e,e?$():(cancelAnimationFrame(Z),Y=!1)},dispose(){X=!1,cancelAnimationFrame(Z),fe.disconnect(),f.removeEventListener(`pointerdown`,G),f.removeEventListener(`pointermove`,K),f.removeEventListener(`pointerup`,q),f.removeEventListener(`pointercancel`,J),f.removeEventListener(`pointerenter`,se),f.removeEventListener(`pointerleave`,ce),w.dispose();for(let e of O)e.material.dispose(),e.mirrorMaterial.dispose(),e.texture.dispose();y.dispose(),y.forceContextLoss()}}}export{g as createCollectionRing};