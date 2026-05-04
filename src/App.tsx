import { useState, useMemo } from 'react';
import {
  BrainCircuit,
  Target,
  Users,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ChevronRight,
  RefreshCw,
  Award,
  BookMarked,
  GraduationCap,
  ShieldCheck,
  Zap,
  Menu,
  X,
  BookOpen,
  MessageCircle,
  Sparkles,
  FileCheck,
  AlertCircle,
  CreditCard
} from 'lucide-react';

// --- CONFIGURACIÓN DE INTERFAZ ---
const USICAMM_AREAS = [
  {
    id: 'area1',
    title: 'Área 1. Aspectos normativos',
    icon: <BookMarked size={20} />,
    color: 'text-blue-500'
  },
  {
    id: 'area2',
    title: 'Área 2. Gestión escolar / educativa',
    icon: <Target size={20} />,
    color: 'text-emerald-500'
  },
  {
    id: 'area3',
    title: 'Área 3. Relación con la comunidad',
    icon: <Users size={20} />,
    color: 'text-purple-500'
  }
];

const EDUCATIONAL_LEVELS = ['Preescolar', 'Primaria', 'Secundaria', 'Supervisión'];

interface Question {
  type: string;
  base: string;
  options: { id: string; text: string }[];
  correct: string;
  argumentation: string;
  aiTip: string;
}

export default function App() {
  const [activeLevel, setActiveLevel] = useState<string>('Primaria');
  const [activeAreaId, setActiveAreaId] = useState<string>('area1');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const activeArea = useMemo(
    () => USICAMM_AREAS.find(a => a.id === activeAreaId) || USICAMM_AREAS[0],
    [activeAreaId]
  );

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
    } catch (err: any) {
      setApiError(
        err.message ||
          'No se pudo conectar con el generador de reactivos. Revisa la configuración de Gemini en Vercel.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = () => {
    if (!selectedOption || isEvaluated || !currentQuestion) return;

    setIsEvaluated(true);

    const isCorrect = String(selectedOption) === String(currentQuestion.correct);

    setStats(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1
    }));
  };

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans text-slate-900 overflow-x-hidden text-balance">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-80 bg-[#0f172a] text-slate-300 flex flex-col z-50 transition-transform duration-300 transform ${
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
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          <section>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4 flex items-center gap-2">
              <GraduationCap size={14} /> Tu Perfil
            </h2>
            <div className="grid gap-2">
              {EDUCATIONAL_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => {
                    setActiveLevel(level);
                    setCurrentQuestion(null);
                    setIsEvaluated(false);
                    setApiError(null);
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
                  key={area.id}
                  onClick={() => {
                    setActiveAreaId(area.id);
                    setCurrentQuestion(null);
                    setIsEvaluated(false);
                    setApiError(null);
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
                  <span className="text-xs font-bold leading-tight">{String(area.title)}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="px-4">
            <div className="bg-gradient-to-b
