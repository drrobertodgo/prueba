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
  FileText,
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

// --- BASE DE CONOCIMIENTO SEGMENTADA ---
const GENERAL_KNOWLEDGE = `
BIBLIOGRAFÍA BASE (Docs 1-36):
- Marco Legal: Art. 3° (Inclusión, Excelencia), LGE (Nueva Escuela Mexicana), LGDNNA (Interés Superior de la Niñez).
- Salud y Seguridad: Acuerdo 30/09/24 (Alimentación), Acuerdo 14/12/23 (Erradicación del Acoso), Acuerdo 17/05/25 (Violencia Sexual).
- Gestión: Acuerdo 05/04/24 (Lineamientos CTE), PMC (Proceso de Mejora Continua), Programa Sintético y Analítico (Contextualización).
- Autores Clave: Antonio Bolívar (Familia-Comunidad), José Weinstein (Liderazgo Pedagógico), Molina Ruiz (Comunidades de Aprendizaje).
`;

const SUPERVISION_ONLY_KNOWLEDGE = `
BIBLIOGRAFÍA ESPECIALIZADA SUPERVISIÓN (Docs 37-40):
- Transformación de la Supervisión (Margarita Zorrilla): De la vigilancia burocrática al apoyo técnico-pedagógico sistemático.
- Asesorar es Acompañar (Montse Ventura): El asesoramiento como un proceso de construcción de saber profesional y cambio institucional.
- Reflexión de la Praxis (David Vitte Viveros): Acompañamiento basado en la pedagogía crítica y el diálogo reflexivo.
- Programa Analítico (Fascículos): El rol de la supervisión en el seguimiento del codiseño curricular.
`;

