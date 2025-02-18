import React, { useState, useEffect } from 'react';
import { Code, Component, Package, Layers, Cpu, GitBranch, Sparkles } from 'lucide-react';

const PremiumReactShowcase = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-cyan-500/5" />
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4}px`,
              height: `${Math.random() * 4}px`,
              backgroundColor: '#61dafb',
              animation: `twinkle ${2 + Math.random() * 4}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="h-screen flex flex-col items-center justify-center px-4">
          {/* Enhanced Title with Floating Elements */}
          <div className="relative mb-8">
            <Sparkles className="absolute -left-12 -top-8 w-8 h-8 text-blue-400 animate-sparkle" />
            <h1 className="text-8xl font-bold text-center transform hover:scale-105 transition-transform duration-500">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 animate-gradient">
                React JS
              </span>
            </h1>
            <Sparkles className="absolute -right-12 -bottom-8 w-8 h-8 text-cyan-400 animate-sparkle-delayed" />
          </div>

          {/* Enhanced 3D React Logo Container */}
          <div 
            className="relative w-96 h-96 perspective-2000 mb-16"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-cyan-500/10 to-transparent rounded-full filter blur-3xl animate-pulse-slow" />
            
            <div 
              className="w-full h-full transform-style-3d"
              style={{
                transform: `
                  rotateX(${mousePosition.y * 30}deg)
                  rotateY(${mousePosition.x * 30}deg)
                  translateZ(50px)
                `
              }}
            >
              {/* Enhanced Layered Effects */}
              <div className="absolute inset-0 transform-style-3d">
                {/* Back Glow */}
                <div className="absolute inset-0 bg-gradient-conic from-blue-500/30 via-cyan-500/20 to-blue-500/30 rounded-full filter blur-xl animate-spin-slow" />
                
                {/* Enhanced Orbital Rings */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0"
                    style={{
                      transform: `rotateZ(${72 * i}deg) rotateX(${60 + i * 5}deg)`,
                      animation: `orbit-3d ${12 - i * 1.5}s linear infinite${i % 2 ? ' reverse' : ''}`,
                    }}
                  >
                    <div className="absolute inset-0 border-2 border-cyan-400 rounded-full" 
                         style={{ opacity: 0.1 + (i * 0.05) }} />
                    <div className="absolute h-2 w-2 -right-1 top-1/2 bg-cyan-400 rounded-full"
                         style={{ opacity: 0.3 + (i * 0.1) }} />
                  </div>
                ))}

                {/* React Logo */}
                <img 
                  src="/public/react.svg"
                  alt="React Logo"
                  className="absolute inset-0 w-full h-full object-contain animate-float filter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                />

                {/* Front Layered Effects */}
                <div className="absolute inset-0">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"
                      style={{
                        transform: `rotateZ(${120 * i}deg) translateZ(${20 + i * 10}px)`,
                        animation: `shine ${3 + i}s ease-in-out infinite ${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {[
              {
                icon: <Component className="w-8 h-8" />,
                title: "Components",
                description: "Build reusable UI components with advanced composition patterns"
              },
              {
                icon: <Cpu className="w-8 h-8" />,
                title: "Virtual DOM",
                description: "Lightning-fast rendering with intelligent diffing algorithm"
              },
              {
                icon: <GitBranch className="w-8 h-8" />,
                title: "State Management",
                description: "Powerful state control with hooks and context API"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500"
                style={{
                  animation: `fade-in-up 0.5s ease-out ${index * 0.2}s forwards`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 animate-shine" />
                <div className="relative z-10">
                  <div className="text-cyan-400 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Custom Animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }

        @keyframes orbit-3d {
          from { transform: rotateZ(0deg) rotateX(60deg) rotateY(0deg); }
          to { transform: rotateZ(360deg) rotateX(60deg) rotateY(360deg); }
        }

        @keyframes shine {
          0%, 100% { opacity: 0; transform: translateX(-100%) rotateZ(var(--rotation)); }
          50% { opacity: 0.5; transform: translateX(100%) rotateZ(var(--rotation)); }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes animate-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }

        .perspective-2000 {
          perspective: 2000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: animate-gradient 4s linear infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .animate-sparkle-delayed {
          animation: sparkle 2s ease-in-out infinite 1s;
        }

        .animate-pulse-slow {
          animation: pulse 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }

        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default PremiumReactShowcase;