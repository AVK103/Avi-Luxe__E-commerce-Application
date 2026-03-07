import { Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const RotatingCore = () => {
  const groupRef = useRef(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.35;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.24;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.7} rotationIntensity={0.75} floatIntensity={1.1}>
        <mesh>
          <octahedronGeometry args={[1.15, 0]} />
          <meshPhysicalMaterial
            color="#8ecfff"
            roughness={0.1}
            metalness={0.15}
            transmission={0.65}
            thickness={0.65}
            clearcoat={1}
            clearcoatRoughness={0.15}
            emissive="#4567ff"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.15, 0.06, 24, 180]} />
        <meshStandardMaterial color="#f3c56f" emissive="#f3c56f" emissiveIntensity={0.18} />
      </mesh>

      <mesh rotation={[Math.PI / 1.95, Math.PI / 5, 0]}>
        <torusGeometry args={[1.68, 0.05, 24, 160]} />
        <meshStandardMaterial color="#86d5ff" emissive="#86d5ff" emissiveIntensity={0.16} />
      </mesh>
    </group>
  );
};

const FooterPrismScene = () => (
  <div className="footer-three-wrap" aria-hidden="true">
    <Canvas
      camera={{ position: [0, 0, 6.4], fov: 38 }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#04060e"]} />
      <fog attach="fog" args={["#04060e", 6, 16]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.4, 3.2, 2.2]} intensity={1.7} color="#a6dcff" />
      <pointLight position={[-2.5, -1.8, 1.8]} intensity={1.5} color="#f3c56f" />
      <pointLight position={[0, 2.1, -1.5]} intensity={1.1} color="#617dff" />

      <Sparkles count={90} speed={0.35} size={2.4} scale={[8, 4, 8]} color="#9ed4ff" />
      <RotatingCore />
    </Canvas>
  </div>
);

export default FooterPrismScene;
