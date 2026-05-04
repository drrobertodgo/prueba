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
  BookOpen,
  Menu,
  X
} from 'lucide-react';

// --- CONFIGURACIÓN ---
const USICAMM_AREAS = [
  { id: 'area1', title: 'Área 1. Aspectos normativos', icon: <BookMarked size={20} />, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
  { id: 'area2', title: 'Área 2. Gestión escolar / educativa', icon: <Target size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  { id: 'area3', title: 'Área 3. Relación con la comunidad', icon: <Users size={20} />, color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200' }
];

const EDUCATIONAL_LEVELS = ['Preescolar', 'Primaria', 'Secundaria', 'Supervisión'];

const GENERAL_KNOWLEDGE = `- Marco Legal: Art. 3°, LGE (NEM), LGDNNA. - Salud: Acuerdo 30/09/24. - Seguridad: Acuerdo 14/12/23 y 17/05/25. - Gestión: Acuerdo 05/04/24, PMC. - Autores: Bolívar, Weinstein, Molina Ruiz.`;
const SUPERVISION_KNOWLEDGE = `- Margarita Zorrilla (Transformación), Montse Ventura (Asesorar es acompañar), David Vitte (Praxis crítica).`;

interface Question {
  type: string;
  base: string;
  options: { id: string; text: string }[];
  correct: string;
  argumentation: string;
  aiTip: string;
}

export default function App() {
  // Estados de la App
  const [activeLevel, setActiveLevel] = useState(EDUCATIONAL_LEVELS[1]); 
  const [activeArea, setActiveArea] = useState(USICAMM_AREAS[0]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  
  // Estado para Menú Móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchNewQuestion = async (areaTitle: string, level: string) => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsEvaluated(false);
    setErrorMsg('');
    setCurrentQuestion(null);
    setIsSidebarOpen(false); // Cerrar menú al generar

    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const knowledge = level === 'Supervisión' 
      ? `${GENERAL_KNOWLEDGE}\nBIBLIOGRAFÍA SUPERVISIÓN: ${SUPERVISION_KNOWLEDGE}` 
      : GENERAL_KNOWLEDGE;

    const promptText = `Eres el Evaluador Nacional USICAMM. Genera UN reactivo inédito de opción múltiple (A, B, C) sobre caso práctico para "${level}" en "${areaTitle}". 
    BIBLIOGRAFÍA: ${knowledge}
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
        const resText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!resText) throw new Error();
        setCurrentQuestion(JSON.parse(resText.replace(/```json|```/g, '').trim()));
        setIsLoading(false);
        return;
      } catch (err) {
        retries--;
        if (retries === 0) {
          setErrorMsg('Motor saturado. Intenta de nuevo.');
          setIsLoading(false);
        } else {
          await new Promise(r => setTimeout(r, 1500));
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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans text-slate-900">
      
      {/* OVERLAY PARA MÓVIL (Cierra el menú al tocar fuera) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR RESPONSIVO */}
      <aside className={`
        fixed inset-y-0 left-0 w-80 bg-[#0f172a] text-slate-300 flex flex-col z-50 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl"><BrainCircuit size={24} className="text-white" /></div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white leading-none">USICAMM<span className="text-emerald-400">AI</span></h1>
              <p className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mt-1">Versión Pro</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <section>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4 flex items-center gap-2"><GraduationCap size={14}/> Rol Profesional</h2>
            <div className="grid grid-cols-1 gap-2">
              {EDUCATIONAL_LEVELS.map(l => (
                <button key={l} onClick={() => { setActiveLevel(l); setCurrentQuestion(null); setIsEvaluated(false); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeLevel === l ? 'bg-emerald-500 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
                  {l === 'Supervisión' ? <Zap size={16} /> : <BookOpen size={16} />} {l}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Área Temática</h2>
            <div className="space-y-2">
              {USICAMM_AREAS.map(a => (
                <button key={a.id} onClick={() => { setActiveArea(a); setCurrentQuestion(null); setIsEvaluated(false); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all border-2 ${activeArea.id === a.id ? 'bg-slate-800 border-emerald-500 text-white' : 'border-transparent text-slate-500 hover:bg-slate-800/50'}`}>
                  <div className={activeArea.id === a.id ? 'text-emerald-400' : 'text-slate-600'}>{a.icon}</div>
                  <span className="text-xs font-bold leading-tight">{a.title}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 border border-slate-700">
            <div className="flex justify-between items-center mb-3"><span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Tu Precisión</span><Award className="text-amber-500" size={14} /></div>
            <span className="text-2xl font-black text-white">{stats.total > 0 ? Math.round((stats.correct/stats.total)*100) : 0}%</span>
            <div className="mt-3 h-1 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${stats.total > 0 ? (stats.correct/stats.total)*100 : 0}%` }}></div></div>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col lg:ml-80">
        
        {/* HEADER PARA MÓVIL */}
        <header className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-30 lg:hidden shadow-sm">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <Menu size={24} />
          </button>
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Entrenando</span>
             <span className="text-xs font-bold text-emerald-600">{activeLevel}</span>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xs">
            {stats.correct}/{stats.total}
          </div>
        </header>

        <div className="max-w-4xl mx-auto w-full px-4 py-8 lg:p-12">
          
          {/* HEADER DESKTOP */}
          <div className="hidden lg:flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100"><ShieldCheck className="text-emerald-500" /></div>
              <div><h2 className="text-sm font-black text-slate-400 uppercase">Motor de Estudio</h2><p className="text-lg font-bold text-slate-800">{activeLevel} • {activeArea.title}</p></div>
            </div>
            {activeLevel === 'Supervisión' && <div className="bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 border border-emerald-500/20"><Zap size={14} fill="currentColor"/> MÓDULO SUPERVISIÓN ACTIVO</div>}
          </div>

          {/* ESTADO INICIAL */}
          {!currentQuestion && !isLoading && !errorMsg && (
            <div className="bg-white rounded-[2rem] p-8 lg:p-16 text-center shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-700">
              <div className="w-20 lg:w-24 h-20 lg:h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-slate-100"><BrainCircuit size={40} className="text-emerald-500 lg:w-12 lg:h-12" /></div>
              <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tight">Estudio Infinito</h3>
              <p className="text-slate-500 text-base lg:text-lg mb-10 max-w-md mx-auto leading-relaxed">Generaremos un caso práctico basado en los documentos oficiales 2026 adaptado a tu rol.</p>
              <button onClick={() => fetchNewQuestion(activeArea.title, activeLevel)} className="w-full lg:w-auto bg-[#0f172a] text-white px-10 py-4 lg:py-5 lg:px-12 rounded-[1.5rem] font-black text-lg hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3 mx-auto">Generar Reactivo IA <ChevronRight size={24} /></button>
            </div>
          )}

          {/* CARGANDO */}
          {isLoading && <div className="py-20 text-center"><div className="relative w-16 lg:w-20 h-16 lg:h-20 mx-auto mb-8"><div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div><div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div></div><h4 className="text-xl font-bold text-slate-800">Diseñando caso práctico...</h4><p className="text-slate-400 font-medium italic mt-2">Analizando Leyes y Acuerdos SEP</p></div>}

          {/* ERROR */}
          {errorMsg && <div className="p-8 lg:p-12 bg-white rounded-[2rem] shadow-xl border border-red-100 text-center"><XCircle size={40} className="text-red-500 mx-auto mb-4" /><p className="text-red-800 font-bold mb-6">{errorMsg}</p><button onClick={() => fetchNewQuestion(activeArea.title, activeLevel)} className="bg-red-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-600">Reintentar</button></div>}

          {/* PREGUNTA GENERADA */}
          {currentQuestion && !isLoading && (
            <div className="space-y-6 lg:space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-20">
              <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-6 lg:p-10 bg-slate-50/50 border-b border-slate-100">
                  <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase mb-4 inline-block tracking-widest">{currentQuestion.type}</span>
                  <h3 className="text-xl lg:text-2xl font-medium text-slate-800 leading-relaxed whitespace-pre-line">{currentQuestion.base}</h3>
                </div>
                <div className="p-6 lg:p-10 space-y-3">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const isCorrect = isEvaluated && opt.id === currentQuestion.correct;
                    const isWrong = isEvaluated && isSelected && opt.id !== currentQuestion.correct;
                    let style = "w-full text-left p-4 lg:p-6 rounded-2xl border-2 transition-all flex items-start gap-4 lg:gap-5 group ";
                    if (!isEvaluated) style += isSelected ? "border-[#0f172a] bg-[#0f172a] text-white shadow-xl lg:scale-[1.02]" : "border-slate-100 bg-white hover:border-emerald-200";
                    else if (isCorrect) style += "border-emerald-500 bg-emerald-50 text-emerald-900";
                    else if (isWrong) style += "border-red-500 bg-red-50 text-red-900";
                    else style += "border-slate-50 bg-white opacity-40 grayscale";
                    return (
                      <button key={opt.id} onClick={() => !isEvaluated && setSelectedOption(opt.id)} className={style} disabled={isEvaluated}>
                        <div className={`shrink-0 w-8 lg:w-10 h-8 lg:h-10 rounded-xl flex items-center justify-center font-black text-base lg:text-lg border-2 transition-all ${isSelected && !isEvaluated ? 'bg-white text-slate-900 border-white' : isCorrect ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{opt.id}</div>
                        <span className="text-base lg:text-lg pt-1 flex-1 leading-snug">{opt.text}</span>
                        {isCorrect && <CheckCircle2 className="ml-auto text-emerald-500 shrink-0" size={20} />}
                        {isWrong && <XCircle className="ml-auto text-red-500 shrink-0" size={20} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RETROALIMENTACIÓN */}
              {isEvaluated && (
                <div className="space-y-4 lg:space-y-6 animate-in slide-in-from-top-4 duration-500">
                  <div className={`p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] border-2 flex flex-col md:flex-row items-start gap-4 lg:gap-6 ${selectedOption === currentQuestion.correct ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0 ${selectedOption === currentQuestion.correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>{selectedOption === currentQuestion.correct ? <CheckCircle2 size={28} /> : <XCircle size={28} />}</div>
                    <div><h4 className={`text-lg lg:text-xl font-black mb-1 ${selectedOption === currentQuestion.correct ? 'text-emerald-800' : 'text-red-800'}`}>{selectedOption === currentQuestion.correct ? '¡Análisis Correcto!' : 'Decisión Incorrecta'}</h4><p className="text-slate-700 text-base lg:text-lg leading-relaxed">{currentQuestion.argumentation}</p></div>
                  </div>
                  <div className="bg-[#0f172a] p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4"><Lightbulb className="text-emerald-400" size={20} fill="currentColor" /><h4 className="text-lg lg:text-xl font-black text-emerald-400 uppercase tracking-widest">Estrategia IA</h4></div>
                    <p className="text-slate-300 text-base lg:text-lg italic leading-relaxed">"{currentQuestion.aiTip}"</p>
                  </div>
                </div>
              )}

              {/* BOTÓN SIGUIENTE */}
              <div className="flex justify-end pt-4">
                {!isEvaluated ? (
                  <button onClick={handleVerify} disabled={!selectedOption} className={`w-full lg:w-auto px-10 py-4 lg:py-5 lg:px-12 rounded-[1.2rem] lg:rounded-[1.5rem] font-black text-lg lg:text-xl shadow-xl transition-all ${selectedOption ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Verificar Respuesta</button>
                ) : (
                  <button onClick={() => fetchNewQuestion(activeArea.title, activeLevel)} className="w-full lg:w-auto bg-[#0f172a] text-white px-10 py-4 lg:py-5 lg:px-12 rounded-[1.2rem] lg:rounded-[1.5rem] font-black text-lg lg:text-xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3"><RefreshCw size={24} /> Siguiente Reactivo</button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
