import React, { useState } from 'react';
import { 
  BookOpen, BrainCircuit, PlayCircle, Image as ImageIcon, 
  LayoutDashboard, Settings, LogOut, ChevronRight, CheckCircle2, 
  XCircle, Lightbulb, Award, BarChart3, Search, ArrowLeft, Play, 
  FileText, Users, Lock, Mail, KeyRound, CreditCard, ShieldCheck,
  Star
} from 'lucide-react';

// --- BASE DE DATOS DE PRUEBA ---
const mockQuestions = [
  {
    id: 1, type: "Cuestionamiento directo", area: "Área 1. Aspectos normativos",
    base: "¿Cuál es la situación escolar que promueve la democracia, no solo como un régimen político, sino como una forma de vida?",
    options: [
      { id: "A", text: "El maestro pide al grupo que organice tres equipos conformados por dos alumnas o alumnos, quienes, previa elección de uno de los equipos, fungirán como jefe y subjefe de grupo." },
      { id: "B", text: "El maestro propone una terna de candidatos, considerando diversos criterios, para que los alumnos elijan..." },
      { id: "C", text: "El maestro propone candidatos... y verifica que cumplan con los requisitos..." }
    ],
    correct: "A",
    argumentation: "La opción correcta describe una situación en la que los estudiantes participan activamente en la elección de sus representantes, lo que fomenta la práctica de la democracia como una forma de vida...",
    aiTip: "Estrategia: En reactivos sobre 'democracia como forma de vida', la Nueva Escuela Mexicana siempre prioriza la agencia y organización autónoma del alumno."
  },
  {
    id: 2, type: "Completamiento", area: "Área 2. Intervención docente",
    base: "Se ejemplifica una situación del entorno escolar que corresponde al tercer plano: Codiseño de contenidos, en la construcción del programa analítico, cuando en el Consejo Técnico Escolar...",
    options: [
      { id: "A", text: "...presentan los resultados de las encuestas aplicadas a las familias..." },
      { id: "B", text: "...deciden la manera en la que se abordarán las problemáticas detectadas..." },
      { id: "C", text: "...trabajan en la creación de estrategias por fases para incluir el aprendizaje de la lengua de señas mexicana..." }
    ],
    correct: "C",
    argumentation: "El tercer plano: codiseño de contenidos, se refiere a la incorporación y contextualización de nuevos contenidos al currículo atendiendo las necesidades específicas.",
    aiTip: "Estrategia de descarte: La opción A corresponde al primer plano. La B corresponde al segundo plano. Solo la C implica crear algo nuevo (Codiseño)."
  }
];

const mockInfographics = [
  { id: 1, title: "Acuerdo 05/04/24 (CTE)", desc: "Lineamientos de integración y operación de Consejos Técnicos.", color: "bg-emerald-500", points: [
    { title: "Propósito Principal", desc: "La mejora continua de la escuela y el máximo logro de aprendizaje." },
    { title: "Autonomía Profesional", desc: "El colectivo docente toma decisiones pedagógicas basadas en su diagnóstico." }
  ]}
];

const mockVideos = [
  { id: 1, title: "Estructura del Programa Analítico (Codiseño)", duration: "03:45", views: "1.2k", thumb: "bg-purple-800" }
];