export default function App() {
  const [activeLevel, setActiveLevel] = useState(EDUCATIONAL_LEVELS[1]); // Default Primaria
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

    const apiKey = ""; // Injected at runtime
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    // Lógica de inyección de conocimiento dinámico
    const knowledgeToUse = level === 'Supervisión' 
      ? `${GENERAL_KNOWLEDGE}\n${SUPERVISION_ONLY_KNOWLEDGE}` 
      : GENERAL_KNOWLEDGE;

    const promptText = `Actúa como el experto líder en evaluación docente de USICAMM en México.
    
    TAREA: Generar UN reactivo de opción múltiple (3 opciones: A, B, C) INÉDITO y de alta complejidad para el proceso de Promoción 2026-2027.
    
    PARÁMETROS:
    - Función/Nivel: "${level}".
    - Área de Evaluación: "${areaTitle}".
    
    CONTEXTO DE LA BIBLIOGRAFÍA CARGADA:
    ${knowledgeToUse}
    
    REGLAS DE ORO PARA EL REACTIVO:
    1. Si el nivel es "Supervisión", el caso debe tratar sobre un Supervisor asesorando a directores, gestionando zonas o aplicando los textos de Zorrilla y Ventura sobre acompañamiento.
    2. Si es Preescolar/Primaria/Secundaria, el caso debe centrarse en un Directivo resolviendo conflictos en el plantel con docentes o padres.
    3. La respuesta correcta debe ser indudable según los Acuerdos 2024-2025 o los autores citados.
    4. Los distractores deben ser acciones que parezcan lógicas pero que sean administrativas, punitivas o violen el Interés Superior de la Niñez.
    
    ENTREGA EL RESULTADO EN ESTE FORMATO JSON:
    {
      "type": "Cuestionamiento directo o Relación de elementos",
      "base": "El planteamiento detallado del caso práctico",
      "options": [{"id": "A", "text": "..."}, {"id": "B", "text": "..."}, {"id": "C", "text": "..."}],
      "correct": "A/B/C",
      "argumentation": "Explicación técnica citando el documento específico de la base de conocimiento (ej. 'Basado en el Acuerdo 14/12/23...' o 'Como menciona Margarita Zorrilla...')",
      "aiTip": "Un consejo de 1 frase para descartar distractores en este tema."
    }`;

    let retries = 5;
    let delay = 1000;
    
    while (retries > 0) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        });
        
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        const generatedJSON = JSON.parse(data.candidates[0].content.parts[0].text);
        setCurrentQuestion(generatedJSON);
        setIsLoading(false);
        return;
      } catch (err) {
        retries--;
        if (retries === 0) {
          setErrorMsg('El motor IA está saturado procesando la bibliografía. Intenta de nuevo.');
          setIsLoading(false);
        } else {
          await new Promise(res => setTimeout(res, delay));
          delay *= 2;
        }
      }
    }
  };

  const handleVerify = () => {
    if (!selectedOption) return;
    setIsEvaluated(true);
    if (selectedOption === currentQuestion.correct) {
      setStats(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setStats(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* SIDEBAR - BENTO STYLE */}
      <aside className="w-80 bg-[#0f172a] text-slate-300 flex flex-col fixed h-full z-10 shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl">
              <BrainCircuit size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white leading-none">USICAMM<span className="text-emerald-400">AI</span></h1>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">Tutor Inteligente</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          {/* NIVELES */}
          <div>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Función a Evaluar</h2>
            <div className="grid grid-cols-1 gap-2">
              {EDUCATIONAL_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => { setActiveLevel(level); setCurrentQuestion(null); setIsEvaluated(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all
                    ${activeLevel === level 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  <GraduationCap size={18} /> {level}
                </button>
              ))}
            </div>
          </div>

          {/* ÁREAS */}
          <div>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Área Temática</h2>
            <div className="space-y-2">
              {USICAMM_AREAS.map(area => (
                <button 
                  key={area.id}
                  onClick={() => { setActiveArea(area); setCurrentQuestion(null); setIsEvaluated(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all border-2
                    ${activeArea.id === area.id 
                      ? 'bg-slate-800 border-emerald-500 text-white' 
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-800/50'}`}
                >
                  <div className={`${activeArea.id === area.id ? 'text-emerald-400' : 'text-slate-600'}`}>{area.icon}</div>
                  <span className="text-xs font-bold leading-tight">{area.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RENDIMIENTO */}
        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase text-slate-500">Tu Progreso</span>
              <Award className="text-amber-500" size={16} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stats.total > 0 ? Math.round((stats.correct/stats.total)*100) : 0}%</span>
              <span className="text-xs font-bold text-slate-500">precisión</span>
            </div>
            <div className="mt-3 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: `${stats.total > 0 ? (stats.correct/stats.total)*100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-80 flex-1 min-h-screen bg-[#f8fafc] p-12">
        <div className="max-w-4xl mx-auto">
          
          {/* HEADER INFO */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                <ShieldCheck className="text-emerald-500" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-tighter">Entrenamiento Activo</h2>
                <p className="text-lg font-bold text-slate-800">{activeLevel} • {activeArea.title}</p>
              </div>
            </div>
            {activeLevel === 'Supervisión' && (
              <div className="bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 border border-emerald-500/20">
                <Zap size={14} fill="currentColor"/> MÓDULO ZORRILLA/VENTURA ACTIVO
              </div>
            )}
          </div>

          {!currentQuestion && !isLoading && (
            <div className="bg-white rounded-[2.5rem] p-16 text-center shadow-xl shadow-slate-200/50 border border-slate-100 animate-in fade-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-slate-100">
                <BrainCircuit size={48} className="text-emerald-500" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Motor de Generación Infinita</h3>
              <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                Nuestra IA procesará los 40 documentos oficiales para crear un caso único para ti.
              </p>
              <button 
                onClick={() => fetchNewQuestion(activeArea.title, activeLevel)}
                className="bg-[#0f172a] text-white px-12 py-5 rounded-3xl font-black text-lg hover:scale-105 transition-all shadow-2xl flex items-center gap-3 mx-auto"
              >
                Generar Reactivo IA <ChevronRight size={24} />
              </button>
            </div>
          )}

          {isLoading && (
            <div className="py-20 text-center animate-in fade-in duration-500">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">Consultando bibliografía...</h4>
              <p className="text-slate-400 font-medium">Cruzando Acuerdos 2024 con perfiles de {activeLevel}</p>
            </div>
          )}

          {currentQuestion && !isLoading && (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="p-10 bg-slate-50/50 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase">{currentQuestion.type}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reactivo Crítico</span>
                  </div>
                  <h3 className="text-2xl font-medium text-slate-800 leading-snug whitespace-pre-line">
                    {currentQuestion.base}
                  </h3>
                </div>

                <div className="p-10 space-y-3">
                  {currentQuestion.options.map((opt: any) => {
                    const isSelected = selectedOption === opt.id;
                    const isCorrect = isEvaluated && opt.id === currentQuestion.correct;
                    const isWrong = isEvaluated && isSelected && opt.id !== currentQuestion.correct;
                    
                    let btnBase = "w-full text-left p-6 rounded-[1.5rem] border-2 transition-all flex items-start gap-5 group outline-none ";
                    if (!isEvaluated) {
                      btnBase += isSelected ? "border-[#0f172a] bg-[#0f172a] text-white shadow-xl scale-[1.02]" : "border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30";
                    } else {
                      if (isCorrect) btnBase += "border-emerald-500 bg-emerald-50 text-emerald-900";
                      else if (isWrong) btnBase += "border-red-500 bg-red-50 text-red-900";
                      else btnBase += "border-slate-50 bg-white opacity-40 grayscale";
                    }

                    return (
                      <button key={opt.id} onClick={() => !isEvaluated && setSelectedOption(opt.id)} disabled={isEvaluated} className={btnBase}>
                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg border-2 transition-all
                          ${isSelected && !isEvaluated ? 'bg-white text-slate-900 border-white' : ''}
                          ${isCorrect ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:border-emerald-200'}
                          ${isWrong ? 'bg-red-500 text-white border-red-500' : ''}
                        `}>{opt.id}</div>
                        <span className="text-lg pt-1 leading-relaxed flex-1">{opt.text}</span>
                        {isCorrect && <CheckCircle2 className="ml-auto text-emerald-500 mt-1" size={24} />}
                        {isWrong && <XCircle className="ml-auto text-red-500 mt-1" size={24} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {isEvaluated && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                  <div className={`p-8 rounded-[2rem] border-2 flex items-start gap-6
                    ${selectedOption === currentQuestion.correct ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0
                      ${selectedOption === currentQuestion.correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                      {selectedOption === currentQuestion.correct ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                    </div>
                    <div>
                      <h4 className="text-xl font-black mb-2">{selectedOption === currentQuestion.correct ? '¡Análisis Correcto!' : 'Decisión Incorrecta'}</h4>
                      <p className="text-slate-700 text-lg leading-relaxed">{currentQuestion.argumentation}</p>
                    </div>
                  </div>

                  <div className="bg-[#0f172a] p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="text-emerald-400" size={24} fill="currentColor" />
                      <h4 className="text-xl font-black tracking-tight text-emerald-400">Hack del Tutor IA</h4>
                    </div>
                    <p className="text-slate-300 text-lg font-medium leading-relaxed italic">"{currentQuestion.aiTip}"</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-8 pb-20">
                {!isEvaluated ? (
                  <button 
                    onClick={handleVerify}
                    disabled={!selectedOption}
                    className={`px-12 py-5 rounded-[1.5rem] font-black text-xl transition-all shadow-xl
                      ${selectedOption ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    Verificar Mi Respuesta
                  </button>
                ) : (
                  <button 
                    onClick={() => fetchNewQuestion(activeArea.title, activeLevel)}
                    className="bg-[#0f172a] text-white px-12 py-5 rounded-[1.5rem] font-black text-xl hover:scale-105 transition-all shadow-2xl flex items-center gap-3"
                  >
                    <RefreshCw size={24} /> Generar Siguiente Reactivo
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
