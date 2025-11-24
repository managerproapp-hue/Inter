import React, { useState, useRef, useEffect } from 'react';
import { AppMode, ProjectState, RoleType, ProjectConfig, Contribution, Phase2Data, Phase3Data, Phase4Data, Phase5Data, Phase6Data, PhaseContent } from './types';
import { ZONES, ROLES, PHASES, CURRICULUM, INITIAL_PHASE_2, INITIAL_PHASE_3, INITIAL_PHASE_4, INITIAL_PHASE_5, INITIAL_PHASE_6, ROLE_DEFINITIONS, ODS_LIST } from './constants';
import { Download, Upload, FileJson, Users, ChevronRight, Printer, ArrowLeft, Save, Map, BookOpen, LayoutDashboard, CheckCircle, Globe, Target, Calendar, RotateCcw, Trash2, AlertTriangle, UserPlus, Sparkles, GraduationCap, Image as ImageIcon, MapPin, FileSearch, AlertOctagon, PackageOpen, History, FileText, ShieldAlert, X, ChevronDown, Check, Utensils, Presentation } from 'lucide-react';
import { TextPhaseEditor, Phase1Editor, Phase2Editor, Phase3Editor, Phase4Editor, Phase5Editor, Phase6Editor } from './components/PhaseEditors';

// --- Sub-components ---

const Landing: React.FC<{ 
  onSelectMode: (mode: AppMode) => void, 
  hasSavedSession: boolean, 
  onResume: () => void, 
  onClear: () => void,
  onImport: () => void 
}> = ({ onSelectMode, hasSavedSession, onResume, onClear, onImport }) => (
  <div className="min-h-screen flex flex-col bg-slate-950 text-white overflow-x-hidden">
    
    {/* Hero Section */}
    <div className="relative pt-20 pb-16 px-6 border-b border-slate-800">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700 text-indigo-300 text-xs font-bold tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4">
             <Sparkles className="w-3 h-3" /> <span>NUEVA VERSIÓN: FASE 4 INTERMEDIA (MEMORIA PARCIAL)</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
             Gastro<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Sostenible</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
             La plataforma definitiva para proyectos de hostelería. <br/>
             <span className="text-indigo-400 font-bold">Metodología Flujo Puzle</span>: Trabaja offline, fusiona aportes y genera la memoria final automáticamente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {hasSavedSession ? (
              <div className="flex flex-col gap-3 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-4">
                 <button 
                  onClick={onResume}
                  className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/30 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" /> Continuar Sesión
                </button>
                <button 
                  onClick={() => { if(window.confirm("¿Seguro que quieres borrar los datos guardados y empezar de cero?")) onClear(); }}
                  className="px-4 py-2 text-slate-500 hover:text-red-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Borrar y Empezar de Nuevo
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onSelectMode(AppMode.SETUP)}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-900/50 transition-all transform hover:scale-105"
                >
                  Comenzar Nuevo Proyecto
                </button>
                <button 
                  onClick={onImport}
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg shadow-lg border border-slate-700 transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" /> Cargar Proyecto (Backup)
                </button>
              </div>
            )}
          </div>
        </div>
    </div>

    {/* Workflow Explanation (Puzzle Flow) */}
    <div className="bg-slate-950 py-20 px-6 flex-1">
       <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold mb-4">¿Cómo funciona el Flujo Puzle?</h2>
             <p className="text-slate-400 max-w-2xl mx-auto">
                Olvídate de conflictos de versiones. Cada pieza tiene su lugar y su momento.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
             {/* Connector Line (Desktop only) */}
             <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-900 via-emerald-900 to-indigo-900 -z-10" />
             
             {/* Step 1: Coordinator */}
             <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-indigo-500 transition-colors group">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-900/50 group-hover:scale-110 transition-transform">
                   <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-indigo-200">1. El Arquitecto</h3>
                <p className="text-sm text-slate-400 mb-4">El Coordinador crea el equipo y define los roles en la Fase 1.</p>
                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
                   <FileJson className="w-3 h-3" /> config.json
                </div>
             </div>

             {/* Step 2: Work */}
             <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500 transition-colors group">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-900/50 group-hover:scale-110 transition-transform">
                   <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-emerald-200">2. Especialistas</h3>
                <p className="text-sm text-slate-400 mb-4">Cada alumno trabaja en su fase y exporta su parte.</p>
                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
                   <Upload className="w-3 h-3" /> aporte_faseX.json
                </div>
             </div>

             {/* Step 3: Merge */}
             <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-purple-500 transition-colors group">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-900/50 group-hover:scale-110 transition-transform">
                   <RotateCcw className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-purple-200">3. Fusión</h3>
                <p className="text-sm text-slate-400 mb-4">El Coordinador importa los aportes. La App los une automáticamente.</p>
                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs font-mono text-emerald-400 flex items-center gap-2">
                   <CheckCircle className="w-3 h-3" /> Integración
                </div>
             </div>

             {/* Step 4: Result */}
             <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-orange-500 transition-colors group">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-900/50 group-hover:scale-110 transition-transform">
                   <Printer className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-orange-200">4. Memoria Oficial</h3>
                <p className="text-sm text-slate-400 mb-4">Revisión final, coevaluación y generación del PDF normativo.</p>
                <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs font-mono text-white flex items-center gap-2">
                   <BookOpen className="w-3 h-3" /> Memoria.pdf
                </div>
             </div>
          </div>
       </div>
    </div>

    {/* Footer with Creator Credits */}
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
       <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center gap-4 opacity-90">
           
           <p className="text-xs text-indigo-400 uppercase tracking-[0.2em] font-bold">Created by</p>
           
           <div className="flex items-center gap-5 bg-slate-900/50 p-5 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-colors shadow-2xl cursor-default group">
               <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-2xl overflow-hidden relative">
                   <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {/* Using Direct Link to fix loading issues */}
                      <img 
                        src="https://lh3.googleusercontent.com/d/1DkCOqFGdw3PZbyNUnTQNgeaAGjBfv1_e" 
                        alt="Juan Codina Logo" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.parentElement) {
                             target.parentElement.innerHTML = '<span class="font-serif font-bold text-3xl text-slate-900">JC</span>';
                          }
                        }}
                      />
                   </div>
               </div>
               <div className="text-left">
                   <h3 className="text-3xl font-bold text-white leading-none font-serif tracking-tight mb-1">Juan Codina</h3>
                   <p className="text-sm text-slate-400 font-medium">Original Design & Development</p>
               </div>
           </div>

           <a 
             href="https://www.canva.com/design/DAFSUqVcxJw/Vn5gSYiDgnt-_Ox9t1g7hA/view"
             target="_blank"
             rel="noopener noreferrer"
             className="text-xs text-slate-500 hover:text-indigo-400 transition-colors border-b border-transparent hover:border-indigo-400 pb-0.5"
           >
             Ver Diseño Original en Canva
           </a>
       </div>
    </footer>
  </div>
);

