import React, { useState, useRef, useEffect } from 'react';
import { AppMode, ProjectState, RoleType, ProjectConfig, Contribution, Phase2Data, Phase4Data, PhaseContent } from './types';
import { ZONES, ROLES, PHASES, CURRICULUM, INITIAL_PHASE_2, INITIAL_PHASE_4, ROLE_DEFINITIONS } from './constants';
import { Download, Upload, FileJson, Users, ChevronRight, Printer, ArrowLeft, Save, Map, BookOpen, LayoutDashboard, CheckCircle } from 'lucide-react';
import { TextPhaseEditor, Phase2Editor, Phase4Editor } from './components/PhaseEditors';

// --- Sub-components defined here for simplicity within file limits, or extracted if needed ---

const Landing: React.FC<{ onSelectMode: (mode: AppMode) => void }> = ({ onSelectMode }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900 text-white px-4">
    <div className="max-w-2xl text-center space-y-8">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
           <span className="text-4xl">🥗</span>
        </div>
      </div>
      <h1 className="text-5xl font-extrabold tracking-tight">GastroSostenible <span className="text-emerald-400">Murcia</span></h1>
      <p className="text-xl text-slate-300 leading-relaxed">
        Plataforma de gestión colaborativa para proyectos finales de gastronomía. 
        Trabaja sin conexión, gestiona roles y unifica tu memoria final con el método Flujo Puzle.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
          <div className="font-bold text-lg mb-2">1. Configura</div>
          <p className="text-sm text-slate-300">Define equipo y zona.</p>
        </div>
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
          <div className="font-bold text-lg mb-2">2. Trabaja</div>
          <p className="text-sm text-slate-300">Edita tu parte offline.</p>
        </div>
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
          <div className="font-bold text-lg mb-2">3. Integra</div>
          <p className="text-sm text-slate-300">Une los JSONs finales.</p>
        </div>
      </div>

      <button 
        onClick={() => onSelectMode(AppMode.SETUP)} // In a real flow, might go to a "Select Role" screen first, simplified here
        className="mt-8 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-lg shadow-xl transition-all transform hover:scale-105"
      >
        Comenzar Proyecto
      </button>
    </div>
  </div>
);

