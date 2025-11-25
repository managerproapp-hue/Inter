import React, { useState, useRef, useEffect } from 'react';
import { Phase2Data, Phase3Data, Phase4Data, Phase5Data, Phase6Data, DishCategory, MenuDish, DishEval, DishFinancial, IngredientCost, CoEvaluationEntry, ProjectConfig, PlanningActivity, RoleType } from '../types';
import { ODS_LIST, INITIAL_PHASE_2, INITIAL_PHASE_3, INITIAL_PHASE_4, INITIAL_PHASE_5, INITIAL_PHASE_6 } from '../constants';
import { Plus, Trash2, Wand2, Sparkles, Check, Search, Briefcase, MapPin, Target, Leaf, PieChart, Book, Users, Utensils, Image, Smartphone, ChevronDown, X, AlertCircle, Camera, Calendar, DollarSign, Store, Calculator, FileCheck, Presentation, Laptop, ShieldAlert, FileText, BarChart3, Flame, UserMinus, UserPlus, Lock, Edit, Save, Upload, GraduationCap, AlertTriangle, FileUp, Clock, Hammer, Info, PenTool, Eye, Filter } from 'lucide-react';
import { enhanceText, suggestConcept } from '../services/geminiService';

interface EditorProps {
  data: any;
  onUpdate: (data: any) => void;
  isReadOnly?: boolean;
  projectContext: string;
  config?: ProjectConfig;
  onConfigUpdate?: (newConfig: ProjectConfig) => void;
  phase3Data?: Phase3Data;
  currentUser?: string;
  fullProjectData?: any;
  currentRole?: RoleType | null;
}

// --- Helper: Role Banner ---
const RoleBanner: React.FC<{ role: RoleType, isOwner: boolean }> = ({ role, isOwner }) => {
  let color = "bg-slate-100 text-slate-700 border-slate-200";
  if (role === RoleType.COORDINATOR) color = "bg-indigo-50 text-indigo-800 border-indigo-200";
  if (role === RoleType.DOCUMENTATION) color = "bg-emerald-50 text-emerald-800 border-emerald-200";
  if (role === RoleType.COMMUNICATION) color = "bg-purple-50 text-purple-800 border-purple-200";
  if (role === RoleType.RESOURCES) color = "bg-amber-50 text-amber-800 border-amber-200";
  if (role === RoleType.PRODUCTION) color = "bg-pink-50 text-pink-800 border-pink-200";

  return (
    <div className={`p-3 rounded-lg border mb-4 flex items-start gap-3 ${color}`}>
       <div className="mt-0.5"><ShieldAlert className="w-5 h-5" /></div>
       <div>
          <p className="font-bold text-sm">Responsabilidad: {role}</p>
          {!isOwner && <p className="text-xs opacity-80">👁️ Estás en una sección liderada por el {role}. Puedes sugerir cambios, pero él/ella debe validarlos.</p>}
          {isOwner && <p className="text-xs opacity-80">✅ Esta es tu sección principal. Lidera la redacción.</p>}
       </div>
    </div>
  );
};

// --- Helper: Image Resizer ---
const handleImageUploadWithResize = (file: File, callback: (base64: string) => void) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new globalThis.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const MAX_WIDTH = 600;
      const MAX_HEIGHT = 600;
      if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) { ctx.drawImage(img, 0, 0, width, height); callback(canvas.toDataURL('image/jpeg', 0.6)); }
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

