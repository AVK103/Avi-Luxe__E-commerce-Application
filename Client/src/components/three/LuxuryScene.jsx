import { Environment, Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const LuxeMesh = ({ position, color, scale, speed = 1, geometry = "sphere" }) => {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.x += delta * 0.25 * speed;
    meshRef.current.rotation.y += delta * 0.42 * speed;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.12;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry === "torus" ? <torusKnotGeometry args={[0.55, 0.18, 140, 24]} /> : null}
        {geometry === "icosahedron" ? <icosahedronGeometry args={[0.8, 0]} /> : null}
        {geometry === "sphere" ? <sphereGeometry args={[0.75, 64, 64]} /> : null}
        <meshStandardMaterial
          color={color}
          roughness={0.15}
          metalness={0.85}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
};

const LuxuryScene = () => (
  <div className="luxury-scene" aria-hidden="true">
    <Canvas camera={{ position: [0, 0, 5.6], fov: 42 }} dpr={[1, 2]}>
      <color attach="background" args={["#090d1b"]} />
      <fog attach="fog" args={["#090d1b", 5.5, 14]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 4, 3]} intensity={1.4} color="#9dd7ff" />
      <pointLight position={[-3, -2, 2]} intensity={1.2} color="#ffd89f" />

      <LuxeMesh position={[-1.8, -0.15, -0.3]} color="#6fd3ff" scale={0.95} speed={0.8} />
      <LuxeMesh position={[1.85, 0.45, -0.2]} color="#f5ad72" scale={0.75} speed={1.1} geometry="icosahedron" />
      <LuxeMesh position={[0.05, -0.9, 0.6]} color="#8e7dff" scale={0.62} speed={1.5} geometry="torus" />

      <Environment preset="city" />
    </Canvas>
  </div>
);

export default LuxuryScene;
