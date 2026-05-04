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
  FileCheck
} from 'lucide-react';

// --- BANCO DE PREGUNTAS PREMIUM (CURADO POR IA EXPERTA) ---
const LOCAL_QUESTION_BANK = [
  {
    id: 1,
    level: "Primaria",
    area: "Área 1. Aspectos normativos",
    type: "Caso Práctico: Inclusión",
    base: "Un docente de tercer grado se resiste a integrar en sus actividades a una alumna con discapacidad auditiva, argumentando que no conoce la Lengua de Señas Mexicana y que la alumna 'pierde el tiempo' en su clase. ¿Cuál es el fundamento legal que la dirección debe aplicar para corregir esta situación?",
    options: [
      { id: "A", text: "El Artículo 3° Constitucional, priorizando la Excelencia sobre la integración si no hay especialistas." },
      { id: "B", text: "La Ley General de Educación (Art. 61), que establece la educación inclusiva como un derecho que obliga a eliminar barreras mediante ajustes razonables." },
      { id: "C", text: "El Acuerdo de Convivencia Escolar, sugiriendo que la alumna asista solo a clases donde el docente se sienta cómodo." }
    ],
    correct: "B",
    argumentation: "La LGE establece que la educación inclusiva es obligatoria y el sistema debe adaptarse al alumno, no al revés. Negar los ajustes razonables es una violación al derecho a la educación.",
    aiTip: "Tip: Si la opción sugiere que el alumno se adapte a la escuela, es incorrecta. La escuela es la que debe realizar los 'Ajustes Razonables'."
  },
  {
    id: 2,
    level: "Supervisión",
    area: "Área 2. Gestión escolar / educativa",
    type: "Caso: Liderazgo Pedagógico",
    base: "Un supervisor detecta que en una zona escolar los directores priorizan el llenado de formatos administrativos sobre el seguimiento al Programa Analítico. Según Margarita Zorrilla, ¿qué acción transforma la función supervisora?",
    options: [
      { id: "A", text: "Implementar un sistema de sanciones para los directores que no entreguen a tiempo sus reportes." },
      { id: "B", text: "Mover el enfoque de la vigilancia administrativa hacia un acompañamiento técnico-pedagógico sistemático y dialógico." },
      { id: "C", text: "Solicitar a la Secretaría que simplifique los formatos para que los directores tengan más tiempo libre." }
    ],
    correct: "B",
    argumentation: "Margarita Zorrilla plantea que la supervisión debe ser una instancia de apoyo y mejora. El supervisor debe ser un asesor que impulse la reflexión sobre la praxis docente.",
    aiTip: "Palabra Clave: En Supervisión, busca siempre 'Acompañamiento', 'Asesoría' y 'Mejora de los Aprendizajes'."
  },
  {
    id: 3,
    level: "Primaria",
    area: "Área 1. Aspectos normativos",
    type: "Protección de Derechos",
    base: "Un alumno llega a la dirección con hematomas visibles y confiesa que su tutor le prohíbe comer como castigo. Bajo el Interés Superior de la Niñez, ¿cuál es la acción inmediata obligatoria?",
    options: [
      { id: "A", text: "Llamar a los padres para confrontarlos y pedirles que dejen de usar la violencia física." },
      { id: "B", text: "Notificar de inmediato a la Procuraduría de Protección de NNA, priorizando la protección y socorro del menor." },
      { id: "C", text: "Esperar a que el comité de seguridad de la escuela realice un acta de hechos para tener evidencias." }
    ],
    correct: "B",
    argumentation: "La LGDNNA y los protocolos de la SEP dictan que ante sospecha de maltrato, la escuela debe dar aviso inmediato a la autoridad competente sin realizar investigaciones previas que pongan en riesgo al menor.",
    aiTip: "Hack: En casos de maltrato o abuso, la respuesta correcta JAMÁS será 'hablar con los padres' o 'investigar'."
  },
  {
    id: 4,
    level: "Primaria",
    area: "Área 2. Gestión escolar / educativa",
    type: "Caso: Programa Analítico",
    base: "Durante una sesión de CTE, el colectivo docente omite considerar el contexto socioeducativo de la comunidad en el codiseño de contenidos. ¿Qué principio pedagógico de la NEM se está violando?",
    options: [
      { id: "A", text: "La Autonomía Profesional y la Contextualización, fundamentales para que el aprendizaje sea significativo." },
      { id: "B", text: "La Estandarización Curricular, que exige que todas las escuelas enseñen exactamente lo mismo." },
      { id: "C", text: "El principio de Evaluación Sumativa, ya que el contexto no afecta el examen nacional." }
    ],
    correct: "A",
    argumentation: "El Plan de Estudios 2022 y las orientaciones del Programa Analítico exigen que los contenidos se sitúen en la realidad local (Lectura de la Realidad).",
    aiTip: "Tip: 'Contextualización' y 'Codiseño' son los pilares de la planeación didáctica en la Nueva Escuela Mexicana."
  },
  {
    id: 5,
    level: "Primaria",
    area: "Área 3. Relación con la comunidad",
    type: "Caso: Antonio Bolívar",
    base: "Un director busca que las familias dejen de ser meras espectadoras y se vuelvan corresponsables del aprendizaje. Según Antonio Bolívar, ¿cuál es la mejor estrategia?",
    options: [
      { id: "A", text: "Cobrar cuotas voluntarias más altas para que los padres valoren la educación de sus hijos." },
      { id: "B", text: "Abrir la escuela al entorno social para construir capital social y redes de colaboración mutua." },
      { id: "C", text: "Enviar reportes de mala conducta diarios para que los padres mantengan el control en casa." }
    ],
    correct: "B",
    argumentation: "Bolívar propone que la escuela y la comunidad no son mundos separados, sino socios en la formación de ciudadanos a través de la participación activa.",
    aiTip: "Palabra Clave: Busca opciones que hablen de 'Vínculos comunitarios' o 'Capital Social'."
  },
  {
    id: 6,
    level: "Secundaria",
    area: "Área 1. Aspectos normativos",
    type: "Seguridad Escolar",
    base: "Se detecta que un alumno porta una sustancia prohibida en su mochila. Siguiendo el manual de 'Entornos Escolares Seguros', ¿cuál es la prioridad?",
    options: [
      { id: "A", text: "Expulsar al alumno inmediatamente para proteger el prestigio del plantel." },
      { id: "B", text: "Salvaguardar la integridad física, dar aviso a los tutores y canalizar a instituciones de salud/seguridad." },
      { id: "C", text: "Revisar las mochilas de todo el grupo de forma obligatoria y pública para encontrar más sustancias." }
    ],
    correct: "B",
    argumentation: "La regla de oro de los protocolos de seguridad es la protección de la integridad física y el enfoque formativo/preventivo por encima del punitivo.",
    aiTip: "Recuerda: Las sanciones que violan el derecho a la educación (como expulsar) son incorrectas en USICAMM."
  },
  {
    id: 7,
    level: "Supervisión",
    area: "Área 1. Aspectos normativos",
    type: "Asesoría: CTE",
    base: "Un supervisor asiste a un CTE y observa que el director impone los objetivos del PMC sin consultar al colectivo. ¿Qué lineamiento del Acuerdo 05/04/24 debe recordar el supervisor?",
    options: [
      { id: "A", text: "Que el director tiene la autoridad absoluta para decidir la ruta de mejora." },
      { id: "B", text: "Que el CTE es el máximo órgano colegiado de decisión pedagógica y requiere del diálogo y consenso." },
      { id: "C", text: "Que el supervisor debe dictar los objetivos del PMC desde la supervisión." }
    ],
    correct: "B",
    argumentation: "El Acuerdo 05/04/24 establece que el CTE opera mediante la horizontalidad y la autonomía profesional de los docentes.",
    aiTip: "Hack: En el CTE de la NEM, la palabra clave es 'Colectivo' y 'Horizontalidad', nunca jerarquía."
  },
  {
    id: 8,
    level: "Primaria",
    area: "Área 2. Gestión escolar / educativa",
    type: "PMC: Fases",
    base: "El Comité de Planeación y Evaluación de una escuela ya identificó las problemáticas y necesidades del plantel. ¿Cuál es el siguiente paso en el Proceso de Mejora Continua (PMC)?",
    options: [
      { id: "A", text: "Realizar la evaluación final para ver si hubo cambios en los aprendizajes." },
      { id: "B", text: "Definir Objetivos, Metas y Acciones para atender las prioridades detectadas." },
      { id: "C", text: "Pedir permiso a la supervisión para empezar a trabajar con el Programa Analítico." }
    ],
    correct: "B",
    argumentation: "Las fases del PMC son: Diagnóstico, Objetivos y Metas, Acciones, Seguimiento y Evaluación. Después del diagnóstico sigue la planeación.",
    aiTip: "Orden mental: Detecto (Diagnóstico) -> Planeo (Objetivos) -> Hago (Acciones) -> Reviso (Seguimiento)."
  },
  {
    id: 9,
    level: "Preescolar",
    area: "Área 2. Gestión escolar / educativa",
    type: "Práctica Reflexiva",
    base: "Una educadora realiza sus actividades siguiendo planeaciones de años anteriores sin cambios. Según los 'Apuntes Didácticos', ¿cómo debe el director motivar el cambio?",
    options: [
      { id: "A", text: "Obligándola a comprar libros de planeación nuevos y más actualizados." },
      { id: "B", text: "Promoviendo una práctica docente reflexiva que ponga en duda lo que se hace para mejorar el impacto en los niños." },
      { id: "C", text: "Cambiándola de grado para que tenga que planear algo diferente por la fuerza." }
    ],
    correct: "B",
    argumentation: "La práctica reflexiva permite al docente salir de la inercia y construir su propio saber profesional basado en su realidad específica.",
    aiTip: "Clave: La mejora docente en la NEM se basa en la 'Reflexión sobre la Praxis', no en manuales externos."
  },
  {
    id: 10,
    level: "Secundaria",
    area: "Área 1. Aspectos normativos",
    type: "Caso: Violencia Sexual",
    base: "Se presenta una queja sobre un posible caso de hostigamiento sexual en el plantel. Según el Acuerdo 17/05/25, ¿cuál es el principio de actuación rector?",
    options: [
      { id: "A", text: "La presunción de inocencia del señalado por encima de cualquier otro derecho." },
      { id: "B", text: "La protección inmediata de la víctima, la no revictimización y la debida diligencia." },
      { id: "C", text: "El sigilo administrativo absoluto para no alarmar a la comunidad escolar." }
    ],
    correct: "B",
    argumentation: "Los lineamientos de violencia sexual de 2025 priorizan los derechos de las víctimas y obligan a medidas de protección urgentes.",
    aiTip: "Acento Ético: En temas de género o abuso, la 'No Revictimización' es el estándar de oro."
  }
];

