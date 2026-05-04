import { useState } from 'react';
import { 
  BookOpen, BrainCircuit, PlayCircle, Image as ImageIcon, 
  LayoutDashboard, LogOut, ChevronRight, CheckCircle2, 
  XCircle, Lightbulb, BarChart3, Search, ArrowLeft, Play, 
  FileText, Users, Mail, KeyRound, CreditCard, ShieldCheck,
  Star
} from 'lucide-react';

// --- BASE DE DATOS REAL (Basada en Guía USICAMM 2025) ---
const mockQuestions = [
  {
    id: 1, type: "Cuestionamiento directo", area: "Área 1. Aspectos normativos",
    base: "¿Cuál es la situación escolar que promueve la democracia, no solo como un régimen político, sino como una forma de vida?",
    options: [
      { id: "A", text: "El maestro pide al grupo que organice tres equipos conformados por dos alumnas o alumnos, quienes, previa elección de uno de los equipos, fungirán como jefe y subjefe de grupo." },
      { id: "B", text: "El maestro propone una terna de candidatos, considerando diversos criterios, para que los alumnos elijan, y que así las alumnas o alumnos puedan elegir al jefe." },
      { id: "C", text: "El maestro propone candidatos, siguiendo un procedimiento establecido, y verifica que cumplan con los requisitos para fungir como jefa o jefe de grupo." }
    ],
    correct: "A",
    argumentation: "La opción correcta describe una situación en la que los estudiantes participan activamente en la elección de sus representantes, lo que fomenta la práctica de la democracia como una forma de vida promoviendo la participación, la colaboración y la toma de decisiones colectivas.",
    aiTip: "Estrategia: En reactivos sobre 'democracia como forma de vida', la Nueva Escuela Mexicana siempre prioriza la agencia y organización autónoma del alumno sobre la imposición del docente."
  },
  {
    id: 2, type: "Completamiento", area: "Área 2. Intervención docente",
    base: "Se ejemplifica una situación del entorno escolar que corresponde al tercer plano: Codiseño de contenidos, en la construcción del programa analítico, cuando en el Consejo Técnico Escolar...",
    options: [
      { id: "A", text: "...presentan los resultados de las encuestas aplicadas a las familias con la finalidad de determinar las características sociográficas de la región." },
      { id: "B", text: "...deciden la manera en la que se abordarán las problemáticas detectadas en la comunidad escolar sobre el uso responsable del agua, con base en los campos formativos." },
      { id: "C", text: "...trabajan en la creación de estrategias por fases para incluir el aprendizaje de la lengua de señas mexicana para los grupos que cuentan con alumnas y alumnos con discapacidad auditiva." }
    ],
    correct: "C",
    argumentation: "El tercer plano: codiseño de contenidos, se refiere a la incorporación y contextualización de nuevos contenidos al currículo atendiendo las necesidades específicas.",
    aiTip: "Estrategia de descarte: La opción A corresponde al primer plano (Lectura de la realidad). La B al segundo (Contextualización). Solo la C implica agregar algo nuevo (Codiseño)."
  },
  {
    id: 3, type: "Ordenamiento", area: "Área 3. Participación en la escuela",
    base: "Ordene los pasos a seguir para el cumplimiento del protocolo ante la situación de riesgo en la que se detectan disparos en el perímetro de la escuela.\n\n1. Verificar que todas y todos se encuentren en el salón.\n2. Permitir, con precaución, la entrada a quienes están fuera.\n3. Indicar que se coloquen en el piso boca abajo, lejos de puertas.\n4. Llamar al número de emergencias (911).\n5. Evitar que se asomen por las ventanas.",
    options: [
      { id: "A", text: "1, 3, 5, 4, 2" },
      { id: "B", text: "2, 4, 3, 1, 5" },
      { id: "C", text: "3, 1, 2, 5, 4" }
    ],
    correct: "C",
    argumentation: "3. Colocarse en el piso (Prioridad salvaguardar integridad). 1. Verificar asistencia. 2. Permitir entrada cautelosamente a los de afuera. 5. Evitar asomarse. 4. Llamar al 911.",
    aiTip: "Estrategia: En protocolos de seguridad de la SEP, la regla de oro es: 'La protección física inmediata es el paso #1'. Buscar la opción que inicie resguardando cuerpos (paso 3) elimina A y B."
  },
  {
    id: 4, type: "Relación de elementos", area: "Área 2. Intervención docente",
    base: "Relacione la fase de la metodología Aprendizaje Basado en Proyectos Comunitarios con la actividad didáctica que le corresponde.\n\nFases:\n1. Planeación\n2. Acción\n3. Intervención\n\nActividades:\na) Identificar recursos tecnológicos.\nb) Revisar producciones y difundir.\nc) Elaborar portafolio de evidencias.\nd) Realizar asamblea para identificar la problemática.",
    options: [
      { id: "A", text: "1a, 2d, 3b" },
      { id: "B", text: "1d, 2a, 3c" },
      { id: "C", text: "1d, 2c, 3b" }
    ],
    correct: "B",
    argumentation: "1. Planeación: d) Identificar el problema. 2. Acción: a) Identificar recursos para solucionar. 3. Intervención: c) Elaborar portafolio evaluando el proceso.",
    aiTip: "Estrategia: Todo proyecto inicia identificando un problema en comunidad (Planeación = Asamblea/d). Esto elimina la opción A inmediatamente."
  },
  {
    id: 5, type: "Cuestionamiento directo", area: "Área 3. Participación en la escuela",
    base: "De acuerdo con el Acuerdo 05/04/24 por el que se emiten los Lineamientos del Consejo Técnico Escolar, ¿cuál es el propósito principal del CTE?",
    options: [
      { id: "A", text: "Administrar los recursos financieros de la escuela provenientes de programas federales." },
      { id: "B", text: "La mejora continua del servicio educativo que presta la escuela, para garantizar el máximo logro de aprendizaje." },
      { id: "C", text: "Evaluar el desempeño administrativo de los docentes frente a grupo." }
    ],
    correct: "B",
    argumentation: "Según el Acuerdo 05/04/24, el CTE es el máximo órgano colegiado para la toma de decisiones pedagógicas y tiene como propósito principal la mejora continua del servicio educativo.",
    aiTip: "Estrategia: La NEM siempre aleja al CTE de funciones administrativas y punitivas (opciones A y C), enfocándolo estrictamente en lo pedagógico y la mejora continua (opción B)."
  },
  {
    id: 6, type: "Completamiento", area: "Área 1. Aspectos normativos",
    base: "Según el Artículo 3o constitucional y la Ley General de Educación, la educación será ________, al tomar en cuenta las diversas capacidades, circunstancias y necesidades de los educandos.",
    options: [
      { id: "A", text: "Inclusiva" },
      { id: "B", text: "Integral" },
      { id: "C", text: "Equitativa" }
    ],
    correct: "A",
    argumentation: "El principio de inclusión implica atender las diversas capacidades, circunstancias, necesidades, estilos y ritmos de aprendizaje de los educandos, eliminando las barreras al aprendizaje.",
    aiTip: "Tip de memoria: Si el texto habla de 'diversas capacidades y necesidades', el concepto legal exacto es INCLUSIVA. Si habla de 'asignación de recursos a quienes menos tienen', es EQUITATIVA."
  },
  {
    id: 7, type: "Cuestionamiento directo", area: "Área 2. Intervención docente",
    base: "Durante el ciclo escolar, una maestra utiliza la evaluación para identificar las dificultades de sus alumnos y ajustar su planeación didáctica, promoviendo la autoevaluación. ¿A qué enfoque de evaluación corresponde esta práctica según el Plan 2022?",
    options: [
      { id: "A", text: "Evaluación Sumativa" },
      { id: "B", text: "Evaluación Diagnóstica" },
      { id: "C", text: "Evaluación Formativa" }
    ],
    correct: "C",
    argumentation: "La evaluación formativa en el Plan 2022 se concibe como un proceso continuo que orienta las decisiones pedagógicas de los docentes y fomenta la reflexión de los alumnos sobre su propio aprendizaje.",
    aiTip: "Estrategia de palabras clave: 'Ajustar planeación', 'reflexión' y 'durante el ciclo' son sinónimos absolutos de Evaluación Formativa."
  },
  {
    id: 8, type: "Cuestionamiento directo", area: "Área 3. Participación en la escuela",
    base: "Dos alumnos de quinto grado discuten frecuentemente en el recreo. Para mejorar la convivencia, el docente decide aplicar la mediación. Según los protocolos oficiales de convivencia escolar, ¿cuál es el rol principal del docente en este proceso?",
    options: [
      { id: "A", text: "Imponer una sanción disciplinaria de acuerdo con el reglamento interno." },
      { id: "B", text: "Escuchar a ambas partes de forma imparcial y facilitar que ellos mismos propongan una solución pacífica." },
      { id: "C", text: "Remitir inmediatamente el caso a la dirección de la escuela para que dictamine una resolución." }
    ],
    correct: "B",
    argumentation: "La mediación escolar busca que las partes en conflicto dialoguen y encuentren soluciones con la ayuda de un tercero imparcial (el docente), promoviendo la cultura de paz.",
    aiTip: "Estrategia de descarte: La NEM privilegia la 'Cultura de Paz' y la autonomía moral. Opciones que involucren 'imponer' (A) o 'delegar castigos' (C) suelen ser incorrectas en escenarios de convivencia."
  },
  {
    id: 9, type: "Relación de elementos", area: "Área 2. Intervención docente",
    base: "Relacione el Eje Articulador del Plan de Estudios 2022 con la actividad didáctica correspondiente.\n\nEjes:\n1. Inclusión\n2. Vida Saludable\n3. Apropiación de las culturas a través de la lectura\n\nActividades:\na) Leer cuentos de tradición oral de la comunidad.\nb) Adaptar materiales impresos al sistema Braille.\nc) Crear un huerto escolar para consumir vegetales.",
    options: [
      { id: "A", text: "1b, 2c, 3a" },
      { id: "B", text: "1a, 2b, 3c" },
      { id: "C", text: "1c, 2a, 3b" }
    ],
    correct: "A",
    argumentation: "Inclusión se relaciona con adaptar al sistema Braille (1b). Vida Saludable con el huerto escolar (2c). Apropiación de culturas con la lectura tradicional (3a).",
    aiTip: "Tip rápido: Relaciona la más obvia primero. 'Huerto escolar' = Vida Saludable (2c). La única opción que tiene 2c es la A."
  },
  {
    id: 10, type: "Cuestionamiento directo", area: "Área 1. Aspectos normativos",
    base: "Al detectar que una alumna presenta signos de maltrato físico, el director activa los protocolos correspondientes y da aviso a las autoridades competentes. ¿Qué principio rector fundamental de la Ley General de los Derechos de Niñas, Niños y Adolescentes se está garantizando?",
    options: [
      { id: "A", text: "El derecho a la educación laica." },
      { id: "B", text: "El interés superior de la niñez." },
      { id: "C", text: "El derecho a la libre asociación." }
    ],
    correct: "B",
    argumentation: "El interés superior de la niñez obliga a todas las autoridades y docentes a tomar decisiones que protejan y prioricen la integridad y desarrollo pleno de los menores por encima de cualquier otro interés.",
    aiTip: "Estrategia: En temas de protección civil, maltrato o derechos vulnerados, la respuesta en USICAMM casi siempre será el principio constitucional de 'El interés superior de la niñez'."
  }
];

