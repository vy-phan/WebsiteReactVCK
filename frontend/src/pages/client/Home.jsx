import React, { Suspense } from 'react';
import { AiFillCode } from "react-icons/ai";
import { SiReact, SiRedux } from "react-icons/si";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { useTheme } from '../../context/ThemeContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import Meta from '../../components/meta';


// Lazy load các components không cần thiết ngay lập tức
const FeedBack = React.lazy(() => import('../../components/FeedBack'));
const ScrollingCards = React.lazy(() => import('../../components/ScrollingCards'));
const CodePreview = React.lazy(() => import('../../components/CodePreview'));

const animations = {
  container: {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  },
  letter: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  },
  codeContainer: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }
};

const codeContainer = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

// Tách Hero section thành component riêng
const Hero = React.memo(({ isDarkMode }) => {
  const { t } = useTranslation();

  return (
    <div className="col-span-1 lg:col-span-5 p-4 sm:p-6 lg:p-7 space-y-6 sm:space-y-8">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
      >
        <TypeAnimation
          sequence={[
            1000,
            t('homeTitle1'),
            1000,
            t('homeTitle2'),
            1000,
            t('homeTitle3'),
            1000,
            t('homeTitle4'),
          ]}
          wrapper="span"
          cursor={true}
          repeat={1}
          className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
          speed={{ type: 'keyStrokeDelayInMs', value: 100 }}
        />
      </motion.h1>
      <StartButton isDarkMode={isDarkMode} />
      <FeatureCard isDarkMode={isDarkMode} />
    </div>
  );
});

// Tách Start Button thành component riêng
const StartButton = React.memo(() => {
  const { t } = useTranslation();

  return (
    <div className='mt-4 sm:mt-6 lg:mt-8'>
      <Link to="/courses" className='w-full sm:w-auto text-white'>
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="relative text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 
          overflow-hidden transition-all duration-300 ease-in-out 
          shadow-md shadow-blue-500/50 hover:shadow-lg hover:shadow-purple-500/70 
          hover:scale-105 hover:text-xl
          before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full 
          before:bg-white/20 before:skew-x-[-30deg] before:transition-all before:duration-500 
          hover:before:left-[100%]"
        >
          {t('homeButton')}
        </motion.button>
      </Link>
    </div>
  );
});

