
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LESSONS } from './constants';
import { AppState, Lesson, Question, QuestionType } from './types';
import { 
  Candy, 
  IceCream, 
  Star, 
  ChevronRight, 
  Home, 
  RefreshCw, 
  Trophy,
  CheckCircle2,
  XCircle,
  Zap
} from 'lucide-react';

const CandyFloatingElements = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
    <div className="absolute top-[10%] left-[5%] floating-item text-pink-400"><Candy size={80} /></div>
    <div className="absolute top-[15%] right-[10%] floating-item text-blue-400" style={{animationDelay: '1s'}}><IceCream size={70} /></div>
    <div className="absolute bottom-[20%] left-[8%] floating-item text-yellow-400" style={{animationDelay: '2s'}}><Star size={90} /></div>
    <div className="absolute bottom-[10%] right-[12%] floating-item text-green-400" style={{animationDelay: '1.5s'}}><Zap size={70} /></div>
    
    <div className="absolute top-[35%] left-[1%] floating-item flex flex-col items-center">
      <span className="text-6xl">🐰</span>
      <span className="text-2xl -mt-2">🍬</span>
    </div>
    <div className="absolute top-[65%] right-[2%] floating-item flex flex-col items-center" style={{animationDelay: '2.5s'}}>
      <span className="text-6xl">🐱</span>
      <span className="text-2xl -mt-2">🍭</span>
    </div>
    <div className="absolute bottom-[8%] left-[15%] floating-item flex flex-col items-center" style={{animationDelay: '3.8s'}}>
      <span className="text-7xl">🐈</span>
      <span className="text-3xl -mt-3">🍫</span>
    </div>
    <div className="absolute top-[8%] right-[20%] floating-item flex flex-col items-center" style={{animationDelay: '0.8s'}}>
      <span className="text-7xl">🐇</span>
      <span className="text-3xl -mt-3">🍬</span>
    </div>
  </div>
);

// 糖果飛入動畫組件
const FlyingCandy = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 850);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed z-[100] pointer-events-none animate-candy-fly-arc" style={{ left: '50%', top: '50%' }}>
      <span className="text-6xl filter drop-shadow-2xl">🍬</span>
    </div>
  );
};