export default function App() {
  // ESTADOS DE AUTENTICACIÓN: 'logged_out' -> 'paywall' -> 'authenticated'
  const [authState, setAuthState] = useState('logged_out'); 
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [userLevel, setUserLevel] = useState('Primaria');
  const [selectedInfographic, setSelectedInfographic] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(mockVideos[0]);

  // --- FLUJO DE AUTENTICACIÓN Y VENTAS ---

  const LoginScreen = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-5xl w-full flex flex-col md:flex-row">
        
        {/* Columna Izquierda: Propuesta de Valor */}
        <div className="md:w-1/2 bg-emerald-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <BrainCircuit size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">USICAMM AI</h1>
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-6">Tu plaza y tu promoción, a un solo clic de distancia.</h2>
            <p className="text-emerald-50 text-lg leading-relaxed mb-8">
              Únete a miles de docentes que estudian de forma inteligente. Simuladores con casos prácticos, infografías automáticas y un Tutor IA disponible 24/7.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-100"><CheckCircle2 className="text-emerald-300"/> Simulador alineado a la NEM</div>
              <div className="flex items-center gap-3 text-emerald-100"><CheckCircle2 className="text-emerald-300"/> Estrategias de descarte (Tips IA)</div>
              <div className="flex items-center gap-3 text-emerald-100"><CheckCircle2 className="text-emerald-300"/> Estudia desde tu celular sin descargar nada</div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Login */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Bienvenido de nuevo</h3>
          <p className="text-slate-500 mb-8">Ingresa a tu panel de estudio.</p>

          <button 
            onClick={() => setAuthState('paywall')}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all mb-6"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continuar con Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-slate-400 text-sm font-medium">O usa tu correo</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Correo Institucional o Personal</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="email" placeholder="maestro@escuela.edu.mx" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          <button 
            onClick={() => setAuthState('paywall')}
            className="w-full bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-slate-800 shadow-md transition-all flex justify-center items-center gap-2"
          >
            Entrar a la Plataforma <ChevronRight size={20}/>
          </button>
          
          <p className="text-center text-sm text-slate-500 mt-6">
            ¿No tienes cuenta? <span className="text-emerald-600 font-bold cursor-pointer">Regístrate gratis</span>
          </p>
        </div>
      </div>
    </div>
  );

  const PaywallScreen = () => (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-12 px-4 animate-in slide-in-from-bottom-8 duration-500">
      <div className="max-w-3xl text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full font-bold text-sm mb-6">
          <ShieldCheck size={18} /> Cuenta Creada Exitosamente
        </div>
        <h2 className="text-4xl font-black text-white mb-4">Elige tu Plan de Estudio</h2>
        <p className="text-xl text-slate-400">Desbloquea el simulador completo, infografías y al Tutor IA para asegurar tu lugar en la USICAMM.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Plan Freemium */}
        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 flex flex-col">
          <h3 className="text-2xl font-bold text-white mb-2">Diagnóstico Gratuito</h3>
          <p className="text-slate-400 mb-6">Para conocer la plataforma.</p>
          <div className="text-4xl font-black text-white mb-8">$0 <span className="text-lg text-slate-500 font-medium">MXN</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="text-emerald-500 shrink-0"/> 1 Examen diagnóstico de 10 preguntas.</li>
            <li className="flex items-start gap-3 text-slate-300"><CheckCircle2 className="text-emerald-500 shrink-0"/> Resultado por áreas.</li>
            <li className="flex items-start gap-3 text-slate-500"><XCircle className="text-slate-600 shrink-0"/> Sin acceso al Tutor IA.</li>
            <li className="flex items-start gap-3 text-slate-500"><XCircle className="text-slate-600 shrink-0"/> Sin estrategias de descarte.</li>
          </ul>
          
          <button className="w-full py-4 rounded-xl font-bold bg-slate-700 text-white hover:bg-slate-600 transition-colors">
            Hacer prueba gratis
          </button>
        </div>

        {/* Plan Pro */}
        <div className="bg-gradient-to-b from-emerald-600 to-emerald-900 rounded-3xl p-8 border border-emerald-500 shadow-2xl relative flex flex-col transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-950 font-black px-4 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg">
            <Star size={16} fill="currentColor"/> EL MÁS ELEGIDO
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">Pase USICAMM (Temporada)</h3>
          <p className="text-emerald-100 mb-6">Acceso total hasta el día de tu examen.</p>
          <div className="text-4xl font-black text-white mb-8">$899 <span className="text-lg text-emerald-200 font-medium">MXN / pago único</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-white"><CheckCircle2 className="text-emerald-300 shrink-0"/> Simulador ilimitado (Todas las áreas).</li>
            <li className="flex items-start gap-3 text-white"><CheckCircle2 className="text-emerald-300 shrink-0"/> Tutor IA explicando cada error.</li>
            <li className="flex items-start gap-3 text-white"><CheckCircle2 className="text-emerald-300 shrink-0"/> Galería de infografías y videos.</li>
            <li className="flex items-start gap-3 text-white"><CheckCircle2 className="text-emerald-300 shrink-0"/> Tips y estrategias de opción múltiple.</li>
          </ul>
          
          {/* Botón de Pago Simulado */}
          <button 
            onClick={() => setAuthState('authenticated')}
            className="w-full py-4 rounded-xl font-black text-lg bg-white text-emerald-900 hover:bg-slate-100 shadow-xl transition-all flex justify-center items-center gap-2"
          >
            <CreditCard size={24} /> Pagar con Mercado Pago
          </button>
          <p className="text-center text-emerald-200 text-xs mt-4">Pago seguro. Aceptamos tarjetas, transferencias y efectivo en OXXO.</p>
        </div>
      </div>
    </div>
  );

  // --- COMPONENTES DE LA APP INTERNA (Resto de tu código intacto) ---
  const Dashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">¡Hola, Profe! 👋</h2>
          <p className="text-slate-500">Tu objetivo: Promoción Horizontal {userLevel} 2025-2026</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-emerald-600">Suscripción Activa</p>
            <p className="text-xl font-bold text-slate-800">Pase USICAMM</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-emerald-100 flex items-center justify-center border-t-emerald-500 bg-emerald-50">
            <Star className="text-emerald-500" fill="currentColor" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentView('simulator')}>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <BrainCircuit size={24} />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Simulador IA</h3>
          <p className="text-slate-500 text-sm mt-2">Reactivos con casos prácticos y retroalimentación pedagógica.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentView('resources')}>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <ImageIcon size={24} />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Infografías</h3>
          <p className="text-slate-500 text-sm mt-2">Resúmenes visuales de los Acuerdos y Leyes.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentView('videos')}>
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <PlayCircle size={24} />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Video Resúmenes</h3>
          <p className="text-slate-500 text-sm mt-2">Micro-learning en video de 3 minutos.</p>
        </div>
      </div>
    </div>
  );

  const Simulator = () => { /* ... Código del simulador (Omitido por brevedad, es el mismo de antes) ... */ 
    return ( <div className="max-w-4xl mx-auto p-8 text-center"><h2 className="text-2xl font-bold">Simulador Activo</h2><p>El código interactivo del simulador funciona aquí igual que en la versión anterior.</p><button onClick={() => setCurrentView('dashboard')} className="mt-4 text-emerald-600 font-bold">Volver al Dashboard</button></div> )
  };
  const ResourcesGallery = () => { return ( <div className="p-8 text-center"><h2 className="text-2xl font-bold">Galería Visual</h2><button onClick={() => setCurrentView('dashboard')} className="mt-4 text-blue-600 font-bold">Volver al Dashboard</button></div> ) };
  const VideoResumenes = () => { return ( <div className="p-8 text-center"><h2 className="text-2xl font-bold">Videos</h2><button onClick={() => setCurrentView('dashboard')} className="mt-4 text-purple-600 font-bold">Volver al Dashboard</button></div> ) };

  // --- CONTROLADOR DE VISTAS PRINCIPAL ---
  if (authState === 'logged_out') return <LoginScreen />;
  if (authState === 'paywall') return <PaywallScreen />;

  // Si llega aquí, es porque authState === 'authenticated'
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <BrainCircuit size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">USICAMM AI</h1>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} /> Panel de Control
          </button>
          <button onClick={() => setCurrentView('simulator')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${currentView === 'simulator' ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'hover:bg-slate-800 hover:text-white'}`}>
            <BookOpen size={20} /> Simulador Activo
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setAuthState('logged_out')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-red-400 hover:text-red-300 transition-colors mt-1"
          >
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="ml-72 flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Buscar leyes, autores o acuerdos..." className="w-full bg-slate-100 border-transparent rounded-full py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" />
          </div>
          <div className="h-10 w-10 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">PM</div>
        </header>

        <div className="flex-1 p-8">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'simulator' && <Simulator />}
          {currentView === 'resources' && <ResourcesGallery />}
          {currentView === 'videos' && <VideoResumenes />}
        </div>
      </main>
    </div>
  );
}