import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import lessThan from '../assets/less-than.png';
import greaterThan from '../assets/greater-than.png';
import slash from '../assets/slash.png';
import underscore from '../assets/underscore.png';
import defaultLogo from '../assets/logo.svg';

const transformations = [
  { 
    normal: { src: lessThan, alt: "<" },
    alt1: { src: lessThan, alt: "^", rotate: 90 }, 
    alt2: { src: greaterThan, alt: ">" }
  },
  { 
    normal: { src: slash, alt: "/" },
    alt1: { src: underscore, alt: "_" },
    alt2: { src: underscore, alt: "_" }
  },
  { 
    normal: { src: greaterThan, alt: ">" },
    alt1: { src: greaterThan, alt: "^", rotate: -90 }, 
    alt2: { src: lessThan, alt: "<" }
  }
];

const colors = ["#3B82F6", "#10B981", "#F59E0B"];

export default function Logo() {
  const [hover, setHover] = useState(false);
  const [randomIndex, setRandomIndex] = useState(1);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showHoverState, setShowHoverState] = useState(false);
  
  // Sử dụng useRef để lưu trữ các timeout và interval
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const isHovering = useRef(false);

  // Cleanup function
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Reset state khi unmount
  useEffect(() => {
    return () => cleanup();
  }, []);
  
  const handleHover = () => {
    cleanup(); // Xóa các timeout và interval cũ
    isHovering.current = true;
    setRandomIndex(Math.floor(Math.random() * 2) + 1);
    setHover(true);
    setShowHoverState(true);
    setIsGlitching(false);
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    setHover(false);
    
    // Cleanup trước khi tạo timeout mới
    cleanup();

    // Giữ trạng thái hover thêm 1 giây
    timeoutRef.current = setTimeout(() => {
      if (!isHovering.current) { // Chỉ thực hiện nếu không đang hover
        setIsGlitching(true);
        
        // Bắt đầu hiệu ứng glitch
        const glitchDuration = 800; // 0.8 giây
        intervalRef.current = setInterval(() => {
          if (!isHovering.current) { // Chỉ thực hiện nếu không đang hover
            setRandomIndex(prev => (prev + 1) % 3);
          }
        }, 50);

        // Kết thúc hiệu ứng glitch và chuyển về logo mặc định
        timeoutRef.current = setTimeout(() => {
          if (!isHovering.current) { // Chỉ thực hiện nếu không đang hover
            cleanup();
            setIsGlitching(false);
            setShowHoverState(false);
          }
        }, glitchDuration);
      }
    }, 1000);
  };

  const itemVariants = {
    initial: {
      rotate: 0,
      y: 0,
      x: 0,
      scale: 1,
    },
    hover: (i) => ({
      rotate: i === 1 ? [0, -10, 10, 0] : [0, 180, 360],
      y: [-2, 2, -2],
      x: i === 0 ? -8 : i === 2 ? 8 : 0,
      scale: [1, 1.1, 1],
      transition: {
        rotate: { duration: 0.6, ease: "easeInOut" },
        y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
        x: { duration: 0.4, ease: "easeOut" },
        scale: { duration: 0.4, ease: "easeInOut" },
      },
    }),
    glitch: {
      x: [0, -2, 3, -1, 0],
      y: [0, 1, -2, 1, 0],
      rotate: [0, -5, 5, -2, 0],
      transition: {
        duration: 0.2,
        repeat: 4,
        ease: "linear",
      },
    },
  };

  return (
    <Link to="/" className="flex items-center space-x-0 md:space-x-2">
      <div
        className="flex items-center relative"
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="flex justify-center items-center cursor-pointer select-none space-x-0 p-2"
          onMouseEnter={handleHover}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {!showHoverState ? (
            <motion.img
              key="default-logo"
              src={defaultLogo}
              alt="Logo"
              className="w-10 h-10 min-w-[40px] min-h-[40px] object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: [0.95, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                filter: 'drop-shadow(0 0 10px #3B82F6) brightness(1.1) contrast(1.1)'
              }}
            />
          ) : (
            <motion.div
              key="hover-state"
              className="w-10 min-w-[40px] flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {transformations.map((char, i) => {
                const currentChar = hover ? char[`alt${randomIndex}`] || char.normal : char.normal;
                return (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={itemVariants}
                    initial="initial"
                    animate={isGlitching ? "glitch" : "hover"}
                    className={`w-8 h-8 relative ${
                      i === 0 ? '-mr-5 md:-mr-5' : i === 1 ? '-mx-1 md:-mx-1' : '-mr-3.5 md:-mr-3.5'
                    }`}
                    style={{
                      filter: hover ? `drop-shadow(0 0 4px ${colors[i]})` : undefined,
                      marginLeft: i === 2 ? '-1.25rem' : undefined
                    }}
                  >
                    <motion.img
                      src={currentChar.src}
                      alt={currentChar.alt}
                      className="w-full h-full object-contain"
                      animate={{ 
                        rotate: currentChar.rotate || 0
                      }}
                      transition={{ 
                        duration: 0.4,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>
      <span className="text-xl font-bold text-gray-800 dark:text-white">CVK</span>
    </Link>
  );
}
