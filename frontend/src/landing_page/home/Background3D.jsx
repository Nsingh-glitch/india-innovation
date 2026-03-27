import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";

function Sphere() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial color="#f97316" wireframe />
      </mesh>
    </Float>
  );
}

function Background3D() {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />

      <Sphere />

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  );
}

export default Background3D;