const mockInfographics = [
  { id: 1, title: "Acuerdo 05/04/24 (CTE)", desc: "Lineamientos de integración y operación de Consejos Técnicos.", color: "bg-emerald-500", points: [
    { title: "Propósito Principal", desc: "La mejora continua de la escuela y el máximo logro de aprendizaje." },
    { title: "Comité de Planeación", desc: "Se encarga de articular el Programa Analítico con el contexto escolar." },
    { title: "Autonomía Profesional", desc: "El colectivo docente toma decisiones pedagógicas basadas en su diagnóstico." }
  ]},
  { id: 2, title: "Plan de Estudios 2022", desc: "Los 4 campos formativos y los 7 ejes articuladores.", color: "bg-blue-500", points: [
    { title: "Perfil de Egreso", desc: "Ciudadanos críticos, inclusivos y solidarios." },
    { title: "Campos Formativos", desc: "Lenguajes, Saberes y Pensamiento, Ética y Sociedades, De lo Humano a lo Comunitario." }
  ]}
];

const mockVideos = [
  { id: 1, title: "Estructura del Programa Analítico (Codiseño)", duration: "03:45", views: "1.2k", thumb: "bg-purple-800" },
  { id: 2, title: "La Evaluación Formativa en la NEM", duration: "04:12", views: "980", thumb: "bg-indigo-800" }
];