const SetupConfig: React.FC<{ onComplete: (config: ProjectConfig) => void, onImport: (file: File) => void }> = ({ onComplete, onImport }) => {
  const [formData, setFormData] = useState<ProjectConfig>({
    projectName: '',
    teamName: '',
    groupNumber: '',
    deliveryDate: '',
    zone: '',
    members: ROLES.map(role => ({ name: '', role, tasks: '' })),
    createdAt: new Date().toISOString()
  });

  const updateMember = (idx: number, field: string, value: string) => {
    const newMembers = [...formData.members];
    newMembers[idx] = { ...newMembers[idx], [field]: value };
    setFormData({ ...formData, members: newMembers });
  };

  const selectedZoneFull = ZONES.find(z => z.startsWith(formData.zone || 'XYZ'));

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8">
        <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Configuración del Arquitecto (Fase 1)</h2>
            <p className="text-indigo-200 mt-2">Define la constitución del equipo antes de comenzar.</p>
          </div>
          <div className="flex gap-2">
              <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-bold flex items-center gap-2">
                <Upload className="w-4 h-4" /> Soy Miembro (Cargar JSON)
                <input type="file" accept=".json" className="hidden" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
              </label>
          </div>
        </div>
        
        <div className="p-8 space-y-10">
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Map className="w-5 h-5 text-indigo-600"/> Datos Generales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Equipo</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ej: Los Innovadores" value={formData.teamName} onChange={e => setFormData({...formData, teamName: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Número de Grupo</label>
                 <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ej: G-04" value={formData.groupNumber} onChange={e => setFormData({...formData, groupNumber: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Proyecto</label>
                <input className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Ej: GastroMurcia Experience" value={formData.projectName} onChange={e => setFormData({...formData, projectName: e.target.value})} />
              </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Fecha de Entrega</label>
                 <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500" value={formData.deliveryDate} onChange={e => setFormData({...formData, deliveryDate: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Zona Gastronómica (Elección Irreversible)</label>
                <select className="w-full p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 font-bold focus:ring-2 focus:ring-indigo-500" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})}>
                  <option value="">-- Selecciona una Zona para bloquearla --</option>
                  {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
                {formData.zone && selectedZoneFull && (
                  <div className="mt-2 p-3 bg-indigo-100 text-indigo-800 text-sm rounded border border-indigo-200 flex items-start gap-2">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{selectedZoneFull}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600"/> Asignación de Roles y Responsabilidades
            </h3>
            
            <div className="space-y-6">
              {formData.members.map((member, idx) => {
                const roleDef = ROLE_DEFINITIONS.find(r => r.role === member.role);
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-4">
                         <div>
                            <h4 className="text-lg font-bold text-indigo-900">{member.role}</h4>
                            <p className="text-sm text-indigo-600 font-medium mb-2">{roleDef?.tagline}</p>
                            
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Responsabilidades Oficiales</p>
                              <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                                {roleDef?.officialTasks.map((task, tIdx) => (
                                  <li key={tIdx}>{task}</li>
                                ))}
                              </ul>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre del Alumno/a</label>
                              <input 
                                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500" 
                                placeholder="Nombre completo"
                                value={member.name} 
                                onChange={(e) => updateMember(idx, 'name', e.target.value)} 
                              />
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Responsabilidades Adicionales</label>
                              <input 
                                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500" 
                                placeholder="Escribe aquí si hay tareas extra..."
                                value={member.tasks} 
                                onChange={(e) => updateMember(idx, 'tasks', e.target.value)} 
                              />
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="pt-6 border-t flex justify-between items-center">
             <p className="text-sm text-slate-500 italic">Asegúrate de que todos los nombres sean correctos antes de exportar.</p>
             <button 
                onClick={() => onComplete(formData)}
                disabled={!formData.projectName || !formData.teamName || !formData.zone}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
             >
               <FileJson className="w-5 h-5" /> Exportar Configuración (JSON)
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Smart Import Modal (The "Inspector") ---
const SmartImportModal: React.FC<{ 
  file: File | null, 
  onCancel: () => void, 
  onConfirm: (importedData: ProjectState, author: string | null, isBackup: boolean) => void, 
  members: {name: string, role: string}[] 
}> = ({ file, onCancel, onConfirm, members }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [fileContent, setFileContent] = useState<any>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setFileContent(json);
          // Analyze content
          const stats = {
            isBackup: !!json.phases, // Detect if full backup
            trends: json.phase2?.trends?.length || 0,
            dishes: json.phase3?.menu?.length || 0,
            financials: json.phase5?.financials?.length || 0,
            coEvals: json.phase6?.coEvaluations?.length || 0,
            timeline: json.phase4?.timeline?.length || 0,
            author: json.lastModifiedBy || "Desconocido"
          };
          setAnalysis(stats);
        } catch (err) {
          setAnalysis({ error: true });
        }
      };
      reader.readAsText(file);
    }
  }, [file]);

  if (!file || !analysis) return null;

  const isBackup = analysis.isBackup;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
       <div className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border-t-8 ${isBackup ? 'border-red-500' : 'border-emerald-500'}`}>
          <div className="p-6">
             <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-full ${isBackup ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                   {isBackup ? <AlertOctagon className="w-8 h-8"/> : <PackageOpen className="w-8 h-8"/>}
                </div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800">
                      {isBackup ? "Copia de Seguridad Completa" : "Pieza del Proyecto"}
                   </h3>
                   <p className="text-sm text-slate-500">{file.name}</p>
                </div>
             </div>

             <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Contenido Detectado</h4>
                {analysis.error ? (
                   <p className="text-red-500 font-bold">Error: Archivo no válido</p>
                ) : (
                   <ul className="text-sm space-y-1 text-slate-700">
                      {isBackup && <li className="font-bold text-red-600">⚠️ Este archivo SOBRESCRIBIRÁ todo el proyecto.</li>}
                      {!isBackup && (
                        <>
                           {analysis.trends > 0 && <li>• {analysis.trends} Tendencias (Fase 2)</li>}
                           {analysis.dishes > 0 && <li>• {analysis.dishes} Platos (Fase 3)</li>}
                           {analysis.timeline > 0 && <li>• {analysis.timeline} Actividades (Fase 4)</li>}
                           {analysis.financials > 0 && <li>• {analysis.financials} Escandallos (Fase 5)</li>}
                           {analysis.coEvals > 0 && <li>• {analysis.coEvals} Coevaluaciones (Fase 6)</li>}
                           {analysis.trends === 0 && analysis.dishes === 0 && analysis.financials === 0 && <li>• Archivo de configuración o vacío</li>}
                        </>
                      )}
                   </ul>
                )}
             </div>

             {!isBackup && (
                <div className="mb-6">
                   <label className="block text-sm font-bold text-slate-700 mb-2">¿De quién es este aporte?</label>
                   <p className="text-xs text-slate-500 mb-2">Es crucial asignar el autor para la evaluación.</p>
                   <select 
                      className="w-full p-3 border rounded-lg bg-indigo-50 border-indigo-200 text-indigo-900 font-bold focus:ring-2 focus:ring-indigo-500"
                      value={selectedAuthor}
                      onChange={(e) => setSelectedAuthor(e.target.value)}
                   >
                      <option value="">-- Seleccionar Autor --</option>
                      {(members || []).map((m, i) => (
                         <option key={i} value={m.name}>{m.name} ({m.role})</option>
                      ))}
                   </select>
                </div>
             )}

             <div className="flex gap-3 justify-end">
                <button onClick={onCancel} className="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium">Cancelar</button>
                <button 
                   onClick={() => onConfirm(fileContent, isBackup ? null : selectedAuthor, isBackup)}
                   disabled={(!isBackup && !selectedAuthor) || !fileContent}
                   className={`px-6 py-2 rounded-lg text-white font-bold shadow-lg flex items-center gap-2 ${isBackup ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-500'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                   {isBackup ? <><AlertTriangle className="w-4 h-4"/> Sobrescribir Todo</> : <><CheckCircle className="w-4 h-4"/> Fusionar Pieza</>}
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

// --- Attribution Renderer for Print View ---
const AttributionRenderer: React.FC<{ text: string, config: ProjectConfig }> = ({ text, config }) => {
  if (!text) return null;

  // Split by author markers: "--- Name: ---"
  const parts = text.split(/(--- .+?: ---)/g);
  
  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        const match = part.match(/--- (.+?): ---/);
        if (match) {
          // It's a marker, skip rendering it directly, handled by next part logic? 
          // Actually, the split keeps the delimiter.
          return null; 
        }
        
        // If it's text, check previous part for author
        const prevPart = index > 0 ? parts[index - 1] : "";
        const authorMatch = prevPart.match(/--- (.+?): ---/);
        
        if (authorMatch) {
          const authorName = authorMatch[1];
          const member = config.members.find(m => m.name === authorName);
          const role = member?.role || "Colaborador";
          
          // Color coding by role
          let borderColor = "border-l-4 border-slate-300";
          let bgColor = "bg-slate-50";
          let textColor = "text-slate-600";
          
          if (role === RoleType.COORDINATOR) { borderColor = "border-l-4 border-indigo-500"; bgColor = "bg-indigo-50"; textColor = "text-indigo-800"; }
          if (role === RoleType.DOCUMENTATION) { borderColor = "border-l-4 border-emerald-500"; bgColor = "bg-emerald-50"; textColor = "text-emerald-800"; }
          if (role === RoleType.COMMUNICATION) { borderColor = "border-l-4 border-purple-500"; bgColor = "bg-purple-50"; textColor = "text-purple-800"; }
          if (role === RoleType.RESOURCES) { borderColor = "border-l-4 border-amber-500"; bgColor = "bg-amber-50"; textColor = "text-amber-800"; }
          if (role === RoleType.PRODUCTION) { borderColor = "border-l-4 border-pink-500"; bgColor = "bg-pink-50"; textColor = "text-pink-800"; }

          return (
             <div key={index} className={`${bgColor} ${borderColor} pl-4 py-2 pr-2 my-2 rounded-r-lg text-justify`}>
                <div className={`text-[10px] font-bold uppercase mb-1 ${textColor} flex justify-between`}>
                   <span>{authorName}</span>
                   <span className="opacity-60">{role}</span>
                </div>
                <div className="whitespace-pre-wrap text-slate-800">{part.trim()}</div>
             </div>
          );
        } else if (part.trim()) {
           // Text without author (e.g. initial content or old format)
           return <div key={index} className="whitespace-pre-wrap mb-2 text-justify">{part}</div>;
        }
        return null;
      })}
    </div>
  );
};


