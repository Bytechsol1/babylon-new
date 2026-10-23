const dialog=document.querySelector('#info-dialog');
const panels={
 science:{eyebrow:'01 / THE SCIENCE',title:'Where curiosity<br>becomes chemistry.',body:'<p>Beauty begins with a better question. What if a formula could feel as extraordinary as it performs?</p><p>Our approach brings ingredient exploration, sensory design, and careful formulation together. Every texture, every drop, every detail has a purpose.</p>'},
 lab:{eyebrow:'02 / THE LAB',title:'A space for<br>what comes next.',body:'<p>The lab is where bold ideas become tangible. A texture to touch. A finish to refine. A new possibility to explore.</p><p>Explore the material studies on this page: switch between the amber serum and cream formulation using 01 and 02 below the scene.</p>'},
 process:{eyebrow:'03 / THE PROCESS',title:'From a spark<br>to something real.',body:'<ol><li><strong>Discover.</strong> Define your vision and the experience.</li><li><strong>Formulate.</strong> Explore ingredients and textures.</li><li><strong>Refine.</strong> Evaluate, learn, and perfect the details.</li><li><strong>Scale.</strong> Plan the journey from concept to creation.</li></ol>'},
 practice:{eyebrow:'04 / IN PRACTICE',title:'Ideas you<br>can almost feel.',body:'<p><strong>Study 001 — The amber serum.</strong><br>A golden, light-catching composition that explores clarity, richness, and precision.</p><p><strong>Study 002 — The daily cream.</strong><br>A soft, sculptural interpretation of nourishment and a slower daily ritual.</p><p class="form-note">These interactive material studies are design concepts.</p>'}
};
function openPanel(name){
 const isProject=name==='project';const panel=panels[name];
 document.querySelector('#dialog-eyebrow').textContent=isProject?'LET’S TALK CHEMISTRY':panel.eyebrow;
 document.querySelector('#dialog-title').innerHTML=isProject?'Something remarkable<br>starts here.':panel.title;
 document.querySelector('#dialog-content').innerHTML=isProject?'<form class="brief-form"><label>Your name<input name="name" autocomplete="name" required maxlength="100" placeholder="What should we call you?"></label><label>Email address<input name="email" type="email" autocomplete="email" required maxlength="200" placeholder="you@yourbrand.com"></label><label>Your idea<textarea name="idea" required maxlength="3000" placeholder="A serum, a new texture, a completely new idea…"></textarea></label><button class="button" type="submit">Download your project brief <span aria-hidden="true">↗</span></button><p class="form-note">Save a brief to share with your team. Your details stay in your browser; this demo does not send enquiries.</p></form>':panel.body+'<button class="button" id="panel-project">Bring your idea to life <span aria-hidden="true">↗</span></button>';
 if(isProject)document.querySelector('.brief-form').addEventListener('submit',downloadBrief);else document.querySelector('#panel-project').addEventListener('click',()=>openPanel('project'));
 if(!dialog.open)dialog.showModal();
}
function downloadBrief(event){event.preventDefault();const data=new FormData(event.target);const text=`BABYLON — PROJECT BRIEF\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\nThe idea\n${data.get('idea')}\n\nFrom molecule to market.\n`;const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='babylon-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#dialog-content').innerHTML='<span class="success-mark" aria-hidden="true">↗</span><p>Your project brief is ready. Find <strong>babylon-project-brief.txt</strong> in your downloads and share it with your team when you’re ready.</p><button class="button" id="brief-done">Keep exploring <span aria-hidden="true">↗</span></button>';document.querySelector('#brief-done').addEventListener('click',()=>dialog.close());}
document.querySelectorAll('[data-panel]').forEach(button=>button.addEventListener('click',()=>{openPanel(button.dataset.panel);closeMenu();}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
const menu=document.querySelector('.menu-toggle');function closeMenu(){menu.setAttribute('aria-expanded','false');document.querySelector('nav').classList.remove('open');}menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');document.querySelector('nav').classList.toggle('open',open);});
let setStudy=()=>{};document.querySelectorAll('[data-study]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.study);document.querySelectorAll('[data-study]').forEach(dot=>{const active=dot===button;dot.classList.toggle('active',active);dot.setAttribute('aria-pressed',String(active));});document.querySelector('#study-number').textContent=index?'NO. 002':'NO. 001';document.querySelector('#study-title').textContent=index?'A DAILY RITUAL, REIMAGINED.':'THE ART OF WHAT’S NEXT.';document.querySelector('#scene').setAttribute('aria-label',index?'A 3D cream jar, navy architectural arch, and reflective silver sphere':'A 3D amber serum bottle, navy architectural arch, and reflective silver sphere');document.querySelector('.fallback-bottle').style.filter=index?'saturate(.2) brightness(1.5)':'';setStudy(index);}));
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');let paused=reducedMotion.matches;const motionToggle=document.querySelector('#motion-toggle');function updateMotion(){motionToggle.setAttribute('aria-pressed',String(paused));motionToggle.setAttribute('aria-label',paused?'Play 3D animation':'Pause 3D animation');motionToggle.innerHTML=paused?'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m5 3 7 5-7 5Z"/></svg>':'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4v8M10 4v8"/></svg>';}updateMotion();motionToggle.addEventListener('click',()=>{paused=!paused;updateMotion();});reducedMotion.addEventListener('change',event=>{paused=event.matches;updateMotion();});

async function initScene(){
 const THREE=await import('./assets/three.module.js');
 const canvas=document.querySelector('#scene'),container=canvas.parentElement;
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#e9d9b7');
 const camera=new THREE.PerspectiveCamera(36,1,.1,80);camera.position.set(5.8,4.1,10.5);camera.lookAt(0,1.9,0);
 // A local studio environment gives the glass and chrome real reflections.
 const envScene=new THREE.Scene();envScene.background=new THREE.Color('#c6baa1');
 const envBox=new THREE.Mesh(new THREE.BoxGeometry(20,15,20),new THREE.MeshBasicMaterial({color:'#c4b28c',side:THREE.BackSide}));envScene.add(envBox);
 function panel(w,h,color,x,y,z,ry=0){const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));mesh.position.set(x,y,z);mesh.rotation.y=ry;envScene.add(mesh);}
 panel(5,10,'#fff9e7',-6,4,0,Math.PI/2);panel(2,9,'#ffffff',3,4,5,-.5);panel(7,4,'#ffe5a3',0,7,-4,.2);panel(7,7,'#202039',5,2,-6,-.5);panel(1,8,'#fff7de',-1,3,6,0);
 const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(envScene,.05).texture;pmrem.dispose();
 scene.add(new THREE.HemisphereLight('#fff9ec','#b4a07b',.85));
 const sun=new THREE.DirectionalLight('#fff3cf',3.8);sun.position.set(-4,8,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-7;sun.shadow.camera.right=7;sun.shadow.camera.top=8;sun.shadow.camera.bottom=-6;sun.shadow.normalBias=.025;sun.shadow.bias=-.0001;sun.shadow.radius=4;scene.add(sun);
 const fill=new THREE.DirectionalLight('#bbc2ff',.65);fill.position.set(4,4,1);scene.add(fill);
 const composition=new THREE.Group();scene.add(composition);
 function texturedMaterial(color,roughness=.8){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');const pixels=ctx.createImageData(128,128);let seed=17;for(let i=0;i<pixels.data.length;i+=4){seed=(seed*16807)%2147483647;const n=150+(seed%100);pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=n;pixels.data[i+3]=255;}ctx.putImageData(pixels,0,0);const texture=new THREE.CanvasTexture(c);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(5,5);return new THREE.MeshStandardMaterial({color,roughness,bumpMap:texture,bumpScale:.025});}
 const stone=texturedMaterial('#e8d8b6'),navy=texturedMaterial('#11112f',.85),black=new THREE.MeshStandardMaterial({color:'#0c0b0b',roughness:.3,metalness:.2});navy.envMapIntensity=.35;
 function mesh(geo,mat,x,y,z,parent=composition){const obj=new THREE.Mesh(geo,mat);obj.position.set(x,y,z);obj.castShadow=true;obj.receiveShadow=true;parent.add(obj);return obj;}
 const floor=mesh(new THREE.PlaneGeometry(200,200),stone,0,-.04,0);floor.rotation.x=-Math.PI/2;
 const wall=mesh(new THREE.PlaneGeometry(200,40),texturedMaterial('#eadbbd'),0,10,-4);wall.receiveShadow=true;
 // Extruded architectural arch, rather than a flat illustration.
 const arch=new THREE.Shape();const outer=2.1,inner=1.21,base=0,center=3.24;
 arch.moveTo(-outer,base);arch.lineTo(-outer,center);arch.absarc(0,center,outer,Math.PI,0,true);arch.lineTo(outer,base);arch.lineTo(inner,base);arch.lineTo(inner,center);arch.absarc(0,center,inner,0,Math.PI,false);arch.lineTo(-inner,base);arch.closePath();
 const archMesh=mesh(new THREE.ExtrudeGeometry(arch,{depth:.7,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.045,bevelThickness:.045,curveSegments:64}),navy,.5,0,-1.25);archMesh.rotation.y=-.12;
 mesh(new THREE.BoxGeometry(1.18,4.2,1.1),navy,3.1,2.06,-.6);
 const podium=mesh(new THREE.BoxGeometry(2.42,1.48,1.95),stone,.1,.72,.12);podium.rotation.y=-.1;
 const bottleGroup=new THREE.Group();bottleGroup.position.set(.14,1.51,.15);bottleGroup.rotation.z=-.075;composition.add(bottleGroup);
 const amber=new THREE.MeshPhysicalMaterial({color:'#be6b0d',metalness:.04,roughness:.1,transmission:.88,thickness:.32,ior:1.47,clearcoat:1,clearcoatRoughness:.06,attenuationColor:new THREE.Color('#c18116'),attenuationDistance:1.7});
 const points=[[0,0],[.32,0],[.39,.04],[.42,.12],[.42,1.35],[.4,1.47],[.31,1.53],[.25,1.56],[.25,1.71],[0,1.71]].map(p=>new THREE.Vector2(...p));
 mesh(new THREE.LatheGeometry(points,80),amber,0,0,0,bottleGroup);
 const liquid=new THREE.MeshPhysicalMaterial({color:'#bc7808',roughness:.08,transmission:.88,thickness:.6,ior:1.37});
 mesh(new THREE.CylinderGeometry(.365,.365,1.13,64),liquid,0,.66,0,bottleGroup);
 mesh(new THREE.CylinderGeometry(.055,.04,1.4,16),new THREE.MeshPhysicalMaterial({color:'#ffebc1',transmission:.9,roughness:.08,thickness:.1}),0,.87,0,bottleGroup);
 mesh(new THREE.CylinderGeometry(.28,.28,.38,64),black,0,1.78,0,bottleGroup);
 const rim=new THREE.MeshStandardMaterial({color:'#af8330',metalness:.85,roughness:.23});mesh(new THREE.TorusGeometry(.275,.014,8,64),rim,0,1.595,0,bottleGroup).rotation.x=Math.PI/2;
 mesh(new THREE.CylinderGeometry(.145,.17,.37,48),black,0,2.13,0,bottleGroup);mesh(new THREE.SphereGeometry(.145,48,24),black,0,2.315,0,bottleGroup).scale.y=.9;
 // Fine printed label follows the surface of the bottle.
 const labelCanvas=document.createElement('canvas');labelCanvas.width=512;labelCanvas.height=320;const lc=labelCanvas.getContext('2d');lc.fillStyle='#f5e5bd';lc.textAlign='center';lc.font='30px Georgia';lc.fillText('BABYLON',256,125);lc.font='10px Arial';lc.fillText('M A T E R I A L   S T U D Y   0 0 1',256,155);lc.font='12px Arial';lc.fillText('THE DAILY FORMULA',256,230);lc.font='10px Arial';lc.fillText('30 ml / 1 fl. oz.',256,260);const labelTexture=new THREE.CanvasTexture(labelCanvas);labelTexture.colorSpace=THREE.SRGBColorSpace;
 const label=mesh(new THREE.CylinderGeometry(.424,.424,.72,64,1,true,-.85,1.7),new THREE.MeshBasicMaterial({map:labelTexture,transparent:true,depthWrite:false,side:THREE.DoubleSide}),0,.78,0,bottleGroup);label.rotation.y=.45;
 const chrome=new THREE.MeshStandardMaterial({color:'#e8ddc8',metalness:1,roughness:.095,envMapIntensity:1.6});const orb=mesh(new THREE.SphereGeometry(.39,64,48),chrome,-1.35,.43,1.35);
 const dish=mesh(new THREE.CylinderGeometry(.93,.97,.16,80),stone,-.54,.065,2.35);dish.rotation.z=-.01;
 const cream=new THREE.MeshPhysicalMaterial({color:'#fff6dd',roughness:.28,clearcoat:.6});const creamDab=mesh(new THREE.SphereGeometry(.5,48,24),cream,-.55,.2,2.35);creamDab.scale.set(1.25,.15,.55);creamDab.rotation.y=-.5;
 const jarGroup=new THREE.Group();jarGroup.position.set(2.07,.03,1.7);composition.add(jarGroup);
 const frosted=new THREE.MeshPhysicalMaterial({color:'#ebdfc0',roughness:.26,transmission:.35,thickness:.2,clearcoat:.5});
 mesh(new THREE.CylinderGeometry(.66,.62,.72,80),frosted,0,.4,0,jarGroup);mesh(new THREE.CylinderGeometry(.6,.57,.49,64),cream,0,.39,0,jarGroup);mesh(new THREE.CylinderGeometry(.67,.67,.3,80),black,0,.9,0,jarGroup);
 // A slender laboratory tube anchors the scientific side of the composition.
 const glass=new THREE.MeshPhysicalMaterial({color:'#fff7df',transmission:1,roughness:.04,thickness:.1,ior:1.46});const tubeGroup=new THREE.Group();tubeGroup.position.set(-2.13,0,-.6);composition.add(tubeGroup);
 mesh(new THREE.CylinderGeometry(.22,.22,3.75,48,1,true),glass,0,1.9,0,tubeGroup);mesh(new THREE.CylinderGeometry(.19,.19,1.85,48),liquid,0,.94,0,tubeGroup);mesh(new THREE.TorusGeometry(.225,.027,8,48),glass,0,3.79,0,tubeGroup).rotation.x=Math.PI/2;mesh(new THREE.CylinderGeometry(.29,.29,.08,48),glass,0,.04,0,tubeGroup);
 const bubbles=[];for(let i=0;i<12;i++){const b=mesh(new THREE.SphereGeometry(.012+(i%3)*.008,12,8),glass,Math.sin(i*2.4)*.12,.2+(i*.137),Math.cos(i*1.7)*.1,tubeGroup);bubbles.push(b);}
 let targetX=0,targetY=0,visible=true,study=0;
 container.addEventListener('pointermove',e=>{const r=container.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*2;targetY=((e.clientY-r.top)/r.height-.5)*2;});container.addEventListener('pointerleave',()=>{targetX=targetY=0;});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(container);
 function resize(){const width=container.clientWidth,height=container.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();renderer.render(scene,camera);}new ResizeObserver(resize).observe(container);resize();
 setStudy=index=>{study=index;bottleGroup.visible=!index;if(index){jarGroup.position.set(.12,1.5,.15);jarGroup.scale.setScalar(1.16);}else{jarGroup.position.set(2.07,.03,1.7);jarGroup.scale.setScalar(1);}};
 setStudy(Number(document.querySelector('.study-dot.active').dataset.study));
 const clock=new THREE.Clock();let animationTime=0;let first=true;
 function draw(){requestAnimationFrame(draw);const dt=Math.min(clock.getDelta(),.05);if(!visible||document.hidden)return;if(!paused){animationTime+=dt;composition.rotation.y=THREE.MathUtils.damp(composition.rotation.y,targetX*.065,3,dt);composition.rotation.x=THREE.MathUtils.damp(composition.rotation.x,targetY*.025,3,dt);bottleGroup.position.y=1.52+Math.sin(animationTime*.8)*.055;bottleGroup.rotation.z=-.075+Math.sin(animationTime*.5)*.018;orb.position.y=.52+Math.sin(animationTime*1.1)*.085;orb.rotation.y=animationTime*.1;for(let i=0;i<bubbles.length;i++)bubbles[i].position.y=.15+((i*.137+animationTime*.055)%1.6);if(study)jarGroup.rotation.y=Math.sin(animationTime*.5)*.05;}renderer.render(scene,camera);if(first){first=false;canvas.classList.add('ready');document.querySelector('.scene-fallback').style.visibility='hidden';}}
 draw();canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();canvas.classList.remove('ready');document.querySelector('.scene-fallback').style.visibility='visible';document.querySelector('#scene-hint').textContent='MATERIAL STUDY';});
}
initScene().catch(()=>{document.querySelector('#scene-hint').textContent='MATERIAL STUDY';motionToggle.hidden=true;});
