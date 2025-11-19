
import React, { useState, useRef, useEffect } from 'react';
import { AppMode, ProjectState, RoleType, ProjectConfig, Contribution, Phase2Data, Phase3Data, Phase4Data, Phase5Data, PhaseContent } from './types';
import { ZONES, ROLES, PHASES, CURRICULUM, INITIAL_PHASE_2, INITIAL_PHASE_3, INITIAL_PHASE_4, INITIAL_PHASE_5, ROLE_DEFINITIONS, ODS_LIST } from './constants';
import { Download, Upload, FileJson, Users, ChevronRight, Printer, ArrowLeft, Save, Map, BookOpen, LayoutDashboard, CheckCircle, Globe, Target, Calendar, RotateCcw, Trash2, AlertTriangle, UserPlus } from 'lucide-react';
import { TextPhaseEditor, Phase1Editor, Phase2Editor, Phase3Editor, Phase4Editor, Phase5Editor } from './components/PhaseEditors';

// --- Sub-components ---

const Landing: React.FC<{ onSelectMode: (mode: AppMode) => void, hasSavedSession: boolean, onResume: () => void, onClear: () => void }> = ({ onSelectMode, hasSavedSession, onResume, onClear }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900 text-white px-4 relative overflow-hidden">
    
    {/* Background Decor */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
    </div>

    <div className="max-w-2xl text-center space-y-8 z-10">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/20 ring-4 ring-emerald-500/50">
           <span className="text-5xl">🥗</span>
        </div>
      </div>
      <div>
        <h1 className="text-6xl font-extrabold tracking-tight mb-2">Gastro<span className="text-emerald-400">Sostenible</span></h1>
        <h2 className="text-2xl text-indigo-200 font-light">Gestor de Proyectos de Hostelería</h2>
      </div>
      
      <p className="text-lg text-slate-300 leading-relaxed max-w-lg mx-auto">
        Plataforma offline-first con metodología Flujo Puzle. Gestiona roles, integra aportes y genera tu memoria final automáticamente.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        {hasSavedSession ? (
          <div className="flex flex-col gap-3 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-4">
             <button 
              onClick={onResume}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Continuar Sesión Anterior
            </button>
            <button 
              onClick={() => { if(window.confirm("¿Seguro que quieres borrar los datos guardados y empezar de cero?")) onClear(); }}
              className="px-4 py-2 text-slate-400 hover:text-red-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Borrar y Empezar de Nuevo
            </button>
          </div>
        ) : (
          <button 
            onClick={() => onSelectMode(AppMode.SETUP)}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-900/50 transition-all transform hover:scale-105"
          >
            Comenzar Nuevo Proyecto
          </button>
        )}
      </div>
    </div>
  </div>
);

const SetupConfig: React.FC<{ onComplete: (config: ProjectConfig) => void, onCancel: () => void, onImport: (file: File) => void }> = ({ onComplete, onCancel, onImport }) => {
  const [config, setConfig] = useState<ProjectConfig>({
    projectName: '',
    teamName: '',
    groupNumber: '',
    deliveryDate: '',
    zone: '',
    members: ROLE_DEFINITIONS.map(def => ({ name: '', role: def.role, tasks: '' })),
    createdAt: new Date().toISOString()
  });

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...config.members];
    (newMembers[index] as any)[field] = value;
    setConfig(prev => ({ ...prev, members: newMembers }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onImport(e.target.files[0]);
  };
  
  const isFormValid = config.projectName && config.teamName && config.zone && config.members.every(m => m.name.trim().length > 0);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 animate-in fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Fase 1: Configuración del Arquitecto</h2>
            <h3 className="text-xl text-indigo-600 font-semibold mt-1">Roles y Datos del Proyecto</h3>
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 flex items-center gap-2 transition-colors shadow-sm">
              <Upload className="w-4 h-4" /> Cargar Config Existente
              <input type="file" accept=".json" className="hidden" onChange={handleFileChange} />
            </label>
            <button onClick={onCancel} className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-medium">Salir</button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <LayoutDashboard className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-800">Datos Generales del Equipo</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1"><label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Equipo</label><input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" value={config.teamName} onChange={(e) => setConfig({...config, teamName: e.target.value})} placeholder="Ej: Los Innovadores del Sabor" /></div>
              <div className="col-span-1"><label className="block text-sm font-bold text-slate-700 mb-2">Número de Grupo</label><input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" value={config.groupNumber || ''} onChange={(e) => setConfig({...config, groupNumber: e.target.value})} placeholder="Ej: G-04" /></div>
              <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Proyecto</label><input type="text" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" value={config.projectName} onChange={(e) => setConfig({...config, projectName: e.target.value})} placeholder="Ej: GastroMurcia Experience" /></div>
              <div className="col-span-1"><label className="block text-sm font-bold text-slate-700 mb-2">Fecha de Entrega</label><input type="date" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" value={config.deliveryDate || ''} onChange={(e) => setConfig({...config, deliveryDate: e.target.value})} /></div>
              <div className="col-span-1"><label className="block text-sm font-bold text-slate-700 mb-2">Zona Gastronómica</label><select className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${config.zone ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-300'}`} value={config.zone} onChange={(e) => setConfig({...config, zone: e.target.value})}><option value="" disabled>-- Selecciona una Zona --</option>{ZONES.map(z => <option key={z} value={z}>{z.split('(')[0].trim()}</option>)}</select></div>
            </div>
          </div>

          <div>
             <div className="flex items-center gap-3 mb-6 px-2">
              <Users className="w-6 h-6 text-indigo-600" />
              <h3 className="text-2xl font-bold text-slate-800">Asignación de Roles</h3>
            </div>
            <div className="space-y-6">
              {ROLE_DEFINITIONS.map((roleDef, idx) => {
                const member = config.members.find(m => m.role === roleDef.role) || { name: '', tasks: '' };
                const memberIndex = config.members.indexOf(member);
                return (
                  <div key={roleDef.role} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                    <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-start md:items-center gap-4">
                      <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold shadow-sm">{idx + 1}</div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                          <h4 className="text-lg font-bold text-slate-900">{roleDef.role}</h4>
                          <span className="text-sm text-indigo-600 font-medium">| {roleDef.tagline}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Responsabilidades</label>
                        <ul className="space-y-2">{roleDef.officialTasks.map((task, i) => (<li key={i} className="flex items-start gap-2 text-sm text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div><span>{task}</span></li>))}</ul>
                      </div>
                      <div className="space-y-4">
                         <div><label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Alumno/a</label><input type="text" placeholder="Nombre completo" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50" value={member.name} onChange={(e) => updateMember(memberIndex, 'name', e.target.value)} /></div>
                         <div><label className="block text-sm font-bold text-slate-700 mb-2">Notas Adicionales</label><textarea placeholder="Tareas extra..." className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 h-24 resize-none text-sm" value={member.tasks} onChange={(e) => updateMember(memberIndex, 'tasks', e.target.value)} /></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sticky bottom-0 bg-white/90 backdrop-blur-md p-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2 text-sm text-slate-500"><CheckCircle className={`w-5 h-5 ${isFormValid ? 'text-emerald-500' : 'text-slate-300'}`} /><span>Asegúrate de que todos los nombres sean correctos.</span></div>
            <button onClick={() => onComplete(config)} disabled={!isFormValid} className="w-full md:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2"><FileJson className="w-5 h-5" /> Exportar Configuración</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper for Smart Import Modal ---
const SmartImportModal: React.FC<{
  candidate: any, 
  members: any[], 
  onConfirm: (author: string) => void, 
  onCancel: () => void 
}> = ({ candidate, members, onConfirm, onCancel }) => {
  const [selectedMember, setSelectedMember] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
           <h3 className="text-xl font-bold flex items-center gap-2">
             <UserPlus className="w-6 h-6" /> Asignar Autoría
           </h3>
           <p className="text-indigo-100 text-sm mt-1">Has subido un archivo. ¿A qué miembro del equipo corresponde este aporte?</p>
        </div>
        
        <div className="p-6 space-y-4">
           <div className="bg-slate-50 p-4 rounded border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Contenido Detectado</p>
              <p className="font-medium text-slate-800">Fase: {PHASES.find(p => p.id === candidate.phaseId)?.title || candidate.phaseId}</p>
              <p className="text-sm text-slate-500">Autor original en archivo: <span className="font-mono">{candidate.author}</span></p>
           </div>

           <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">Seleccionar Miembro del Equipo:</label>
             <select 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
             >
                <option value="">-- Seleccionar Alumno --</option>
                {members.map(m => (
                  <option key={m.name} value={m.name}>{m.name} - {m.role}</option>
                ))}
             </select>
           </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onCancel} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium">Cancelar</button>
          <button 
             onClick={() => onConfirm(selectedMember)}
             disabled={!selectedMember}
             className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold disabled:opacity-50 transition-colors"
          >
            Confirmar e Importar
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // State
  const [mode, setMode] = useState<AppMode>(AppMode.LANDING);
  const [projectState, setProjectState] = useState<ProjectState>({
    config: null,
    phases: { phase1: '', phase2: INITIAL_PHASE_2, phase3: INITIAL_PHASE_3, phase4: INITIAL_PHASE_4, phase5: INITIAL_PHASE_5 },
    lastModifiedBy: 'Sistema',
    lastModifiedDate: new Date().toISOString()
  });
  
  const [activePhaseId, setActivePhaseId] = useState('phase1');
  const [currentUser, setCurrentUser] = useState('');
  const [view, setView] = useState<'editor' | 'roadmap' | 'curriculum' | 'print'>('editor');
  const [hasSavedSession, setHasSavedSession] = useState(false);

  // Smart Import State
  const [importCandidate, setImportCandidate] = useState<any>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  // --- Persistence & Lifecycle ---

  // 1. Check for saved session on mount
  useEffect(() => {
    const savedData = localStorage.getItem('gastro_project_data');
    if (savedData) {
      setHasSavedSession(true);
    }
  }, []);

  // 2. Auto-save whenever state changes
  useEffect(() => {
    if (mode === AppMode.WORKSPACE && projectState.config) {
      localStorage.setItem('gastro_project_data', JSON.stringify(projectState));
      localStorage.setItem('gastro_mode', mode);
      if (currentUser) localStorage.setItem('gastro_current_user', currentUser);
      localStorage.setItem('gastro_active_phase', activePhaseId);
    }
  }, [projectState, mode, currentUser, activePhaseId]);

  // 3. Prevent accidental close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (mode === AppMode.WORKSPACE) {
        e.preventDefault();
        e.returnValue = ''; // Legacy support
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [mode]);

  // --- Handlers ---

  const handleResumeSession = () => {
    try {
      const savedData = localStorage.getItem('gastro_project_data');
      const savedUser = localStorage.getItem('gastro_current_user');
      const savedPhase = localStorage.getItem('gastro_active_phase');
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Ensure new phases exist if old save
        if(!parsed.phases.phase5) parsed.phases.phase5 = INITIAL_PHASE_5;
        
        setProjectState(parsed);
        if (savedUser) setCurrentUser(savedUser);
        if (savedPhase) setActivePhaseId(savedPhase);
        setMode(AppMode.WORKSPACE);
      }
    } catch (e) {
      console.error("Error restoring session", e);
      alert("Error al restaurar la sesión anterior. Los datos pueden estar corruptos.");
    }
  };

  const handleClearSession = () => {
    localStorage.removeItem('gastro_project_data');
    localStorage.removeItem('gastro_mode');
    localStorage.removeItem('gastro_current_user');
    localStorage.removeItem('gastro_active_phase');
    setHasSavedSession(false);
    setProjectState({
      config: null,
      phases: { phase1: '', phase2: INITIAL_PHASE_2, phase3: INITIAL_PHASE_3, phase4: INITIAL_PHASE_4, phase5: INITIAL_PHASE_5 },
      lastModifiedBy: 'Sistema',
      lastModifiedDate: new Date().toISOString()
    });
  };

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfigComplete = (config: ProjectConfig) => {
    setProjectState(prev => ({ ...prev, config }));
    downloadJSON(config, `Configuracion_${config.teamName.replace(/\s+/g, '_')}.json`);
    setMode(AppMode.WORKSPACE);
  };

  const handleImportConfig = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.config && json.phases) {
             if(!json.phases.phase5) json.phases.phase5 = INITIAL_PHASE_5; // Migration
             setProjectState(json); // Full restore
        } else if (json.teamName) {
             setProjectState(prev => ({ ...prev, config: json })); // Config only
        }
        setMode(AppMode.WORKSPACE);
      } catch (err) {
        alert("Error al leer el archivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  // Reads file but pauses for "Who is this?" check
  const handleImportContributionFile = (file: File) => {
     const reader = new FileReader();
     reader.onload = (e) => {
       try {
         const json = JSON.parse(e.target?.result as string);
         if (!json.phaseId && !json.config) throw new Error("Formato desconocido");
         
         // If it's a Contribution, ask for Author
         if (json.phaseId) {
           setImportCandidate(json);
           setShowImportModal(true);
         } else {
           // Fallback for full project import inside workspace (overwrite)
           if (window.confirm("Has subido un archivo de Proyecto Completo. ¿Quieres sobrescribir todo tu trabajo actual?")) {
             if(!json.phases.phase5) json.phases.phase5 = INITIAL_PHASE_5;
             setProjectState(json);
           }
         }
       } catch (err) {
         alert("Error: Archivo inválido.");
       }
     };
     reader.readAsText(file);
  };

  // The actual logic that runs AFTER the Coordinator confirms "This file is from Maria"
  const executeSmartMerge = (authorName: string) => {
    if (!importCandidate) return;
    
    setProjectState(prev => {
      const newPhases = { ...prev.phases };
      const contrib = { ...importCandidate, author: authorName }; // Override author
      
      // SMART MERGE LOGIC
      if (contrib.phaseId === 'phase2') {
          const currentP2 = newPhases.phase2 as Phase2Data;
          const incomingP2 = contrib.content as Phase2Data;
          
          const mergedTrends = [...currentP2.trends, ...incomingP2.trends.map(p => ({...p, author: authorName}))];
          const mergedPublic = [...currentP2.publicAnalysis, ...incomingP2.publicAnalysis.map(c => ({...c, author: authorName}))];
          const mergedMenu = [...currentP2.menuBenchmarking, ...incomingP2.menuBenchmarking.map(d => ({...d, author: authorName}))];
          const mergedGraphs = [...currentP2.graphs, ...incomingP2.graphs.map(g => ({...g, author: authorName}))];

          const newSynthesis = currentP2.synthesis 
            ? `${currentP2.synthesis}\n\n--- Aportación de ${authorName}: ---\n${incomingP2.synthesis}`
            : incomingP2.synthesis;

          const newConcept = { ...currentP2.concept };
          // Only overwrite if empty
          if(!newConcept.name) newConcept.name = incomingP2.concept.name;
          if(!newConcept.restaurantType) newConcept.restaurantType = incomingP2.concept.restaurantType;
          if(!newConcept.culinaryStyle) newConcept.culinaryStyle = incomingP2.concept.culinaryStyle;
          if(!newConcept.targetAudience) newConcept.targetAudience = incomingP2.concept.targetAudience;
          if(!newConcept.averagePrice) newConcept.averagePrice = incomingP2.concept.averagePrice;
          if(!newConcept.description) newConcept.description = incomingP2.concept.description;

          const mergedRefs = [...new Set([...currentP2.references, ...incomingP2.references])];
          const mergedReports = [...currentP2.weeklyReports, ...incomingP2.weeklyReports];

          newPhases.phase2 = {
            specificFocus: currentP2.specificFocus,
            trends: mergedTrends,
            publicAnalysis: mergedPublic,
            menuBenchmarking: mergedMenu,
            graphs: mergedGraphs,
            synthesis: newSynthesis,
            concept: newConcept,
            zoneMapDescription: currentP2.zoneMapDescription || incomingP2.zoneMapDescription,
            references: mergedRefs,
            weeklyReports: mergedReports
          };

      } else if (contrib.phaseId === 'phase3') {
          const currentP3 = newPhases.phase3 as Phase3Data;
          const incomingP3 = contrib.content as Phase3Data;
          // Merge logic same as before...
          const mergedProductList = currentP3.products.list + (incomingP3.products.list ? `\n\n[${authorName}]: ${incomingP3.products.list}` : '');
          const mergedDishes = [...currentP3.menu, ...incomingP3.menu.map(d => ({...d, author: authorName}))];
          const mergedRefs = [...new Set([...currentP3.references, ...incomingP3.references])];

          newPhases.phase3 = {
             ...currentP3,
             products: { ...currentP3.products, list: mergedProductList },
             menu: mergedDishes,
             references: mergedRefs
          };

      } else {
          // Text phases & Simple overwrites
          (newPhases as any)[contrib.phaseId] = contrib.content;
      }
      
      alert(`¡Datos de ${authorName} importados en ${contrib.phaseId}!`);

      return {
          ...prev,
          phases: newPhases,
          lastModifiedBy: `Merge (${authorName})`,
          lastModifiedDate: new Date().toISOString()
      };
    });

    setShowImportModal(false);
    setImportCandidate(null);
  };

  const handleExportContribution = () => {
    if (!currentUser) return alert("Por favor, selecciona tu nombre/rol en la barra lateral antes de exportar.");
    
    const currentContent = (projectState.phases as any)[activePhaseId];
    const contribution: Contribution = {
      phaseId: activePhaseId,
      author: currentUser,
      content: currentContent,
      timestamp: new Date().toISOString()
    };
    
    downloadJSON(contribution, `Aporte_${currentUser.replace(/\s+/g, '')}_${activePhaseId}.json`);
  };

  const handleExportFullProject = () => {
    downloadJSON(projectState, `Memoria_Final_${projectState.config?.teamName.replace(/\s+/g, '_')}.json`);
  };

  const handlePhaseUpdate = (data: any) => {
    setProjectState(prev => ({
      ...prev,
      phases: {
        ...prev.phases,
        [activePhaseId]: data
      },
      lastModifiedBy: currentUser || 'Anonimo',
      lastModifiedDate: new Date().toISOString()
    }));
  };

  if (mode === AppMode.LANDING) {
    return <Landing onSelectMode={(m) => setMode(m)} hasSavedSession={hasSavedSession} onResume={handleResumeSession} onClear={handleClearSession} />;
  }

  if (mode === AppMode.SETUP) {
    return <SetupConfig onComplete={handleConfigComplete} onCancel={() => setMode(AppMode.LANDING)} onImport={handleImportConfig} />;
  }

  const activePhaseDef = PHASES.find(p => p.id === activePhaseId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row print:bg-white">
      
      {/* Smart Import Modal Overlay */}
      {showImportModal && (
        <SmartImportModal 
          candidate={importCandidate}
          members={projectState.config?.members || []}
          onConfirm={executeSmartMerge}
          onCancel={() => { setShowImportModal(false); setImportCandidate(null); }}
        />
      )}

      <aside className="w-full md:w-72 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 no-print z-20">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-white font-bold text-xl truncate">{projectState.config?.projectName || "Sin Nombre"}</h2>
          <p className="text-xs text-slate-500 mt-1">{projectState.config?.teamName} • {projectState.config?.zone}</p>
        </div>

        <div className="p-4 border-b border-slate-800 bg-slate-800/50">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-indigo-400 flex items-center gap-1">
             <Users className="w-3 h-3" /> Tu Identidad Actual
          </label>
          <select 
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
          >
            <option value="">-- Seleccionar Quién Eres --</option>
            {projectState.config?.members.map(m => (
              <option key={m.name} value={m.name}>{m.name} ({m.role})</option>
            ))}
          </select>
          {!currentUser && <div className="text-[10px] text-orange-400 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Selecciona rol para editar</div>}
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="text-xs font-bold uppercase text-slate-500 mb-3 px-2">Fases del Proyecto</div>
            <ul className="space-y-1">
              {PHASES.map(phase => (
                <li key={phase.id}>
                  <button
                    onClick={() => { setActivePhaseId(phase.id); setView('editor'); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activePhaseId === phase.id && view === 'editor' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
                  >
                    <span className="opacity-75 text-xs bg-slate-800 px-1.5 py-0.5 rounded">{phase.id.replace('phase', 'F')}</span>
                    <span className="truncate text-left">{phase.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <div className="text-xs font-bold uppercase text-slate-500 mb-3 px-2">Recursos</div>
             <ul className="space-y-1">
               <li><button onClick={() => setView('roadmap')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${view === 'roadmap' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><Map className="w-4 h-4" /> Guía Didáctica</button></li>
               <li><button onClick={() => setView('curriculum')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${view === 'curriculum' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><BookOpen className="w-4 h-4" /> Guía Evaluación</button></li>
               <li><button onClick={() => setView('print')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${view === 'print' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><Printer className="w-4 h-4" /> Vista Impresión (Memoria)</button></li>
             </ul>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button onClick={handleExportContribution} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-xs font-medium transition-colors"><Upload className="w-3 h-3" /> Exportar Mi Parte</button>
          <label className="cursor-pointer w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white py-2 rounded-lg text-xs font-medium transition-colors shadow-lg shadow-emerald-900/20">
             <Download className="w-3 h-3" /> Importar Aporte (JSON)
             <input type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && handleImportContributionFile(e.target.files[0])} />
          </label>
          <button onClick={handleExportFullProject} className="w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-lg text-xs font-medium transition-colors mt-2"><Save className="w-3 h-3" /> Guardar Backup Total</button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto relative scroll-smooth">
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-10 no-print shadow-sm">
           <div className="flex items-center gap-4">
             <div className="md:hidden text-indigo-600 font-bold">GSM</div>
             <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {view === 'editor' ? activePhaseDef?.title : view === 'roadmap' ? 'Guía Didáctica' : 'Vista'}
             </h1>
           </div>
           <div className="text-xs text-slate-400 hidden sm:block">
              {currentUser ? `Editando como: ${currentUser}` : 'Modo Lectura (Selecciona rol)'}
           </div>
        </header>

        <div className="p-6 md:p-10 max-w-5xl mx-auto">
          {view === 'editor' && (
            <>
              {activePhaseId === 'phase1' ? (
                 <Phase1Editor 
                    data={projectState.phases.phase1} 
                    onUpdate={handlePhaseUpdate} 
                    isReadOnly={false} 
                    projectContext={`Proyecto: ${projectState.config?.projectName}. Zona: ${projectState.config?.zone}`}
                    config={projectState.config}
                 />
              ) : activePhaseId === 'phase2' ? (
                <Phase2Editor data={projectState.phases.phase2} onUpdate={handlePhaseUpdate} projectContext={`Proyecto: ${projectState.config?.projectName}. Zona: ${projectState.config?.zone}`} />
              ) : activePhaseId === 'phase3' ? (
                <Phase3Editor data={projectState.phases.phase3} onUpdate={handlePhaseUpdate} projectContext={`Proyecto: ${projectState.config?.projectName}. Zona: ${projectState.config?.zone}`} />
              ) : activePhaseId === 'phase4' ? (
                <Phase4Editor data={projectState.phases.phase4} onUpdate={handlePhaseUpdate} projectContext="" phase3Data={projectState.phases.phase3} />
              ) : activePhaseId === 'phase5' ? (
                <Phase5Editor data={projectState.phases.phase5} onUpdate={handlePhaseUpdate} projectContext="" />
              ) : null}
            </>
          )}
          {view === 'roadmap' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-bl-full opacity-50"></div>
                   <h1 className="text-3xl font-bold text-slate-900 mb-2 relative z-10">Guía Didáctica: Módulo de Proyecto</h1>
                   <p className="text-lg text-slate-600 mb-4 relative z-10">IES La Flota, Murcia - GM Cocina y Gastronomía</p>
                   <div className="inline-block px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-sm font-medium relative z-10"><strong>Proyecto:</strong> Oferta de una Carta Gastronómica Sostenible</div>
                </div>
                <p className="text-slate-500 italic">Consulta las instrucciones detalladas en cada fase del editor.</p>
             </div>
          )}
          {view === 'curriculum' && (
            <div className="space-y-6">{Object.entries(CURRICULUM).map(([moduleName, outcomes]) => (<div key={moduleName} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><h3 className="text-indigo-600 font-bold uppercase tracking-wide text-sm mb-4">{moduleName}</h3><div className="space-y-6">{outcomes.map(ra => (<div key={ra.code}><div className="font-bold text-slate-800 mb-2">{ra.code} - {ra.description}</div><ul className="list-disc list-inside text-sm text-slate-600 space-y-1 pl-2">{ra.criteria.map(c => <li key={c}>{c}</li>)}</ul></div>))}</div></div>))}</div>
          )}
          {view === 'print' && (
            <div className="bg-white min-h-screen p-10 md:p-16 shadow-2xl print:shadow-none max-w-4xl mx-auto text-black" style={{ fontFamily: 'Calibri, sans-serif', fontSize: '11pt', lineHeight: '1.15' }}>
               <style>{`
                 @media print {
                   @page { margin: 2.5cm; }
                   body { -webkit-print-color-adjust: exact; }
                 }
               `}</style>
               
               <div className="no-print mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex justify-between items-center">
                 <span><strong>Vista Oficial de Memoria:</strong> Formato Calibri 11, Interlineado 1.15, Márgenes 2.5cm.</span>
                 <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2 rounded font-sans font-bold hover:bg-slate-700">Imprimir Memoria PDF</button>
               </div>
               
               {/* 1. PORTADA */}
               <div className="text-center pb-20 mb-10 break-after-page flex flex-col justify-center h-[80vh]">
                  <h1 className="text-4xl font-bold mb-8 uppercase">{projectState.config?.projectName}</h1>
                  <h2 className="text-xl mb-2">Ciclo Formativo GM Cocina y Gastronomía</h2>
                  <h3 className="text-lg text-slate-600 mb-12">{projectState.config?.zone}</h3>
                  
                  <div className="text-left max-w-md mx-auto w-full border-t border-slate-300 pt-8 mt-8">
                     <p className="mb-1 font-bold">Integrantes del Equipo ({projectState.config?.teamName}):</p>
                     <ul className="mb-8 space-y-1">
                       {projectState.config?.members.map(m => (<li key={m.name} className="flex justify-between"><span>{m.name}</span> <span className="italic text-slate-500 text-sm">{m.role}</span></li>))}
                     </ul>
                     <p className="mb-1"><strong>Fecha:</strong> {projectState.config?.deliveryDate}</p>
                  </div>
               </div>

               {/* 2. RESUMEN */}
               <section className="mb-8">
                  <h3 className="text-lg font-bold uppercase mb-2">2. Resumen</h3>
                  <p className="text-justify whitespace-pre-wrap">{projectState.phases.phase5.abstract || "[Pendiente de redacción en Fase 5]"}</p>
               </section>

               {/* 3. INTRODUCCIÓN */}
               <section className="mb-8">
                  <h3 className="text-lg font-bold uppercase mb-2">3. Introducción</h3>
                  <h4 className="font-bold mb-1">3.1. Contexto y justificación del proyecto</h4>
                  <p className="text-justify whitespace-pre-wrap mb-4">{projectState.phases.phase1 || "[Pendiente de redacción en Fase 1]"}</p>
                  
                  <h4 className="font-bold mb-1">3.2. Objetivos del proyecto</h4>
                  <p className="text-justify whitespace-pre-wrap mb-4">{projectState.phases.phase5.projectObjectives || "[Pendiente de redacción en Fase 5]"}</p>
                  
                  <h4 className="font-bold mb-1">3.3. Alcance y limitaciones</h4>
                  <p className="text-justify whitespace-pre-wrap">{projectState.phases.phase5.projectScope || "[Pendiente de redacción en Fase 5]"}</p>
               </section>

               {/* 4. ANÁLISIS DE EMPRESAS */}
               <section className="mb-8 break-before-page">
                   <h3 className="text-lg font-bold uppercase mb-2">4. Análisis y contextualización de empresas del sector</h3>
                   
                   <h4 className="font-bold mb-1">4.1. Caracterización de empresas del sector</h4>
                   <div className="pl-4 mb-4">
                      <p className="font-bold italic mb-1">4.1.1 Identificación de la empresa (Concepto Propio)</p>
                      <p className="mb-2"><strong>Nombre:</strong> {projectState.phases.phase2.concept.name}</p>
                      <p className="mb-2"><strong>Tipo:</strong> {projectState.phases.phase2.concept.restaurantType} | <strong>Estilo:</strong> {projectState.phases.phase2.concept.culinaryStyle}</p>
                      <p className="text-justify italic mb-2">"{projectState.phases.phase2.concept.description}"</p>
                      
                      <p className="font-bold italic mb-1 mt-4">4.1.2 Análisis del sector (Tendencias)</p>
                      <p className="text-justify whitespace-pre-wrap mb-2">{projectState.phases.phase2.specificFocus}</p>
                      <ul className="list-disc list-inside pl-4 mb-2">
                         {projectState.phases.phase2.trends.map(t => <li key={t.id}>{t.description}</li>)}
                      </ul>

                      <p className="font-bold italic mb-1 mt-4">4.1.3 Justificación</p>
                      <p className="text-justify whitespace-pre-wrap">{projectState.phases.phase2.synthesis}</p>
                   </div>

                   <h4 className="font-bold mb-1">4.2. Productos y servicios</h4>
                   <div className="pl-4 mb-4">
                      <p className="mb-2"><strong>Público Objetivo:</strong> {projectState.phases.phase2.concept.targetAudience}</p>
                      <p className="mb-2"><strong>Oferta Gastronómica Principal:</strong> {projectState.phases.phase3.products.list}</p>
                   </div>

                   <h4 className="font-bold mb-1">4.3. Relación con los ODS</h4>
                   <div className="pl-4 mb-4">
                      <p className="mb-2"><strong>ODS del Negocio:</strong> {projectState.phases.phase2.concept.linkedODS.join(', ')}</p>
                      <p className="text-justify whitespace-pre-wrap">{projectState.phases.phase3.products.sustainability}</p>
                   </div>

                   <h4 className="font-bold mb-1">4.4. Identificación de riesgos laborales</h4>
                   <p className="text-justify whitespace-pre-wrap pl-4 mb-4">{projectState.phases.phase5.occupationalRisks || "[Pendiente de redacción en Fase 5]"}</p>

                   <h4 className="font-bold mb-1">4.5. Conclusiones del análisis</h4>
                   <p className="text-justify whitespace-pre-wrap pl-4">El análisis de la zona {projectState.config?.zone} confirma la viabilidad del concepto {projectState.phases.phase2.concept.name}.</p>
               </section>

               {/* 5. DESARROLLO */}
               <section className="mb-8 break-before-page">
                   <h3 className="text-lg font-bold uppercase mb-2">5. Desarrollo del Proyecto</h3>
                   <h4 className="font-bold mb-1">5.1. Metodología de trabajo</h4>
                   <p className="text-justify whitespace-pre-wrap mb-4">{projectState.phases.phase5.methodology}</p>

                   <h4 className="font-bold mb-1">5.2. Temporalización y Actividades</h4>
                   <div className="pl-4 mb-4">
                      <table className="w-full text-sm border-collapse border border-slate-300">
                         <thead><tr className="bg-slate-100"><th className="border p-1">Semana</th><th className="border p-1">Avances</th></tr></thead>
                         <tbody>
                            {projectState.phases.phase2.weeklyReports.map(w => (
                               <tr key={w.id}><td className="border p-1 font-bold">{w.week}</td><td className="border p-1">{w.advances}</td></tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
               </section>

               {/* 6. RESULTADOS */}
               <section className="mb-8 break-before-page">
                   <h3 className="text-lg font-bold uppercase mb-2">6. Resultados y análisis</h3>
                   <h4 className="font-bold mb-1">6.1. Análisis de los resultados obtenidos</h4>
                   <p className="text-justify whitespace-pre-wrap mb-4">{projectState.phases.phase5.resultsAnalysis || "[Pendiente de redacción en Fase 5]"}</p>
                   
                   <h4 className="font-bold mb-2">Resumen de Costes (Escandallos)</h4>
                   <table className="w-full text-sm mb-4 border-collapse border border-slate-300">
                     <thead>
                       <tr className="bg-slate-100"><th className="border p-1 text-left">Plato</th><th className="border p-1 text-right">Coste</th><th className="border p-1 text-right">PVR</th><th className="border p-1 text-right">Margen</th></tr>
                     </thead>
                     <tbody>
                       {projectState.phases.phase4.financials.map((f, i) => {
                          const dishName = projectState.phases.phase3.menu.find(m => m.id === f.dishId)?.name || 'Plato desconocido';
                          const margin = f.sellingPrice > 0 ? ((f.sellingPrice - f.totalCost) / f.sellingPrice * 100).toFixed(1) : '0';
                          return (
                             <tr key={i}>
                                <td className="border p-1">{dishName}</td>
                                <td className="border p-1 text-right">{f.totalCost.toFixed(2)}€</td>
                                <td className="border p-1 text-right">{f.sellingPrice.toFixed(2)}€</td>
                                <td className="border p-1 text-right">{margin}%</td>
                             </tr>
                          )
                       })}
                     </tbody>
                   </table>
               </section>

               {/* 7. CONCLUSIONES */}
               <section className="mb-8">
                   <h3 className="text-lg font-bold uppercase mb-2">7. Conclusiones y recomendaciones</h3>
                   <p className="text-justify whitespace-pre-wrap">{projectState.phases.phase5.finalConclusions || "[Pendiente de redacción en Fase 5]"}</p>
               </section>

               {/* 8. BIBLIOGRAFÍA */}
               <section className="mb-8 break-before-page">
                   <h3 className="text-lg font-bold uppercase mb-2">8. Bibliografía</h3>
                   <ul className="list-disc list-inside pl-4">
                      {[...projectState.phases.phase2.references, ...projectState.phases.phase3.references].map((ref, i) => (
                         <li key={i}>{ref}</li>
                      ))}
                   </ul>
               </section>

               {/* ANEXOS */}
               <section className="break-before-page">
                   <h3 className="text-lg font-bold uppercase mb-2">Anexos</h3>
                   <div className="grid grid-cols-2 gap-4">
                      {projectState.phases.phase3.menu.slice(0, 4).map((d, i) => (
                         d.image && (
                           <div key={i} className="border p-2">
                              <img src={d.image} className="w-full h-40 object-cover mb-2" />
                              <p className="text-center font-bold text-xs">{d.name}</p>
                           </div>
                         )
                      ))}
                   </div>
               </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