// --- Helper Component: Multi-Select ODS Dropdown ---
const ODSSelector: React.FC<{ selected: string | string[], onChange: (val: string | string[]) => void, min?: number, mode?: 'string' | 'array' }> = ({ selected, onChange, min = 0, mode = 'string' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedArray: string[] = Array.isArray(selected) ? selected : (selected ? selected.split(', ') : []);
  const toggleODS = (ods: string) => {
    let newArray; if (selectedArray.includes(ods)) newArray = selectedArray.filter(item => item !== ods); else newArray = [...selectedArray, ods];
    newArray.sort((a, b) => parseInt(a) - parseInt(b));
    if (mode === 'array') onChange(newArray); else onChange(newArray.join(', '));
  };
  useEffect(() => { function handleClickOutside(event: MouseEvent) { if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setIsOpen(false); } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [wrapperRef]);
  const isValid = min === 0 || selectedArray.length >= min;
  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div onClick={() => setIsOpen(!isOpen)} className={`min-h-[42px] w-full p-2 border rounded-lg bg-white cursor-pointer flex items-center justify-between hover:border-indigo-400 transition-colors ${!isValid ? 'border-orange-300 ring-1 ring-orange-100' : 'border-slate-300'}`}>
        <div className="flex flex-wrap gap-1">{selectedArray.length === 0 && <span className="text-slate-400 text-sm">Seleccionar ODS...</span>}{selectedArray.map(ods => (<span key={ods} className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">{ods.split('.')[0]} <X className="w-3 h-3 cursor-pointer hover:text-emerald-600" onClick={(e) => { e.stopPropagation(); toggleODS(ods); }} /></span>))}</div>
        <div className="flex items-center gap-2 text-slate-400">{!isValid && <span className="text-[10px] text-orange-500 font-bold whitespace-nowrap">Mínimo {min}</span>}<ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></div>
      </div>
      {isOpen && (<div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">{ODS_LIST.map(ods => { const isSelected = selectedArray.includes(ods); return (<div key={ods} onClick={() => toggleODS(ods)} className={`p-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-slate-50 ${isSelected ? 'bg-emerald-50 text-emerald-900' : 'text-slate-600'}`}><div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>{isSelected && <Check className="w-3 h-3 text-white" />}</div><span>{ods}</span></div>)})}</div>)}
    </div>
  );
};

export const TextPhaseEditor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, projectContext }) => {
  const [loading, setLoading] = useState(false);
  const handleAI = async () => { setLoading(true); const improved = await enhanceText(data, projectContext); onUpdate(improved); setLoading(false); };
  return (
    <div className="space-y-4 h-full flex flex-col">
      {!isReadOnly && (<div className="flex justify-end"><button onClick={handleAI} disabled={loading || !data} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50">{loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}{loading ? 'Mejorando...' : 'Mejorar con Gemini IA'}</button></div>)}
      <textarea className="w-full flex-1 p-6 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none document-font text-lg leading-relaxed text-slate-700 min-h-[600px]" value={data || ''} onChange={(e) => onUpdate(e.target.value)} placeholder="Escribe aquí..." readOnly={isReadOnly} />
    </div>
  );
};

// --- Phase 1 Editor ---
export const Phase1Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, projectContext, config, onConfigUpdate, currentRole }) => {
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [tempConfig, setTempConfig] = useState<ProjectConfig | null>(null);
  
  // SOFT-LOCK: Only Coordinator should edit Phase 1
  const isCoordinator = currentRole === RoleType.COORDINATOR;

  useEffect(() => { if (config) setTempConfig(config); }, [config]);
  if (!config || !tempConfig) return <div>Error Config</div>;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUploadWithResize(file, (base64) => setTempConfig(prev => prev ? ({ ...prev, schoolLogo: base64 }) : null));
  };
  const saveConfig = () => { if (onConfigUpdate && tempConfig) { onConfigUpdate(tempConfig); setIsEditingConfig(false); }};

  return (
    <div className="space-y-8 h-full flex flex-col pb-10">
      {!isCoordinator && (
         <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg text-orange-800 text-sm flex gap-2">
            <Lock className="w-4 h-4 mt-0.5" />
            <span><strong>Vista de Solo Lectura:</strong> Solo el Coordinador puede modificar la configuración del equipo.</span>
         </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative group">
        {!isReadOnly && !isEditingConfig && isCoordinator && (
           <button onClick={() => setIsEditingConfig(true)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10 flex items-center gap-2 text-xs font-bold"><Edit className="w-4 h-4" /> Editar Datos</button>
        )}
        <div className="bg-slate-800 p-6 text-white flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4 w-full">
            <div className="relative">
                <div className="bg-white p-2 rounded-lg w-24 h-24 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg">
                    {tempConfig.schoolLogo ? <img src={tempConfig.schoolLogo} className="w-full h-full object-contain" /> : <Store className="w-10 h-10 text-slate-300" />}
                </div>
                {isEditingConfig && (<label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg cursor-pointer text-white text-xs hover:bg-black/60 transition-colors"><Camera className="w-6 h-6 mb-1" /> Cambiar<input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} /></label>)}
            </div>
            <div className="flex-1">
              {isEditingConfig ? (
                <div className="space-y-2 animate-in fade-in">
                   <div><label className="text-[10px] uppercase text-slate-400 font-bold">Nombre del Centro</label><input className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm" value={tempConfig.schoolName} onChange={(e) => setTempConfig({...tempConfig, schoolName: e.target.value})} /></div>
                   <div><label className="text-[10px] uppercase text-slate-400 font-bold">Dirección</label><input className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm" value={tempConfig.schoolAddress} onChange={(e) => setTempConfig({...tempConfig, schoolAddress: e.target.value})} /></div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{tempConfig.projectName}</h2>
                  <p className="text-slate-400 mt-1 text-lg">{tempConfig.teamName}</p>
                  {tempConfig.schoolName && (<div className="mt-3 pt-3 border-t border-slate-700"><p className="text-xs text-indigo-300 uppercase tracking-wider font-bold flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {tempConfig.schoolName}</p>{tempConfig.schoolAddress && <p className="text-xs text-slate-500">{tempConfig.schoolAddress}</p>}</div>)}
                </>
              )}
            </div>
          </div>
          {isEditingConfig && (<div className="flex gap-2 mt-2 md:mt-0"><button onClick={() => { setTempConfig(config); setIsEditingConfig(false); }} className="p-2 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30"><X className="w-5 h-5" /></button><button onClick={saveConfig} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg"><Save className="w-4 h-4" /> Guardar</button></div>)}
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-[600px]">
        <TextPhaseEditor data={data} onUpdate={onUpdate} isReadOnly={!isCoordinator} projectContext={projectContext} />
      </div>
    </div>
  );
};

// --- Phase 2 Editor ---
export const Phase2Editor: React.FC<EditorProps> = ({ data, onUpdate, projectContext, currentUser, currentRole }) => {
  const state: Phase2Data = { ...INITIAL_PHASE_2, ...(data || {}), trends: Array.isArray(data?.trends) ? data.trends : [], publicAnalysis: Array.isArray(data?.publicAnalysis) ? data.publicAnalysis : [], menuBenchmarking: Array.isArray(data?.menuBenchmarking) ? data.menuBenchmarking : [], references: Array.isArray(data?.references) ? data.references : [], concept: { ...INITIAL_PHASE_2.concept, ...(data?.concept || {}) } };
  const [activeTab, setActiveTab] = useState<'PartA' | 'PartB'>('PartA');
  const updateField = (field: keyof Phase2Data, value: any) => onUpdate({ ...state, [field]: value });
  
  // Auto-authoring
  const addTrend = () => updateField('trends', [...state.trends, { id: Date.now().toString(), description: '', author: currentUser }]);
  const addPublic = () => updateField('publicAnalysis', [...state.publicAnalysis, { id: Date.now().toString(), profile: '', method: '', linkedODS: '', author: currentUser }]);
  const addMenu = () => updateField('menuBenchmarking', [...state.menuBenchmarking, { id: Date.now().toString(), restaurantName: '', location: '', sustainableDish: '', ods: '', author: currentUser }]);
  
  const isCoordinator = currentRole === RoleType.COORDINATOR;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex gap-4 mb-4 border-b border-slate-200 pb-1">
        <button onClick={() => setActiveTab('PartA')} className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'PartA' ? 'bg-blue-50 text-blue-800 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-700'}`}>🅰️ Análisis Individual (Todos)</button>
        <button onClick={() => setActiveTab('PartB')} className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'PartB' ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}>🅱️ Modelo de Negocio (Coordinador)</button>
      </div>
      {activeTab === 'PartA' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Leaf className="w-4 h-4"/> Tendencias</h3><button onClick={addTrend}><Plus className="w-3 h-3"/></button></div>
                <div className="space-y-2">{(state.trends || []).map((t, idx) => (<div key={idx} className="flex gap-2"><input className="flex-1 p-2 border rounded text-sm" value={t.description} onChange={(e) => {const n=[...state.trends]; n[idx].description=e.target.value; updateField('trends', n)}} /><span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 self-center">{t.author || "?"}</span></div>))}</div>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4"/> Público</h3><button onClick={addPublic}><Plus className="w-3 h-3"/></button></div>
                <div className="space-y-3">{(state.publicAnalysis || []).map((p, idx) => (<div key={idx} className="bg-slate-50 p-3 rounded border border-slate-100 space-y-2 text-sm"><input className="w-full p-2 border rounded" placeholder="Perfil" value={p.profile} onChange={(e) => {const n=[...state.publicAnalysis]; n[idx].profile=e.target.value; updateField('publicAnalysis', n)}} /><ODSSelector selected={p.linkedODS} onChange={(val) => {const n=[...state.publicAnalysis]; n[idx].linkedODS=val as string; updateField('publicAnalysis', n)}} /></div>))}</div>
             </div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Search className="w-5 h-5 text-indigo-600"/> Cartas (Min 5)</h3><button onClick={addMenu}><Plus className="w-4 h-4"/></button></div>
              <div className="space-y-4">{(state.menuBenchmarking || []).map((m, idx) => (<div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start bg-slate-50 p-3 rounded border relative"><div className="col-span-3"><input className="w-full p-2 border rounded text-sm font-bold" placeholder="Restaurante" value={m.restaurantName} onChange={(e) => {const n=[...state.menuBenchmarking]; n[idx].restaurantName=e.target.value; updateField('menuBenchmarking', n)}} /></div><div className="col-span-3"><input className="w-full p-2 border rounded text-sm" placeholder="Ubicación" value={m.location} onChange={(e) => {const n=[...state.menuBenchmarking]; n[idx].location=e.target.value; updateField('menuBenchmarking', n)}} /></div><div className="col-span-3"><input className="w-full p-2 border rounded text-sm" placeholder="Plato" value={m.sustainableDish} onChange={(e) => {const n=[...state.menuBenchmarking]; n[idx].sustainableDish=e.target.value; updateField('menuBenchmarking', n)}} /></div><div className="col-span-2"><ODSSelector selected={m.ods} onChange={(val) => {const n=[...state.menuBenchmarking]; n[idx].ods=val as string; updateField('menuBenchmarking', n)}} /></div><div className="col-span-12 text-right text-xs text-slate-400 italic">Autor: {m.author || "Sin firmar"}</div></div>))}</div>
           </div>
        </div>
      )}
      {activeTab === 'PartB' && (
        <div className="space-y-8">
           <RoleBanner role={RoleType.COORDINATOR} isOwner={isCoordinator} />
           <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500 ${!isCoordinator ? 'opacity-80 grayscale-[0.3]' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-1">Nombre</label><input className="w-full p-3 border rounded-lg text-lg font-serif bg-slate-50" value={state.concept.name} onChange={(e) => updateField('concept', {...state.concept, name: e.target.value})} disabled={!isCoordinator} /></div>
                 <div><label className="block text-sm font-bold text-slate-700 mb-1">Tipo</label><input className="w-full p-2 border rounded" value={state.concept.restaurantType} onChange={(e) => updateField('concept', {...state.concept, restaurantType: e.target.value})} disabled={!isCoordinator} /></div>
                 <div><label className="block text-sm font-bold text-slate-700 mb-1">Estilo</label><input className="w-full p-2 border rounded" value={state.concept.culinaryStyle} onChange={(e) => updateField('concept', {...state.concept, culinaryStyle: e.target.value})} disabled={!isCoordinator} /></div>
                 <div><label className="block text-sm font-bold text-slate-700 mb-1">Cliente</label><input className="w-full p-2 border rounded" value={state.concept.targetAudience} onChange={(e) => updateField('concept', {...state.concept, targetAudience: e.target.value})} disabled={!isCoordinator} /></div>
                 <div><label className="block text-sm font-bold text-slate-700 mb-1">Precio</label><input className="w-full p-2 border rounded" value={state.concept.averagePrice} onChange={(e) => updateField('concept', {...state.concept, averagePrice: e.target.value})} disabled={!isCoordinator} /></div>
                 <div className="col-span-2"><label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label><textarea className="w-full p-3 border rounded h-20 text-sm" value={state.concept.description} onChange={(e) => updateField('concept', {...state.concept, description: e.target.value})} disabled={!isCoordinator} /></div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export const Phase3Editor: React.FC<EditorProps> = ({ data, onUpdate, currentUser, currentRole }) => {
  const state: Phase3Data = { ...INITIAL_PHASE_3, ...(data || {}), menu: Array.isArray(data?.menu) ? data.menu : [] };
  const [activeTab, setActiveTab] = useState<'Products' | 'Menu' | 'Visual'>('Menu');
  const [filterMyDishes, setFilterMyDishes] = useState(true);
  const updateField = (field: keyof Phase3Data, value: any) => onUpdate({ ...state, [field]: value });
  
  // Auto-authoring
  const addDish = (category: DishCategory) => updateField('menu', [...state.menu, { id: Date.now().toString(), category, name: '', ingredients: '', elaboration: '', allergens: '', techniques: '', presentation: '', ods: '', author: currentUser || '' }]);
  const updateDish = (id: string, field: keyof MenuDish, val: string) => updateField('menu', state.menu.map(d => d.id === id ? { ...d, [field]: val } : d));
  const categories: DishCategory[] = ['Aperitivo', 'Entrante', 'Principal', 'Postre'];
  const displayedDishes = filterMyDishes && currentUser ? state.menu.filter(d => d.author === currentUser) : state.menu;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2"><button onClick={() => setActiveTab('Menu')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'Menu' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>2. Mis Platos</button><button onClick={() => setActiveTab('Visual')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'Visual' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>3. Visual</button><button onClick={() => setActiveTab('Products')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'Products' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>1. Productos</button></div>
      {activeTab === 'Menu' && (
         <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
               <div><h3 className="font-bold text-slate-800">Gestión de Menú</h3><p className="text-xs text-slate-500">Cada alumno debe aportar 4 platos.</p></div>
               <button onClick={() => setFilterMyDishes(!filterMyDishes)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${filterMyDishes ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}><Filter className="w-4 h-4"/> {filterMyDishes ? "Viendo: Solo Mis Platos" : "Viendo: Todo el Equipo"}</button>
            </div>
            {categories.map(cat => (
               <div key={cat} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800 text-lg">{cat}s</h3><button onClick={() => addDish(cat)} className="text-indigo-600 text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Crear {cat}</button></div>
                  <div className="space-y-6">{displayedDishes.filter(d => d.category === cat).map((dish) => (<div key={dish.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50"><div className="grid grid-cols-1 lg:grid-cols-12 gap-6"><div className="col-span-1 lg:col-span-3 flex flex-col items-center gap-2"><div className="w-full aspect-square bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">{dish.image ? <img src={dish.image} className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-slate-400" />}</div><label className="cursor-pointer px-3 py-1 bg-white border border-slate-300 rounded text-xs font-bold flex items-center gap-1"><Image className="w-3 h-3" /> Foto<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUploadWithResize(e.target.files[0], (b64) => updateDish(dish.id, 'image', b64))} /></label></div><div className="col-span-1 lg:col-span-9 space-y-3"><input className="w-full p-2 border rounded bg-white font-bold" value={dish.name} onChange={(e) => updateDish(dish.id, 'name', e.target.value)} placeholder="Nombre del Plato" /><textarea className="w-full p-2 border rounded bg-white text-sm h-20" value={dish.elaboration} onChange={(e) => updateDish(dish.id, 'elaboration', e.target.value)} placeholder="Elaboración" /><div className="text-right text-xs text-slate-400">Autor: {dish.author}</div></div></div></div>))}</div>
               </div>
            ))}
         </div>
      )}
      {activeTab === 'Visual' && (<div><RoleBanner role={RoleType.COMMUNICATION} isOwner={currentRole === RoleType.COMMUNICATION} /><div className="bg-white p-6 rounded-xl border shadow-sm space-y-4"><h3>Diseño Visual</h3><input className="w-full p-3 border rounded" placeholder="Enlace Canva" value={state.visual.canvaDescription} onChange={(e) => updateField('visual', {...state.visual, canvaDescription: e.target.value})} /></div></div>)}
    </div>
  );
};

export const Phase4Editor: React.FC<EditorProps> = ({ data, onUpdate, currentRole, currentUser }) => {
  const state: Phase4Data = { ...INITIAL_PHASE_4, ...(data || {}), timeline: Array.isArray(data?.timeline) ? data.timeline : [] };
  const [activeTab, setActiveTab] = useState<'Intro' | 'Analysis' | 'Design' | 'Planning'>('Intro');
  const updateField = (field: keyof Phase4Data, value: any) => onUpdate({ ...state, [field]: value });
  
  const handleMapUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleImageUploadWithResize(file, (b64) => updateField('mapImage', b64)); };
  
  // Auto-authoring for timeline
  const addActivity = () => updateField('timeline', [...state.timeline, { id: Date.now().toString(), activity: '', dates: '', resources: '', author: currentUser || '' }]);
  const updateActivity = (idx: number, field: keyof PlanningActivity, val: string) => { const n = [...state.timeline]; n[idx] = { ...n[idx], [field]: val }; updateField('timeline', n); };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
         <button onClick={() => setActiveTab('Intro')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'Intro' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>🟢 Intro (Doc)</button>
         <button onClick={() => setActiveTab('Analysis')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'Analysis' ? 'bg-amber-600 text-white' : 'bg-white border'}`}>🟠 Análisis (Rec)</button>
         <button onClick={() => setActiveTab('Design')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'Design' ? 'bg-pink-600 text-white' : 'bg-white border'}`}>🔴 Diseño (Prod)</button>
         <button onClick={() => setActiveTab('Planning')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'Planning' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>🔵 Plan (Coord)</button>
      </div>
      {activeTab === 'Intro' && (
         <div>
            <RoleBanner role={RoleType.DOCUMENTATION} isOwner={currentRole === RoleType.DOCUMENTATION} />
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
               <h3>Introducción</h3>
               <textarea className="w-full p-3 border rounded h-32" value={state.introContext} onChange={(e) => updateField('introContext', e.target.value)} placeholder="Contexto..." />
               <div className="p-4 bg-slate-50 rounded border border-dashed border-slate-300">
                  <p className="text-sm font-bold mb-2">Mapa de la Zona (Densidad)</p>
                  {state.mapImage ? <div className="mb-2"><img src={state.mapImage} className="h-32 object-contain" /><button onClick={() => updateField('mapImage', '')} className="text-xs text-red-500">Eliminar</button></div> : <input type="file" accept="image/*" onChange={handleMapUpload} />}
               </div>
            </div>
         </div>
      )}
      {activeTab === 'Analysis' && (<div><RoleBanner role={RoleType.RESOURCES} isOwner={currentRole === RoleType.RESOURCES} /><div className="bg-white p-6 rounded-xl border shadow-sm space-y-4"><h3>Análisis del Sector</h3><textarea className="w-full p-3 border rounded h-32" value={state.sectorCharacterization} onChange={(e) => updateField('sectorCharacterization', e.target.value)} /></div></div>)}
      {activeTab === 'Design' && (<div><RoleBanner role={RoleType.PRODUCTION} isOwner={currentRole === RoleType.PRODUCTION} /><div className="bg-white p-6 rounded-xl border shadow-sm space-y-4"><h3>Viabilidad</h3><textarea className="w-full p-3 border rounded h-32" value={state.technicalViability} onChange={(e) => updateField('technicalViability', e.target.value)} /></div></div>)}
      {activeTab === 'Planning' && (
         <div>
            <RoleBanner role={RoleType.COORDINATOR} isOwner={currentRole === RoleType.COORDINATOR} />
            <div className="bg-white p-6 rounded-xl border shadow-sm">
               <div className="flex justify-between mb-4"><h3 className="font-bold">Cronograma</h3><button onClick={addActivity}><Plus className="w-4 h-4"/></button></div>
               <div className="space-y-2">{(state.timeline || []).map((act, i) => (<div key={i} className="flex gap-2 text-sm"><input className="flex-1 border p-1" value={act.activity} onChange={(e) => updateActivity(i, 'activity', e.target.value)} placeholder="Actividad" /><input className="w-24 border p-1" value={act.dates} onChange={(e) => updateActivity(i, 'dates', e.target.value)} placeholder="Fechas" /><span className="text-xs text-slate-400 self-center">{act.author}</span></div>))}</div>
            </div>
         </div>
      )}
    </div>
  );
};

export const Phase5Editor: React.FC<EditorProps> = ({ data, onUpdate, phase3Data, currentUser }) => {
  const state: Phase5Data = { ...INITIAL_PHASE_5, ...(data || {}), financials: Array.isArray(data?.financials) ? data.financials : [], dishes: Array.isArray(data?.dishes) ? data.dishes : [] };
  const menu = Array.isArray(phase3Data?.menu) ? phase3Data?.menu : [];
  const [filterMyDishes, setFilterMyDishes] = useState(true);
  const [activeTab, setActiveTab] = useState<'Financials' | 'Sensory'>('Financials');
  const updateField = (field: keyof Phase5Data, value: any) => onUpdate({ ...state, [field]: value });
  
  const myMenu = filterMyDishes && currentUser ? menu.filter(m => m.author === currentUser) : menu;
  const displayedFinancials = state.financials.filter(f => { const m = menu.find(dish => dish.id === f.dishId); return !filterMyDishes || !currentUser || m?.author === currentUser; });

  const addFinancial = (dishId: string) => { if (state.financials.find(f => f.dishId === dishId)) return; updateField('financials', [...state.financials, { dishId, numberOfRations: 10, totalCost: 0, sellingPrice: 0, ingredients: [] }]); };
  const updateFinancial = (dishId: string, fData: Partial<DishFinancial>) => updateField('financials', state.financials.map(f => f.dishId === dishId ? { ...f, ...fData } : f));

  // Calculations
  const calculateTotals = (f: DishFinancial) => {
     const total = f.ingredients.reduce((sum, ing) => sum + (ing.price || 0), 0);
     return total;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex gap-2 mb-4"><button onClick={() => setActiveTab('Financials')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'Financials' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>Escandallos</button></div>
      {activeTab === 'Financials' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
                <div><h3 className="font-bold text-slate-800">Mis Escandallos</h3></div>
                <button onClick={() => setFilterMyDishes(!filterMyDishes)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${filterMyDishes ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}><Filter className="w-4 h-4"/> {filterMyDishes ? "Solo Mis Platos" : "Todos"}</button>
             </div>
             <div className="flex gap-2 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <select className="p-2 border rounded flex-1" id="dishSelect"><option value="">-- Seleccionar Plato --</option>{myMenu.filter(m => !state.financials.find(f => f.dishId === m.id)).map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}</select>
                <button onClick={() => { const select = document.getElementById('dishSelect') as HTMLSelectElement; if(select.value) { addFinancial(select.value); select.value = ''; }}} className="bg-indigo-600 text-white px-4 py-2 rounded font-bold text-sm">Crear Escandallo</button>
             </div>
             <div className="space-y-8">
                {displayedFinancials.map(fin => {
                   const dish = menu.find(m => m.id === fin.dishId);
                   const totalCost = calculateTotals(fin);
                   const costPerRation = fin.numberOfRations > 0 ? totalCost / fin.numberOfRations : 0;
                   const foodCostPct = fin.sellingPrice > 0 ? (costPerRation / fin.sellingPrice) * 100 : 0;
                   
                   // Reverse Calc
                   const [targetFC, setTargetFC] = useState("");
                   const handleReverse = () => {
                      const target = parseFloat(targetFC);
                      if (target > 0 && costPerRation > 0) {
                         const suggestedPVP = costPerRation / (target / 100);
                         updateFinancial(fin.dishId, { sellingPrice: parseFloat(suggestedPVP.toFixed(2)) });
                      }
                   };

                   return (
                      <div key={fin.dishId} className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                         <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center">
                            <h3 className="font-bold text-indigo-900">{dish?.name}</h3>
                            <div className="flex items-center gap-4 text-sm">
                               <label>Raciones: <input type="number" className="w-16 p-1 border rounded text-center" value={fin.numberOfRations} onChange={(e) => updateFinancial(fin.dishId, { numberOfRations: parseInt(e.target.value) || 1 })} /></label>
                            </div>
                         </div>
                         <div className="p-4">
                            <table className="w-full text-sm mb-4">
                               <thead className="bg-slate-100 text-slate-600 font-bold"><tr className="text-left"><th className="p-2">Ingrediente</th><th className="p-2">Cant</th><th className="p-2">Ud</th><th className="p-2 text-right">Coste Total (€)</th><th></th></tr></thead>
                               <tbody>
                                  {fin.ingredients.map((ing, idx) => (
                                     <tr key={idx} className="border-b">
                                        <td className="p-2"><input className="w-full bg-transparent" value={ing.name} onChange={(e) => { const n = [...fin.ingredients]; n[idx].name = e.target.value; updateFinancial(fin.dishId, { ingredients: n }); }} placeholder="Nombre" /></td>
                                        <td className="p-2"><input className="w-16 bg-transparent" value={ing.quantity} onChange={(e) => { const n = [...fin.ingredients]; n[idx].quantity = e.target.value; updateFinancial(fin.dishId, { ingredients: n }); }} placeholder="Cant" /></td>
                                        <td className="p-2"><input className="w-16 bg-transparent" value={ing.unit} onChange={(e) => { const n = [...fin.ingredients]; n[idx].unit = e.target.value; updateFinancial(fin.dishId, { ingredients: n }); }} placeholder="kg/L" /></td>
                                        <td className="p-2 text-right"><input type="number" className="w-20 text-right bg-transparent" value={ing.price} onChange={(e) => { const n = [...fin.ingredients]; n[idx].price = parseFloat(e.target.value) || 0; updateFinancial(fin.dishId, { ingredients: n, totalCost: calculateTotals({...fin, ingredients: n}) }); }} /></td>
                                        <td className="p-2 text-center"><button onClick={() => { const n = fin.ingredients.filter((_, i) => i !== idx); updateFinancial(fin.dishId, { ingredients: n, totalCost: calculateTotals({...fin, ingredients: n}) }); }} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button></td>
                                     </tr>
                                  ))}
                               </tbody>
                            </table>
                            <button onClick={() => updateFinancial(fin.dishId, { ingredients: [...fin.ingredients, { name: '', quantity: '', unit: '', price: 0 }] })} className="text-xs font-bold text-indigo-600 flex items-center gap-1 mb-4"><Plus className="w-3 h-3" /> Añadir Ingrediente</button>
                            
                            <div className="bg-slate-50 p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border border-slate-200">
                               <div><p className="text-slate-500 font-bold text-xs uppercase">Coste Total MP</p><p className="text-lg font-mono">{totalCost.toFixed(2)}€</p></div>
                               <div><p className="text-slate-500 font-bold text-xs uppercase">Coste x Ración</p><p className="text-lg font-mono text-indigo-600">{costPerRation.toFixed(2)}€</p></div>
                               <div className="col-span-2 flex items-end gap-2">
                                  <div className="flex-1">
                                     <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Precio Venta (PVP)</label>
                                     <input type="number" className="w-full p-2 border border-slate-300 rounded font-bold text-emerald-700" value={fin.sellingPrice} onChange={(e) => updateFinancial(fin.dishId, { sellingPrice: parseFloat(e.target.value) || 0 })} />
                                  </div>
                                  <div className="flex-1 text-right">
                                     <p className="text-xs font-bold text-slate-500 uppercase mb-1">Food Cost %</p>
                                     <p className={`text-lg font-bold ${foodCostPct > 35 ? 'text-red-500' : 'text-emerald-500'}`}>{foodCostPct.toFixed(1)}%</p>
                                  </div>
                               </div>
                               <div className="col-span-4 mt-2 border-t pt-2 flex items-center gap-2">
                                  <Calculator className="w-4 h-4 text-slate-400" />
                                  <input className="w-20 p-1 border rounded text-xs" placeholder="% Obj" value={targetFC} onChange={(e) => setTargetFC(e.target.value)} />
                                  <button onClick={handleReverse} className="text-xs bg-slate-200 px-2 py-1 rounded hover:bg-slate-300">Calc. Precio Sugerido</button>
                               </div>
                            </div>
                         </div>
                      </div>
                   );
                })}
             </div>
          </div>
      )}
    </div>
  );
};

export const Phase6Editor: React.FC<EditorProps> = ({ data, onUpdate, currentRole, currentUser, config, fullProjectData }) => {
  const state: Phase6Data = { ...INITIAL_PHASE_6, ...(data || {}), coEvaluations: Array.isArray(data?.coEvaluations) ? data.coEvaluations : [] };
  const [activeTab, setActiveTab] = useState<'Memory' | 'Defense' | 'Checklist' | 'CoEval' | 'Polish'>('Memory');
  const updateField = (field: keyof Phase6Data, value: any) => onUpdate({ ...state, [field]: value });

  // CoEval Logic
  const myEvals = (state.coEvaluations || []).filter(e => e.reviewer === currentUser);
  const addEval = () => updateField('coEvaluations', [...state.coEvaluations, { id: Date.now().toString(), reviewer: currentUser || '', target: '', justification: '', score: 0, timestamp: new Date().toISOString() }]);
  const updateEval = (idx: number, f: string, v: any) => {
     const all = [...state.coEvaluations];
     // Find index in main array
     const realIdx = all.findIndex(e => e.id === myEvals[idx].id);
     if (realIdx !== -1) { all[realIdx] = { ...all[realIdx], [f]: v }; updateField('coEvaluations', all); }
  };

  // Polish logic
  const importDraft = (section: 'intro' | 'analysis' | 'design') => {
     let text = "";
     if (section === 'intro') text = fullProjectData?.phases?.phase4?.introContext || "";
     if (section === 'analysis') text = fullProjectData?.phases?.phase4?.sectorCharacterization || "";
     if (section === 'design') text = fullProjectData?.phases?.phase4?.problemDetected || "";
     updateField('polishedTexts', { ...state.polishedTexts, [section]: text });
  };

  return (
    <div className="space-y-6 pb-10">
       <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('Memory')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'Memory' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>🟢 Memoria</button>
          <button onClick={() => setActiveTab('Polish')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'Polish' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>🖊️ Edición Final</button>
          <button onClick={() => setActiveTab('Defense')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'Defense' ? 'bg-purple-600 text-white' : 'bg-white border'}`}>🟣 Defensa</button>
          <button onClick={() => setActiveTab('CoEval')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'CoEval' ? 'bg-red-600 text-white' : 'bg-white border'}`}>🔥 Coevaluación</button>
       </div>
       
       {activeTab === 'Memory' && (<div><RoleBanner role={RoleType.DOCUMENTATION} isOwner={currentRole === RoleType.DOCUMENTATION} /><div className="bg-white p-6 rounded-xl border shadow-sm space-y-4"><h3>Resumen Ejecutivo</h3><textarea className="w-full p-3 border rounded h-32" value={state.abstract} onChange={(e) => updateField('abstract', e.target.value)} /><h3>Conclusiones Finales</h3><textarea className="w-full p-3 border rounded h-32" value={state.finalConclusions} onChange={(e) => updateField('finalConclusions', e.target.value)} /></div></div>)}
       
       {activeTab === 'Polish' && (
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold mb-4">Imágenes de Memoria</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div><label className="block text-sm font-bold mb-2">Portada</label>{state.coverImage ? <img src={state.coverImage} className="h-32 object-cover rounded mb-2" /> : null}<input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUploadWithResize(e.target.files[0], (b64) => updateField('coverImage', b64))} /></div>
                   <div><label className="block text-sm font-bold mb-2">Equipo</label>{state.teamImage ? <img src={state.teamImage} className="h-32 object-cover rounded mb-2" /> : null}<input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUploadWithResize(e.target.files[0], (b64) => updateField('teamImage', b64))} /></div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                   <h3 className="font-bold">Redacción: Introducción</h3>
                   <button onClick={() => importDraft('intro')} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Importar Borrador Fase 4</button>
                </div>
                <textarea className="w-full p-3 border rounded h-40 document-font" value={state.polishedTexts?.intro || ""} onChange={(e) => updateField('polishedTexts', {...state.polishedTexts, intro: e.target.value})} />
             </div>
          </div>
       )}

       {activeTab === 'Defense' && (<div><RoleBanner role={RoleType.COMMUNICATION} isOwner={currentRole === RoleType.COMMUNICATION} /><div className="bg-white p-6 rounded-xl border shadow-sm space-y-4"><h3>Enlaces Defensa</h3><input className="w-full p-3 border rounded" value={state.presentationUrl} onChange={(e) => updateField('presentationUrl', e.target.value)} placeholder="URL Presentación" /></div></div>)}
       
       {activeTab === 'CoEval' && (
          <div className="space-y-6">
             <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-800 text-sm mb-4 flex gap-2 items-start">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0"/>
                <div><strong>CONFIDENCIAL:</strong> Evalúa a tus compañeros. Rúbrica ±1 punto. Se honesto/a. Solo tú y el profesor verán esto.</div>
             </div>
             <div className="flex justify-end"><button onClick={addEval} className="bg-red-600 text-white px-4 py-2 rounded font-bold text-sm">+ Añadir Evaluación</button></div>
             <div className="space-y-4">
                {myEvals.map((ev, idx) => (
                   <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                         <div><label className="text-xs font-bold">Compañero</label><select className="w-full p-2 border rounded" value={ev.target} onChange={(e) => updateEval(idx, 'target', e.target.value)}><option value="">-- Seleccionar --</option>{(config?.members || []).filter(m => m.name !== currentUser).map((m, i) => <option key={i} value={m.name}>{m.name}</option>)}</select></div>
                         <div>
                            <label className="text-xs font-bold">Puntuación (±1)</label>
                            <div className="flex items-center gap-3">
                               <input type="range" min="-1" max="1" step="0.1" className="flex-1" value={ev.score} onChange={(e) => updateEval(idx, 'score', parseFloat(e.target.value))} />
                               <span className={`font-bold w-12 text-center ${ev.score < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{ev.score > 0 ? '+' : ''}{ev.score.toFixed(1)}</span>
                            </div>
                         </div>
                      </div>
                      <textarea className="w-full p-2 border rounded text-sm" placeholder="Justificación (Obligatoria)..." value={ev.justification} onChange={(e) => updateEval(idx, 'justification', e.target.value)} />
                   </div>
                ))}
             </div>
          </div>
       )}
    </div>
  );
};