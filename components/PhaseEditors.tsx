import React, { useState, useRef, useEffect } from 'react';
import { Phase2Data, Phase3Data, Phase4Data, Phase5Data, Phase6Data, DishCategory, MenuDish, DishEval, DishFinancial, IngredientCost, CoEvaluationEntry, ProjectConfig, PlanningActivity } from '../types';
import { ODS_LIST, INITIAL_PHASE_2, INITIAL_PHASE_3, INITIAL_PHASE_4, INITIAL_PHASE_5, INITIAL_PHASE_6 } from '../constants';
import { Plus, Trash2, Wand2, Sparkles, Check, Search, Briefcase, MapPin, Target, Leaf, PieChart, Book, Users, Utensils, Image, Smartphone, ChevronDown, X, AlertCircle, Camera, Calendar, DollarSign, Store, Calculator, FileCheck, Presentation, Laptop, ShieldAlert, FileText, BarChart3, Flame, UserMinus, UserPlus, Lock, Edit, Save, Upload, GraduationCap, AlertTriangle, FileUp, Clock, Hammer, Info, PenTool } from 'lucide-react';
import { enhanceText, suggestConcept } from '../services/geminiService';

interface EditorProps {
  data: any;
  onUpdate: (data: any) => void;
  isReadOnly?: boolean;
  projectContext: string;
  config?: ProjectConfig;
  onConfigUpdate?: (newConfig: ProjectConfig) => void;
  phase3Data?: Phase3Data; // Phase 5 needs access to Phase 3 menu
  currentUser?: string; // For Phase 6 CoEval
  fullProjectData?: any; // For Phase 6 importing text
}

// --- Helper: Image Resizer to prevent Base64 Bloat & Crashes ---
// Stronger compression to avoid "white screen" crashes on mobile
const handleImageUploadWithResize = (file: File, callback: (base64: string) => void) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new globalThis.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Limit to 600px max dimension for better performance
      const MAX_WIDTH = 600;
      const MAX_HEIGHT = 600;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
         ctx.drawImage(img, 0, 0, width, height);
         // Compress to jpeg at 60% quality
         callback(canvas.toDataURL('image/jpeg', 0.6)); 
      }
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

// --- Helper Component: Multi-Select ODS Dropdown ---
interface ODSSelectorProps {
  selected: string | string[]; // Can be array or comma-separated string
  onChange: (val: string | string[]) => void;
  min?: number;
  mode?: 'string' | 'array';
}