// Tách Feature Card thành component riêng
const FeatureCard = React.memo(({ isDarkMode }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className={`${isDarkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-white/80 border-gray-200'} 
      p-4 sm:p-6 lg:p-8 rounded-xl border backdrop-blur-sm hover:border-blue-500/50 transition-colors duration-300 shadow-lg`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <AiFillCode className="text-4xl text-blue-500" />
        </div>
        <div>
          <h3 className="font-medium text-blue-500">{t('homeTitleFeature')}</h3>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t('homeFeature').split(' / ')[0]} <br />
            {t('homeFeature').split(' / ')[1]}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

const Home = () => {
  const { isDarkMode } = useTheme();
  const { i18n,t } = useTranslation();

  return (
    <div className={`min-h-screen ${isDarkMode
      ? 'bg-gradient-to-br from-gray-900 to-black text-white'
      : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900'
      } pt-4 sm:pt-6 md:pt-8`}>
      {/* Nhúng Meta component ở đầu trang Home */}
      <Meta
        title={t('homeMetaTitle')} // Sử dụng translation cho title
        description={t('homeMetaDescription')} // Sử dụng translation cho description
        keywords={t('homeMetaKeywords')} // Sử dụng translation cho keywords
      />
      <div className="mt-9 pt-9 px-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 max-w-8xl mx-auto">
        <Hero key={i18n.language} isDarkMode={isDarkMode} />

        <motion.div
          variants={animations.codeContainer}
          initial="hidden"
          animate="visible"
          className="col-span-1 lg:col-span-7 p-4 space-y-4 sm:space-y-6"
        >
          {/* Component Type snippet */}
          <motion.div
            variants={codeContainer}
            className={`${isDarkMode ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'} rounded-xl p-4 sm:p-6 transition-colors duration-300 shadow-lg overflow-x-auto border border-gray-200`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-lg sm:text-xl text-cyan-600"><SiReact /></div>
              <span className="text-sm font-medium text-cyan-600">Component Type</span>
            </div>
            <pre className={`text-xs sm:text-sm font-mono whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              <span className="text-blue-400">// Function Component</span>
              <br />
              <span className="text-pink-400">const</span> Button = () {"=>"} <span className="text-gray-400">{"<button>Click Me</button>"}</span>
              <br /><br />

              <span className="text-blue-400">// Class Component</span>
              <br />
              <span className="text-pink-400">class</span> Header <span className="text-pink-400">extends</span> React.Component {"{"}
              <br />
              {"  render = () => "}<span className="text-gray-400">{"<h1>Welcome!</h1>"}</span>
              <br />
              {"}"}
              <br /><br />

              <span className="text-blue-400">// HOC Pattern</span>
              <br />
              <span className="text-pink-400">const</span> withBorder = {"(Comp) => (props) => "}
              <br />
              <span className="text-gray-400">&nbsp;&nbsp;{"<div className='border'><Comp {...props} /></div>"}</span>
            </pre>
          </motion.div>

          {/* React Hook snippet */}
          <motion.div
            variants={codeContainer}
            className={`${isDarkMode ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'} rounded-xl p-4 sm:p-6 transition-colors duration-300 shadow-lg overflow-x-auto border border-gray-200`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-lg sm:text-xl text-cyan-600"><SiReact /></div>
              <span className="text-sm font-medium text-cyan-600">React Hook</span>
            </div>
            <pre className={`text-xs sm:text-sm font-mono whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              <span className="text-blue-400">const</span> [count, setCount] ={" "}
              <span className="text-yellow-400">useState</span>(0);
              <br />
              <span className="text-yellow-400">useEffect</span>(() =&gt; {"{"}
              console.log(count);
              {"}"}, [count]);
              <br />
              <span className="text-blue-400">return</span> (
              <span className="text-gray-400">&lt;button onClick={"{"}() =&gt; setCount(count + 1){"}"}&gt;</span>
              {" "}Increase{" "}
              <span className="text-gray-400">&lt;/button&gt;</span>);
            </pre>
          </motion.div>


          {/* State Management snippet */}
          <motion.div
            variants={codeContainer}
            className={`${isDarkMode ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'} rounded-xl p-4 sm:p-6 transition-colors duration-300 shadow-lg overflow-x-auto border border-gray-200`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-lg sm:text-xl text-orange-600"><SiRedux /></div>
              <span className="text-sm font-medium text-orange-600">State Management</span>
            </div>
            <pre className={`text-xs sm:text-sm font-mono whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              <span className="text-blue-400">const</span> [count, setCount] ={" "}
              <span className="text-yellow-400">useState</span>(0);
              <br />
              <span className="text-blue-400">const</span> theme ={" "}
              <span className="text-yellow-400">useContext</span>(ThemeContext);
              <br />
              <span className="text-blue-400">const</span> [state, dispatch] ={" "}
              <span className="text-yellow-400">useReducer</span>(reducer, initialState);
              <br />
              <br />
              <span className="text-gray-400">{"// Global state example (Redux)"}</span>
              <br />
              <span className="text-blue-400">const</span> value ={" "}
              <span className="text-yellow-400">useSelector</span>(state =&gt; state.value);
              <br />
              <span className="text-yellow-400">useDispatch</span>()({"{"} type:{" "}
              <span className="text-green-400">"INCREMENT"</span> {"}"});
            </pre>
          </motion.div>

        </motion.div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <ScrollingCards />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <CodePreview />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <FeedBack />
      </Suspense>


    </div>
  );
};

export default React.memo(Home);