export default function App() {
  const [authState, setAuthState] = useState('logged_out'); 
  const [currentView, setCurrentView] = useState('dashboard');
  const [userLevel, setUserLevel] = useState('Primaria');
  const [selectedInfographic, setSelectedInfographic] = useState(mockInfographics[0]);
  const [selectedVideo, setSelectedVideo] = useState(mockVideos[0]);

  // --- COMPONENTES DE VENTA Y LOGIN ---
  const LoginScreen = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-5xl w-full flex flex-col md:flex-row">
        <div className="md:w-1/2 bg-emerald-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"><BrainCircuit size={32} className="text-white" /></div>
              <h1 className="text-3xl font-black tracking-tight">USICAMM AI</h1>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-6">Tu plaza y tu promoción, a un solo clic de distancia.</h2>
            <p className="text-emerald-50 text-lg leading-relaxed mb-8">Únete a miles de docentes que estudian de forma inteligente. Simuladores con casos prácticos, infografías automáticas y un Tutor IA disponible 24/7.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-100"><CheckCircle2 className="text-emerald-300"/> Simulador alineado a la NEM</div>
              <div className="flex items-center gap-3 text-emerald-100"><CheckCircle2 className="text-emerald-300"/> Estrategias de descarte (Tips IA)</div>
              <div className="flex items-center gap-3 text-emerald-100"><CheckCircle2 className="text-emerald-300"/> Estudia desde tu celular</div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Bienvenido de nuevo</h3>
          <p className="text-slate-500 mb-8">Ingresa a tu panel de estudio.</p>
          <button onClick={() => setAuthState('paywall')} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all mb-6">
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continuar con Google
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div><span className="text-slate-400 text-sm font-medium">O usa tu correo</span><div className="h-px bg-slate-200 flex-1"></div>
          </div>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Correo Institucional o Personal</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="email" placeholder="maestro@escuela.edu.mx" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" /></div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
              <div className="relative"><KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" /></div>
            </div>
          </div>
          <button onClick={() => setAuthState('paywall')} className="w-full bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-slate-800 transition-all flex justify-center items-center gap-2">
            Entrar a la Plataforma <ChevronRight size={20}/>
          </button>
        </div>
      </div>
    </div>
  );

  const PaywallScreen = () => (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-12 px-4 animate-in slide-in-from-bottom-8 duration-500">
      <div className="max-w-3xl text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full font-bold text-sm mb-6"><ShieldCheck size={18} /> Cuenta Creada Exitosamente</div>
        <h2 className="text-4xl font-black text-white mb-4">Elige tu Plan de Estudio</h2>
        <p className="text-xl text-slate-400">Desbloquea el simulador completo, infografías y al Tutor IA.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 flex flex-col">
          <h3 className="text-2xl font-bold text-white mb-2">Diagnóstico Gratuito</h3>
          <p className="text-slate-400 mb-6">Para conocer la plataforma.</p>
          <div className="text-4xl font-black text-white mb-8">$0 <span className="text-lg text-slate-500 font-medium">MXN</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="text-emerald-500 shrink-0"/> 1 Examen diagnóstico de 10 preguntas.</li>
            <li className="flex items-start gap-3 text-slate-500"><XCircle className="text-slate-600 shrink-0"/> Sin acceso al Tutor IA ni tips.</li>
          </ul>
          <button className="w-full py-4 rounded-xl font-bold bg-slate-700 text-white">Hacer prueba gratis</button>
        </div>
        <div className="bg-gradient-to-b from-emerald-600 to-emerald-900 rounded-3xl p-8 border border-emerald-500 shadow-2xl relative flex flex-col transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-950 font-black px-4 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg"><Star size={16} fill="currentColor"/> EL MÁS ELEGIDO</div>
          <h3 className="text-2xl font-bold text-white mb-2">Pase USICAMM (Temporada)</h3>
          <p className="text-emerald-100 mb-6">Acceso total hasta el día de tu examen.</p>
          <div className="text-4xl font-black text-white mb-8">$899 <span className="text-lg text-emerald-200 font-medium">MXN</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-white"><CheckCircle2 className="text-emerald-300 shrink-0"/> Simulador ilimitado (Todas las áreas).</li>
            <li className="flex items-start gap-3 text-white"><CheckCircle2 className="text-emerald-300 shrink-0"/> Tutor IA explicando cada error.</li>
            <li className="flex items-start gap-3 text-white"><CheckCircle2 className="text-emerald-300 shrink-0"/> Galería de infografías y videos.</li>
          </ul>
          <button onClick={() => setAuthState('authenticated')} className="w-full py-4 rounded-xl font-black text-lg bg-white text-emerald-900 hover:bg-slate-100 shadow-xl flex justify-center items-center gap-2">
            <CreditCard size={24} /> Pagar con Mercado Pago
          </button>
        </div>
      </div>
    </div>
  );

  // --- COMPONENTES INTERNOS ---
  const Dashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div><h2 className="text-2xl font-bold text-slate-800">¡Hola, Profe! 👋</h2><p className="text-slate-500">Tu objetivo: Promoción Horizontal {userLevel} 2025-2026</p></div>
        <div className="flex gap-4">
          <div className="text-right"><p className="text-sm font-semibold text-emerald-600">Suscripción Activa</p><p className="text-xl font-bold text-slate-800">Pase USICAMM</p></div>
          <div className="w-16 h-16 rounded-full border-4 border-emerald-100 flex items-center justify-center border-t-emerald-500 bg-emerald-50"><Star className="text-emerald-500" fill="currentColor" /></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer" onClick={() => setCurrentView('simulator')}>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><BrainCircuit size={24} /></div>
          <h3 className="font-bold text-lg text-slate-800">Simulador IA</h3><p className="text-slate-500 text-sm mt-2">Reactivos y retroalimentación pedagógica.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer" onClick={() => setCurrentView('resources')}>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4"><ImageIcon size={24} /></div>
          <h3 className="font-bold text-lg text-slate-800">Infografías</h3><p className="text-slate-500 text-sm mt-2">Resúmenes visuales de Acuerdos y Leyes.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer" onClick={() => setCurrentView('videos')}>
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4"><PlayCircle size={24} /></div>
          <h3 className="font-bold text-lg text-slate-800">Video Resúmenes</h3><p className="text-slate-500 text-sm mt-2">Micro-learning en video de 3 minutos.</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center"><BarChart3 className="mr-2 text-slate-400" /> Tu desempeño por áreas</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="font-medium text-slate-700">Área 1: Aspectos Normativos</span><span className="text-emerald-600 font-bold">85%</span></div>
            <div className="w-full bg-slate-100 rounded-full h-2.5"><div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '85%' }}></div></div>
          </div>
        </div>
      </div>
    </div>
  );

  const Simulator = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isEvaluated, setIsEvaluated] = useState(false);
    const question = mockQuestions[currentIndex];

    return (
      <div className="max-w-4xl mx-auto animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{question.type}</span>
            <span className="ml-2 text-sm text-slate-500 font-medium">{question.area}</span>
          </div>
          <div className="text-slate-500 font-medium">Reactivo {currentIndex + 1} de {mockQuestions.length}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100"><h3 className="text-xl font-medium text-slate-800 leading-relaxed whitespace-pre-line">{question.base}</h3></div>
          <div className="p-8 space-y-4 bg-slate-50/50">
            {question.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isCorrect = isEvaluated && opt.id === question.correct;
              const isWrongSelected = isEvaluated && isSelected && opt.id !== question.correct;
              let optionClasses = "w-full text-left p-5 rounded-xl border-2 transition-all flex items-start gap-4 ";
              if (!isEvaluated) optionClasses += isSelected ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:border-emerald-200";
              else if (isCorrect) optionClasses += "border-emerald-500 bg-emerald-50";
              else if (isWrongSelected) optionClasses += "border-red-500 bg-red-50";
              else optionClasses += "border-slate-200 bg-white opacity-50";

              return (
                <button key={opt.id} onClick={() => !isEvaluated && setSelectedOption(opt.id)} disabled={isEvaluated} className={optionClasses}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${isSelected && !isEvaluated ? 'bg-emerald-500 border-emerald-600 text-white' : ''} ${isCorrect ? 'bg-emerald-500 text-white' : ''} ${isWrongSelected ? 'bg-red-500 text-white' : ''} ${!isSelected && !isEvaluated ? 'bg-slate-100 text-slate-600' : ''}`}>{opt.id}</div>
                  <span className={`text-lg pt-0.5 ${isCorrect ? 'font-medium text-emerald-900' : 'text-slate-700'}`}>{opt.text}</span>
                  {isCorrect && <CheckCircle2 className="ml-auto text-emerald-500 shrink-0 mt-0.5" />}
                  {isWrongSelected && <XCircle className="ml-auto text-red-500 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {isEvaluated && (
          <div className="mt-6 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className={`p-6 rounded-2xl border ${selectedOption === question.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <h4 className={`font-bold flex items-center gap-2 mb-2 ${selectedOption === question.correct ? 'text-emerald-800' : 'text-red-800'}`}>
                {selectedOption === question.correct ? <><CheckCircle2 size={20}/> ¡Correcta!</> : <><XCircle size={20}/> Incorrecta</>}
              </h4>
              <p className="text-slate-800"><strong className="text-slate-900">Explicación Oficial:</strong> {question.argumentation}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-inner">
              <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2"><Lightbulb size={20} className="text-amber-500" fill="currentColor"/> Consejo del Tutor IA</h4>
              <p className="text-blue-900 font-medium">{question.aiTip}</p>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-4 pb-12">
          {!isEvaluated ? (
            <button onClick={() => selectedOption && setIsEvaluated(true)} disabled={!selectedOption} className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${selectedOption ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>Verificar Respuesta</button>
          ) : (
            <button onClick={() => { if(currentIndex < mockQuestions.length - 1) { setCurrentIndex(currentIndex + 1); setSelectedOption(null); setIsEvaluated(false); } else { setCurrentView('dashboard'); } }} className="px-8 py-3 rounded-xl font-bold text-lg transition-all bg-emerald-600 text-white flex items-center gap-2">
              {currentIndex < mockQuestions.length - 1 ? 'Siguiente Reactivo' : 'Finalizar Práctica'} <ChevronRight size={20}/>
            </button>
          )}
        </div>
      </div>
    );
  };

  const ResourcesGallery = () => (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3"><ImageIcon className="text-blue-500" /> Generador Visual IA</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockInfographics.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer" onClick={() => { setSelectedInfographic(item); setCurrentView('infographic_viewer'); }}>
            <div className={`h-40 ${item.color} flex flex-col items-center justify-center text-white relative`}><ImageIcon size={48} className="opacity-80 mb-2" /><span className="font-bold opacity-90">Ver Infografía</span></div>
            <div className="p-5"><h4 className="font-bold text-lg text-slate-800">{item.title}</h4><p className="text-slate-500 text-sm mt-1">{item.desc}</p></div>
          </div>
        ))}
      </div>
    </div>
  );

  const InfographicViewer = () => (
    <div className="animate-in slide-in-from-bottom-8 duration-500">
      <button onClick={() => setCurrentView('resources')} className="mb-6 flex items-center gap-2 text-slate-500 font-semibold"><ArrowLeft size={20} /> Volver a la galería</button>
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-3xl mx-auto">
        <div className={`${selectedInfographic.color} p-10 text-center text-white`}><h2 className="text-4xl font-black mb-4">{selectedInfographic.title}</h2><p className="text-lg opacity-90">{selectedInfographic.desc}</p></div>
        <div className="p-10 space-y-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          {selectedInfographic.points.map((point, idx) => (
            <div key={idx} className="flex gap-6 items-start bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${selectedInfographic.color}`}></div>
              <div className={`w-12 h-12 rounded-full ${selectedInfographic.color} flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md`}>{idx + 1}</div>
              <div><h4 className="text-xl font-bold text-slate-800 mb-2">{point.title}</h4><p className="text-slate-600 text-lg">{point.desc}</p></div>
            </div>
          ))}
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center"><button className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto"><FileText size={20} /> Descargar PDF</button></div>
      </div>
    </div>
  );

  const VideoResumenes = () => (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-black rounded-3xl overflow-hidden aspect-video relative flex items-center justify-center cursor-pointer shadow-xl">
          <div className={`absolute inset-0 ${selectedVideo.thumb} opacity-80 mix-blend-multiply`}></div>
          <div className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300"><Play className="text-white ml-2" size={32} fill="currentColor" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedVideo.title}</h2>
          <p className="text-slate-500">Video resumen de los documentos oficiales para repaso rápido.</p>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2"><PlayCircle className="text-purple-500" /> Siguiente en la lista</h3>
        {mockVideos.map(video => (
          <div key={video.id} onClick={() => setSelectedVideo(video)} className={`p-4 rounded-xl border-2 cursor-pointer flex gap-4 ${selectedVideo.id === video.id ? 'bg-purple-50 border-purple-200' : 'bg-white border-slate-100'}`}>
            <div className={`w-24 shrink-0 rounded-lg aspect-video ${video.thumb} flex items-center justify-center`}><Play size={16} className="text-white" fill="currentColor" /></div>
            <div><h4 className={`font-bold text-sm leading-tight mb-1 ${selectedVideo.id === video.id ? 'text-purple-900' : 'text-slate-800'}`}>{video.title}</h4><div className="text-xs text-slate-500"><Users size={12} className="inline mr-1"/> {video.views}</div></div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- CONTROLADOR GENERAL ---
  if (authState === 'logged_out') return <LoginScreen />;
  if (authState === 'paywall') return <PaywallScreen />;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3 text-white"><div className="bg-emerald-500 p-2 rounded-lg"><BrainCircuit size={24} /></div><h1 className="text-xl font-bold tracking-tight">USICAMM AI</h1></div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'hover:bg-slate-800 hover:text-white'}`}><LayoutDashboard size={20} /> Panel de Control</button>
          <button onClick={() => setCurrentView('simulator')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'simulator' ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'hover:bg-slate-800 hover:text-white'}`}><BookOpen size={20} /> Simulador Activo</button>
          <button onClick={() => setCurrentView('resources')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'resources' || currentView === 'infographic_viewer' ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'hover:bg-slate-800 hover:text-white'}`}><ImageIcon size={20} /> Recursos Visuales</button>
          <button onClick={() => setCurrentView('videos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'videos' ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'hover:bg-slate-800 hover:text-white'}`}><PlayCircle size={20} /> Video Resúmenes</button>
        </nav>
        <div className="p-4 border-t border-slate-800"><button onClick={() => setAuthState('logged_out')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-red-400 mt-1"><LogOut size={20} /> Cerrar Sesión</button></div>
      </aside>
      <main className="ml-72 flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="Buscar leyes o acuerdos..." className="w-full bg-slate-100 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none" /></div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
              {['Preescolar', 'Primaria', 'Secundaria'].map(level => (
                <button key={level} onClick={() => setUserLevel(level)} className={`px-3 py-1 rounded-md text-xs font-bold ${userLevel === level ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>{level}</button>
              ))}
            </div>
            <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">PM</div>
          </div>
        </header>
        <div className="flex-1 p-8">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'simulator' && <Simulator />}
          {currentView === 'resources' && <ResourcesGallery />}
          {currentView === 'infographic_viewer' && <InfographicViewer />}
          {currentView === 'videos' && <VideoResumenes />}
        </div>
      </main>
    </div>
  );
}