const ODSSelector: React.FC<ODSSelectorProps> = ({ selected, onChange, min = 0, mode = 'string' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Normalize selection to array for internal logic
  const selectedArray: string[] = Array.isArray(selected) 
    ? selected 
    : (selected ? selected.split(', ') : []);

  const toggleODS = (ods: string) => {
    let newArray;
    if (selectedArray.includes(ods)) {
      newArray = selectedArray.filter(item => item !== ods);
    } else {
      newArray = [...selectedArray, ods];
    }
    // Sort slightly by number for neatness
    newArray.sort((a, b) => parseInt(a) - parseInt(b));

    if (mode === 'array') {
      onChange(newArray);
    } else {
      onChange(newArray.join(', '));
    }
  };

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const isValid = min === 0 || selectedArray.length >= min;

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[42px] w-full p-2 border rounded-lg bg-white cursor-pointer flex items-center justify-between hover:border-indigo-400 transition-colors ${!isValid ? 'border-orange-300 ring-1 ring-orange-100' : 'border-slate-300'}`}
      >
        <div className="flex flex-wrap gap-1">
          {selectedArray.length === 0 && <span className="text-slate-400 text-sm">Seleccionar ODS vinculados...</span>}
          {selectedArray.map(ods => (
            <span key={ods} className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              {ods.split('.')[0]} 
              <X className="w-3 h-3 cursor-pointer hover:text-emerald-600" onClick={(e) => { e.stopPropagation(); toggleODS(ods); }} />
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-slate-400">
           {!isValid && <span className="text-[10px] text-orange-500 font-bold whitespace-nowrap">Mínimo {min}</span>}
           <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
           {ODS_LIST.map(ods => {
             const isSelected = selectedArray.includes(ods);
             return (
               <div 
                key={ods} 
                onClick={() => toggleODS(ods)}
                className={`p-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-slate-50 ${isSelected ? 'bg-emerald-50 text-emerald-900' : 'text-slate-600'}`}
               >
                 <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                 </div>
                 <span>{ods}</span>
               </div>
             )
           })}
        </div>
      )}
    </div>
  );
};

// --- Text Phase Editor (Generic) ---
export const TextPhaseEditor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, projectContext }) => {
  const [loading, setLoading] = useState(false);

  const handleAI = async () => {
    setLoading(true);
    const improved = await enhanceText(data, projectContext);
    onUpdate(improved);
    setLoading(false);
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {!isReadOnly && (
        <div className="flex justify-end">
          <button
            onClick={handleAI}
            disabled={loading || !data}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {loading ? 'Mejorando...' : 'Mejorar con Gemini IA'}
          </button>
        </div>
      )}
      <textarea
        className="w-full flex-1 p-6 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none document-font text-lg leading-relaxed text-slate-700"
        value={data || ''}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="Escribe aquí el desarrollo de esta fase..."
        readOnly={isReadOnly}
      />
    </div>
  );
};

// --- Phase 1 Editor (Config Display + Text) ---
export const Phase1Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, projectContext, config, onConfigUpdate }) => {
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [tempConfig, setTempConfig] = useState<ProjectConfig | null>(null);

  useEffect(() => {
    if (config) setTempConfig(config);
  }, [config]);

  if (!config || !tempConfig) return <div className="text-red-500 p-4">Error: No se cargó la configuración. Reinicia el proyecto.</div>;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUploadWithResize(file, (base64) => {
        setTempConfig(prev => prev ? ({ ...prev, schoolLogo: base64 }) : null);
      });
    }
  };

  const saveConfig = () => {
    if (onConfigUpdate && tempConfig) {
      onConfigUpdate(tempConfig);
      setIsEditingConfig(false);
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col pb-10">
      {/* Project Identity Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4 relative group">
        
        {/* Edit Button */}
        {!isReadOnly && !isEditingConfig && (
           <button 
             onClick={() => setIsEditingConfig(true)}
             className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10 flex items-center gap-2 text-xs font-bold"
           >
             <Edit className="w-4 h-4" /> Editar Datos Centro
           </button>
        )}

        <div className="bg-slate-800 p-6 text-white flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4 w-full">
            {/* Logo Area */}
            <div className="relative">
                <div className="bg-white p-2 rounded-lg w-24 h-24 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg">
                    {tempConfig.schoolLogo ? (
                        <img src={tempConfig.schoolLogo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                        <Store className="w-10 h-10 text-slate-300" />
                    )}
                </div>
                {isEditingConfig && (
                   <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg cursor-pointer text-white text-xs hover:bg-black/60 transition-colors">
                      <Camera className="w-6 h-6 mb-1" /> Cambiar
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                   </label>
                )}
            </div>

            <div className="flex-1">
              {isEditingConfig ? (
                <div className="space-y-2 animate-in fade-in">
                   <div>
                     <label className="text-[10px] uppercase text-slate-400 font-bold">Nombre del Centro</label>
                     <input 
                       className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:ring-1 focus:ring-indigo-500"
                       value={tempConfig.schoolName}
                       onChange={(e) => setTempConfig({...tempConfig, schoolName: e.target.value})}
                     />
                   </div>
                   <div>
                     <label className="text-[10px] uppercase text-slate-400 font-bold">Dirección</label>
                     <input 
                       className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:ring-1 focus:ring-indigo-500"
                       value={tempConfig.schoolAddress}
                       onChange={(e) => setTempConfig({...tempConfig, schoolAddress: e.target.value})}
                     />
                   </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{tempConfig.projectName || 'Proyecto Sin Nombre'}</h2>
                  <p className="text-slate-400 mt-1 text-lg">{tempConfig.teamName || 'Equipo Sin Nombre'}</p>
                  {tempConfig.schoolName && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                       <p className="text-xs text-indigo-300 uppercase tracking-wider font-bold flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" /> {tempConfig.schoolName}
                       </p>
                       {tempConfig.schoolAddress && <p className="text-xs text-slate-500">{tempConfig.schoolAddress}</p>}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Actions in Edit Mode */}
          {isEditingConfig && (
            <div className="flex gap-2 mt-2 md:mt-0">
               <button onClick={() => { setTempConfig(config); setIsEditingConfig(false); }} className="p-2 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30"><X className="w-5 h-5" /></button>
               <button onClick={saveConfig} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg"><Save className="w-4 h-4" /> Guardar</button>
            </div>
          )}
          
          {/* Right Side Meta Data (Only show if not editing for cleaner UI) */}
          {!isEditingConfig && (
            <div className="text-left md:text-right hidden md:block">
                <div className="bg-indigo-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                {tempConfig.groupNumber || 'G-??'}
                </div>
                <p className="text-sm text-slate-300 font-medium flex items-center gap-1 md:justify-end">
                <MapPin className="w-4 h-4" /> {tempConfig.zone || 'Zona no asignada'}
                </p>
                {tempConfig.deliveryDate && (
                <p className="text-sm text-slate-300 mt-1 flex items-center gap-1 md:justify-end">
                    <Calendar className="w-4 h-4" /> {tempConfig.deliveryDate}
                </p>
                )}
            </div>
          )}
        </div>
        
        <div className="p-6 bg-slate-50">
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 tracking-wider">
            <Users className="w-4 h-4" /> Miembros del Equipo y Roles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(tempConfig.members || []).map((member: any, idx: number) => (
              <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
                  {idx + 1}
                </div>
                <div>
                   <p className="font-bold text-slate-800 text-sm leading-tight">{member.role}</p>
                   <p className="text-sm text-slate-500">{member.name || "Vacante"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Context Editor */}
      <div className="flex-1 flex flex-col min-h-[600px]">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             <Book className="w-5 h-5 text-indigo-600" /> Contexto y Justificación (Apartado 3.1)
          </h3>
          <p className="text-sm text-slate-500">
            Redacta aquí la introducción de tu proyecto, explicando por qué habéis elegido este concepto y cómo se adapta a la zona asignada.
          </p>
        </div>
        <TextPhaseEditor 
          data={data} 
          onUpdate={onUpdate} 
          isReadOnly={isReadOnly} 
          projectContext={projectContext}
          config={config}
        />
      </div>
    </div>
  );
};

// --- Phase 2, 3 Editors ---
export const Phase2Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, projectContext }) => {
  // Defensive coding: Ensure lists are initialized even if data comes from older version
  const state: Phase2Data = { 
    ...INITIAL_PHASE_2, 
    ...(data || {}), 
    trends: Array.isArray(data?.trends) ? data.trends : [],
    publicAnalysis: Array.isArray(data?.publicAnalysis) ? data.publicAnalysis : [],
    menuBenchmarking: Array.isArray(data?.menuBenchmarking) ? data.menuBenchmarking : [],
    references: Array.isArray(data?.references) ? data.references : [],
    concept: { ...INITIAL_PHASE_2.concept, ...(data?.concept || {}) } 
  };

  const [aiSuggestion, setAiSuggestion] = useState('');
  const [activeTab, setActiveTab] = useState<'PartA' | 'PartB'>('PartA');
  const updateField = (field: keyof Phase2Data, value: any) => onUpdate({ ...state, [field]: value });
  const addTrend = () => updateField('trends', [...state.trends, { id: Date.now().toString(), description: '' }]);
  const removeTrend = (idx: number) => { const n = [...state.trends]; n.splice(idx, 1); updateField('trends', n); };
  const addPublic = () => updateField('publicAnalysis', [...state.publicAnalysis, { id: Date.now().toString(), profile: '', method: '', linkedODS: '' }]);
  const addMenu = () => updateField('menuBenchmarking', [...state.menuBenchmarking, { id: Date.now().toString(), restaurantName: '', location: '', sustainableDish: '', ods: '' }]);
  const removeMenu = (idx: number) => { const n = [...state.menuBenchmarking]; n.splice(idx, 1); updateField('menuBenchmarking', n); };
  const addReference = () => updateField('references', [...state.references, '']);
  const handleConceptAI = async () => { const zone = projectContext.split('Zona:')[1]?.split(',')[0] || 'Murcia'; const suggestions = await suggestConcept(zone); setAiSuggestion(suggestions); };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex gap-4 mb-4 border-b border-slate-200 pb-1">
        <button onClick={() => setActiveTab('PartA')} className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'PartA' ? 'bg-blue-50 text-blue-800 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-700'}`}>🅰️ Análisis Individual</button>
        <button onClick={() => setActiveTab('PartB')} className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'PartB' ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}>🅱️ Modelo de Negocio (Grupal)</button>
      </div>
      {activeTab === 'PartA' && (
        <div className="space-y-8">
           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex gap-3 items-start">
             <Search className="w-5 h-5 flex-shrink-0 mt-0.5" /><div><p className="font-bold">Tarea 2 - Análisis Individual:</p><p>Investiga el mercado real.</p></div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-2">Enfoque: Análisis de Tendencias</label>
              <input className="w-full p-3 border border-slate-300 rounded bg-slate-50" value={state.specificFocus} onChange={(e) => updateField('specificFocus', e.target.value)} />
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Leaf className="w-4 h-4"/> Tendencias</h3><button onClick={addTrend}><Plus className="w-3 h-3"/></button></div>
                <div className="space-y-2">{state.trends.map((t, idx) => (<div key={idx} className="flex gap-2"><input className="flex-1 p-2 border rounded text-sm" value={t.description} onChange={(e) => {const n=[...state.trends]; n[idx].description=e.target.value; updateField('trends', n)}} /><button onClick={() => removeTrend(idx)}><Trash2 className="w-4 h-4"/></button></div>))}</div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4"/> Público</h3><button onClick={addPublic}><Plus className="w-3 h-3"/></button></div>
                <div className="space-y-3">{state.publicAnalysis.map((p, idx) => (<div key={idx} className="bg-slate-50 p-3 rounded border border-slate-100 space-y-2 text-sm"><input className="w-full p-2 border rounded" placeholder="Perfil" value={p.profile} onChange={(e) => {const n=[...state.publicAnalysis]; n[idx].profile=e.target.value; updateField('publicAnalysis', n)}} /><ODSSelector selected={p.linkedODS} onChange={(val) => {const n=[...state.publicAnalysis]; n[idx].linkedODS=val as string; updateField('publicAnalysis', n)}} /></div>))}</div>
             </div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Search className="w-5 h-5 text-indigo-600"/> Cartas (Min 5)</h3><button onClick={addMenu}><Plus className="w-4 h-4"/></button></div>
              <div className="space-y-4">{state.menuBenchmarking.map((m, idx) => (<div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start bg-slate-50 p-3 rounded border relative"><div className="col-span-3"><input className="w-full p-2 border rounded text-sm font-bold" placeholder="Restaurante" value={m.restaurantName} onChange={(e) => {const n=[...state.menuBenchmarking]; n[idx].restaurantName=e.target.value; updateField('menuBenchmarking', n)}} /></div><div className="col-span-3"><input className="w-full p-2 border rounded text-sm" placeholder="Ubicación" value={m.location} onChange={(e) => {const n=[...state.menuBenchmarking]; n[idx].location=e.target.value; updateField('menuBenchmarking', n)}} /></div><div className="col-span-3"><input className="w-full p-2 border rounded text-sm" placeholder="Plato" value={m.sustainableDish} onChange={(e) => {const n=[...state.menuBenchmarking]; n[idx].sustainableDish=e.target.value; updateField('menuBenchmarking', n)}} /></div><div className="col-span-2"><ODSSelector selected={m.ods} onChange={(val) => {const n=[...state.menuBenchmarking]; n[idx].ods=val as string; updateField('menuBenchmarking', n)}} /></div><div className="col-span-1"><button onClick={() => removeMenu(idx)}><Trash2 className="w-4 h-4"/></button></div></div>))}</div>
           </div>
        </div>
      )}
      {activeTab === 'PartB' && (
        <div className="space-y-8">
           <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-sm text-emerald-800 flex gap-3 items-start"><Store className="w-5 h-5 flex-shrink-0 mt-0.5" /><div><p className="font-bold">Informe Grupal</p><p>Concepto final del restaurante.</p></div></div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
              <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-slate-800">Definición</h3><button onClick={handleConceptAI} className="text-indigo-600 text-sm flex items-center gap-1"><Sparkles className="w-4 h-4"/> Ideas IA</button></div>
              {aiSuggestion && <div className="mb-6 p-3 bg-indigo-50 text-sm rounded text-indigo-800 border border-indigo-100">{aiSuggestion}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-1">Nombre</label><input className="w-full p-3 border rounded-lg text-lg font-serif bg-slate-50" value={state.concept.name} onChange={(e) => updateField('concept', {...state.concept, name: e.target.value})} /></div>
                 <div><label className="block text-sm font-bold text-slate-700 mb-1">Tipo</label><input className="w-full p-2 border rounded" value={state.concept.restaurantType} onChange={(e) => updateField('concept', {...state.concept, restaurantType: e.target.value})} /></div>
                 <div><label className="block text-sm font-bold text-slate-700 mb-1">Estilo</label><input className="w-full p-2 border rounded" value={state.concept.culinaryStyle} onChange={(e) => updateField('concept', {...state.concept, culinaryStyle: e.target.value})} /></div>
                 <div><label className="block text-sm font-bold text-slate-700 mb-1">Cliente</label><input className="w-full p-2 border rounded" value={state.concept.targetAudience} onChange={(e) => updateField('concept', {...state.concept, targetAudience: e.target.value})} /></div>
                 <div><label className="block text-sm font-bold text-slate-700 mb-1">Precio</label><input className="w-full p-2 border rounded" value={state.concept.averagePrice} onChange={(e) => updateField('concept', {...state.concept, averagePrice: e.target.value})} /></div>
                 <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label><textarea className="w-full p-3 border rounded h-20 text-sm" value={state.concept.description} onChange={(e) => updateField('concept', {...state.concept, description: e.target.value})} /></div>
                 <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">ODS</label><ODSSelector selected={state.concept.linkedODS} onChange={(val) => updateField('concept', {...state.concept, linkedODS: val as string[]})} mode="array" min={2}/></div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"><h3 className="font-bold text-slate-800 mb-2">Síntesis</h3><textarea className="w-full p-4 border rounded-lg h-24 text-sm" value={state.synthesis} onChange={(e) => updateField('synthesis', e.target.value)} /></div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"><div className="flex justify-between items-center mb-2"><h3 className="font-bold text-slate-800">Referencias</h3><button onClick={addReference}><Plus className="w-3 h-3"/></button></div><ul className="space-y-2">{state.references.map((r, i) => (<li key={i} className="flex gap-2"><span className="text-slate-400 text-sm">{i+1}.</span><input className="flex-1 p-1 border-b text-sm outline-none" value={r} onChange={(e) => {const n=[...state.references]; n[i]=e.target.value; updateField('references', n)}} /></li>))}</ul></div>
        </div>
      )}
    </div>
  );
};

export const Phase3Editor: React.FC<EditorProps> = ({ data, onUpdate }) => {
  // Defensive coding: Ensure menu and references are arrays
  const state: Phase3Data = { 
    ...INITIAL_PHASE_3, 
    ...(data || {}),
    menu: Array.isArray(data?.menu) ? data.menu : [],
    references: Array.isArray(data?.references) ? data.references : []
  };

  const [activeTab, setActiveTab] = useState<'Products' | 'Menu' | 'Visual'>('Products');
  const updateField = (field: keyof Phase3Data, value: any) => onUpdate({ ...state, [field]: value });
  const categories: DishCategory[] = ['Aperitivo', 'Entrante', 'Principal', 'Postre'];
  const addDish = (category: DishCategory) => updateField('menu', [...state.menu, { id: Date.now().toString(), category, name: '', ingredients: '', elaboration: '', allergens: '', techniques: '', presentation: '', ods: '', author: '' }]);
  const removeDish = (id: string) => updateField('menu', state.menu.filter(d => d.id !== id));
  const updateDish = (id: string, field: keyof MenuDish, val: string) => updateField('menu', state.menu.map(d => d.id === id ? { ...d, [field]: val } : d));
  const handleImageUpload = (id: string, file: File) => {
     handleImageUploadWithResize(file, (base64) => {
        updateDish(id, 'image', base64);
     });
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2"><button onClick={() => setActiveTab('Products')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Products' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>1. Productos</button><button onClick={() => setActiveTab('Menu')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Menu' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>2. Platos</button><button onClick={() => setActiveTab('Visual')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Visual' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>3. Visual</button></div>
      {activeTab === 'Products' && (<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6"><h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Leaf className="w-5 h-5 text-emerald-600"/> Selección</h3><div><label className="block text-sm font-bold text-slate-700 mb-1">Lista</label><textarea className="w-full p-3 border rounded-lg h-24 text-sm" value={state.products.list} onChange={(e) => updateField('products', {...state.products, list: e.target.value})} /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-bold text-slate-700 mb-1">Sostenibilidad</label><textarea className="w-full p-3 border rounded-lg h-24 text-sm" value={state.products.sustainability} onChange={(e) => updateField('products', {...state.products, sustainability: e.target.value})} /></div><div><label className="block text-sm font-bold text-slate-700 mb-1">Impacto (Análisis)</label><textarea className="w-full p-3 border rounded-lg h-24 text-sm" value={state.products.impactAnalysis} onChange={(e) => updateField('products', {...state.products, impactAnalysis: e.target.value})} /></div></div></div>)}
      {activeTab === 'Menu' && (<div className="space-y-8">{categories.map(cat => (<div key={cat} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"><div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800 text-lg">{cat}s</h3><button onClick={() => addDish(cat)} className="text-indigo-600 text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Añadir</button></div><div className="space-y-6">{state.menu.filter(d => d.category === cat).map((dish) => (<div key={dish.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative"><button onClick={() => removeDish(dish.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button><div className="grid grid-cols-1 lg:grid-cols-12 gap-6"><div className="col-span-1 lg:col-span-3 flex flex-col items-center gap-2"><div className="w-full aspect-square bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden border border-slate-300 relative">{dish.image ? <img src={dish.image} className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-slate-400" />}</div><label className="cursor-pointer px-3 py-1 bg-white border border-slate-300 rounded text-xs font-bold flex items-center gap-1"><Image className="w-3 h-3" /> Foto<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(dish.id, e.target.files[0])} /></label></div><div className="col-span-1 lg:col-span-9 space-y-3"><input className="w-full p-2 border rounded bg-white font-bold" value={dish.name} onChange={(e) => updateDish(dish.id, 'name', e.target.value)} placeholder="Nombre" /><input className="w-full p-2 border rounded bg-white" value={dish.ingredients} onChange={(e) => updateDish(dish.id, 'ingredients', e.target.value)} placeholder="Ingredientes" /><div className="grid grid-cols-3 gap-4"><input className="p-2 border rounded bg-white text-sm" value={dish.allergens} onChange={(e) => updateDish(dish.id, 'allergens', e.target.value)} placeholder="Alérgenos" /><input className="p-2 border rounded bg-white text-sm" value={dish.techniques} onChange={(e) => updateDish(dish.id, 'techniques', e.target.value)} placeholder="Técnicas" /><ODSSelector selected={dish.ods} onChange={(val) => updateDish(dish.id, 'ods', val as string)} /></div><textarea className="w-full p-2 border rounded bg-white text-sm h-20" value={dish.elaboration} onChange={(e) => updateDish(dish.id, 'elaboration', e.target.value)} placeholder="Elaboración" /></div></div></div>))}</div></div>))}</div>)}
      {activeTab === 'Visual' && (<div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6"><h3 className="text-lg font-bold text-slate-800 mb-4">Diseño Visual</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="font-bold text-slate-700">Enlace Canva</label><input className="w-full p-3 border rounded-lg" value={state.visual.canvaDescription} onChange={(e) => updateField('visual', {...state.visual, canvaDescription: e.target.value})} /></div><div><label className="font-bold text-slate-700">QR</label><input className="w-full p-3 border rounded-lg" value={state.visual.qrUrl} onChange={(e) => updateField('visual', {...state.visual, qrUrl: e.target.value})} /></div></div><div><label className="font-bold text-slate-700">Físico</label><textarea className="w-full p-3 border rounded-lg h-24" value={state.visual.physicalDescription} onChange={(e) => updateField('visual', {...state.visual, physicalDescription: e.target.value})} /></div></div>)}
    </div>
  );
};

// --- NEW: Phase 4 Editor (Memoria Parcial y Consolidación) ---
export const Phase4Editor: React.FC<EditorProps> = ({ data, onUpdate }) => {
  // Defensive merge to ensure state is fully populated even if data is partial (prevents blank screen)
  const state: Phase4Data = { 
    ...INITIAL_PHASE_4, 
    ...(data || {}),
    timeline: Array.isArray(data?.timeline) ? data.timeline : [] // Extra protection for timeline array
  };
  
  const [activeTab, setActiveTab] = useState<'Intro' | 'Analysis' | 'Design' | 'Planning'>('Intro');
  const updateField = (field: keyof Phase4Data, value: any) => onUpdate({ ...state, [field]: value });

  const addActivity = () => updateField('timeline', [...(state.timeline || []), { id: Date.now().toString(), activity: '', dates: '', resources: '' }]);
  const removeActivity = (idx: number) => { const n = [...(state.timeline || [])]; n.splice(idx, 1); updateField('timeline', n); };
  const updateActivity = (idx: number, field: keyof PlanningActivity, val: string) => {
     const n = [...(state.timeline || [])];
     n[idx] = { ...n[idx], [field]: val };
     updateField('timeline', n);
  };
  
  const handleMapUpload = (file: File) => {
    handleImageUploadWithResize(file, (base64) => {
      updateField('mapImage', base64);
    });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Reminder Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 animate-pulse">
         <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
         <div>
           <h4 className="text-yellow-800 font-bold text-sm uppercase">Recordatorio Importante para Alumnos</h4>
           <p className="text-yellow-700 text-sm">
             Al finalizar vuestra aportación, recordad descargar el archivo ("Exportar Mi Parte") y enviarlo al coordinador. 
             El coordinador debe unificar todas las partes para generar el documento definitivo de esta Entrega Parcial.
           </p>
         </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
         <button onClick={() => setActiveTab('Intro')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Intro' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>1. Introducción</button>
         <button onClick={() => setActiveTab('Analysis')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Analysis' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>2. Análisis Sector</button>
         <button onClick={() => setActiveTab('Design')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Design' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>3. Diseño Proyecto</button>
         <button onClick={() => setActiveTab('Planning')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Planning' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>4. Planificación</button>
      </div>

      {activeTab === 'Intro' && (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">1. Introducción y Justificación</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Contexto y Justificación</label>
              <p className="text-xs text-slate-500 mb-1">Explica por qué una "Carta Sostenible" es necesaria en vuestra zona.</p>
              <textarea className="w-full p-3 border rounded-lg h-32 text-sm" value={state.introContext} onChange={(e) => updateField('introContext', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Objetivos del Proyecto</label>
              <p className="text-xs text-slate-500 mb-1">Generales y específicos (ej: reducir desperdicio, diseñar 20 platos km0).</p>
              <textarea className="w-full p-3 border rounded-lg h-32 text-sm" value={state.introObjectives} onChange={(e) => updateField('introObjectives', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mapa de la Zona / Densidad Restauración</label>
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                 {state.mapImage ? (
                    <div className="relative group">
                       <img src={state.mapImage} alt="Mapa Zona" className="h-32 w-auto object-cover rounded shadow-sm" />
                       <button onClick={() => updateField('mapImage', '')} className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-5 h-5"/></button>
                    </div>
                 ) : (
                    <div className="h-32 w-48 bg-slate-200 rounded flex items-center justify-center text-slate-400 text-xs text-center p-2">Sin mapa</div>
                 )}
                 <label className="cursor-pointer bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Subir Imagen Mapa
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleMapUpload(e.target.files[0])} />
                 </label>
              </div>
            </div>
         </div>
      )}

      {activeTab === 'Analysis' && (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Search className="w-5 h-5"/> 2. Análisis y Contextualización (RA1)</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Caracterización del Sector Murciano</label>
              <textarea className="w-full p-3 border rounded-lg h-32 text-sm" placeholder="Empresas tipo representativas, estructura organizativa..." value={state.sectorCharacterization} onChange={(e) => updateField('sectorCharacterization', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Estrategia y Demanda</label>
              <textarea className="w-full p-3 border rounded-lg h-32 text-sm" placeholder="Cómo responden estas empresas a la demanda..." value={state.strategyDemand} onChange={(e) => updateField('strategyDemand', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">ODS y Sostenibilidad (ODS 12)</label>
              <textarea className="w-full p-3 border rounded-lg h-32 text-sm" placeholder="Justificación formal de la relación con los ODS..." value={state.odsJustification} onChange={(e) => updateField('odsJustification', e.target.value)} />
            </div>
         </div>
      )}

      {activeTab === 'Design' && (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Hammer className="w-5 h-5"/> 3. Identificación de Necesidades y Diseño (RA2)</h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Problema Detectado</label>
              <textarea className="w-full p-3 border rounded-lg h-24 text-sm" value={state.problemDetected} onChange={(e) => updateField('problemDetected', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Viabilidad Técnica Inicial</label>
                 <textarea className="w-full p-3 border rounded-lg h-32 text-sm" placeholder="¿Es posible elaborar estos platos con los recursos actuales?" value={state.technicalViability} onChange={(e) => updateField('technicalViability', e.target.value)} />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Partes Esenciales del Proyecto</label>
                 <textarea className="w-full p-3 border rounded-lg h-32 text-sm" placeholder="Fases: diseño, prototipado, comercialización..." value={state.essentialParts} onChange={(e) => updateField('essentialParts', e.target.value)} />
               </div>
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Recursos Necesarios (Humanos y Materiales)</label>
               <textarea className="w-full p-3 border rounded-lg h-24 text-sm" placeholder="Maquinaria, perfiles de cocineros..." value={state.requiredResources} onChange={(e) => updateField('requiredResources', e.target.value)} />
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Aspectos de Calidad</label>
               <textarea className="w-full p-3 border rounded-lg h-24 text-sm" value={state.qualityAspects} onChange={(e) => updateField('qualityAspects', e.target.value)} />
            </div>
         </div>
      )}

      {activeTab === 'Planning' && (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Clock className="w-5 h-5"/> 4. Planificación Inicial (RA3)</h3>
            <div>
               <div className="flex justify-between items-center mb-4">
                  <label className="font-bold text-slate-700">Cronología de Actividades</label>
                  <button onClick={addActivity} className="text-xs flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100"><Plus className="w-3 h-3"/> Añadir Actividad</button>
               </div>
               <div className="space-y-3">
                  {(state.timeline || []).map((act, idx) => (
                     <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 bg-slate-50 p-3 rounded border border-slate-100 relative">
                        <div className="md:col-span-5">
                           <input className="w-full p-2 border rounded text-sm font-bold" placeholder="Actividad" value={act.activity} onChange={(e) => updateActivity(idx, 'activity', e.target.value)} />
                        </div>
                        <div className="md:col-span-3">
                           <input className="w-full p-2 border rounded text-sm" placeholder="Fechas" value={act.dates} onChange={(e) => updateActivity(idx, 'dates', e.target.value)} />
                        </div>
                        <div className="md:col-span-3">
                           <input className="w-full p-2 border rounded text-sm" placeholder="Recursos/Responsable" value={act.resources} onChange={(e) => updateActivity(idx, 'resources', e.target.value)} />
                        </div>
                        <div className="md:col-span-1 flex justify-center items-center">
                           <button onClick={() => removeActivity(idx)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                        </div>
                     </div>
                  ))}
                  {(state.timeline || []).length === 0 && <p className="text-xs text-slate-400 italic">No hay actividades planificadas.</p>}
               </div>
            </div>
            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Logística y Recursos para Prototipado</label>
               <textarea className="w-full p-3 border rounded-lg h-24 text-sm" placeholder="Compra de producto, uso de taller, roles..." value={state.logistics} onChange={(e) => updateField('logistics', e.target.value)} />
            </div>
         </div>
      )}
    </div>
  );
};

// --- Structured Phase 5 Editor (Old Phase 4 - Costes y Ejecución) ---
export const Phase5Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, phase3Data }) => {
  // Robustness check: Ensure initial structure exists
  const state: Phase5Data = { 
      ...INITIAL_PHASE_5, 
      ...(data || {}),
      financials: Array.isArray(data?.financials) ? data.financials : [],
      dishes: Array.isArray(data?.dishes) ? data.dishes : []
  };
  
  // Safe access to menu
  const menu = Array.isArray(phase3Data?.menu) ? phase3Data?.menu : [];
  
  const [activeTab, setActiveTab] = useState<'Financials' | 'Sensory' | 'Report'>('Financials');
  const updateField = (field: keyof Phase5Data, value: any) => onUpdate({ ...state, [field]: value });
  
  // Financial helpers
  const addFinancial = (dishId: string) => { 
      if (state.financials.find(f => f.dishId === dishId)) return; 
      updateField('financials', [...state.financials, { dishId, numberOfRations: 10, totalCost: 0, sellingPrice: 0, ingredients: [] }]); 
  };
  const removeFinancial = (dishId: string) => updateField('financials', state.financials.filter(f => f.dishId !== dishId));
  const updateFinancial = (dishId: string, field: keyof DishFinancial, value: any) => updateField('financials', state.financials.map(f => f.dishId === dishId ? { ...f, [field]: value } : f));
  
  const addIngredient = (dishId: string) => { 
      const fin = state.financials.find(f => f.dishId === dishId); 
      if(!fin) return; 
      const newIngs = [...fin.ingredients, { name: '', quantity: '', unit: 'kg', price: 0 }]; 
      updateField('financials', state.financials.map(f => f.dishId === dishId ? { ...f, ingredients: newIngs } : f)); 
  };
  
  const updateIngredient = (dishId: string, idx: number, field: keyof IngredientCost, val: any) => { 
      const fin = state.financials.find(f => f.dishId === dishId); 
      if(!fin) return; 
      const newIngs = [...fin.ingredients]; 
      newIngs[idx] = { ...newIngs[idx], [field]: val };
      
      // Recalculate total cost automatically: Sum (Quantity * Unit Price)
      const newTotalCost = newIngs.reduce((acc, curr) => {
         // Fix: Handle comma as decimal and "c/s" as 0
         const cleanQty = curr.quantity.replace(',', '.');
         const qty = parseFloat(cleanQty);
         const price = curr.price;
         
         const validQty = isNaN(qty) ? 0 : qty;
         
         if (!isNaN(price)) {
            return acc + (validQty * price);
         }
         return acc;
      }, 0);
      
      updateField('financials', state.financials.map(f => f.dishId === dishId ? { ...f, ingredients: newIngs, totalCost: newTotalCost } : f)); 
  };
  
  const removeIngredient = (dishId: string, idx: number) => { 
      const fin = state.financials.find(f => f.dishId === dishId); 
      if(!fin) return; 
      const newIngs = [...fin.ingredients]; 
      newIngs.splice(idx, 1); 
      
      const newTotalCost = newIngs.reduce((acc, curr) => {
         const cleanQty = curr.quantity.replace(',', '.');
         const qty = parseFloat(cleanQty);
         const validQty = isNaN(qty) ? 0 : qty;
         const price = curr.price;
         if (!isNaN(price)) return acc + (validQty * price);
         return acc;
      }, 0);

      updateField('financials', state.financials.map(f => f.dishId === dishId ? { ...f, ingredients: newIngs, totalCost: newTotalCost } : f)); 
  };

  // Reverse Calculation logic: Target % Food Cost -> Set PVP
  const handleTargetFoodCostChange = (dishId: string, targetPercent: number) => {
     const fin = state.financials.find(f => f.dishId === dishId);
     if (!fin) return;
     const costPerRation = (fin.totalCost || 0) / (fin.numberOfRations || 1);
     
     if (targetPercent > 0 && costPerRation > 0) {
        const suggestedPVP = costPerRation / (targetPercent / 100);
        updateFinancial(dishId, 'sellingPrice', parseFloat(suggestedPVP.toFixed(2)));
     }
  };

  const addSensory = () => updateField('dishes', [...state.dishes, { id: Date.now().toString(), dishName: '', expectation: '', reality: '', waste: '' }]);
  const removeSensory = (idx: number) => { const n = [...state.dishes]; n.splice(idx, 1); updateField('dishes', n); };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
         <button onClick={() => setActiveTab('Financials')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Financials' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>1. Escandallos</button>
         <button onClick={() => setActiveTab('Sensory')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Sensory' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>2. Sensorial</button>
         <button onClick={() => setActiveTab('Report')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Report' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>3. Informe</button>
      </div>

      {activeTab === 'Financials' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm border border-blue-100 flex gap-3">
                 <DollarSign className="w-5 h-5 flex-shrink-0"/><div><p className="font-bold">Cálculo de Costes (Escandallo)</p><p>Selecciona un plato y detalla sus costes exactos por ración. Utiliza 'c/s' para cantidades no medibles.</p></div>
             </div>
             <div className="flex gap-2 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <select className="p-2 border rounded flex-1" id="dishSelect"><option value="">-- Seleccionar Plato Diseñado en Fase 3 --</option>{(menu || []).filter(m => !state.financials.find(f => f.dishId === m.id)).map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}</select>
                <button onClick={() => { const select = document.getElementById('dishSelect') as HTMLSelectElement; if(select.value) { addFinancial(select.value); select.value = ''; }}} className="bg-indigo-600 text-white px-4 py-2 rounded font-bold text-sm">Crear Escandallo</button>
             </div>
             
             <div className="space-y-8">
             {state.financials.map(fin => {
                   const dish = menu.find(m => m.id === fin.dishId);
                   const totalMaterialCost = fin.totalCost || 0;
                   const rations = fin.numberOfRations || 1;
                   const costPerRation = totalMaterialCost / rations;
                   const pvp = fin.sellingPrice || 0;
                   const foodCostPercent = pvp > 0 ? (costPerRation / pvp) * 100 : 0;
                   const grossMargin = pvp - costPerRation;
                   const grossMarginPercent = pvp > 0 ? (grossMargin / pvp) * 100 : 0;

                   return (
                     <div key={fin.dishId} className="bg-white border border-slate-900 shadow-lg mx-auto max-w-4xl print:shadow-none print:border-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                        {/* Header */}
                        <div className="bg-indigo-100 border-b-2 border-slate-900 p-4 text-center">
                            <h3 className="text-xl font-bold uppercase tracking-wider text-slate-900">Escandallo de Plato / Hoja de Coste</h3>
                        </div>
                        {/* Subheader Grid */}
                        <div className="grid grid-cols-12 border-b-2 border-slate-900 text-sm">
                            <div className="col-span-8 p-2 border-r border-slate-900">
                                <label className="font-bold block text-xs uppercase text-slate-500">Nombre del Plato</label>
                                <span className="text-lg font-bold text-slate-900">{dish?.name || 'Plato Desconocido'}</span>
                            </div>
                            <div className="col-span-2 p-2 border-r border-slate-900">
                                <label className="font-bold block text-xs uppercase text-slate-500">Nº Raciones</label>
                                <input type="number" className="w-full font-bold bg-yellow-50 border-b border-slate-300 focus:outline-none" value={fin.numberOfRations} onChange={(e) => updateFinancial(fin.dishId, 'numberOfRations', parseFloat(e.target.value))} />
                            </div>
                            <div className="col-span-2 p-2">
                                <label className="font-bold block text-xs uppercase text-slate-500">Fecha</label>
                                <span className="text-slate-700">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Table Header */}
                        <div className="grid grid-cols-12 bg-indigo-50 border-b border-slate-900 text-xs font-bold uppercase text-center tracking-tight">
                            <div className="col-span-4 p-2 border-r border-slate-300 text-left">Producto / Ingrediente</div>
                            <div className="col-span-2 p-2 border-r border-slate-300">Cantidad</div>
                            <div className="col-span-2 p-2 border-r border-slate-300">Unidad</div>
                            <div className="col-span-2 p-2 border-r border-slate-300">Precio Unit. (€)</div>
                            <div className="col-span-2 p-2">Coste Total (€)</div>
                        </div>

                        {/* Ingredients Rows */}
                        <div className="text-sm">
                            {fin.ingredients.map((ing, idx) => {
                                const cleanQty = ing.quantity.replace(',', '.');
                                const qty = parseFloat(cleanQty);
                                const validQty = isNaN(qty) ? 0 : qty;
                                const rowCost = (validQty * ing.price);

                                return (
                                    <div key={idx} className="grid grid-cols-12 border-b border-slate-200 hover:bg-slate-50 group">
                                        <div className="col-span-4 p-1 border-r border-slate-200">
                                            <input className="w-full bg-transparent px-2 py-1 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Nombre ingrediente..." value={ing.name} onChange={(e) => updateIngredient(fin.dishId, idx, 'name', e.target.value)} />
                                        </div>
                                        <div className="col-span-2 p-1 border-r border-slate-200">
                                            <input className="w-full bg-transparent text-center px-2 py-1 focus:bg-white outline-none" type="text" placeholder="ej: 0.5 o c/s" value={ing.quantity} onChange={(e) => updateIngredient(fin.dishId, idx, 'quantity', e.target.value)} />
                                        </div>
                                        <div className="col-span-2 p-1 border-r border-slate-200">
                                            <input className="w-full bg-transparent text-center px-2 py-1 focus:bg-white outline-none" placeholder="kg, L, ud" value={ing.unit} onChange={(e) => updateIngredient(fin.dishId, idx, 'unit', e.target.value)} />
                                        </div>
                                        <div className="col-span-2 p-1 border-r border-slate-200">
                                            <input className="w-full bg-transparent text-right px-2 py-1 focus:bg-white outline-none" type="number" step="0.01" value={ing.price} onChange={(e) => updateIngredient(fin.dishId, idx, 'price', parseFloat(e.target.value))} />
                                        </div>
                                        <div className="col-span-2 p-2 text-right font-mono text-slate-700 relative">
                                            {rowCost.toFixed(2)} €
                                            <button onClick={() => removeIngredient(fin.dishId, idx)} className="absolute right-1 top-1.5 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-100 p-1 rounded"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="p-2 text-center">
                                <button onClick={() => addIngredient(fin.dishId)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1"><Plus className="w-3 h-3"/> Añadir Ingrediente</button>
                            </div>
                        </div>

                        {/* Footer Calculations */}
                        <div className="border-t-2 border-slate-900 bg-slate-50 text-sm">
                            <div className="grid grid-cols-12 border-b border-slate-300">
                                <div className="col-span-8 p-2 text-right font-bold border-r border-slate-300">Coste total de materia prima</div>
                                <div className="col-span-4 p-2 text-right font-mono font-bold">{totalMaterialCost.toFixed(2)} €</div>
                            </div>
                             <div className="grid grid-cols-12 border-b border-slate-300">
                                <div className="col-span-8 p-2 text-right font-bold border-r border-slate-300">Coste por ración</div>
                                <div className="col-span-4 p-2 text-right font-mono font-bold bg-yellow-100">{costPerRation.toFixed(2)} €</div>
                            </div>
                            <div className="grid grid-cols-12 border-b border-slate-300">
                                <div className="col-span-8 p-2 text-right font-bold border-r border-slate-300">% Food Cost (Coste MP / PVP)</div>
                                <div className={`col-span-4 p-2 text-right font-mono font-bold ${foodCostPercent > 35 ? 'text-red-600' : 'text-emerald-600'}`}>{foodCostPercent.toFixed(1)} %</div>
                            </div>
                            
                            {/* Reverse Calc Section */}
                            <div className="grid grid-cols-12 border-b border-slate-300 bg-white">
                                <div className="col-span-8 p-2 text-right font-bold border-r border-slate-300 flex items-center justify-end gap-2 text-indigo-600">
                                  <Calculator className="w-3 h-3"/> Food Cost Objetivo (%) para calcular PVP
                                </div>
                                <div className="col-span-4 p-2 text-right">
                                    <input 
                                       type="number"
                                       placeholder="Ej: 30"
                                       className="w-full text-right p-1 bg-indigo-50 border border-indigo-200 rounded text-indigo-700 font-bold focus:ring-1 focus:ring-indigo-500"
                                       onChange={(e) => handleTargetFoodCostChange(fin.dishId, parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 border-b border-slate-300">
                                <div className="col-span-8 p-2 text-right font-bold border-r border-slate-300">Margen Bruto de explotación (PVP - Coste)</div>
                                <div className="col-span-4 p-2 text-right font-mono">{grossMargin.toFixed(2)} €</div>
                            </div>
                            <div className="grid grid-cols-12 border-b border-slate-300">
                                <div className="col-span-8 p-2 text-right font-bold border-r border-slate-300">% Margen Bruto</div>
                                <div className="col-span-4 p-2 text-right font-mono">{grossMarginPercent.toFixed(1)} %</div>
                            </div>
                            <div className="grid grid-cols-12 bg-indigo-100 border-t-2 border-slate-900">
                                <div className="col-span-8 p-3 text-right font-bold border-r border-slate-300 uppercase text-indigo-900 flex items-center justify-end gap-2">
                                    <DollarSign className="w-4 h-4" /> Precio Venta Público (PVP) por ración
                                </div>
                                <div className="col-span-4 p-2 text-right">
                                    <input 
                                        type="number" 
                                        step="0.10" 
                                        className="w-full text-right font-bold text-xl bg-white border border-indigo-300 p-1 rounded text-indigo-700 focus:ring-2 ring-indigo-500 outline-none" 
                                        value={fin.sellingPrice} 
                                        onChange={(e) => updateFinancial(fin.dishId, 'sellingPrice', parseFloat(e.target.value))} 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-2 flex justify-end">
                           <button onClick={() => removeFinancial(fin.dishId)} className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"><Trash2 className="w-3 h-3" /> Eliminar Escandallo</button>
                        </div>
                     </div>
                   );
                })}
                {state.financials.length === 0 && (
                    <div className="text-center p-10 border-2 border-dashed border-slate-300 rounded-xl text-slate-400">
                        <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No hay escandallos creados aún.</p>
                    </div>
                )}
                </div>
          </div>
      )}
      {activeTab === 'Sensory' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-slate-800">Catas</h3><button onClick={addSensory} className="text-indigo-600 text-sm flex items-center gap-1"><Plus className="w-4 h-4"/> Añadir</button></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{state.dishes.map((d, idx) => (<div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative"><button onClick={() => removeSensory(idx)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button><div className="space-y-3"><div><label className="text-xs font-bold text-slate-500">Plato</label><input className="w-full p-2 border rounded font-bold" value={d.dishName} onChange={(e) => {const n=[...state.dishes]; n[idx].dishName=e.target.value; updateField('dishes', n)}} /></div><div><label className="text-xs font-bold text-slate-500">Expectativa</label><textarea className="w-full p-2 border rounded h-16 text-sm" value={d.expectation} onChange={(e) => {const n=[...state.dishes]; n[idx].expectation=e.target.value; updateField('dishes', n)}} /></div><div><label className="text-xs font-bold text-slate-500">Realidad</label><textarea className="w-full p-2 border rounded h-16 text-sm" value={d.reality} onChange={(e) => {const n=[...state.dishes]; n[idx].reality=e.target.value; updateField('dishes', n)}} /></div><div><label className="text-xs font-bold text-slate-500">Desperdicio</label><input className="w-full p-2 border rounded text-sm" value={d.waste} onChange={(e) => {const n=[...state.dishes]; n[idx].waste=e.target.value; updateField('dishes', n)}} /></div></div></div>))}</div>
          </div>
      )}
      {activeTab === 'Report' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col animate-in fade-in">
             <h3 className="text-lg font-bold text-slate-800 mb-2">Informe Brigada</h3>
             <textarea className="w-full flex-1 p-4 border border-slate-200 rounded-lg resize-none min-h-[300px]" value={state.brigadeReport} onChange={(e) => updateField('brigadeReport', e.target.value)} placeholder="Informe de ejecución..." />
          </div>
      )}
    </div>
  );
};

// --- Structured Phase 6 Editor (Old Phase 5 - Memoria y Defensa) ---
export const Phase6Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, currentUser, config, fullProjectData }) => {
  // Robustness: Ensure coEvaluations is an array
  const state: Phase6Data = { 
    ...INITIAL_PHASE_6, 
    ...(data || {}),
    coEvaluations: Array.isArray(data?.coEvaluations) ? data.coEvaluations : []
  };

  const [activeTab, setActiveTab] = useState<'Checklist' | 'Memory' | 'Edition' | 'Defense' | 'CoEval'>('Checklist');
  const updateField = (field: keyof Phase6Data, value: any) => onUpdate({ ...state, [field]: value });
  
  const updatePolished = (field: string, value: string) => {
    updateField('polishedTexts', { ...state.polishedTexts, [field]: value });
  };

  const handleExtraImage = (field: 'coverImage' | 'teamImage', file: File) => {
    handleImageUploadWithResize(file, (base64) => {
      updateField(field, base64);
    });
  };
  
  const importDraftText = (target: string, sourceText: string) => {
    if (window.confirm("¿Importar texto borrador? Esto sobrescribirá la edición actual de esta sección.")) {
      updatePolished(target, sourceText || "");
    }
  };

  const addCoEval = () => { if(!currentUser) { alert("Selecciona tu usuario."); return; } updateField('coEvaluations', [...state.coEvaluations, { id: Date.now().toString(), reviewer: currentUser, target: '', justification: '', score: 0, timestamp: new Date().toISOString() }]); };
  const updateCoEval = (id: string, field: keyof CoEvaluationEntry, val: any) => updateField('coEvaluations', state.coEvaluations.map(c => c.id === id ? { ...c, [field]: val } : c));
  const removeCoEval = (id: string) => updateField('coEvaluations', state.coEvaluations.filter(c => c.id !== id));

  return (
    <div className="space-y-6 pb-10">
       <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
         <button onClick={() => setActiveTab('Checklist')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Checklist' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>1. Checklist</button>
         <button onClick={() => setActiveTab('Memory')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Memory' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>2. Memoria Final</button>
         <button onClick={() => setActiveTab('Edition')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Edition' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>3. Edición Visual 🖊️</button>
         <button onClick={() => setActiveTab('Defense')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Defense' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>4. Defensa</button>
         <button onClick={() => setActiveTab('CoEval')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'CoEval' ? 'bg-red-600 text-white' : 'bg-white border border-red-200 text-red-800'}`}>5. Coevaluación</button>
      </div>

      {activeTab === 'Checklist' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-in fade-in">
             <h3 className="text-xl font-bold text-slate-800 mb-6">Checklist Entrega Final</h3>
             <div className="space-y-4 max-w-2xl">
                <label className="flex items-center gap-4 p-4 border rounded-xl hover:bg-slate-50 cursor-pointer"><input type="checkbox" className="w-6 h-6 text-indigo-600 rounded" checked={state.individualChecklist.investigationDone} onChange={(e) => updateField('individualChecklist', {...state.individualChecklist, investigationDone: e.target.checked})} /><span className="font-bold text-slate-800 block">Investigación</span></label>
                <label className="flex items-center gap-4 p-4 border rounded-xl hover:bg-slate-50 cursor-pointer"><input type="checkbox" className="w-6 h-6 text-indigo-600 rounded" checked={state.individualChecklist.dishesDesigned} onChange={(e) => updateField('individualChecklist', {...state.individualChecklist, dishesDesigned: e.target.checked})} /><span className="font-bold text-slate-800 block">Platos</span></label>
                <label className="flex items-center gap-4 p-4 border rounded-xl hover:bg-slate-50 cursor-pointer"><input type="checkbox" className="w-6 h-6 text-indigo-600 rounded" checked={state.individualChecklist.selfEvalDone} onChange={(e) => updateField('individualChecklist', {...state.individualChecklist, selfEvalDone: e.target.checked})} /><span className="font-bold text-slate-800 block">Autoevaluación</span></label>
                <label className="flex items-center gap-4 p-4 border rounded-xl hover:bg-slate-50 cursor-pointer"><input type="checkbox" className="w-6 h-6 text-indigo-600 rounded" checked={state.individualChecklist.defensePrepared} onChange={(e) => updateField('individualChecklist', {...state.individualChecklist, defensePrepared: e.target.checked})} /><span className="font-bold text-slate-800 block">Defensa</span></label>
             </div>
          </div>
      )}
      {activeTab === 'Memory' && (
          <div className="space-y-6 animate-in fade-in">
             <div className="bg-indigo-50 p-4 rounded-lg text-indigo-800 text-sm border border-indigo-100"><p className="font-bold">Montaje Final</p></div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                <div><label className="block text-sm font-bold text-slate-700 mb-2">2. Resumen (Abstract)</label><textarea className="w-full p-3 border rounded-lg h-32 text-sm" value={state.abstract} onChange={(e) => updateField('abstract', e.target.value)} /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">3.3. Alcance y Limitaciones</label><textarea className="w-full p-3 border rounded-lg h-32 text-sm" value={state.projectScope} onChange={(e) => updateField('projectScope', e.target.value)} /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">4.4. Riesgos Laborales</label><textarea className="w-full p-3 border rounded-lg h-32 text-sm" value={state.occupationalRisks} onChange={(e) => updateField('occupationalRisks', e.target.value)} /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">5.1. Metodología</label><textarea className="w-full p-3 border rounded-lg h-32 text-sm" value={state.methodology} onChange={(e) => updateField('methodology', e.target.value)} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-sm font-bold text-slate-700 mb-2">6.1. Resultados</label><textarea className="w-full p-3 border rounded-lg h-32 text-sm" value={state.resultsAnalysis} onChange={(e) => updateField('resultsAnalysis', e.target.value)} /></div><div><label className="block text-sm font-bold text-slate-700 mb-2">7. Conclusiones</label><textarea className="w-full p-3 border rounded-lg h-32 text-sm" value={state.finalConclusions} onChange={(e) => updateField('finalConclusions', e.target.value)} /></div></div>
             </div>
          </div>
      )}
      {activeTab === 'Edition' && (
         <div className="space-y-6 animate-in fade-in">
            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm border border-blue-100 flex gap-2">
               <PenTool className="w-5 h-5 flex-shrink-0" />
               <div>
                 <p className="font-bold">Edición Visual y Pulido de Textos</p>
                 <p>Aquí puedes subir fotos de portada/equipo y editar los textos finales para mejorar el estilo sin perder la autoría original (los textos originales se conservan para evaluación).</p>
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Image className="w-5 h-5" /> Imágenes Extra</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Foto de Portada</label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 relative group">
                         {state.coverImage ? <img src={state.coverImage} className="w-full h-40 object-cover rounded" /> : <div className="h-40 flex items-center justify-center text-slate-400">Sin foto</div>}
                         <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                            Cambiar Foto <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleExtraImage('coverImage', e.target.files[0])} />
                         </label>
                      </div>
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Foto de Equipo (Agradecimientos)</label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 relative group">
                         {state.teamImage ? <img src={state.teamImage} className="w-full h-40 object-cover rounded" /> : <div className="h-40 flex items-center justify-center text-slate-400">Sin foto</div>}
                         <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                            Cambiar Foto <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleExtraImage('teamImage', e.target.files[0])} />
                         </label>
                      </div>
                   </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
               <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><FileText className="w-5 h-5" /> Edición de Textos (Versión Impresa)</h3>
               
               {/* Polished Intro */}
               <div>
                  <div className="flex justify-between mb-2">
                     <label className="block text-sm font-bold text-slate-700">Introducción (Editada)</label>
                     <button onClick={() => importDraftText('intro', fullProjectData?.phases?.phase4?.introContext)} className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"><FileUp className="w-3 h-3"/> Importar Borrador Fase 4</button>
                  </div>
                  <textarea className="w-full p-3 border rounded-lg h-32 text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="Texto final pulido para impresión..." value={state.polishedTexts?.intro || ""} onChange={(e) => updatePolished('intro', e.target.value)} />
               </div>

               {/* Polished Analysis */}
               <div>
                  <div className="flex justify-between mb-2">
                     <label className="block text-sm font-bold text-slate-700">Análisis Sector (Editado)</label>
                     <button onClick={() => importDraftText('analysis', fullProjectData?.phases?.phase4?.sectorCharacterization)} className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"><FileUp className="w-3 h-3"/> Importar Borrador Fase 4</button>
                  </div>
                  <textarea className="w-full p-3 border rounded-lg h-32 text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="Texto final pulido para impresión..." value={state.polishedTexts?.analysis || ""} onChange={(e) => updatePolished('analysis', e.target.value)} />
               </div>
            </div>
         </div>
      )}
      {activeTab === 'Defense' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in space-y-6">
             <h3 className="text-lg font-bold text-slate-800">Enlaces Defensa</h3>
             <div><label className="block text-sm font-bold text-slate-700 mb-2">Presentación</label><input className="w-full p-3 border rounded-lg bg-slate-50" value={state.presentationUrl} onChange={(e) => updateField('presentationUrl', e.target.value)} /></div>
             <div><label className="block text-sm font-bold text-slate-700 mb-2">Carta Virtual (QR)</label><input className="w-full p-3 border rounded-lg bg-slate-50" value={state.virtualMenuUrl} onChange={(e) => updateField('virtualMenuUrl', e.target.value)} /></div>
             <div><label className="block text-sm font-bold text-slate-700 mb-2">Evidencia Carta Física</label><input className="w-full p-3 border rounded-lg bg-slate-50" value={state.physicalMenuEvidence} onChange={(e) => updateField('physicalMenuEvidence', e.target.value)} /></div>
          </div>
      )}
      {activeTab === 'CoEval' && (
         <div className="space-y-6 animate-in fade-in">
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-red-900"><h3 className="text-lg font-bold flex items-center gap-2 mb-2"><ShieldAlert className="w-5 h-5"/> Coevaluación</h3><button onClick={addCoEval} className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2"><UserPlus className="w-4 h-4" /> Evaluar</button></div>
            <div className="grid grid-cols-1 gap-4">{state.coEvaluations.filter(c => !currentUser || c.reviewer === currentUser).map((ev, idx) => (<div key={ev.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative"><button onClick={() => removeCoEval(ev.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button><div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"><div className="md:col-span-4"><label className="text-xs font-bold text-slate-500 uppercase">Evaluado</label><select className="w-full p-2 border rounded bg-slate-50 font-bold" value={ev.target} onChange={(e) => updateCoEval(ev.id, 'target', e.target.value)}><option value="">-- Seleccionar --</option>{config?.members.filter((m: any) => m.name !== currentUser).map((m: any, i: number) => (<option key={i} value={m.name}>{m.name}</option>))}</select></div><div className="md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase">Puntos (±1)</label><input type="number" step="0.01" max="1" min="-1" className="w-full p-2 border rounded font-bold bg-slate-50" value={ev.score} onChange={(e) => updateCoEval(ev.id, 'score', parseFloat(e.target.value))} /></div><div className="md:col-span-6"><label className="text-xs font-bold text-slate-500 uppercase">Justificación</label><input className="w-full p-2 border rounded" value={ev.justification} onChange={(e) => updateCoEval(ev.id, 'justification', e.target.value)} /></div></div></div>))}</div>
         </div>
      )}
    </div>
  );
};