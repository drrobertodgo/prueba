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
  Zap
} from 'lucide-react';

// --- CONFIGURACIÓN DE ÁREAS Y NIVELES ---
const USICAMM_AREAS = [
  { id: 'area1', title: 'Área 1. Aspectos normativos', icon: <BookMarked size={20} />, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
  { id: 'area2', title: 'Área 2. Gestión escolar / educativa', icon: <Target size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  { id: 'area3', title: 'Área 3. Relación con la comunidad', icon: <Users size={20} />, color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200' }
];

const EDUCATIONAL_LEVELS = ['Preescolar', 'Primaria', 'Secundaria', 'Supervisión'];

// --- BASE DE CONOCIMIENTO ---
const GENERAL_KNOWLEDGE = `
- Marco Legal: Art. 3° (Inclusión, Excelencia), LGE (NEM), LGDNNA (Interés Superior).
- Salud y Seguridad: Acuerdo 30/09/24 (Alimentación), Acuerdo 14/12/23 (Acoso), Acuerdo 17/05/25 (Violencia Sexual).
- Gestión: Acuerdo 05/04/24 (CTE), PMC (Mejora Continua), Programa Analítico.
- Autores: Antonio Bolívar, José Weinstein, Molina Ruiz, Justa Ezpeleta.
`;

const SUPERVISION_ONLY_KNOWLEDGE = `
- Margarita Zorrilla: Transformar supervisión de vigilancia a apoyo técnico.
- Montse Ventura: Asesorar es acompañar (construcción entre pares).
- David Vitte Viveros: Reflexión de la Praxis y pedagogía crítica.
`;

export default function App() {
  const [activeLevel, setActiveLevel] = useState(EDUCATIONAL_LEVELS[1]); 
  const [activeArea, setActiveArea] = useState(USICAMM_AREAS[0]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [stats, setStats] = useState({ correct: 0, total: 0 });

  const fetchNewQuestion = async (areaTitle: string, level: string) => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsEvaluated(false);
    setErrorMsg('');
    setCurrentQuestion(null);

    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const knowledge = level === 'Supervisión' 
      ? `${GENERAL_KNOWLEDGE}\nESPECIAL SUPERVISIÓN: ${SUPERVISION_ONLY_KNOWLEDGE}` 
      : GENERAL_KNOWLEDGE;

    const promptText = `Eres experto en USICAMM México. Genera UN reactivo inédito de opción múltiple (A, B, C) sobre el caso práctico para "${level}" en el "${areaTitle}". 
    BIBLIOGRAFÍA: ${knowledge}
    INSTRUCCIONES: El caso debe ser realista. La correcta debe citar la ley o autor. Los distractores deben ser acciones administrativas o punitivas incorrectas.
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
        setCurrentQuestion(JSON.parse(resText.replace(/```json|```/g, '')));
        setIsLoading(false);
        return;
      } catch (err) {
        retries--;
        if (retries === 0) {
          setErrorMsg('Motor IA saturado. Intenta de nuevo.');
          setIsLoading(false);
        } else {
          await new Promise(r => setTimeout(res, 1000));
        }
      }
    }
  };

  const handleVerify = () => {
    if (!selectedOption || isEvaluated) return;
    setIsEvaluated(true);
    const correct = selectedOption === currentQuestion.correct;
    setStats(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      <aside className="w-80 bg-[#0f172a] text-slate-300 flex flex-col fixed h-full z-10 shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl"><BrainCircuit size={28} className="text-white" /></div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white leading-none">USICAMM<span className="text-emerald-400">AI</span></h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1">Tutor Pro</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          <section>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Nivel</h2>
            <div className="grid gap-2">
              {EDUCATIONAL_LEVELS.map(l => (
                <button key={l} onClick={() => { setActiveLevel(l); setCurrentQuestion(null); }} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeLevel === l ? 'bg-emerald-500 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}><GraduationCap size={18} /> {l}</button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Área</h2>
            <div className="space-y-2">
              {USICAMM_AREAS.map(a => (
                <button key={a.id} onClick={() => { setActiveArea(a); setCurrentQuestion(null); }} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all border-2 ${activeArea.id === a.id ? 'bg-slate-800 border-emerald-500 text-white' : 'border-transparent text-slate-500 hover:bg-slate-800/50'}`}>
                  <div className={activeArea.id === a.id ? 'text-emerald-400' : 'text-slate-600'}>{a.icon}</div>
                  <span className="text-xs font-bold leading-tight">{a.title}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 border border-slate-700">
            <div className="flex justify-between items-center mb-4"><span className="text-[10px] font-black uppercase text-slate-500">Precisión</span><Award className="text-amber-500" size={16} /></div>
            <div className="flex items-baseline gap-2"><span className="text-3xl font-black text-white">{stats.total > 0 ? Math.round((stats.correct/stats.total)*100) : 0}%</span></div>
            <div className="mt-3 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.total > 0 ? (stats.correct/stats.total)*100 : 0}%` }}></div></div>
          </div>
        </div>
      </aside>

      <main className="ml-80 flex-1 min-h-screen bg-[#f8fafc] p-12">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100"><ShieldCheck className="text-emerald-500" /></div>
              <div><h2 className="text-sm font-black text-slate-400 uppercase">Entrenamiento</h2><p className="text-lg font-bold text-slate-800">{activeLevel} • {activeArea.title}</p></div>
            </div>
            {activeLevel === 'Supervisión' && <div className="bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 border border-emerald-500/20"><Zap size={14} fill="currentColor"/> MÓDULO ZORRILLA ACTIVO</div>}
          </header>

          {!currentQuestion && !isLoading && !errorMsg && (
            <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-slate-100"><BrainCircuit size={48} className="text-emerald-500" /></div>
              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Motor de IA USICAMM</h3>
              <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">Generaremos un caso práctico basado en los 40 documentos oficiales actualizados a 2026.</p>
              <button onClick={() => fetchNewQuestion(activeArea.title, activeLevel)} className="bg-[#0f172a] text-white px-12 py-5 rounded-3xl font-black text-lg hover:scale-105 transition-all shadow-2xl flex items-center gap-3 mx-auto">Generar Reactivo IA <ChevronRight size={24} /></button>
            </div>
          )}

          {isLoading && <div className="py-20 text-center animate-in fade-in duration-500"><div className="relative w-20 h-20 mx-auto mb-8"><div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div><div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div></div><h4 className="text-xl font-bold text-slate-800">Analizando bibliografía...</h4></div>}

          {errorMsg && <div className="p-10 bg-red-50 text-red-800 rounded-3xl text-center font-bold">{errorMsg}</div>}

          {currentQuestion && !isLoading && (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-10 bg-slate-50/50 border-b border-slate-100">
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase mb-4 inline-block">{currentQuestion.type}</span>
                  <h3 className="text-2xl font-medium text-slate-800 leading-snug whitespace-pre-line">{currentQuestion.base}</h3>
                </div>
                <div className="p-10 space-y-3">
                  {currentQuestion.options.map((opt: any) => {
                    const isSelected = selectedOption === opt.id;
                    const isCorrect = isEvaluated && opt.id === currentQuestion.correct;
                    const isWrong = isEvaluated && isSelected && opt.id !== currentQuestion.correct;
                    let style = "w-full text-left p-6 rounded-[1.5rem] border-2 transition-all flex items-start gap-5 group ";
                    if (!isEvaluated) style += isSelected ? "border-[#0f172a] bg-[#0f172a] text-white shadow-xl scale-[1.02]" : "border-slate-100 bg-white hover:border-emerald-200";
                    else if (isCorrect) style += "border-emerald-500 bg-emerald-50 text-emerald-900";
                    else if (isWrong) style += "border-red-500 bg-red-50 text-red-900";
                    else style += "border-slate-50 bg-white opacity-40 grayscale";
                    return (
                      <button key={opt.id} onClick={() => !isEvaluated && setSelectedOption(opt.id)} className={style}>
                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border-2 ${isSelected && !isEvaluated ? 'bg-white text-slate-900' : isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'}`}>{opt.id}</div>
                        <span className="text-lg pt-1 leading-relaxed flex-1">{opt.text}</span>
                        {isCorrect && <CheckCircle2 className="ml-auto text-emerald-500" size={24} />}
                        {isWrong && <XCircle className="ml-auto text-red-500" size={24} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {isEvaluated && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                  <div className={`p-8 rounded-[2rem] border-2 flex items-start gap-6 ${selectedOption === currentQuestion.correct ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${selectedOption === currentQuestion.correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                      {selectedOption === currentQuestion.correct ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                    </div>
                    <div><h4 className="text-xl font-black mb-2">{selectedOption === currentQuestion.correct ? '¡Correcto!' : 'Incorrecto'}</h4><p className="text-slate-700 text-lg">{currentQuestion.argumentation}</p></div>
                  </div>
                  <div className="bg-[#0f172a] p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-4"><Lightbulb className="text-emerald-400" size={24} fill="currentColor" /><h4 className="text-xl font-black text-emerald-400">Hack IA</h4></div>
                    <p className="text-slate-300 text-lg italic">"{currentQuestion.aiTip}"</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-8 pb-20">
                {!isEvaluated ? (
                  <button onClick={handleVerify} disabled={!selectedOption} className={`px-12 py-5 rounded-[1.5rem] font-black text-xl shadow-xl ${selectedOption ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Verificar</button>
                ) : (
                  <button onClick={() => fetchNewQuestion(activeArea.title, activeLevel)} className="bg-[#0f172a] text-white px-12 py-5 rounded-[1.5rem] font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center gap-3"><RefreshCw size={24} /> Siguiente</button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
