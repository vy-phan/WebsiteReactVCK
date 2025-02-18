import React from 'react';
import { motion } from 'framer-motion';
import { SiReact, SiTypescript, SiJavascript } from "react-icons/si";
import { FaPlay, FaPause } from "react-icons/fa";

const CodePreview = () => {
    const [isPlaying, setIsPlaying] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState('jsx');

    const codeExamples = {
        jsx: `function Welcome() {
  const [count, setCount] = useState(0);
            
  useEffect(() => {
    document.title = \`Clicks: \${count}\`;
  }, [count]);
            
  return (
    <button onClick={() => setCount(count + 1)}>
      Count is: {count}
    </button>
  );
}`,
        ts: `interface Props {
  name: string;
  age?: number;
}
            
const Profile: React.FC<Props> = ({ 
  name, 
  age = 20 
}) => {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
};`,
        js: `class Timer extends React.Component {
  state = { seconds: 0 };
            
  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(state => ({
        seconds: state.seconds + 1
      }));
    }, 1000);
  }
            
  render() {
    return <h1>Seconds: {this.state.seconds}</h1>;
  }
}`
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto my-36 pb-20 overflow-hidden"
        >
            {/* Glass Effect Container */}
            <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/50 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30">
                {/* Code Editor Header */}
                <div className="px-6 py-4 border-b border-gray-200/10 dark:border-gray-700/30 flex items-center justify-between">
                    <div className="flex space-x-3">
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/30"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/30"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30"></div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setActiveTab('jsx')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105
                                ${activeTab === 'jsx'
                                    ? 'bg-gray-100 text-blue-400 dark:bg-blue-500/20 dark:text-blue-300 shadow-lg shadow-blue-500/20' // Active state: Nền xám nhạt
                                    : 'bg-white dark:bg-dark text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/30' // Default state: Nền trắng
                                   }`}
                        >
                            <SiReact className="text-lg" />
                            <span className="font-medium">JSX</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('ts')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105
                            ${activeTab === 'ts'
                                    ? 'bg-gray-100 text-blue-400 dark:bg-blue-500/20 dark:text-blue-300 shadow-lg shadow-blue-500/20' // Active state: Nền xám nhạt
                                    : 'bg-white dark:bg-dark text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/30' // Default state: Nền trắng
                                   }`}
                        >
                            <SiTypescript className="text-lg" />
                            <span className="font-medium">TypeScript</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('js')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105
                                 ${activeTab === 'js'
                                    ? 'bg-gray-100 text-blue-400 dark:bg-blue-500/20 dark:text-blue-300 shadow-lg shadow-blue-500/20' // Active state: Nền xám nhạt
                                    : 'bg-white dark:bg-dark text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/30' // Default state: Nền trắng
                                   }`}
                        >
                            <SiJavascript className="text-lg" />
                            <span className="font-medium">Class</span>
                        </button>
                    </div>
                    <span>

                    </span>
                    <span>
                        
                    </span>
                    {/* <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:scale-110 transition-transform duration-300"
                    >
                        {isPlaying ? <FaPause className="text-white" /> : <FaPlay />}
                    </button> */}
                </div>

                {/* Code Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="relative bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl p-6 overflow-hidden"
                >
                    {/* Line Numbers */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-4 pt-6 text-gray-400 dark:text-gray-600 select-none border-r border-gray-200/20 dark:border-gray-700/30">
                        {codeExamples[activeTab].split('\n').map((_, i) => (
                            <div key={i} className="leading-6 text-sm font-mono">{i + 1}</div>
                        ))}
                    </div>

                    {/* Animated Code */}
                    <pre className="pl-12 overflow-x-auto">
                        <code className="text-sm leading-6 font-mono">
                            {codeExamples[activeTab].split('\n').map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="hover:bg-gray-100 dark:hover:bg-white/5 px-4 -mx-4 rounded-lg transition-colors duration-200"
                                >
                                    <span className="text-blue-600 dark:text-blue-400">{line.match(/^(const|function|class|interface)/) || ''}</span>
                                    <span className="text-purple-600 dark:text-purple-400">{line.match(/useState|useEffect|componentDidMount/) || ''}</span>
                                    <span className="text-green-600 dark:text-green-400">{line.match(/"([^"]+)"/) || ''}</span>
                                    <span className="text-yellow-600 dark:text-yellow-400">{line.match(/\{([^}]+)\}/) || ''}</span>
                                    <span className="text-gray-800 dark:text-gray-300">{line}</span>
                                </motion.div>
                            ))}
                        </code>
                    </pre>

                    {/* Enhanced Floating Particles */}
                    {isPlaying && (
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -200],
                                        x: [0, Math.random() * 100 - 50],
                                        opacity: [0, 0.8, 0],
                                        scale: [0, 1.5, 0],
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    }}
                                    className="absolute w-2 h-2 bg-blue-500/30 dark:bg-blue-400/30 rounded-full blur-lg"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        bottom: '0',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CodePreview;