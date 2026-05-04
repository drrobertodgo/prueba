import { useState } from 'react';
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
  MessageCircle
} from 'lucide-react';

// --- CONFIGURACIÓN ---
const USICAMM_AREAS = [
  { id: 'area1', title: 'Área 1. Aspectos normativos', icon: <BookMarked size={20} />, color: 'text-blue-500' },
  { id: 'area2', title: 'Área 2. Gestión escolar / educativa', icon: <Target size={20} />, color: 'text-emerald-500' },
  { id: 'area3', title: 'Área 3. Relación con la comunidad', icon: <Users size={20} />, color: 'text-purple-500' }
];

const EDUCATIONAL_LEVELS = ['Preescolar', 'Primaria', 'Secundaria', 'Supervisión'];

const KNOWLEDGE_BASE = {
  general: `- Marco Legal: Art. 3° (Inclusiva), LGE, LGDNNA. - Salud/Seguridad: Acuerdo 30/09/24, 14/12/23, 17/05/25. - Gestión: Acuerdo 05/04/24 (CTE), PMC. - Autores: Bolívar, Weinstein, Molina Ruiz.`,
  supervision: `- Margarita Zorrilla (Transformación), Montse Ventura (Acompañar), David Vitte Viveros (Praxis).`
};

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
  const [activeArea, setActiveArea] = useState(USICAMM_AREAS[0]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchNewQuestion = async () => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsEvaluated(false);
    setErrorMsg('');
    setCurrentQuestion(null);
    setIsSidebarOpen(false);

    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const context = activeLevel === 'Supervisión' 
      ? `${KNOWLEDGE_BASE.general}\n${KNOWLEDGE_BASE.supervision}`
      : KNOWLEDGE_BASE.general;

    const promptText = `Eres Evaluador Senior de USICAMM. Genera UN reactivo inédito de opción múltiple (A, B, C) sobre un caso práctico para la función de "${activeLevel}" en el área de "${activeArea.title}". 
    BIBLIOGRAFÍA: ${context}
    RESPONDE SOLO JSON: {"type": "string", "base": "string", "options": [{"id": "A", "text": "string"}], "correct": "A", "argumentation": "string", "aiTip": "string"}`;

    let retries = 3;
    while (retries > 0) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        });
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = rawText.replace(/```json|```/g, '').trim();
        setCurrentQuestion(JSON.parse(cleanJson));
        setIsLoading(false);
        return;
      } catch (err) {
        retries--;
        if (retries === 0) {
          setErrorMsg('Error al conectar con la bibliografía. Intenta de nuevo.');
          setIsLoading(false);
        } else {
          await new Promise(res => setTimeout(res, 1000));
        }
      }
    }
  };

  const handleVerify = () => {
    if (!selectedOption || isEvaluated || !currentQuestion) return;
    setIsEvaluated(true);
    const correct = selectedOption === currentQuestion.correct;
    setStats(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  const getAccuracy = () => stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans text-slate-900 overflow-x-hidden">
      
      {/* SIDEBAR RESPONSIVO */}
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      
      <aside className={`fixed inset-y-0 left-0 w-80 bg-[#0f172a] text-slate-300 flex flex-col z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl"><BrainCircuit size={28} className="text-white" /></div>
            <div>
              <h1 className="text-2xl font-black text-white leading-none tracking-tighter">USICAMM<span className="text-emerald-400">AI</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Premium</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          <section>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4 flex items-center gap-2"><GraduationCap size={14}/> Rol a Evaluar</h2>
            <div className="grid gap-2">
              {EDUCATIONAL_LEVELS.map(l => (
                <button key={String(l)} onClick={() => { setActiveLevel(l); setCurrentQuestion(null); setIsEvaluated(false); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeLevel === l ? 'bg-emerald-500 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
                  {l === 'Supervisión' ? <Zap size={16} /> : <BookOpen size={16} />} {String(l)}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Área Temática</h2>
            <div className="space-y-2">
              {USICAMM_AREAS.map(a => (
                <button key={String(a.id)} onClick={() => { setActiveArea(a); setCurrentQuestion(null); setIsEvaluated(false); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all border-2 ${activeArea.id === a.id ? 'bg-slate-800 border-emerald-500 text-white shadow-lg' : 'border-transparent text-slate-500 hover:bg-slate-800/50'}`}>
                  <div className={activeArea.id === a.id ? 'text-emerald-400' : 'text-slate-600'}>{a.icon}</div>
                  <span className="text-xs font-bold leading-tight">{String(a.title)}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700 mb-4 text-center">
             <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Precisión</p>
             <span className="text-3xl font-black text-white">{getAccuracy()}%</span>
          </div>
          <a href="https://wa.me/526181518337" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl font-black text-xs hover:bg-[#128C7E] transition-all">
            <MessageCircle size={18} fill="currentColor"/> SOPORTE TÉCNICO
          </a>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col lg:ml-80">
        
        {/* MOBILE HEADER */}
        <header className="bg-white border-b p-4 flex items-center justify-between lg:hidden sticky top-0 z-30 shadow-sm">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-xl text-slate-600"><Menu size={24} /></button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase">Evaluando</span>
            <span className="text-xs font-bold text-emerald-600">{String(activeLevel)}</span>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-black text-emerald-600">{stats.correct}/{stats.total}</div>
        </header>

        <div className="max-w-4xl mx-auto w-full px-4 py-8 lg:p-12">
          
          {/* HEADER DESKTOP */}
          <div className="hidden lg:flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100"><ShieldCheck className="text-emerald-500" /></div>
              <div><h2 className="text-sm font-black text-slate-400 uppercase">Simulador Inteligente</h2><p className="text-xl font-bold text-slate-800">{String(activeLevel)} • {String(activeArea.title)}</p></div>
            </div>
            {activeLevel === 'Supervisión' && <div className="bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 border border-emerald-500/20"><Zap size={14} fill="currentColor"/> MÓDULO SUPERVISIÓN ACTIVO</div>}
          </div>

          {!currentQuestion && !isLoading && !errorMsg && (
            <div className="bg-white rounded-[2.5rem] p-10 lg:p-20 text-center shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in fade-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 border-2 border-slate-100 transform -rotate-3"><BrainCircuit size={48} className="text-emerald-500" /></div>
              <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Estudio Sin Límites</h3>
              <p className="text-slate-500 text-lg lg:text-xl mb-12 max-w-md mx-auto leading-relaxed">Generación infinita de casos prácticos basados en los 40 documentos oficiales 2026.</p>
              <button onClick={fetchNewQuestion} className="w-full lg:w-auto bg-[#0f172a] text-white px-12 py-5 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto">Generar Reactivo IA <ChevronRight size={28} /></button>
            </div>
          )}

          {isLoading && (
            <div className="py-20 text-center animate-in fade-in">
              <div className="relative w-24 h-24 mx-auto mb-10">
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800">Analizando Bibliografía Oficial...</h4>
              <p className="text-slate-400 mt-2 font-medium italic">Contextualizando caso para {String(activeLevel)}</p>
            </div>
          )}

          {errorMsg && <div className="p-12 bg-white rounded-[2.5rem] shadow-xl border border-red-100 text-center"><XCircle size={48} className="text-red-500 mx-auto mb-4" /><p className="text-red-800 text-lg font-bold mb-6">{String(errorMsg)}</p><button onClick={fetchNewQuestion} className="bg-red-500 text-white px-10 py-4 rounded-2xl font-bold">Reintentar Ahora</button></div>}

          {currentQuestion && !isLoading && (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-20">
              <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-8 lg:p-12 bg-slate-50/50 border-b border-slate-100 relative">
                  <div className="flex justify-between items-center mb-6">
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">{String(currentQuestion.type)}</span>
                    <Award className="text-amber-500" size={24} />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-medium leading-snug text-slate-800 whitespace-pre-line">{String(currentQuestion.base)}</h3>
                </div>
                <div className="p-8 lg:p-12 space-y-4">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const isCorrect = isEvaluated && opt.id === currentQuestion.correct;
                    const isWrong = isEvaluated && isSelected && opt.id !== currentQuestion.correct;
                    let style = "w-full text-left p-6 lg:p-8 rounded-[1.5rem] border-2 transition-all flex items-start gap-6 group ";
                    if (!isEvaluated) style += isSelected ? "border-[#0f172a] bg-[#0f172a] text-white shadow-2xl scale-[1.02]" : "border-slate-100 bg-white hover:border-emerald-200";
                    else if (isCorrect) style += "border-emerald-500 bg-emerald-50 text-emerald-900";
                    else if (isWrong) style += "border-red-500 bg-red-50 text-red-900";
                    else style += "opacity-30 grayscale border-slate-50";

                    return (
                      <button key={String(opt.id)} onClick={() => !isEvaluated && setSelectedOption(opt.id)} className={style} disabled={isEvaluated}>
                        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border-2 transition-all ${isSelected && !isEvaluated ? 'bg-white text-slate-900 border-white' : isCorrect ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 text-slate-400'}`}>{String(opt.id)}</div>
                        <span className="text-lg lg:text-xl font-medium flex-1 pt-1">{String(opt.text)}</span>
                        {isCorrect && <CheckCircle2 className="text-emerald-500 mt-1" size={28} />}
                        {isWrong && <XCircle className="text-red-500 mt-1" size={28} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {isEvaluated && (
                <div className="space-y-6 animate-in slide-in-from-top-6 duration-500">
                  <div className={`p-8 lg:p-10 rounded-[2.5rem] border-2 flex flex-col md:flex-row gap-8 ${selectedOption === currentQuestion.correct ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-inner ${selectedOption === currentQuestion.correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                      {selectedOption === currentQuestion.correct ? <CheckCircle2 size={36} /> : <XCircle size={36} />}
                    </div>
                    <div><h4 className="text-2xl font-black mb-3">Análisis Normativo:</h4><p className="text-slate-700 text-lg leading-relaxed">{String(currentQuestion.argumentation)}</p></div>
                  </div>
                  <div className="bg-[#0f172a] p-8 lg:p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-emerald-500/20 transition-all" />
                    <div className="flex items-center gap-4 mb-4"><Lightbulb className="text-emerald-400" size={32} fill="currentColor" /><h4 className="font-black text-emerald-400 uppercase tracking-widest text-lg">Estrategia IA</h4></div>
                    <p className="text-slate-300 text-xl font-medium italic leading-relaxed">"{String(currentQuestion.aiTip)}"</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-8">
                {!isEvaluated ? (
                  <button onClick={handleVerify} disabled={!selectedOption} className={`w-full lg:w-auto px-16 py-6 rounded-[2rem] font-black text-2xl shadow-2xl transition-all ${selectedOption ? 'bg-emerald-500 text-white hover:bg-emerald-600 scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Verificar Respuesta</button>
                ) : (
                  <button onClick={fetchNewQuestion} className="w-full lg:w-auto bg-[#0f172a] text-white px-16 py-6 rounded-[2rem] font-black text-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4"><RefreshCw size={28} /> Siguiente Caso</button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