const USICAMM_AREAS = [
  { id: 'area1', title: 'Área 1. Aspectos normativos', icon: <BookMarked size={20} />, color: 'text-blue-500' },
  { id: 'area2', title: 'Área 2. Gestión escolar / educativa', icon: <Target size={20} />, color: 'text-emerald-500' },
  { id: 'area3', title: 'Área 3. Relación con la comunidad', icon: <Users size={20} />, color: 'text-purple-500' }
];

const EDUCATIONAL_LEVELS = ['Preescolar', 'Primaria', 'Secundaria', 'Supervisión'];

interface Question {
  id: number;
  level: string;
  area: string;
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

  const activeArea = useMemo(() => 
    USICAMM_AREAS.find(a => a.id === activeAreaId) || USICAMM_AREAS[0]
  , [activeAreaId]);

  const loadLocalQuestion = () => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsEvaluated(false);
    setCurrentQuestion(null);
    setIsSidebarOpen(false);

    setTimeout(() => {
      const filtered = LOCAL_QUESTION_BANK.filter(q => q.level === activeLevel && q.area === activeArea.title);
      const secondary = filtered.length > 0 ? filtered : LOCAL_QUESTION_BANK.filter(q => q.level === activeLevel);
      const pool = secondary.length > 0 ? secondary : LOCAL_QUESTION_BANK;
      const randomQ = pool[Math.floor(Math.random() * pool.length)];
      setCurrentQuestion(randomQ);
      setIsLoading(false);
    }, 800);
  };

  const fetchNewQuestion = (useIA = false) => {
    if (useIA) {
      setIsLoading(true);
      setSelectedOption(null);
      setIsEvaluated(false);
      setCurrentQuestion(null);
      setIsSidebarOpen(false);

      const apiKey = ""; 
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      const prompt = `Genera un reactivo USICAMM para ${activeLevel} en ${activeArea.title}. Responde solo JSON.`;
      
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      })
      .then(r => r.json())
      .then(data => {
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = rawText.replace(/```json|```/g, '').trim();
        setCurrentQuestion(JSON.parse(cleanJson));
        setIsLoading(false);
      })
      .catch(() => loadLocalQuestion());
      return;
    }
    loadLocalQuestion();
  };

  const handleVerify = () => {
    if (!selectedOption || isEvaluated || !currentQuestion) return;
    setIsEvaluated(true);
    const correct = selectedOption === currentQuestion.correct;
    setStats(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row font-sans text-slate-900 overflow-x-hidden">
      
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      
      <aside className={`fixed inset-y-0 left-0 w-80 bg-[#0f172a] text-slate-300 flex flex-col z-50 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-emerald-500/20 shadow-lg"><BrainCircuit size={28} className="text-white" /></div>
            <div>
              <h1 className="text-2xl font-black text-white leading-none tracking-tighter">USICAMM<span className="text-emerald-400">AI</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">Premium v.2026</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          <section>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4 flex items-center gap-2"><GraduationCap size={14}/> Tu Perfil</h2>
            <div className="grid gap-2">
              {EDUCATIONAL_LEVELS.map(l => (
                <button key={l} onClick={() => { setActiveLevel(l); setCurrentQuestion(null); setIsEvaluated(false); setIsSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeLevel === l ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-slate-800 text-slate-400'}`}>
                   {l === 'Supervisión' ? <Zap size={16} /> : <BookOpen size={16} />} {l}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-4">Ejes de Evaluación</h2>
            <div className="space-y-2">
              {USICAMM_AREAS.map(a => (
                <button key={a.id} onClick={() => { setActiveAreaId(a.id); setCurrentQuestion(null); setIsEvaluated(false); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all border-2 ${activeAreaId === a.id ? 'bg-slate-800 border-emerald-500 text-white shadow-lg' : 'border-transparent text-slate-500 hover:bg-slate-800/50'}`}>
                  <div className={activeAreaId === a.id ? 'text-emerald-400' : 'text-slate-600'}>{a.icon}</div>
                  <span className="text-xs font-bold leading-tight">{a.title}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700 mb-4 text-center">
             <p className="text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Precisión</p>
             <span className="text-3xl font-black text-white">{stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</span>
          </div>
          <a href="https://wa.me/526181518337" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl font-black text-xs hover:bg-[#128C7E] transition-all">
            <MessageCircle size={18} fill="currentColor"/> SOPORTE USICAMM
          </a>
        </div>
      </aside>

      <main className="flex-1 flex flex-col lg:ml-80">
        <header className="bg-white border-b p-4 flex items-center justify-between lg:hidden sticky top-0 z-30 shadow-sm">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 rounded-xl text-slate-600"><Menu size={24} /></button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase">Estudiando</span>
            <span className="text-xs font-bold text-emerald-600">{activeLevel}</span>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-black text-emerald-600">{stats.correct}/{stats.total}</div>
        </header>

        <div className="max-w-4xl mx-auto w-full px-4 py-8 lg:p-12">
          <div className="hidden lg:flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100"><ShieldCheck className="text-emerald-500" /></div>
              <div><h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Simulador Profesional</h2><p className="text-xl font-bold text-slate-800">{activeLevel} • {activeArea.title}</p></div>
            </div>
            <div className="bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black flex items-center gap-2 border border-emerald-500/20">
               <FileCheck size={14} /> BANCO CURADO ACTIVO
            </div>
          </div>

          {!currentQuestion && !isLoading && (
            <div className="bg-white rounded-[2.5rem] p-10 lg:p-20 text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-700">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 border-2 border-slate-100"><BrainCircuit size={48} className="text-emerald-500" /></div>
              <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight text-balance">Estudio Inteligente</h3>
              <p className="text-slate-500 text-lg lg:text-xl mb-12 max-w-xl mx-auto leading-relaxed">Hemos integrado un banco de reactivos curados por expertos en la Nueva Escuela Mexicana. Estudia sin interrupciones.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => fetchNewQuestion(false)} className="bg-[#0f172a] text-white px-12 py-5 rounded-[1.5rem] font-black text-xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">Empezar Entrenamiento <ChevronRight size={24} /></button>
                <button onClick={() => fetchNewQuestion(true)} className="bg-emerald-100 text-emerald-700 px-10 py-5 rounded-[1.5rem] font-black text-lg hover:bg-emerald-200 transition-all flex items-center justify-center gap-3 border border-emerald-200"><Sparkles size={22} /> Motor IA (Beta)</button>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="py-20 text-center animate-in fade-in">
              <div className="relative w-24 h-24 mx-auto mb-10">
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
              </div>
              <h4 className="text-2xl font-bold text-slate-800">Cargando Reactivo Crítico...</h4>
              <p className="text-slate-400 mt-2 font-medium italic">Accediendo a la base de datos oficial 2026</p>
            </div>
          )}

          {currentQuestion && !isLoading && (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 pb-20">
              <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-8 lg:p-12 bg-slate-50/50 border-b border-slate-100 relative">
                  <div className="flex justify-between items-center mb-6">
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20">{currentQuestion.type}</span>
                    <Award className="text-amber-500" size={24} />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-medium leading-snug text-slate-800 whitespace-pre-line">{currentQuestion.base}</h3>
                </div>
                <div className="p-8 lg:p-12 space-y-4">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt.id;
                    const isCorrect = isEvaluated && opt.id === currentQuestion.correct;
                    const isWrong = isEvaluated && isSelected && opt.id !== currentQuestion.correct;
                    let style = "w-full text-left p-6 lg:p-8 rounded-[1.5rem] border-2 transition-all flex items-start gap-6 group ";
                    if (!isEvaluated) style += isSelected ? "border-[#0f172a] bg-[#0f172a] text-white shadow-2xl scale-[1.02]" : "border-slate-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/30";
                    else if (isCorrect) style += "border-emerald-500 bg-emerald-50 text-emerald-900";
                    else if (isWrong) style += "border-red-500 bg-red-50 text-red-900";
                    else style += "opacity-30 grayscale border-slate-50";
                    return (
                      <button key={opt.id} onClick={() => !isEvaluated && setSelectedOption(opt.id)} className={style} disabled={isEvaluated}>
                        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border-2 transition-all ${isSelected && !isEvaluated ? 'bg-white text-slate-900 border-white' : isCorrect ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 text-slate-400'}`}>{opt.id}</div>
                        <span className="text-lg lg:text-xl font-medium flex-1 pt-1">{opt.text}</span>
                        {isCorrect && <CheckCircle2 className="text-emerald-500 mt-1" size={28} />}
                        {isWrong && <XCircle className="text-red-500 mt-1" size={28} />}
                      </button>
                    );
                  })}
                </div>
              </div>
              {isEvaluated && (
                <div className="space-y-6 animate-in slide-in-from-top-6 duration-500">
                  <div className={`p-8 lg:p-12 rounded-[2.5rem] border-2 flex flex-col md:flex-row gap-8 ${selectedOption === currentQuestion.correct ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-inner ${selectedOption === currentQuestion.correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}><CheckCircle2 size={36} /></div>
                    <div><h4 className="text-2xl font-black mb-3 text-slate-900">Sustento Teórico:</h4><p className="text-slate-700 text-lg leading-relaxed">{currentQuestion.argumentation}</p></div>
                  </div>
                  <div className="bg-[#0f172a] p-8 lg:p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-emerald-500/20 transition-all" />
                    <div className="flex items-center gap-4 mb-4"><Lightbulb className="text-emerald-400" size={32} fill="currentColor" /><h4 className="font-black text-emerald-400 uppercase tracking-widest text-lg">Estrategia del Tutor</h4></div>
                    <p className="text-slate-300 text-xl font-medium italic leading-relaxed">"{currentQuestion.aiTip}"</p>
                  </div>
                </div>
              )}
              <div className="flex justify-end pt-8">
                {!isEvaluated ? (
                  <button onClick={handleVerify} disabled={!selectedOption} className={`w-full lg:w-auto px-16 py-6 rounded-[2rem] font-black text-2xl shadow-2xl transition-all ${selectedOption ? 'bg-emerald-500 text-white hover:bg-emerald-600 scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Verificar Respuesta</button>
                ) : (
                  <button onClick={() => fetchNewQuestion(false)} className="w-full lg:w-auto bg-[#0f172a] text-white px-16 py-6 rounded-[2rem] font-black text-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-4"><RefreshCw size={28} /> Siguiente Caso</button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
