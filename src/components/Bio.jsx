import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './Bio.css';

// Starfield background
function Stars({ count = 10 }) {
  const group = useRef();
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(
        (Math.random() - 0.5) * 10, // x
        (Math.random() - 0.5) * 10, // y
        -2 + Math.random() * 1 // z (slightly behind the image)
      );
    }
    return new Float32Array(arr);
  }, [count]);

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#fff" size={0.04} sizeAttenuation />
      </points>
    </group>
  );
}

// Shooting star animation
function ShootingStar() {
  const mesh = useRef();
  const [start, setStart] = useState(Math.random() * 10);

  useFrame(({ clock }) => {
    const t = (clock.getElapsedTime() + start) % 10;
    if (mesh.current) {
      // Shooting star appears randomly every ~5-10 seconds
      const active = t > 1 && t < 1.3;
      mesh.current.visible = active;
      if (active) {
        // Move diagonally across the background
        const progress = (t - 1) / 0.3;
        mesh.current.position.x = -4 + progress * 8;
        mesh.current.position.y = 2 - progress * 4;
        mesh.current.position.z = -1.5;
      }
    }
  });

  return (
    <mesh ref={mesh} visible={false}>
      <cylinderGeometry args={[0.01, 0.03, 0.5, 8]} />
      <meshBasicMaterial color="#fff" transparent opacity={0.8} />
    </mesh>
  );
}

const ImagePlane = ({ imageUrl, active }) => {
  const meshRef = useRef();
  const texture = useTexture(`/images/${imageUrl}`);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Gentle left-right swing (Z axis only)
      meshRef.current.rotation.y = active
        ? Math.sin(clock.getElapsedTime() * 0.8) * 0.13 // ~±7.5°
        : 0;
      meshRef.current.rotation.x = 0;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[4, 4]} />
      <meshStandardMaterial
        map={texture}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const Bio = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const blogData = [
    {
      image: 'family.png',
      title: "My Roots",
      description: "Every great story begins at home. I belong to a beautiful nuclear middle-class family where love was our greatest wealth. My father, a dedicated construction worker, built not just structures but dreams with his calloused hands. My mother, the heart of our home, wove warmth into every corner with her endless care. In our small but happy world, we learned that happiness isn't measured by what you have, but by the love you share."
    },
    {
      image: 'village.jpeg',
      title: "Where I Began",
      description: "Kulappully, Shornur - my slice of heaven on earth. This beautiful village may not boast of technological marvels, but it holds treasures that no city can offer. Golden paddy fields dancing in the breeze, crystal-clear rivers singing ancient songs, serene ponds reflecting childhood dreams, and football matches that taught me teamwork. Here, surrounded by nature's embrace and genuine friendships, my life's adventure truly began."
    },
    {
      image: 'aups.png',
      title: "Innocence & Discovery",
      description: "AUPS KULAPPULLY- where my academic journey took its first magical steps. Those were days of pure wonder and extreme innocence, guided by teachers who were more like guardian angels. With no mobile phones to distract us and technology still a distant dream, we lived in the moment. Friendships were forged in playgrounds, lessons learned with chalk and blackboards. Those golden days of simplicity and joy will forever hold a special place in my heart."
    },
    {
      image: 'jts.png',
      title: "Awakening",
      description: "THS SHORNUR- marked the turning point where curiosity met purpose. This technically-oriented institution opened my eyes to the fascinating world of technology. Here, I discovered how the world truly works, understood the profound importance of education, and felt the first sparks of ambition. It was during these transformative years that life became serious, dreams took shape, and I completed my senior higher secondary education with a newfound sense of direction."
    },
    {
      image: 'college.png',
      title: "Finding My Path",
      description: "College life was nothing short of magical - pursuing a diploma in Computer Engineering at an institution so close to home that it felt like an extension of my world. Here, I dove deep into the ocean of IT, discovered the art of coding, and explored cutting-edge technologies. Each day brought new revelations, and slowly but surely, my dreams of a career in the IT field began to crystallize into concrete aspirations."
    },
    {
      image: 'confused.jpeg',
      title: "The Crossroads",
      description: "Post-college confusion hit like a storm. Standing at life's crossroads with only one clear certainty - my burning desire for an IT career - I felt overwhelmed by infinite possibilities. After months of exploration and soul-searching, web development called out to me. The MERN stack became my chosen path, and as I immersed myself in learning, confusion transformed into passion, and uncertainty blossomed into pure joy."
    },
    {
      image: 'company.jpeg',
      title: "First Steps",
      description: "Dreams materialized when Topscore Solutions in Ernakulam opened their doors to me. Stepping into this IT company as a Support Engineer marked the beginning of my professional journey. Every day brings new challenges and learning opportunities. While I'm grateful for this start, my heart still beats with the ambition to evolve into a Software Developer - a dream I'm determined to achieve."
    },
    {
      image: 'future.png',
      title: "The Journey Continues",
      description: "Today, I stand at an exciting juncture - working professionally while continuously expanding my programming horizons. Each new language I learn, every challenge I overcome, brings me closer to my ultimate goal. The journey from a village boy to an IT professional continues, fueled by dreams, determination, and an unwavering belief that the best is yet to come."
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % blogData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + blogData.length) % blogData.length);
  };

  return (
    <div className="bio-container">
      <div className="bio-header">
        <h1>My Life's Journey</h1>
        <p className="greeting"> Life is a beautiful tapestry woven with dreams, struggles, victories, and endless possibilities. 
          This is the story of my voyage from a simple village to the world of technology - 
          a journey of transformation, discovery, and relentless pursuit of dreams.</p>
      </div>

      <div className="bio-content">
        <div className="image-container">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            {/* Star background */}
            <Stars count={120} />
            {/* Multiple shooting stars for more randomness */}
            <ShootingStar />
            <ShootingStar />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#0ff" />
            <ImagePlane imageUrl={blogData[currentIndex].image} active={true} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
            />
          </Canvas>
        </div>

        <div className="description-container">
          <h2 className="description-title">{blogData[currentIndex].title}</h2>
          <p className="description-text">{blogData[currentIndex].description}</p>

          <div className="navigation-arrows">
            <button onClick={handlePrev} className="arrow-button">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="currentColor" />
              </svg>
            </button>
            <span className="page-indicator">{currentIndex + 1} / {blogData.length}</span>
            <button onClick={handleNext} className="arrow-button">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bio;