// --- Sidebar Component ---
const Sidebar: React.FC<{ 
  state: ProjectState, 
  activePhase: string, 
  onChangePhase: (id: string) => void,
  currentUser: string,
  onUserChange: (user: string) => void,
  onExport: () => void,
  onImportClick: () => void,
  onBackup: () => void,
  onPrint: () => void
}> = ({ state, activePhase, onChangePhase, currentUser, onUserChange, onExport, onImportClick, onBackup, onPrint }) => (
  <div className="w-72 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 overflow-hidden shadow-2xl z-40 print:hidden">
    <div className="p-6 border-b border-slate-800 bg-slate-950">
       <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
             {state.config?.schoolLogo ? <img src={state.config.schoolLogo} className="w-full h-full object-cover rounded-lg" /> : <GraduationCap className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-tight line-clamp-2">{state.config?.projectName || "Nuevo Proyecto"}</h1>
            <p className="text-xs text-indigo-400 font-medium truncate">{state.config?.zone || "Sin Zona"}</p>
          </div>
       </div>
    </div>

    <div className="p-4 border-b border-slate-800 bg-slate-900/50">
      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
         <Users className="w-3 h-3" /> Tu Identidad Actual
      </label>
      <select 
        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-indigo-500"
        value={currentUser}
        onChange={(e) => onUserChange(e.target.value)}
      >
        <option value="">-- ¿Quién eres? --</option>
        {state.config?.members.map((m, i) => (
          <option key={i} value={m.name}>{m.name} ({m.role})</option>
        ))}
      </select>
    </div>

    <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
      <div className="px-4 mb-2">
        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Recursos</p>
        <button 
           onClick={() => onChangePhase('roadmap')}
           className={`w-full text-left p-2 rounded text-sm mb-1 flex items-center gap-3 transition-colors ${activePhase === 'roadmap' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800'}`}
        >
           <Map className="w-4 h-4" /> Guía Didáctica
        </button>
        <button 
           onClick={() => onChangePhase('curriculum')}
           className={`w-full text-left p-2 rounded text-sm mb-1 flex items-center gap-3 transition-colors ${activePhase === 'curriculum' ? 'bg-emerald-500/10 text-emerald-400' : 'hover:bg-slate-800'}`}
        >
           <BookOpen className="w-4 h-4" /> Guía Evaluación
        </button>
      </div>

      <div className="px-4 mt-6">
         <p className="text-xs font-bold text-slate-500 uppercase mb-2">Fases del Proyecto</p>
         {PHASES.map((phase) => {
            const Icon = phase.icon === 'MapPin' ? MapPin : phase.icon === 'Search' ? FileSearch : phase.icon === 'Utensils' ? Utensils : phase.icon === 'FileText' ? FileText : phase.icon === 'ChefHat' ? AlertOctagon : Presentation;
            return (
              <button
                key={phase.id}
                onClick={() => onChangePhase(phase.id)}
                className={`w-full text-left p-2 rounded text-sm mb-1 flex items-center gap-3 transition-all ${activePhase === phase.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                <Icon className="w-4 h-4" /> {phase.title.split(':')[0]}
              </button>
            )
         })}
      </div>

       <div className="px-4 mt-6">
        <button 
           onClick={onPrint}
           className="w-full p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-105"
        >
           <Printer className="w-4 h-4" /> Vista Impresión
        </button>
      </div>
    </div>

    <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-2">
       <button onClick={onExport} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700">
          <Upload className="w-3 h-3" /> Exportar Mi Parte
       </button>
       <button onClick={onImportClick} className="w-full py-2 bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-emerald-900/50">
          <Download className="w-3 h-3" /> Importar (Pieza/Backup)
       </button>
       <button onClick={onBackup} className="w-full py-2 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-400 rounded text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-indigo-900/50">
          <Save className="w-3 h-3" /> Guardar Backup Total
       </button>
    </div>
  </div>
);

// --- MAIN APP ---

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.LANDING);
  const [projectState, setProjectState] = useState<ProjectState>({
    config: null,
    phases: {
      phase1: '',
      phase2: INITIAL_PHASE_2,
      phase3: INITIAL_PHASE_3,
      phase4: INITIAL_PHASE_4,
      phase5: INITIAL_PHASE_5,
      phase6: INITIAL_PHASE_6,
    },
    lastModifiedBy: '',
    lastModifiedDate: new Date().toISOString()
  });
  const [activePhase, setActivePhase] = useState<string>('roadmap');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);
  const [printMode, setPrintMode] = useState<'partial' | 'final'>('partial');

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('gastro_project');
    if (saved) {
       // Logic to show resume button is in Landing component
    }
  }, []);

  useEffect(() => {
    if (projectState.config) {
      localStorage.setItem('gastro_project', JSON.stringify({ state: projectState, user: currentUser, phase: activePhase }));
    }
  }, [projectState, currentUser, activePhase]);

  // Exit Protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);


  const handleResume = () => {
    const saved = localStorage.getItem('gastro_project');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProjectState(parsed.state);
      setCurrentUser(parsed.user || '');
      setActivePhase(parsed.phase || 'roadmap');
      setMode(AppMode.WORKSPACE);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('gastro_project');
    setProjectState({ config: null, phases: { phase1: '', phase2: INITIAL_PHASE_2, phase3: INITIAL_PHASE_3, phase4: INITIAL_PHASE_4, phase5: INITIAL_PHASE_5, phase6: INITIAL_PHASE_6 }, lastModifiedBy: '', lastModifiedDate: '' });
    setCurrentUser('');
    setMode(AppMode.LANDING);
  };

  const handleConfigComplete = (config: ProjectConfig) => {
    setProjectState(prev => ({ ...prev, config }));
    setMode(AppMode.WORKSPACE);
  };

  // --- SMART MERGE LOGIC ---
  const executeSmartMerge = (importedState: ProjectState, author: string | null, isBackup: boolean) => {
    if (isBackup) {
      setProjectState(importedState);
      alert("Copia de seguridad restaurada correctamente.");
      setMode(AppMode.WORKSPACE); // FORCE SWITCH TO WORKSPACE
    } else {
      // Piece Merge Logic
      const newState = { ...projectState };
      const authorTag = author ? `\n\n--- ${author}: ---\n` : '\n';

      // Phase 1 Merge (Append text)
      if (importedState.phases.phase1) {
         newState.phases.phase1 += authorTag + importedState.phases.phase1;
      }

      // Phase 2 Merge (Append lists & text)
      if (importedState.phases.phase2) {
         newState.phases.phase2.trends = [...newState.phases.phase2.trends, ...importedState.phases.phase2.trends];
         newState.phases.phase2.publicAnalysis = [...newState.phases.phase2.publicAnalysis, ...importedState.phases.phase2.publicAnalysis];
         newState.phases.phase2.menuBenchmarking = [...newState.phases.phase2.menuBenchmarking, ...importedState.phases.phase2.menuBenchmarking];
         if (importedState.phases.phase2.synthesis) newState.phases.phase2.synthesis += authorTag + importedState.phases.phase2.synthesis;
      }

      // Phase 3 Merge (Add Dishes with Author)
      if (importedState.phases.phase3?.menu) {
         const newDishes = importedState.phases.phase3.menu.map(d => ({ ...d, author: author || d.author }));
         newState.phases.phase3.menu = [...newState.phases.phase3.menu, ...newDishes];
      }

      // Phase 4 Merge (Partial Memory - Append Texts & Timeline)
      if (importedState.phases.phase4) {
         const p4 = importedState.phases.phase4;
         if (p4.introContext) newState.phases.phase4.introContext += authorTag + p4.introContext;
         if (p4.introObjectives) newState.phases.phase4.introObjectives += authorTag + p4.introObjectives;
         if (p4.sectorCharacterization) newState.phases.phase4.sectorCharacterization += authorTag + p4.sectorCharacterization;
         // Merge timeline
         if (p4.timeline) {
            const newActivities = p4.timeline.map(a => ({...a, author: author || a.author}));
            newState.phases.phase4.timeline = [...(newState.phases.phase4.timeline || []), ...newActivities];
         }
      }

      // Phase 6 Merge (CoEvaluations)
      if (importedState.phases.phase6?.coEvaluations) {
         newState.phases.phase6.coEvaluations = [...newState.phases.phase6.coEvaluations, ...importedState.phases.phase6.coEvaluations];
      }

      setProjectState(newState);
      alert(`Aporte de ${author} fusionado correctamente.`);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(projectState);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
    const fileName = currentUser ? `Aporte_${currentUser}_${activePhase}_${timestamp}.json` : `GastroProyecto_Backup_${timestamp}.json`;
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const renderPrintView = () => {
    if (!projectState.config) return null;
    const { phase1, phase2, phase3, phase4, phase5, phase6 } = projectState.phases;
    const isFinal = printMode === 'final';

    return (
      <div className="bg-white min-h-screen text-slate-900 print:text-black font-sans">
        <style>{`
          @page { size: A4; margin: 1.5cm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .break-after-page { page-break-after: always; }
          .break-before-page { page-break-before: always; }
          .avoid-break { page-break-inside: avoid; }
        `}</style>
        
        {/* Print Toolbar */}
        <div className="fixed top-0 left-0 right-0 bg-slate-800 p-4 text-white flex justify-between items-center print:hidden z-50">
           <button onClick={() => setActivePhase('roadmap')} className="flex items-center gap-2 hover:text-indigo-300"><ArrowLeft /> Volver</button>
           <div className="flex items-center gap-4">
              <span className="font-bold">MODO DE IMPRESIÓN:</span>
              <div className="flex bg-slate-700 rounded-lg p-1">
                 <button onClick={() => setPrintMode('partial')} className={`px-4 py-1 rounded ${!isFinal ? 'bg-indigo-500 text-white' : 'text-slate-300'}`}>Memoria Parcial (Fase 4)</button>
                 <button onClick={() => setPrintMode('final')} className={`px-4 py-1 rounded ${isFinal ? 'bg-indigo-500 text-white' : 'text-slate-300'}`}>Memoria Final (Fase 6)</button>
              </div>
           </div>
           <button onClick={() => window.print()} className="bg-white text-slate-900 px-4 py-2 rounded font-bold flex items-center gap-2"><Printer className="w-4 h-4"/> Imprimir PDF</button>
        </div>

        <div className="max-w-[210mm] mx-auto pt-20 print:pt-0 bg-white shadow-xl print:shadow-none min-h-[297mm]">
           
           {/* COVER PAGE - FLEX LAYOUT FIX */}
           <div className="h-[297mm] flex flex-col justify-between break-after-page border-b print:border-none p-10 relative">
               
               {/* HEADER: School ID */}
               <div className="flex flex-col items-center justify-center pt-10">
                   {projectState.config.schoolLogo && (
                       <img src={projectState.config.schoolLogo} className="h-24 w-auto object-contain mb-4" alt="Logo Centro" />
                   )}
                   <h2 className="text-xl font-bold uppercase tracking-widest text-slate-700">{projectState.config.schoolName || "IES LA FLOTA"}</h2>
                   <p className="text-sm text-slate-500">{projectState.config.schoolAddress || "Paseo Científico Gabriel Ciscar, nº 1, 30007 Murcia"}</p>
               </div>

               {/* BODY: Title & Image */}
               <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
                   <div>
                       <h1 className="text-4xl font-extrabold uppercase leading-tight text-slate-900 mb-2">
                           {isFinal ? 'MEMORIA FINAL DEL PROYECTO' : 'OFERTA DE UNA CARTA GASTRONÓMICA SOSTENIBLE'}
                       </h1>
                       <h3 className="text-2xl text-slate-600 font-serif italic">Ciclo Formativo GM Cocina y Gastronomía</h3>
                   </div>
                   
                   {/* Cover Image - Constrained Height */}
                   {(isFinal && phase6?.coverImage) && (
                       <div className="max-h-[300px] overflow-hidden rounded-xl border-4 border-white shadow-lg rotate-1">
                           <img src={phase6.coverImage} className="h-full w-auto object-cover" />
                       </div>
                   )}
                   
                   <div className="text-lg text-slate-500 max-w-lg mx-auto border-t border-b border-slate-200 py-4">
                       {projectState.config.zone}
                   </div>
               </div>

               {/* FOOTER: Team & Date */}
               <div className="pb-10">
                   <div className="border-t-2 border-slate-900 pt-6">
                       <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Integrantes del Equipo ("{projectState.config.teamName}"):</h4>
                       <ul className="grid grid-cols-1 gap-2 text-sm">
                           {projectState.config.members.map((m, i) => (
                               <li key={i} className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                                   <span className="font-bold">{m.name}</span>
                                   <span className="italic text-slate-500 bg-slate-100 px-2 rounded">{m.role}</span>
                               </li>
                           ))}
                       </ul>
                       <p className="mt-6 text-right font-bold text-xs uppercase">Fecha de Entrega: {projectState.config.deliveryDate}</p>
                   </div>
               </div>
           </div>

           {/* CONTENT */}
           <div className="px-10 py-10 text-justify leading-relaxed">
              {/* INDEX IS GENERATED AUTOMATICALLY BY PDF PRINTER USUALLY, WE SKIP IT HERE FOR SPA */}
              
              {/* 2. RESUMEN */}
              {isFinal && (
                 <section className="mb-10">
                   <h2 className="text-xl font-bold uppercase border-b-2 border-slate-900 mb-4">2. RESUMEN</h2>
                   <div className="document-font">{phase6?.abstract || "[Pendiente de redacción en Fase 6]"}</div>
                 </section>
              )}

              {/* 3. INTRODUCCIÓN */}
              <section className="mb-10">
                 <h2 className="text-xl font-bold uppercase border-b-2 border-slate-900 mb-4">3. INTRODUCCIÓN</h2>
                 <h3 className="font-bold text-lg mb-2">Contexto y justificación del proyecto</h3>
                 <AttributionRenderer text={isFinal && phase6?.polishedTexts?.intro ? phase6.polishedTexts.intro : (phase4?.introContext || phase1)} config={projectState.config} />
                 
                 {/* Map Display in Intro */}
                 {phase4?.mapImage && (
                    <div className="my-6 text-center avoid-break">
                       <img src={phase4.mapImage} className="max-h-[300px] max-w-full mx-auto border border-slate-300 p-1" />
                       <p className="text-xs italic text-slate-500 mt-1">Fig 1. Mapa de localización y densidad.</p>
                    </div>
                 )}

                 <h3 className="font-bold text-lg mt-6 mb-2">Objetivos</h3>
                 <AttributionRenderer text={phase4?.introObjectives || ""} config={projectState.config} />
                 
                 {isFinal && (
                   <>
                     <h3 className="font-bold text-lg mt-6 mb-2">Alcance y limitaciones</h3>
                     <div className="document-font">{phase6?.projectScope || "[Pendiente de redacción en Fase 6]"}</div>
                   </>
                 )}
              </section>

              <div className="break-after-page" />

              {/* 4. ANÁLISIS */}
              <section className="mb-10">
                 <h2 className="text-xl font-bold uppercase border-b-2 border-slate-900 mb-6">4. ANÁLISIS Y CONTEXTUALIZACIÓN</h2>
                 
                 <div className="mb-8">
                     <h3 className="font-bold text-lg mb-3 bg-slate-100 p-2 border-l-4 border-indigo-500">Caracterización de empresas del sector</h3>
                     <AttributionRenderer text={isFinal && phase6?.polishedTexts?.analysis ? phase6.polishedTexts.analysis : (phase4?.sectorCharacterization || "")} config={projectState.config} />
                 </div>

                 {/* BUSINESS MODEL CANVAS */}
                 <div className="mb-8 avoid-break border border-slate-200 rounded p-4 bg-slate-50">
                     <h3 className="font-bold text-lg mb-4 text-center uppercase tracking-widest text-indigo-800">Identificación de la empresa (Concepto Propio)</h3>
                     <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div><span className="font-bold block text-xs uppercase text-slate-500">Nombre:</span> {phase2?.concept?.name}</div>
                        <div><span className="font-bold block text-xs uppercase text-slate-500">Tipo/Estilo:</span> {phase2?.concept?.restaurantType} / {phase2?.concept?.culinaryStyle}</div>
                        <div className="col-span-2"><span className="font-bold block text-xs uppercase text-slate-500">Descripción:</span> <p className="italic text-slate-600">{phase2?.concept?.description}</p></div>
                     </div>
                 </div>

                 <div className="mb-8">
                    <h3 className="font-bold text-lg mb-3 bg-slate-100 p-2 border-l-4 border-indigo-500">Análisis del sector (Tendencias)</h3>
                    {(phase2?.trends || []).length > 0 ? (
                       <ul className="list-disc pl-5 space-y-2 mb-4">
                          {phase2.trends.map((t, i) => (
                             <li key={i} className="text-sm">
                                {t.description} {t.author && <span className="text-[10px] bg-slate-100 px-1 rounded text-slate-500 ml-2">({t.author})</span>}
                             </li>
                          ))}
                       </ul>
                    ) : <p className="italic text-slate-400">Sin tendencias registradas.</p>}
                 </div>

                 <div className="mb-8">
                    <h3 className="font-bold text-lg mb-3 bg-slate-100 p-2 border-l-4 border-indigo-500">Productos y servicios</h3>
                    <p className="font-bold mb-1">Público Objetivo:</p>
                    <p className="mb-2 text-sm text-slate-700">{phase2?.concept?.targetAudience || phase2?.publicAnalysis?.[0]?.profile || "No definido"}</p>
                    
                    <p className="font-bold mb-1 mt-4">Oferta Gastronómica Principal:</p>
                    <AttributionRenderer text={isFinal && phase6?.polishedTexts?.design ? phase6.polishedTexts.design : (phase4?.problemDetected || "")} config={projectState.config} />
                 </div>

                 <div className="mb-8">
                    <h3 className="font-bold text-lg mb-3 bg-slate-100 p-2 border-l-4 border-indigo-500">Relación con los ODS e Impacto</h3>
                    <p className="font-bold text-sm mb-2 text-emerald-700">ODS del Negocio: <span className="font-normal text-slate-700">{(phase2?.concept?.linkedODS || []).join(', ') || "Ninguno"}</span></p>
                    <AttributionRenderer text={phase4?.odsJustification || ""} config={projectState.config} />
                    
                    <h4 className="font-bold text-md mt-4 mb-2">Análisis de Impacto Ambiental/Social:</h4>
                    <div className="document-font text-sm">{phase3?.products?.impactAnalysis || "Pendiente de análisis."}</div>
                 </div>

                 {isFinal && (
                    <div className="mb-8">
                       <h3 className="font-bold text-lg mb-3 bg-slate-100 p-2 border-l-4 border-indigo-500">Identificación de riesgos laborales</h3>
                       <div className="document-font">{phase6?.occupationalRisks || "[Pendiente de redacción en Fase 6]"}</div>
                    </div>
                 )}
              </section>

              <div className="break-after-page" />

              {/* 5. DESARROLLO DEL PROYECTO */}
              <section className="mb-10">
                 <h2 className="text-xl font-bold uppercase border-b-2 border-slate-900 mb-6">5. DESARROLLO DEL PROYECTO</h2>
                 
                 <h3 className="font-bold text-lg mb-2">Metodología de trabajo</h3>
                 <p className="mb-4 text-justify">{isFinal ? phase6?.methodology : "La metodología empleada se basa en el aprendizaje basado en proyectos (ABP) y el método Flujo Puzle, distribuyendo roles específicos entre los miembros del equipo para simular un entorno de trabajo real en hostelería."}</p>

                 <h3 className="font-bold text-lg mb-2">Planificación y Cronograma</h3>
                 <div className="mb-6">
                    {(phase4?.timeline || []).length > 0 ? (
                       <table className="w-full text-sm border-collapse border border-slate-300">
                          <thead><tr className="bg-slate-100"><th className="border p-2">Actividad</th><th className="border p-2">Fechas</th><th className="border p-2">Recursos</th></tr></thead>
                          <tbody>
                             {phase4.timeline.map((act, i) => (
                                <tr key={i}>
                                   <td className="border p-2">
                                      {act.activity}
                                      {act.author && <span className="block text-[10px] text-slate-400 mt-1">Resp: {act.author}</span>}
                                   </td>
                                   <td className="border p-2">{act.dates}</td>
                                   <td className="border p-2">{act.resources}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    ) : <p className="italic text-slate-400">Sin cronograma.</p>}
                 </div>

                 <h3 className="font-bold text-lg mb-2">Logística:</h3>
                 <div className="mb-4">{phase4?.logistics || "Pendiente"}</div>

                 <h3 className="font-bold text-lg mb-2">Viabilidad y Recursos</h3>
                 <AttributionRenderer text={phase4?.technicalViability || ""} config={projectState.config} />
              </section>

              {/* 6. RESULTADOS (Final Only) */}
              <section className="mb-10">
                 <h2 className="text-xl font-bold uppercase border-b-2 border-slate-900 mb-6">6. RESULTADOS Y ANÁLISIS</h2>
                 
                 <h3 className="font-bold text-lg mb-2">6.1. Análisis de los resultados obtenidos</h3>
                 <div className="document-font mb-6">{isFinal ? phase6?.resultsAnalysis : "[Pendiente de redacción en Fase 6]"}</div>
                 
                 <h3 className="font-bold text-lg mb-4">Resumen de Costes (Escandallos)</h3>
                 {(phase5?.financials || []).length > 0 ? (
                    <table className="w-full text-sm border-collapse border border-slate-300 mb-6">
                       <thead><tr className="bg-slate-100"><th className="border p-2 text-left">Plato</th><th className="border p-2">Coste Ración</th><th className="border p-2">PVP</th><th className="border p-2">% Food Cost</th></tr></thead>
                       <tbody>
                          {phase5.financials.map((f, i) => {
                             const dishName = (phase3?.menu || []).find(d => d.id === f.dishId)?.name || 'Plato';
                             const costPerRation = (f.totalCost || 0) / (f.numberOfRations || 1);
                             const foodCost = f.sellingPrice > 0 ? (costPerRation / f.sellingPrice) * 100 : 0;
                             return (
                                <tr key={i}>
                                   <td className="border p-2 font-bold">{dishName}</td>
                                   <td className="border p-2 text-right">{costPerRation.toFixed(2)}€</td>
                                   <td className="border p-2 text-right">{f.sellingPrice.toFixed(2)}€</td>
                                   <td className="border p-2 text-right">{foodCost.toFixed(1)}%</td>
                                </tr>
                             )
                          })}
                       </tbody>
                    </table>
                 ) : <p className="italic text-slate-400 mb-6">Sin datos financieros (Fase 5).</p>}
              </section>

              <div className="break-after-page" />

              {/* 7. CONCLUSIONES */}
              <section className="mb-10">
                 <h2 className="text-xl font-bold uppercase border-b-2 border-slate-900 mb-6">7. CONCLUSIONES Y RECOMENDACIONES</h2>
                 <div className="document-font">{isFinal ? phase6?.finalConclusions : "[Pendiente de redacción en Fase 6]"}</div>
              </section>

              {/* 8. BIBLIOGRAFÍA */}
              <section className="mb-10">
                 <h2 className="text-xl font-bold uppercase border-b-2 border-slate-900 mb-6">8. BIBLIOGRAFÍA</h2>
                 <ul className="list-disc pl-5 space-y-2">
                    {[...(phase2?.references || []), ...(phase3?.references || [])].map((r, i) => (
                       <li key={i} className="text-sm">{r}</li>
                    ))}
                 </ul>
              </section>

              <div className="break-after-page" />

              {/* ANEXOS */}
              <section>
                 <h2 className="text-xl font-bold uppercase border-b-2 border-slate-900 mb-6">ANEXO: CARTA VISUAL</h2>
                 <div className="grid grid-cols-2 gap-4">
                     {(phase3?.menu || []).filter(d => d.image).map(d => (
                        <div key={d.id} className="border p-2 rounded break-inside-avoid">
                           <img src={d.image} className="w-full h-48 object-cover rounded mb-2" />
                           <p className="font-bold text-center text-sm">{d.name}</p>
                           <p className="text-center text-xs text-slate-500">{d.category}</p>
                        </div>
                     ))}
                 </div>
                 
                 {isFinal && phase6?.teamImage && (
                    <div className="mt-10 break-inside-avoid">
                       <h3 className="font-bold text-lg mb-4 text-center">Equipo del Proyecto: "{projectState.config.teamName}"</h3>
                       <img src={phase6.teamImage} className="w-full h-auto rounded-xl shadow-sm border border-slate-200" />
                    </div>
                 )}
              </section>
              
              {isFinal && (
                 <section className="mt-10 break-before-page">
                    <div className="border-4 border-red-100 p-8 rounded-xl bg-red-50">
                       <h2 className="text-xl font-bold uppercase text-red-800 mb-2">ANEXO CONFIDENCIAL: COEVALUACIÓN DIABÓLICA</h2>
                       <p className="text-sm text-red-700 font-bold mb-4">Rúbrica: Contribución individual al éxito del equipo (Máx. ±1 puntos)</p>
                       <p className="text-xs text-red-600 mb-6 italic">Este documento contiene las aportaciones originales de los miembros del equipo sobre la participación de sus compañeros.</p>
                       
                       <table className="w-full text-sm bg-white border border-red-200">
                          <thead>
                             <tr className="bg-red-100 text-red-900">
                                <th className="p-2 text-left">Evaluador</th>
                                <th className="p-2 text-left">Evaluado</th>
                                <th className="p-2 text-center">Impacto</th>
                                <th className="p-2 text-left">Justificación</th>
                             </tr>
                          </thead>
                          <tbody>
                             {(phase6?.coEvaluations || []).map((ev, i) => (
                                <tr key={i} className="border-b border-red-100">
                                   <td className="p-2 font-bold">{ev.reviewer}</td>
                                   <td className="p-2">{ev.target}</td>
                                   <td className={`p-2 text-center font-bold ${ev.score < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{ev.score.toFixed(2)}</td>
                                   <td className="p-2 italic text-slate-600">"{ev.justification}"</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </section>
              )}
           </div>
        </div>
      </div>
    );
  };

  const currentPhaseTitle = PHASES.find(p => p.id === activePhase)?.title;

  if (mode === AppMode.LANDING) {
    return (
      <Landing 
        onSelectMode={setMode} 
        hasSavedSession={!!projectState.config} 
        onResume={handleResume} 
        onClear={handleClear} 
        onImport={() => { 
          const input = document.createElement('input'); 
          input.type = 'file'; 
          input.accept = '.json'; 
          input.onchange = (e) => { 
            const f = (e.target as HTMLInputElement).files?.[0]; 
            if(f) { setPendingImportFile(f); setImportModalOpen(true); }
          }; 
          input.click(); 
        }}
      />
    );
  }

  if (mode === AppMode.SETUP) {
    return <SetupConfig onComplete={handleConfigComplete} onImport={(f) => { setPendingImportFile(f); setImportModalOpen(true); }} />;
  }

  if (mode === AppMode.WORKSPACE) {
    if (printMode === 'partial' || printMode === 'final') {
      // Check if we are in print 'view' mode which is triggered by button, but we render directly if state is set?
      // Actually we need a way to get back. The print view renders inside the main layout OR replaces it.
      // Let's replace it for print cleanliness.
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
         state={projectState} 
         activePhase={activePhase} 
         onChangePhase={setActivePhase} 
         currentUser={currentUser}
         onUserChange={setCurrentUser}
         onExport={handleExport}
         onImportClick={() => { 
            const input = document.createElement('input'); 
            input.type = 'file'; 
            input.accept = '.json'; 
            input.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if(f) { setPendingImportFile(f); setImportModalOpen(true); }}; 
            input.click(); 
         }}
         onBackup={handleExport}
         onPrint={() => setActivePhase('print')} // We use a pseudo-phase for print view logic or just render overlay
      />

      {/* Main Content */}
      <div className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">
        {activePhase === 'print' ? (
           renderPrintView()
        ) : (
          <>
            <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 {activePhase === 'roadmap' && <Map className="w-5 h-5 text-indigo-600"/>}
                 {activePhase === 'curriculum' && <BookOpen className="w-5 h-5 text-indigo-600"/>}
                 {PHASES.find(p => p.id === activePhase)?.title}
              </h2>
              <div className="flex items-center gap-4">
                  {currentUser ? (
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                       {currentUser}
                    </span>
                  ) : (
                    <span className="text-red-500 text-sm font-bold animate-pulse flex items-center gap-1">
                       <AlertTriangle className="w-4 h-4" /> Selecciona tu usuario
                    </span>
                  )}
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
              <div className="max-w-5xl mx-auto h-full">
                 {activePhase === 'roadmap' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                       <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                          <div className="relative z-10">
                            <h1 className="text-3xl font-extrabold mb-4">Guía Didáctica: Proyecto GastroSostenible</h1>
                            <p className="text-indigo-100 text-lg max-w-2xl">
                               IES La Flota, Murcia. Ciclo GM Cocina y Gastronomía.
                               <br/>Reto: Diseñar una oferta gastronómica real, sostenible y rentable.
                            </p>
                          </div>
                          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                             <Target className="w-64 h-64 -mb-12 -mr-12" />
                          </div>
                       </div>

                       {/* ROLES Y RESPONSABILIDADES */}
                       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
                          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg"><Users className="w-5 h-5 text-indigo-600"/> Roles y Responsabilidades del Equipo</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             {ROLE_DEFINITIONS.map((role, idx) => {
                                let bgColor = "bg-slate-50";
                                let titleColor = "text-slate-800";
                                let borderClass = "border-slate-200";
                                
                                // Color Coding
                                if (role.role === RoleType.COORDINATOR) { bgColor="bg-indigo-50"; titleColor="text-indigo-900"; borderClass="border-indigo-100"; }
                                else if (role.role === RoleType.DOCUMENTATION) { bgColor="bg-emerald-50"; titleColor="text-emerald-900"; borderClass="border-emerald-100"; }
                                else if (role.role === RoleType.COMMUNICATION) { bgColor="bg-purple-50"; titleColor="text-purple-900"; borderClass="border-purple-100"; }
                                else if (role.role === RoleType.RESOURCES) { bgColor="bg-amber-50"; titleColor="text-amber-900"; borderClass="border-amber-100"; }
                                else if (role.role === RoleType.PRODUCTION) { bgColor="bg-pink-50"; titleColor="text-pink-900"; borderClass="border-pink-100"; }

                                return (
                                   <div key={idx} className={`p-4 rounded-lg border ${borderClass} ${bgColor} hover:shadow-md transition-shadow`}>
                                      <h4 className={`font-bold ${titleColor} mb-1`}>{role.role}</h4>
                                      <p className="text-xs font-medium text-slate-600 mb-3 italic">{role.tagline}</p>
                                      <ul className="list-disc pl-3 text-[11px] text-slate-600 space-y-1">
                                         {role.officialTasks.map((t, i) => <li key={i}>{t}</li>)}
                                      </ul>
                                   </div>
                                )
                             })}
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-600"/> Zonas Gastronómicas</h3>
                              <ul className="space-y-2 text-sm text-slate-600">
                                 {ZONES.map((z, i) => <li key={i} className="p-2 bg-slate-50 rounded border border-slate-100">{z}</li>)}
                              </ul>
                           </div>
                           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-emerald-600"/> ODS Prioritarios</h3>
                              <div className="grid grid-cols-2 gap-2">
                                 {ODS_LIST.map((ods, i) => (
                                    <div key={i} className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-1 rounded border border-emerald-100 truncate" title={ods}>
                                       {ods}
                                    </div>
                                 ))}
                              </div>
                           </div>
                       </div>
                    </div>
                 )}

                 {activePhase === 'curriculum' && (
                    <div className="space-y-6 animate-in fade-in">
                       <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Criterios de Evaluación Oficiales</h2>
                          {Object.entries(CURRICULUM).map(([moduleName, outcomes]) => (
                             <div key={moduleName} className="mb-8">
                                <h3 className="text-lg font-bold text-indigo-700 bg-indigo-50 p-2 rounded mb-4">{moduleName}</h3>
                                <div className="space-y-6">
                                   {outcomes.map((ra) => (
                                      <div key={ra.code} className="pl-4 border-l-4 border-indigo-200">
                                         <h4 className="font-bold text-slate-800 mb-2">{ra.code} - {ra.description}</h4>
                                         <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                                            {ra.criteria.map((cr, i) => <li key={i}>{cr}</li>)}
                                         </ul>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          ))}
                          <p className="text-xs text-slate-400 mt-8 italic border-t pt-4">
                             Fuente: BOLETÍN OFICIAL DEL ESTADO. Núm. 129, Martes 28 de mayo de 2024, Sec. I. Pág. 61079. cve: BOE-A-2024-10684. REGIÓN DE MURCIA. Consejería de Educación y Formación Profesional.
                          </p>
                       </div>
                    </div>
                 )}

                 {activePhase === 'phase1' && (
                    <Phase1Editor 
                      data={projectState.phases.phase1} 
                      onUpdate={(d) => setProjectState({...projectState, phases: {...projectState.phases, phase1: d}})}
                      isReadOnly={false}
                      projectContext=""
                      config={projectState.config!}
                      onConfigUpdate={(newConfig) => setProjectState({...projectState, config: newConfig})}
                    />
                 )}

                 {activePhase === 'phase2' && (
                    <Phase2Editor
                      data={projectState.phases.phase2}
                      onUpdate={(d) => setProjectState({...projectState, phases: {...projectState.phases, phase2: d}})}
                      projectContext={`Proyecto: ${projectState.config?.projectName}, Zona: ${projectState.config?.zone}`}
                    />
                 )}

                 {activePhase === 'phase3' && (
                    <Phase3Editor
                      data={projectState.phases.phase3}
                      onUpdate={(d) => setProjectState({...projectState, phases: {...projectState.phases, phase3: d}})}
                      projectContext=""
                    />
                 )}

                 {activePhase === 'phase4' && (
                    <Phase4Editor
                       data={projectState.phases.phase4}
                       onUpdate={(d) => setProjectState({...projectState, phases: {...projectState.phases, phase4: d}})}
                       projectContext=""
                    />
                 )}

                 {activePhase === 'phase5' && (
                    <Phase5Editor
                       data={projectState.phases.phase5}
                       onUpdate={(d) => setProjectState({...projectState, phases: {...projectState.phases, phase5: d}})}
                       projectContext=""
                       phase3Data={projectState.phases.phase3}
                    />
                 )}

                 {activePhase === 'phase6' && (
                    <Phase6Editor
                       data={projectState.phases.phase6}
                       onUpdate={(d) => setProjectState({...projectState, phases: {...projectState.phases, phase6: d}})}
                       projectContext=""
                       currentUser={currentUser}
                       config={projectState.config!}
                       fullProjectData={projectState}
                    />
                 )}
              </div>
            </main>
          </>
        )}
      </div>

      {importModalOpen && (
         <SmartImportModal 
            file={pendingImportFile} 
            onCancel={() => { setImportModalOpen(false); setPendingImportFile(null); }}
            onConfirm={(importedData, author, isBackup) => { executeSmartMerge(importedData, author, isBackup); setImportModalOpen(false); }}
            members={projectState.config?.members || []}
         />
      )}
    </div>
  );
};

export default App;