export default function App() {
  const [state, setState] = useState<AppState>(AppState.MENU);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isFlying, setIsFlying] = useState(false);
  const [boxWiggle, setBoxWiggle] = useState(false);

  const allLessons = useMemo(() => {
    const lessons = JSON.parse(JSON.stringify(LESSONS)) as Lesson[];
    const bonusIndex = lessons.findIndex((l: Lesson) => l.id === 'bonus');
    if (bonusIndex !== -1) {
      const pool = lessons.slice(0, 3).flatMap(l => l.questions);
      const mcPool = pool.filter(q => q.type === QuestionType.MC);
      const shuffled = [...mcPool].sort(() => 0.5 - Math.random()).slice(0, 20);
      lessons[bonusIndex].questions = shuffled;
    }
    return lessons;
  }, []);

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentQuestionIndex(0);
    setScore(0);
    setState(AppState.LESSON);
    setShowFeedback(false);
    setUserAnswer('');
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setUserAnswer('');
    if (activeLesson && currentQuestionIndex < activeLesson.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setState(AppState.SUMMARY);
    }
  };

  const handleAnswer = (answer: string) => {
    if (showFeedback || !answer.trim()) return;
    const currentQuestion = activeLesson?.questions[currentQuestionIndex];
    const isCorrect = answer.trim().toLowerCase() === currentQuestion?.correctAnswer.trim().toLowerCase();
    
    setIsLastAnswerCorrect(isCorrect);
    setUserAnswer(answer);
    
    if (isCorrect) {
      setIsFlying(true); 
    }
    
    setShowFeedback(true);

    if (isCorrect) {
      // 延遲跳轉，讓動畫跑完
      setTimeout(() => nextQuestion(), 1400);
    }
  };

  const handleFlyComplete = () => {
    setIsFlying(false);
    setScore(prev => prev + 1);
    setBoxWiggle(true);
    setTimeout(() => setBoxWiggle(false), 500);
  };

  const resetToMenu = () => {
    setState(AppState.MENU);
    setActiveLesson(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-[#FFF9FA]">
      <style>{`
        @keyframes candy-fly-arc {
          0% { 
            transform: translate(-50%, -50%) scale(1) rotate(0deg); 
            opacity: 1; 
          }
          30% { 
            transform: translate(-80%, -200%) scale(1.6) rotate(45deg); 
            opacity: 1; 
          }
          60% {
            transform: translate(calc(25vw - 50px), calc(-30vh - 100px)) scale(1.2) rotate(180deg);
            opacity: 1;
          }
          100% { 
            transform: translate(calc(50vw - 120px), calc(-50vh + 100px)) scale(0.1) rotate(480deg); 
            opacity: 0; 
          }
        }
        .animate-candy-fly-arc {
          animation: candy-fly-arc 0.85s cubic-bezier(0.42, 0, 0.58, 1) forwards;
        }
        .box-wiggle {
          animation: wiggle 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        @keyframes wiggle {
          10%, 90% { transform: translate3d(-1px, 0, 0) rotate(-5deg); }
          20%, 80% { transform: translate3d(2px, 0, 0) rotate(8deg); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0) rotate(-10deg) scale(1.2); }
          40%, 60% { transform: translate3d(4px, 0, 0) rotate(10deg) scale(1.2); }
        }
      `}</style>

      <CandyFloatingElements />
      
      {isFlying && <FlyingCandy onComplete={handleFlyComplete} />}

      <div className="max-w-4xl w-full relative z-20">
        {state === AppState.MENU && (
          <div className="candy-container p-8 md:p-14 animate-in fade-in duration-500 border-pink-100">
            <header className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 border-4 border-pink-200 shadow-lg">
                <span className="text-6xl">🐰</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-[900] text-pink-600 mb-4 tracking-tighter">
                五下拼音糖果屋
              </h1>
              <p className="text-lg md:text-xl font-bold text-pink-400 opacity-90">🍬 第一至三課：拼音大挑戰 🐱</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allLessons.map((lesson: Lesson, idx: number) => (
                <button
                  key={lesson.id}
                  onClick={() => handleStartLesson(lesson)}
                  className={`group relative flex flex-col p-8 text-left transition-all btn-candy-pop border-b-8
                    ${idx === 0 ? 'bg-[#FF85A1] text-white border-pink-700 shadow-pink-200' : ''}
                    ${idx === 1 ? 'bg-[#7AE7C7] text-white border-green-700 shadow-green-200' : ''}
                    ${idx === 2 ? 'bg-[#FFB347] text-white border-orange-700 shadow-orange-200' : ''}
                    ${idx === 3 ? 'bg-[#D0BFFF] text-white border-purple-700 shadow-purple-200' : ''}
                  `}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-white/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">Level 0{idx + 1}</span>
                  </div>
                  <h3 className="text-2xl font-black mb-3">{lesson.title}</h3>
                  <p className="font-bold opacity-90 text-sm leading-relaxed mb-6">{lesson.description}</p>
                  <div className="mt-auto flex items-center justify-between font-black">
                    <span className="text-sm">進入商店 🐰</span>
                    <ChevronRight size={24} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </button>
              ))}
            </div>

            <footer className="mt-12 text-center text-pink-300 font-bold flex items-center justify-center gap-6">
               <div className="h-[2px] flex-1 bg-pink-100"></div>
               <span className="text-3xl">🐱</span>
               <span className="text-sm md:text-base uppercase tracking-widest font-black">Happy Learning</span>
               <span className="text-3xl">🐰</span>
               <div className="h-[2px] flex-1 bg-pink-100"></div>
            </footer>
          </div>
        )}

        {state === AppState.LESSON && activeLesson && (
          <div className="candy-container p-6 md:p-12 min-h-[600px] flex flex-col animate-in pop-in relative">
            
            {/* 糖果箱 UI */}
            <div className={`fixed top-8 right-8 z-50 flex flex-col items-center transition-all ${boxWiggle ? 'box-wiggle' : ''}`}>
               <div className="relative group">
                  <div className="absolute -inset-6 bg-pink-200 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                  <div className="bg-white border-4 border-pink-400 p-5 rounded-[30px] shadow-2xl relative flex flex-col items-center min-w-[120px]">
                    <span className="text-5xl mb-2 filter drop-shadow-md">🎁</span>
                    <div className="bg-pink-500 text-white px-5 py-1.5 rounded-full text-2xl font-black shadow-lg">
                      {score}
                    </div>
                    <span className="text-xs font-black text-pink-400 mt-2 uppercase tracking-widest">Candy Box</span>
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center mb-8 bg-pink-50/50 p-6 rounded-[35px] border-2 border-pink-100">
              <button 
                onClick={resetToMenu}
                className="btn-candy-pop bg-white px-5 py-2.5 text-pink-500 font-black flex items-center gap-2 border-2 border-pink-200"
              >
                <Home size={20} /> <span className="hidden md:inline">回商店街 🐱</span>
              </button>
              
              <div className="text-center flex-1 mx-4">
                <h2 className="text-xl md:text-2xl font-black text-pink-600 mb-2 truncate">{activeLesson.title}</h2>
                <div className="progress-candy w-32 md:w-64 mx-auto">
                   <div 
                     className="progress-fill" 
                     style={{ width: `${((currentQuestionIndex + 1) / activeLesson.questions.length) * 100}%` }}
                   ></div>
                </div>
              </div>

              <div className="text-sm font-black text-pink-400 bg-white px-4 py-2 rounded-full border-2 border-pink-50 min-w-[80px] text-center">
                {currentQuestionIndex + 1} / {activeLesson.questions.length}
              </div>
            </div>

            <div className="flex-grow flex flex-col justify-center max-w-2xl mx-auto w-full">
              <div className="mb-10 text-center">
                {activeLesson.questions[currentQuestionIndex].context && (
                  <div className="inline-block px-8 py-3 bg-pink-100/50 text-pink-600 rounded-full font-black text-xl mb-6 border-2 border-pink-200">
                    {activeLesson.questions[currentQuestionIndex].context}
                  </div>
                )}
                <h3 className="text-3xl md:text-4xl font-black text-[#4D2D52] leading-tight">
                  {activeLesson.questions[currentQuestionIndex].prompt}
                </h3>
              </div>

              <div className="space-y-4 mb-10">
                <div className="grid grid-cols-1 gap-4">
                  {activeLesson.questions[currentQuestionIndex].options?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={showFeedback}
                      className={`w-full p-6 text-left rounded-[30px] border-4 transition-all text-xl font-black flex justify-between items-center btn-candy-pop
                        ${showFeedback 
                          ? option.id === activeLesson.questions[currentQuestionIndex].correctAnswer 
                            ? 'bg-green-500 border-green-600 text-white shadow-lg' 
                            : userAnswer === option.id 
                              ? 'bg-red-500 border-red-600 text-white shake-incorrect' 
                              : 'opacity-20 border-gray-200'
                          : 'bg-white border-pink-100 hover:border-pink-300 text-[#4D2D52] shadow-sm'
                        }`}
                    >
                      <span className="flex items-center gap-5">
                        <span className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-black shadow-sm text-lg
                          ${showFeedback && option.id === activeLesson.questions[currentQuestionIndex].correctAnswer ? 'bg-white text-green-500' : 'bg-pink-100 text-pink-500'}`}>
                          {option.id}
                        </span> 
                        {option.text}
                      </span>
                      {showFeedback && option.id === activeLesson.questions[currentQuestionIndex].correctAnswer && <CheckCircle2 className="text-white" size={32} />}
                      {showFeedback && userAnswer === option.id && option.id !== activeLesson.questions[currentQuestionIndex].correctAnswer && <XCircle className="text-white" size={32} />}
                    </button>
                  ))}
                </div>
              </div>

              {showFeedback && (
                <div className={`p-8 rounded-[40px] mb-4 border-4 animate-in pop-in shadow-xl ${isLastAnswerCorrect ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
                  <div className="flex items-center gap-6">
                    <div className="shrink-0 scale-150">
                      {isLastAnswerCorrect ? <span className="text-5xl">🐰</span> : <span className="text-5xl">😿</span>}
                    </div>
                    <div className="flex-grow">
                      <p className="text-2xl font-black">
                        {isLastAnswerCorrect ? '答對啦！糖果跳進去囉 🍬' : `差一點點！答案是：${activeLesson.questions[currentQuestionIndex].correctAnswer}`}
                      </p>
                    </div>
                    {!isLastAnswerCorrect && (
                      <button 
                        onClick={nextQuestion}
                        className="btn-candy-pop bg-pink-500 text-white px-10 py-4 font-black shadow-lg text-xl"
                      >
                        下一關 🐰
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {state === AppState.SUMMARY && activeLesson && (
          <div className="candy-container p-12 md:p-20 text-center animate-in pop-in border-pink-100">
            <div className="relative z-10">
              <div className="flex justify-center mb-10 gap-8">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-6xl floating-item shadow-lg border-4 border-pink-50">🐰</div>
                <div className="w-32 h-32 bg-yellow-400 rounded-full border-8 border-white shadow-2xl flex items-center justify-center">
                  <Trophy size={64} className="text-white" />
                </div>
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-6xl floating-item shadow-lg border-4 border-pink-50" style={{animationDelay: '1.2s'}}>🐱</div>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black text-pink-600 mb-6 tracking-tighter">挑戰成功！</h2>
              <div className="inline-block px-12 py-5 bg-pink-100 rounded-full border-4 border-pink-200 mb-14 shadow-inner">
                <p className="text-2xl text-pink-500 font-black">
                   完成度：{activeLesson.title}
                </p>
              </div>
              
              <div className="flex flex-col items-center justify-center gap-10 mb-20">
                <div className="bg-white p-16 rounded-full border-[15px] border-pink-400 shadow-2xl relative">
                  <div className="absolute -top-8 -right-8 animate-pulse text-yellow-500"><Star size={56} fill="currentColor" /></div>
                  <span className="text-9xl font-[950] text-pink-500 leading-none">
                    {Math.round((score / activeLesson.questions.length) * 100)}
                  </span>
                  <span className="text-2xl text-pink-300 font-black ml-3 uppercase">Score</span>
                </div>
                <p className="text-2xl font-black text-[#4D2D52] bg-pink-50/50 px-10 py-4 rounded-full border border-pink-100">
                  收穫滿滿！一共獲得 {score} 顆糖果 🍭
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                  onClick={() => handleStartLesson(activeLesson)}
                  className="btn-candy-pop flex items-center justify-center gap-3 px-12 py-6 bg-white border-4 border-pink-400 text-pink-500 font-black text-2xl shadow-lg"
                >
                  <RefreshCw size={28} /> 再玩一次
                </button>
                <button 
                  onClick={resetToMenu}
                  className="btn-candy-pop flex items-center justify-center gap-3 px-12 py-6 bg-pink-500 text-white font-black text-2xl shadow-lg border-b-8 border-pink-700"
                >
                  <Home size={28} /> 關閉商店 🐰
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
