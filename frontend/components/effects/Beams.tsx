"use client";

/* eslint-disable react/no-unknown-property */
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import "./Beams.css";

export interface BeamsProps {
  beamWidth?: number;
  beamHeight?: number;
  beamNumber?: number;
  lightColor?: string;
  beamColor?: string;
  backgroundColor?: string;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
  rotation?: number;
  lightMode?: boolean;
}

const noise = `
float random (in vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
float noise (in vec2 st) {
  vec2 i = floor(st); vec2 f = fract(st); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x), mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec3 P){
  vec3 Pi0=floor(P), Pi1=Pi0+vec3(1.0); Pi0=mod(Pi0,289.0); Pi1=mod(Pi1,289.0); vec3 Pf0=fract(P), Pf1=Pf0-vec3(1.0);
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x), iy=vec4(Pi0.yy,Pi1.yy), iz0=Pi0.zzzz, iz1=Pi1.zzzz;
  vec4 ixy=permute(permute(ix)+iy), ixy0=permute(ixy+iz0), ixy1=permute(ixy+iz1);
  vec4 gx0=ixy0/7.0, gy0=fract(floor(gx0)/7.0)-0.5; gx0=fract(gx0); vec4 gz0=vec4(0.5)-abs(gx0)-abs(gy0); vec4 sz0=step(gz0,vec4(0.0)); gx0-=sz0*(step(0.0,gx0)-0.5); gy0-=sz0*(step(0.0,gy0)-0.5);
  vec4 gx1=ixy1/7.0, gy1=fract(floor(gx1)/7.0)-0.5; gx1=fract(gx1); vec4 gz1=vec4(0.5)-abs(gx1)-abs(gy1); vec4 sz1=step(gz1,vec4(0.0)); gx1-=sz1*(step(0.0,gx1)-0.5); gy1-=sz1*(step(0.0,gy1)-0.5);
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x), g100=vec3(gx0.y,gy0.y,gz0.y), g010=vec3(gx0.z,gy0.z,gz0.z), g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x), g101=vec3(gx1.y,gy1.y,gz1.y), g011=vec3(gx1.z,gy1.z,gz1.z), g111=vec3(gx1.w,gy1.w,gz1.w);
  vec4 n0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110))); g000*=n0.x; g010*=n0.y; g100*=n0.z; g110*=n0.w;
  vec4 n1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111))); g001*=n1.x; g011*=n1.y; g101*=n1.z; g111*=n1.w;
  float n000=dot(g000,Pf0), n100=dot(g100,vec3(Pf1.x,Pf0.yz)), n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)), n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z)), n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z)), n011=dot(g011,vec3(Pf0.x,Pf1.yz)), n111=dot(g111,Pf1);
  vec3 f=fade(Pf0); vec4 nz=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),f.z); vec2 ny=mix(nz.xy,nz.zw,f.y); return 2.2*mix(ny.x,ny.y,f.x);
}`;

