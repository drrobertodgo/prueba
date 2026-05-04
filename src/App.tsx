import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Award,
  BookMarked,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  GraduationCap,
  Lightbulb,
  Menu,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  XCircle,
  Zap
} from 'lucide-react';

const USICAMM_AREAS = [
  {
    id: 'area1',
    title: 'Área 1. Aspectos normativos',
    icon: <BookMarked size={20} />
  },
  {
    id: 'area2',
    title: 'Área 2. Gestión escolar / educativa',
    icon: <Target size={20} />
  },
  {
    id: 'area3',
    title: 'Área 3. Relación con la comunidad',
    icon: <Users size={20} />
  }
];

const EDUCATIONAL_LEVELS = ['Preescolar', 'Primaria', 'Secundaria', 'Supervisión'];

interface Question {
  type: string;
  base: string;
  options: {
    id: string;
    text: string;
  }[];
  correct: string;
  argumentation: string;
  aiTip: string;
}

export default function App() {
  const [activeLevel, setActiveLevel] = useState<string>('Primaria');
  const [activeAreaId, setActiveAreaId] = useState<string>('area1');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const activeArea = useMemo(() => {
    return USICAMM_AREAS.find(area => area.id === activeAreaId) || USICAMM_AREAS[0];
  }, [activeAreaId]);

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  const resetQuestionState = () => {
    setCurrentQuestion(null);
    setSelectedOption(null);
    setIsEvaluated(false);
    setApiError(null);
  };

  const fetchNewQuestion = async () => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsEvaluated(false);
    setApiError(null);
    setCurrentQuestion(null);
    setIsSidebarOpen(false);

    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activeLevel,
          activeAreaTitle: activeArea.title
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo generar el reactivo.');
      }

      if (!data.base || !Array.isArray(data.options) || !data.correct) {
        throw new Error('El reactivo recibido no tiene el formato esperado.');
      }

      setCurrentQuestion(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el generador de reactivos. Revisa la configuración de Gemini en Vercel.';

      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = () => {
    if (!selectedOption || isEvaluated || !currentQuestion) {
      return;
    }

    setIsEvaluated(true);

    const isCorrect = selectedOption === currentQuestion.correct;

    setStats(previousStats => ({
      correct: previousStats.correct + (isCorrect ? 1 : 0),
      total: previousStats.total + 1
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans text-slate-900 overflow-x-hidden">
      {isSidebarOpen ? (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 w-80 bg-[#0f172a] text-slate-300 flex flex-col z-50 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-8 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
              <BrainCircuit size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-black leading-none tracking-tighter">
                USICAMM<span className="text-emerald-400">AI</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest leading-none">
                Motor Generativo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400"
          >
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          <section>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4 flex items-center gap-2">
              <GraduationCap size={14} />
              Tu Perfil
            </h2>

            <div className="grid gap-2">
              {EDUCATIONAL_LEVELS.map(level => (
                <button
                  type="button"
                  key={level}
                  onClick={() => {
                    setActiveLevel(level);
                    resetQuestionState();
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeLevel === level
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  {level === 'Supervisión' ? <Zap size={16} /> : <BookOpen size={16} />}
                  {level}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">
              Áreas de Estudio
            </h2>

            <div className="space-y-2">
              {USICAMM_AREAS.map(area => (
                <button
                  type="button"
                  key={area.id}
                  onClick={() => {
                    setActiveAreaId(area.id);
                    resetQuestionState();
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all border-2 ${
                    activeAreaId === area.id
                      ? 'bg-slate-800 border-emerald-500 text-white shadow-lg'
                      : 'border-transparent text-slate-500 hover:bg-slate-800/50'
                  }`}
                >
                  <div className={activeAreaId === area.id ? 'text-emerald-400' : 'text-slate-600'}>
                    {area.icon}
                  </div>
                  <span className="text-xs font-bold leading-tight">{area.title}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="px-4">
            <div className="bg-gradient-to-br from-amber-400/10 to-amber-600/10 border border-amber-500/20 rounded-2xl p-4">
              <p className="text-[10px] font-black text-amber-600 uppercase mb-2">
                Próximamente
              </p>

              <p className="text-xs text-slate-400 leading-tight mb-3">
                Generador de exámenes en PDF y reportes personalizados por área.
              </p>

              <button
                type="button"
                className="w-full py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-amber-600 transition-all"
              >
                Ver avance
              </button>
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700 mb-4 text-center">
            <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest leading-none">
              Rendimiento
            </p>
            <span className="text-3xl font-black text-white">{accuracy}%</span>
          </div>

          <a
            href="https://wa.me/526181518337"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl font-black text-xs hover:bg-[#128C7E] transition-all"
          >
            <MessageCircle size={18} fill="currentColor" />
            CONTACTAR SOPORTE
          </a>
        </div>
      </aside>

      <main className="flex-1 flex flex-col lg:ml-80">
        <header className="bg-white border-b p-4 flex items-center justify-between lg:hidden sticky top-0 z-30 shadow-sm">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-slate-100 rounded-xl text-slate-600"
          >
            <Menu size={24} />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              USICAMM AI
            </span>
            <span className="text-xs font-bold text-emerald-600 leading-none mt-1">
              {activeLevel}
            </span>
          </div>

          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-black text-emerald-600 shadow-inner">
            {stats.correct}/{stats.total}
          </div>
        </header>

        <div className="max-w-4xl mx-auto w-full px-4 py-8 lg:p-12">
          <div className="hidden lg:flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 shadow-slate-200/50">
                <ShieldCheck className="text-emerald-500" />
              </div>

              <div>
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">
                  Simulador Inteligente
                </h2>
                <p className="text-xl font-bold text-slate-800 mt-1">
                  {activeLevel} • {activeArea.title}
                </p>
              </div>
            </div>

            <div className="bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black flex items-center gap-2 border border-emerald-500/20">
              <FileCheck size={14} />
              BIBLIOGRAFÍA BASE INTEGRADA
            </div>
          </div>

          {!currentQuestion && !isLoading && !apiError ? (
            <div className="bg-white rounded-[2.5rem] p-10 lg:p-20 text-center shadow-2xl border border-slate-100">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 border-2 border-slate-100 shadow-inner">
                <BrainCircuit size={48} className="text-emerald-500" />
              </div>

              <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-none">
                Generación Ilimitada 2026
              </h3>

              <p className="text-slate-500 text-lg lg:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
                Estudia con casos prácticos generados por IA a partir de principios normativos y pedagógicos de la educación mexicana.
              </p>

              <button
                type="button"
                onClick={fetchNewQuestion}
                className="w-full lg:w-auto bg-[#0f172a] text-white px-12 py-5 rounded-[2.5rem] font-black text-xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-4 mx-auto"
              >
                <Sparkles size={24} />
                Empezar Entrenamiento
                <ChevronRight size={24} />
              </button>
            </div>
          ) : null}

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="relative w-24 h-24 mx-auto mb-10 text-emerald-500 animate-spin">
                <RefreshCw size={96} />
              </div>

              <h4 className="text-3xl font-black text-slate-800 tracking-tighter">
                Gemini está pensando...
              </h4>

              <p className="text-slate-400 mt-2 font-medium italic">
                Generando un caso práctico para {activeLevel}
              </p>
            </div>
          ) : null}

          {apiError ? (
            <div className="bg-white rounded-[2.5rem] p-10 lg:p-16 text-center border-2 border-red-100 shadow-xl">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={48} />
              </div>

              <h3 className="text-2xl font-black text-red-900 mb-4 leading-tight uppercase tracking-tighter">
                No se pudo generar el reactivo
              </h3>

              <p className="text-red-700 text-lg mb-10 max-w-md mx-auto">
                {apiError}
              </p>

              <button
                type="button"
                onClick={fetchNewQuestion}
                className="bg-red-600 text-white px-10 py-4 rounded-[1.5rem] font-black text-lg hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-3 mx-auto shadow-red-200"
              >
                <RefreshCw size={24} />
                Reintentar Ahora
              </button>
            </div>
          ) : null}

          {currentQuestion && !isLoading ? (
            <div className="space-y-8 pb-20">
              <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-8 lg:p-12 bg-slate-50/50 border-b border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                      {currentQuestion.type}
                    </span>
                    <Award className="text-amber-500" size={24} />
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-medium leading-snug text-slate-800 whitespace-pre-line">
                    {currentQuestion.base}
                  </h3>
                </div>

                <div className="p-8 lg:p-12 space-y-4">
                  {currentQuestion.options.map(option => {
                    const isSelected = selectedOption === option.id;
                    const isCorrect = isEvaluated && option.id === currentQuestion.correct;
                    const isWrong = isEvaluated && isSelected && option.id !== currentQuestion.correct;

                    let optionStyle =
                      'w-full text-left p-6 lg:p-8 rounded-[1.5rem] border-2 transition-all flex items-start gap-6 group ';

                    if (!isEvaluated) {
                      optionStyle += isSelected
                        ? 'border-[#0f172a] bg-[#0f172a] text-white shadow-2xl scale-[1.01]'
                        : 'border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30';
                    } else if (isCorrect) {
                      optionStyle += 'border-emerald-500 bg-emerald-50 text-emerald-900';
                    } else if (isWrong) {
                      optionStyle += 'border-red-500 bg-red-50 text-red-900';
                    } else {
                      optionStyle += 'border-slate-100 bg-white opacity-40 grayscale text-slate-500';
                    }

                    return (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() => {
                          if (!isEvaluated) {
                            setSelectedOption(option.id);
                          }
                        }}
                        className={optionStyle}
                        disabled={isEvaluated}
                      >
                        <div
                          className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border-2 transition-all ${
                            isSelected && !isEvaluated
                              ? 'bg-white text-slate-900 border-white'
                              : isCorrect
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {option.id}
                        </div>

                        <span className="text-lg lg:text-xl font-medium flex-1 pt-1 leading-tight">
                          {option.text}
                        </span>

                        {isCorrect ? (
                          <CheckCircle2 className="text-emerald-500 mt-1 shrink-0" size={28} />
                        ) : null}

                        {isWrong ? (
                          <XCircle className="text-red-500 mt-1 shrink-0" size={28} />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {isEvaluated ? (
                <div className="space-y-6">
                  <div
                    className={`p-8 lg:p-12 rounded-[2.5rem] border-2 flex flex-col md:flex-row gap-8 shadow-sm ${
                      selectedOption === currentQuestion.correct
                        ? 'bg-emerald-50/50 border-emerald-100'
                        : 'bg-red-50/50 border-red-100'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-inner ${
                        selectedOption === currentQuestion.correct
                          ? 'bg-emerald-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {selectedOption === currentQuestion.correct ? (
                        <CheckCircle2 size={36} />
                      ) : (
                        <XCircle size={36} />
                      )}
                    </div>

                    <div>
                      <h4
                        className={`text-2xl font-black mb-3 ${
                          selectedOption === currentQuestion.correct
                            ? 'text-emerald-800'
                            : 'text-red-800'
                        }`}
                      >
                        {selectedOption === currentQuestion.correct
                          ? '¡Sustento Correcto!'
                          : 'Decisión Incorrecta'}
                      </h4>

                      <p className="text-slate-700 text-lg leading-relaxed">
                        {currentQuestion.argumentation}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#0f172a] p-8 lg:p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-emerald-500/20 transition-all" />

                    <div className="flex items-center gap-4 mb-4">
                      <Lightbulb className="text-emerald-400" size={32} fill="currentColor" />
                      <h4 className="font-black text-emerald-400 uppercase tracking-widest text-lg leading-none">
                        Estrategia del Tutor
                      </h4>
                    </div>

                    <p className="text-slate-300 text-xl font-medium italic leading-relaxed">
                      {currentQuestion.aiTip}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end pt-8">
                {!isEvaluated ? (
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={!selectedOption}
                    className={`w-full lg:w-auto px-16 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all ${
                      selectedOption
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600 scale-105'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Verificar Respuesta
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={fetchNewQuestion}
                    className="w-full lg:w-auto bg-[#0f172a] text-white px-16 py-6 rounded-[2.5rem] font-black text-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4 shadow-slate-900/40"
                  >
                    <RefreshCw size={28} />
                    Siguiente Reactivo
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