const SetupConfig: React.FC<{ onComplete: (config: ProjectConfig) => void, onCancel: () => void, onImport: (file: File) => void }> = ({ onComplete, onCancel, onImport }) => {
  const [config, setConfig] = useState<ProjectConfig>({
    projectName: '',
    teamName: '',
    groupNumber: '',
    deliveryDate: '',
    zone: '', // No default selection to force user choice
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
  
  const isFormValid = 
    config.projectName && 
    config.teamName && 
    config.zone && 
    config.members.every(m => m.name.trim().length > 0);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Fase 1: Configuración del Arquitecto</h2>
            <h3 className="text-xl text-indigo-600 font-semibold mt-1">Roles y Datos del Proyecto</h3>
            <p className="text-slate-500 mt-1">Completa la ficha técnica del equipo y asigna responsabilidades antes de comenzar.</p>
          </div>
          <div className="flex gap-2">
            <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 flex items-center gap-2 transition-colors shadow-sm">
              <Upload className="w-4 h-4" /> Cargar Config Existente
              <input type="file" accept=".json" className="hidden" onChange={handleFileChange} />
            </label>
            <button onClick={onCancel} className="px-4 py-2 text-slate-500 hover:text-slate-800 text-sm font-medium">
              Salir
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Section 1: General Data */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <LayoutDashboard className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-800">Datos Generales del Equipo</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-1 md:col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Equipo</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                  value={config.teamName}
                  onChange={(e) => setConfig({...config, teamName: e.target.value})}
                  placeholder="Ej: Los Innovadores del Sabor"
                />
              </div>
              <div className="col-span-1 md:col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Número de Grupo (Opcional)</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                  value={config.groupNumber || ''}
                  onChange={(e) => setConfig({...config, groupNumber: e.target.value})}
                  placeholder="Ej: G-04"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Proyecto</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                  value={config.projectName}
                  onChange={(e) => setConfig({...config, projectName: e.target.value})}
                  placeholder="Ej: GastroMurcia Experience"
                />
              </div>
              <div className="col-span-1 md:col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de Entrega</label>
                <input 
                  type="date" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                  value={config.deliveryDate || ''}
                  onChange={(e) => setConfig({...config, deliveryDate: e.target.value})}
                />
              </div>
              <div className="col-span-1 md:col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Zona Gastronómica (Elección Irreversible)</label>
                <select 
                   className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors ${config.zone ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-300 text-slate-500'}`}
                   value={config.zone}
                   onChange={(e) => setConfig({...config, zone: e.target.value})}
                >
                  <option value="" disabled>-- Selecciona una Zona para bloquearla --</option>
                  {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Roles */}
          <div>
             <div className="flex items-center gap-3 mb-6 px-2">
              <Users className="w-6 h-6 text-indigo-600" />
              <h3 className="text-2xl font-bold text-slate-800">Asignación de Roles y Responsabilidades</h3>
            </div>

            <div className="space-y-6">
              {ROLE_DEFINITIONS.map((roleDef, idx) => {
                const member = config.members.find(m => m.role === roleDef.role) || { name: '', tasks: '' };
                const memberIndex = config.members.indexOf(member);
                
                return (
                  <div key={roleDef.role} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                    {/* Role Header */}
                    <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-start md:items-center gap-4">
                      <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold shadow-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                          <h4 className="text-lg font-bold text-slate-900">{roleDef.role}</h4>
                          <span className="hidden md:block text-slate-300">|</span>
                          <span className="text-sm text-indigo-600 font-medium">{roleDef.tagline}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left: Responsibilities */}
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Responsabilidades Oficiales</label>
                        <ul className="space-y-2">
                          {roleDef.officialTasks.map((task, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: Inputs */}
                      <div className="space-y-4">
                         <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Alumno/a</label>
                           <input 
                              type="text"
                              placeholder="Nombre completo"
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                              value={member.name}
                              onChange={(e) => updateMember(memberIndex, 'name', e.target.value)}
                           />
                         </div>
                         <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Responsabilidades Adicionales (Específicas)</label>
                           <textarea 
                              placeholder="Escribe aquí si hay tareas extra acordadas..."
                              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors h-24 resize-none text-sm"
                              value={member.tasks}
                              onChange={(e) => updateMember(memberIndex, 'tasks', e.target.value)}
                           />
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white/90 backdrop-blur-md p-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle className={`w-5 h-5 ${isFormValid ? 'text-emerald-500' : 'text-slate-300'}`} />
              <span>Asegúrate de que todos los nombres sean correctos antes de exportar.</span>
            </div>
            <button 
              onClick={() => onComplete(config)}
              disabled={!isFormValid}
              className="w-full md:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <FileJson className="w-5 h-5" />
              Exportar Configuración (JSON)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.LANDING);
  const [projectState, setProjectState] = useState<ProjectState>({
    config: null,
    phases: {
      phase1: '',
      phase2: INITIAL_PHASE_2,
      phase3: '',
      phase4: INITIAL_PHASE_4,
      phase5: ''
    },
    lastModifiedBy: 'Sistema',
    lastModifiedDate: new Date().toISOString()
  });
  
  const [activePhaseId, setActivePhaseId] = useState('phase1');
  const [currentUser, setCurrentUser] = useState('');
  const [view, setView] = useState<'editor' | 'roadmap' | 'curriculum' | 'print'>('editor');

  // --- Persistence Helpers ---
  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Handlers ---
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
        // Check if it's a full project or just config
        if (json.config && json.phases) {
             setProjectState(json);
        } else if (json.teamName) {
             setProjectState(prev => ({ ...prev, config: json }));
        }
        setMode(AppMode.WORKSPACE);
      } catch (err) {
        alert("Error al leer el archivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleImportContribution = (file: File) => {
     const reader = new FileReader();
     reader.onload = (e) => {
       try {
         const contrib: Contribution = JSON.parse(e.target?.result as string);
         if (!contrib.phaseId || !contrib.content) throw new Error("Formato inválido");
         
         // Merge logic
         setProjectState(prev => {
            const newPhases = { ...prev.phases };
            // Specific merge for structured phases could be more granular, 
            // but for "Puzzle Flow", replacing the phase block or merging arrays is standard.
            // Here we replace the specific phase content with the contribution.
            (newPhases as any)[contrib.phaseId] = contrib.content;
            
            return {
                ...prev,
                phases: newPhases,
                lastModifiedBy: contrib.author,
                lastModifiedDate: new Date().toISOString()
            };
         });
         alert(`Contribución de ${contrib.author} para ${contrib.phaseId} importada con éxito.`);
       } catch (err) {
         alert("Error: El archivo no es una contribución válida.");
       }
     };
     reader.readAsText(file);
  };

  const handleExportContribution = () => {
    if (!currentUser) return alert("Selecciona quién eres primero.");
    
    const currentContent = (projectState.phases as any)[activePhaseId];
    const contribution: Contribution = {
      phaseId: activePhaseId,
      author: currentUser,
      content: currentContent,
      timestamp: new Date().toISOString()
    };
    
    downloadJSON(contribution, `Contribucion_${activePhaseId}_${currentUser}.json`);
  };

  const handleExportFullProject = () => {
    downloadJSON(projectState, `Memoria_Final_${projectState.config?.teamName}.json`);
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

  // --- Render Logic ---
  if (mode === AppMode.LANDING) {
    return <Landing onSelectMode={(m) => setMode(m)} />;
  }

  if (mode === AppMode.SETUP) {
    return (
      <SetupConfig 
        onComplete={handleConfigComplete} 
        onCancel={() => setMode(AppMode.LANDING)} 
        onImport={handleImportConfig} 
      />
    );
  }

  // --- Workspace Render ---
  
  const activePhaseDef = PHASES.find(p => p.id === activePhaseId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row print:bg-white">
      
      {/* Sidebar - Hidden on Print */}
      <aside className="w-full md:w-72 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 no-print">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-white font-bold text-xl truncate">{projectState.config?.projectName || "Sin Nombre"}</h2>
          <p className="text-xs text-slate-500 mt-1">{projectState.config?.teamName} • {projectState.config?.zone}</p>
        </div>

        <div className="p-4 border-b border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-500">¿Quién eres hoy?</label>
          <select 
            className="w-full bg-slate-800 border-none rounded p-2 text-sm text-white focus:ring-1 focus:ring-indigo-500"
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
          >
            <option value="">-- Seleccionar Alumno --</option>
            {projectState.config?.members.map(m => (
              <option key={m.name} value={m.name}>{m.name} ({m.role})</option>
            ))}
          </select>
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
                    {/* Simple icon mapping */}
                    <span className="opacity-75 text-xs bg-slate-800 px-1.5 py-0.5 rounded">{phase.id.replace('phase', 'F')}</span>
                    <span className="truncate text-left">{phase.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
             <div className="text-xs font-bold uppercase text-slate-500 mb-3 px-2">Gestión</div>
             <ul className="space-y-1">
               <li>
                 <button onClick={() => setView('roadmap')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${view === 'roadmap' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>
                   <Map className="w-4 h-4" /> Hoja de Ruta
                 </button>
               </li>
               <li>
                 <button onClick={() => setView('curriculum')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${view === 'curriculum' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>
                   <BookOpen className="w-4 h-4" /> Guía Evaluación
                 </button>
               </li>
               <li>
                 <button onClick={() => setView('print')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${view === 'print' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}>
                   <Printer className="w-4 h-4" /> Imprimir / PDF
                 </button>
               </li>
             </ul>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
             onClick={handleExportContribution}
             className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <Upload className="w-3 h-3" /> Exportar mi Parte
          </button>
          <label className="cursor-pointer w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white py-2 rounded-lg text-xs font-medium transition-colors">
             <Download className="w-3 h-3" /> Importar JSON
             <input type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && handleImportContribution(e.target.files[0])} />
          </label>
          <button 
             onClick={handleExportFullProject}
             className="w-full flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-lg text-xs font-medium transition-colors mt-2"
          >
            <Save className="w-3 h-3" /> Guardar Todo (Líder)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        {/* Toolbar (Mobile/Desktop) - No Print */}
        <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-10 no-print">
           <div className="flex items-center gap-4">
             <div className="md:hidden text-indigo-600 font-bold">GSM</div>
             <h1 className="text-xl font-bold text-slate-800">
               {view === 'editor' ? activePhaseDef?.title : 
                view === 'roadmap' ? 'Hoja de Ruta' : 
                view === 'curriculum' ? 'Criterios de Evaluación' : 'Vista de Impresión'}
             </h1>
           </div>
        </header>

        <div className="p-6 md:p-10 max-w-5xl mx-auto">
          
          {/* Editor View */}
          {view === 'editor' && (
            <>
              {activePhaseDef?.type === 'text' ? (
                <TextPhaseEditor 
                  data={(projectState.phases as any)[activePhaseId]} 
                  onUpdate={handlePhaseUpdate} 
                  projectContext={`Proyecto: ${projectState.config?.projectName}. Zona: ${projectState.config?.zone}. Fase: ${activePhaseDef.title}`}
                />
              ) : activePhaseId === 'phase2' ? (
                <Phase2Editor 
                  data={projectState.phases.phase2} 
                  onUpdate={handlePhaseUpdate} 
                  projectContext={`Proyecto: ${projectState.config?.projectName}. Zona: ${projectState.config?.zone}`}
                />
              ) : activePhaseId === 'phase4' ? (
                <Phase4Editor 
                  data={projectState.phases.phase4} 
                  onUpdate={handlePhaseUpdate} 
                  projectContext=""
                />
              ) : null}
            </>
          )}

          {/* Roadmap View */}
          {view === 'roadmap' && (
             <div className="space-y-8">
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-6">Cronograma del Proyecto</h3>
                  <div className="relative border-l-2 border-indigo-200 ml-3 space-y-10">
                    {PHASES.map((p, i) => (
                      <div key={p.id} className="relative pl-8">
                        <div className="absolute -left-2.5 top-1 w-5 h-5 bg-indigo-600 rounded-full border-4 border-white shadow-sm"></div>
                        <h4 className="text-lg font-bold text-slate-900">{p.title}</h4>
                        <p className="text-slate-500 text-sm mt-1">
                          Responsables sugeridos: {
                            i === 0 ? "Coordinador" :
                            i === 1 ? "Documentación y Recursos" :
                            i === 2 ? "Producción" :
                            "Todos los miembros"
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          )}

          {/* Curriculum View */}
          {view === 'curriculum' && (
            <div className="space-y-6">
              {Object.entries(CURRICULUM).map(([moduleName, outcomes]) => (
                <div key={moduleName} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-indigo-600 font-bold uppercase tracking-wide text-sm mb-4">{moduleName}</h3>
                  <div className="space-y-6">
                    {outcomes.map(ra => (
                      <div key={ra.code}>
                        <div className="font-bold text-slate-800 mb-2">{ra.code} - {ra.description}</div>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 pl-2">
                          {ra.criteria.map(c => <li key={c}>{c}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Print View */}
          {view === 'print' && (
            <div className="bg-white min-h-screen p-8 md:p-16 shadow-2xl print:shadow-none max-w-4xl mx-auto document-font text-black">
               <div className="no-print mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm flex justify-between items-center">
                 <span>Esta vista está optimizada para imprimir (CTRL+P). Los menús se ocultarán automáticamente.</span>
                 <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2 rounded font-sans font-bold hover:bg-slate-700">Imprimir Ahora</button>
               </div>

               {/* Cover Page */}
               <div className="text-center border-b-2 border-black pb-10 mb-10 break-after-page">
                 <h1 className="text-4xl font-bold mb-4">{projectState.config?.projectName}</h1>
                 <h2 className="text-2xl text-slate-600 mb-8">{projectState.config?.teamName} | {projectState.config?.zone}</h2>
                 
                 <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto text-sm">
                   {projectState.config?.members.map(m => (
                     <div key={m.name} className="flex justify-between border-b border-slate-300 pb-1">
                       <span className="font-bold">{m.role}:</span>
                       <span>{m.name}</span>
                     </div>
                   ))}
                 </div>
               </div>

               {/* Content */}
               <div className="space-y-12">
                 <section>
                   <h3 className="text-2xl font-bold border-b border-black mb-4">1. Definición y Contexto</h3>
                   <div className="whitespace-pre-wrap leading-relaxed">{projectState.phases.phase1 || "Sin contenido."}</div>
                 </section>

                 <section className="break-before-page">
                   <h3 className="text-2xl font-bold border-b border-black mb-4">2. Inmersión: Concepto y Productos</h3>
                   <div className="mb-6 p-4 bg-slate-50 border rounded">
                     <h4 className="font-bold text-lg">{projectState.phases.phase2.concept.name}</h4>
                     <p className="italic text-slate-600 mb-2">"{projectState.phases.phase2.concept.slogan}"</p>
                     <p>{projectState.phases.phase2.concept.values}</p>
                   </div>
                   <h4 className="font-bold text-lg mb-2">Tabla de Productos Locales</h4>
                   <table className="w-full text-sm text-left border-collapse mb-6">
                     <thead>
                       <tr className="border-b border-slate-400">
                         <th className="py-2">Producto</th>
                         <th className="py-2">Productor</th>
                         <th className="py-2">Temporada</th>
                       </tr>
                     </thead>
                     <tbody>
                       {projectState.phases.phase2.products.map(p => (
                         <tr key={p.id} className="border-b border-slate-100">
                           <td className="py-2 font-medium">{p.name}</td>
                           <td className="py-2">{p.producer}</td>
                           <td className="py-2">{p.season}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </section>

                 <section>
                   <h3 className="text-2xl font-bold border-b border-black mb-4">3. Diseño de Oferta</h3>
                   <div className="whitespace-pre-wrap leading-relaxed">{projectState.phases.phase3 || "Sin contenido."}</div>
                 </section>

                 <section className="break-before-page">
                   <h3 className="text-2xl font-bold border-b border-black mb-4">4. Ejecución Práctica</h3>
                   <div className="grid gap-8">
                     {projectState.phases.phase4.dishes.map(d => (
                       <div key={d.id} className="border p-4 rounded bg-slate-50 print:border-slate-300">
                         <h4 className="font-bold mb-2 uppercase">{d.dishName}</h4>
                         <div className="grid grid-cols-3 gap-4 text-xs">
                            <div><span className="font-bold block">Expectativa:</span> {d.expectation}</div>
                            <div><span className="font-bold block">Realidad:</span> {d.reality}</div>
                            <div><span className="font-bold block">Mermas:</span> {d.waste}</div>
                         </div>
                       </div>
                     ))}
                   </div>
                   <div className="mt-6">
                      <h4 className="font-bold text-lg mb-2">Informe de Brigada</h4>
                      <p className="whitespace-pre-wrap">{projectState.phases.phase4.brigadeReport}</p>
                   </div>
                 </section>

                 <section>
                   <h3 className="text-2xl font-bold border-b border-black mb-4">5. Conclusiones</h3>
                   <div className="whitespace-pre-wrap leading-relaxed">{projectState.phases.phase5 || "Sin contenido."}</div>
                 </section>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}