function color(hex: string) { return new THREE.Color(hex); }
function extendMaterial(cfg: { beamColor: string; speed: number; noiseIntensity: number; scale: number; lightMode: boolean }) {
  const physical = THREE.ShaderLib.physical;
  const uniforms = THREE.UniformsUtils.clone(physical.uniforms);
  const defaults = new THREE.MeshStandardMaterial({ color: cfg.beamColor, roughness: 0.3, metalness: 0.3 });
  uniforms.diffuse.value = defaults.color;
  uniforms.roughness.value = defaults.roughness;
  uniforms.metalness.value = defaults.metalness;
  uniforms.time = { value: 0 };
  uniforms.uSpeed = { value: cfg.speed };
  uniforms.uNoiseIntensity = { value: cfg.noiseIntensity };
  uniforms.uScale = { value: cfg.scale };
  uniforms.uLightMode = { value: cfg.lightMode ? 1 : 0 };
  return new THREE.ShaderMaterial({
    uniforms, lights: true, fog: true,
    vertexShader: `varying vec3 vEye; varying float vNoise; varying vec2 vUv; uniform float time; uniform float uSpeed; uniform float uScale; ${noise}
      float getPos(vec3 pos) { return cnoise(vec3(pos.x * 0., pos.y - uv.y, pos.z + time * uSpeed * 3.) * uScale); }
      vec3 getCurrentPos(vec3 pos) { vec3 next = pos; next.z += getPos(pos); return next; }
      vec3 getNormal(vec3 pos) { vec3 cur=getCurrentPos(pos); vec3 nextX=getCurrentPos(pos+vec3(.01,0.,0.)); vec3 nextZ=getCurrentPos(pos+vec3(0.,-.01,0.)); return normalize(cross(normalize(nextZ-cur),normalize(nextX-cur))); }
      ${physical.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed.z += getPos(transformed.xyz);").replace("#include <beginnormal_vertex>", "#include <beginnormal_vertex>\nobjectNormal = getNormal(position.xyz);")}`,
    fragmentShader: `uniform float uLightMode; uniform float uNoiseIntensity; ${noise}
      ${physical.fragmentShader.replace("#include <dithering_fragment>", "#include <dithering_fragment>\nfloat randomNoise=noise(gl_FragCoord.xy); gl_FragColor.rgb -= randomNoise / 15. * uNoiseIntensity; if(uLightMode > .5) gl_FragColor.rgb = mix(vec3(1.), gl_FragColor.rgb, .7);")}`,
  });
}

function geometryFor(count: number, width: number, height: number) {
  const segments = 80; const positions: number[] = []; const indices: number[] = []; const uvs: number[] = [];
  const total = count * width; const start = -total / 2;
  for (let i = 0; i < count; i++) for (let j = 0; j <= segments; j++) {
    const y = height * (j / segments - 0.5); const x = start + i * width;
    positions.push(x, y, 0, x + width, y, 0); uvs.push(Math.random() * 300, j / segments, Math.random() * 300 + 1, j / segments);
    if (j < segments) { const v = (i * (segments + 1) + j) * 2; indices.push(v, v + 1, v + 2, v + 2, v + 1, v + 3); }
  }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2)); geometry.setIndex(indices); geometry.computeVertexNormals(); return geometry;
}

const Planes = forwardRef<THREE.Mesh, { material: THREE.ShaderMaterial; width: number; count: number; height: number }>(({ material, width, count, height }, ref) => {
  const mesh = useRef<THREE.Mesh>(null); useImperativeHandle(ref, () => mesh.current as THREE.Mesh);
  const geometry = useMemo(() => geometryFor(count, width, height), [count, width, height]);
  useFrame((_, delta) => { material.uniforms.time.value += 0.1 * delta; });
  return <mesh ref={mesh} geometry={geometry} material={material} />;
});
Planes.displayName = "Planes";

export default function Beams({ beamWidth = 2, beamHeight = 15, beamNumber = 12, lightColor = "#ffffff", beamColor = "#000000", backgroundColor = "#000000", speed = 2, noiseIntensity = 1.75, scale = 0.2, rotation = 0, lightMode = false }: BeamsProps) {
  const material = useMemo(() => extendMaterial({ beamColor, speed, noiseIntensity, scale, lightMode }), [beamColor, speed, noiseIntensity, scale, lightMode]);
  useEffect(() => () => { material.dispose(); }, [material]);
  return <Canvas dpr={[1, 2]} frameloop="always" className="beams-container"><group rotation={[0, 0, rotation * Math.PI / 180]}><Planes material={material} width={beamWidth} count={beamNumber} height={beamHeight} /><directionalLight color={lightColor} intensity={1.1} position={[0, 3, 10]} /></group><ambientLight intensity={1} /><color attach="background" args={[backgroundColor]} /><PerspectiveCamera makeDefault position={[0, 0, 20]} fov={30} /></Canvas>;
}