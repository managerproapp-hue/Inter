
import React, { useState, useRef, useEffect } from 'react';
import { Phase2Data, Phase3Data, Phase4Data, Phase5Data, DishCategory, MenuDish, DishEval, DishFinancial, IngredientCost, CoEvaluationEntry } from '../types';
import { ODS_LIST, INITIAL_PHASE_2, INITIAL_PHASE_3, INITIAL_PHASE_4, INITIAL_PHASE_5 } from '../constants';
import { Plus, Trash2, Wand2, Sparkles, Check, Search, Briefcase, MapPin, Target, Leaf, PieChart, Book, Users, Utensils, Image, Smartphone, ChevronDown, X, AlertCircle, Camera, Calendar, DollarSign, Store, Calculator, FileCheck, Presentation, Laptop, ShieldAlert, FileText, BarChart3, Flame, UserMinus, UserPlus, Lock } from 'lucide-react';
import { enhanceText, suggestConcept } from '../services/geminiService';

interface EditorProps {
  data: any;
  onUpdate: (data: any) => void;
  isReadOnly?: boolean;
  projectContext: string;
  config?: any;
  phase3Data?: Phase3Data; // Phase 4 needs access to Phase 3 menu
  currentUser?: string; // For Phase 5 CoEval
}

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
export const Phase1Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, projectContext, config }) => {
  if (!config) return <div className="text-red-500 p-4">Error: No se cargó la configuración. Reinicia el proyecto.</div>;

  return (
    <div className="space-y-8 h-full flex flex-col pb-10">
      {/* Project Identity Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-4">
        <div className="bg-slate-800 p-6 text-white flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-2xl font-bold">{config.projectName || 'Proyecto Sin Nombre'}</h2>
            <p className="text-slate-400 mt-1 text-lg">{config.teamName || 'Equipo Sin Nombre'}</p>
          </div>
          <div className="text-left md:text-right">
            <div className="bg-indigo-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
              {config.groupNumber || 'G-??'}
            </div>
            <p className="text-sm text-slate-300 font-medium flex items-center gap-1 md:justify-end">
               <MapPin className="w-4 h-4" /> {config.zone || 'Zona no asignada'}
            </p>
            {config.deliveryDate && (
               <p className="text-sm text-slate-300 mt-1 flex items-center gap-1 md:justify-end">
                  <Calendar className="w-4 h-4" /> {config.deliveryDate}
               </p>
            )}
          </div>
        </div>
        
        <div className="p-6 bg-slate-50">
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 tracking-wider">
            <Users className="w-4 h-4" /> Miembros del Equipo y Roles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.members.map((member: any, idx: number) => (
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
      <div className="flex-1 flex flex-col min-h-[300px]">
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

// --- Structured Phase 2 Editor (Updated for Tarea 2) ---
export const Phase2Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, projectContext }) => {
  // Ensure concept fields exist even if loading old data
  const state: Phase2Data = { 
    ...INITIAL_PHASE_2, 
    ...data, 
    concept: { ...INITIAL_PHASE_2.concept, ...(data?.concept || {}) } 
  };
  
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [activeTab, setActiveTab] = useState<'PartA' | 'PartB'>('PartA');

  const updateField = (field: keyof Phase2Data, value: any) => {
    onUpdate({ ...state, [field]: value });
  };

  // --- Helpers for Tarea 2 Individual Lists ---
  const addTrend = () => {
    updateField('trends', [...state.trends, { id: Date.now().toString(), description: '' }]);
  };
  const removeTrend = (idx: number) => {
    const n = [...state.trends]; n.splice(idx, 1); updateField('trends', n);
  };

  const addPublic = () => {
    updateField('publicAnalysis', [...state.publicAnalysis, { id: Date.now().toString(), profile: '', method: '', linkedODS: '' }]);
  };

  const addMenu = () => {
    updateField('menuBenchmarking', [...state.menuBenchmarking, { id: Date.now().toString(), restaurantName: '', location: '', sustainableDish: '', ods: '' }]);
  };
  const removeMenu = (idx: number) => {
    const n = [...state.menuBenchmarking]; n.splice(idx, 1); updateField('menuBenchmarking', n);
  };

  const addGraph = () => {
    updateField('graphs', [...state.graphs, { id: Date.now().toString(), description: '' }]);
  };

  // --- Helpers for Tarea 2 Group Lists ---
  const addReference = () => {
    updateField('references', [...state.references, '']);
  };

  const addWeeklyReport = () => {
    updateField('weeklyReports', [...state.weeklyReports, { id: Date.now().toString(), week: `Semana ${state.weeklyReports.length + 1}`, advances: '', problems: '', contributions: '' }]);
  };

  const handleConceptAI = async () => {
    const zone = projectContext.split('Zona:')[1]?.split(',')[0] || 'Murcia';
    const suggestions = await suggestConcept(zone);
    setAiSuggestion(suggestions);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-4 border-b border-slate-200 pb-1">
        <button 
          onClick={() => setActiveTab('PartA')}
          className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'PartA' ? 'bg-blue-50 text-blue-800 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🅰️ Análisis Individual
        </button>
        <button 
          onClick={() => setActiveTab('PartB')}
          className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'PartB' ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🅱️ Modelo de Negocio (Grupal)
        </button>
      </div>

      {/* === PART A: INDIVIDUAL (Tarea 2) === */}
      {activeTab === 'PartA' && (
        <div className="space-y-8">
           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex gap-3 items-start">
             <Search className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <div>
               <p className="font-bold">Tarea 2 - Análisis Individual:</p>
               <p>Investiga el mercado real de la zona para detectar huecos que vuestro proyecto pueda cubrir.</p>
             </div>
           </div>

           {/* Specific Focus */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-2">Enfoque: Análisis de Tendencias de la Zona</label>
              <input 
                className="w-full p-3 border border-slate-300 rounded bg-slate-50"
                placeholder="Ej: En la zona predominan los asadores, pero falta oferta vegana o de km0..."
                value={state.specificFocus}
                onChange={(e) => updateField('specificFocus', e.target.value)}
              />
              <p className="text-xs text-slate-400 mt-1">Analiza las tendencias generales de los restaurantes (competencia) en tu zona asignada.</p>
           </div>

           {/* Trends & Target Audience */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2"><Leaf className="w-4 h-4"/> Tendencias Sostenibles</h3>
                  <button onClick={addTrend} className="text-blue-600 text-xs flex items-center"><Plus className="w-3 h-3"/> Añadir</button>
                </div>
                <div className="space-y-2">
                   {state.trends.map((t, idx) => (
                     <div key={idx} className="flex gap-2">
                       <input className="flex-1 p-2 border rounded text-sm" placeholder="Ej: En Altiplano usan uvas bio..." value={t.description}
                         onChange={(e) => {const n=[...state.trends]; n[idx].description=e.target.value; updateField('trends', n)}} />
                       <button onClick={() => removeTrend(idx)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                     </div>
                   ))}
                   {state.trends.length === 0 && <p className="text-xs text-slate-400 italic">Añade al menos 3 tendencias.</p>}
                </div>
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2"><Users className="w-4 h-4"/> Público Objetivo</h3>
                  <button onClick={addPublic} className="text-blue-600 text-xs flex items-center"><Plus className="w-3 h-3"/> Añadir</button>
                </div>
                <div className="space-y-3">
                   {state.publicAnalysis.map((p, idx) => (
                     <div key={idx} className="bg-slate-50 p-3 rounded border border-slate-100 space-y-2 text-sm">
                       <input className="w-full p-2 border rounded" placeholder="Perfil (Edad, gustos)" value={p.profile}
                         onChange={(e) => {const n=[...state.publicAnalysis]; n[idx].profile=e.target.value; updateField('publicAnalysis', n)}} />
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                         <input className="p-2 border rounded" placeholder="Método (Ej: Encuesta)" value={p.method}
                           onChange={(e) => {const n=[...state.publicAnalysis]; n[idx].method=e.target.value; updateField('publicAnalysis', n)}} />
                         
                         <div className="w-full">
                            <ODSSelector 
                              selected={p.linkedODS} 
                              onChange={(val) => {const n=[...state.publicAnalysis]; n[idx].linkedODS=val as string; updateField('publicAnalysis', n)}} 
                              mode="string"
                            />
                         </div>
                       </div>
                     </div>
                   ))}
                </div>
             </div>
           </div>

           {/* Menu Benchmarking (5 items) */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Search className="w-5 h-5 text-indigo-600"/> Búsqueda de Cartas (Mínimo 5)</h3>
                <button onClick={addMenu} className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir Carta</button>
              </div>
              <div className="space-y-4">
                {state.menuBenchmarking.map((m, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start bg-slate-50 p-3 rounded border relative">
                     <div className="col-span-3">
                        <input className="w-full p-2 border rounded text-sm font-bold" placeholder="Restaurante" value={m.restaurantName}
                           onChange={(e) => {const n=[...state.menuBenchmarking]; n[idx].restaurantName=e.target.value; updateField('menuBenchmarking', n)}} />
                     </div>
                     <div className="col-span-3">
                        <input className="w-full p-2 border rounded text-sm" placeholder="Ubicación" value={m.location}
                           onChange={(e) => {const n=[...state.menuBenchmarking]; n[idx].location=e.target.value; updateField('menuBenchmarking', n)}} />
                     </div>
                     <div className="col-span-3">
                        <input className="w-full p-2 border rounded text-sm" placeholder="Plato Sostenible Destacado" value={m.sustainableDish}
                           onChange={(e) => {const n=[...state.menuBenchmarking]; n[idx].sustainableDish=e.target.value; updateField('menuBenchmarking', n)}} />
                     </div>
                     <div className="col-span-2">
                         <ODSSelector 
                            selected={m.ods} 
                            onChange={(val) => {const n=[...state.menuBenchmarking]; n[idx].ods=val as string; updateField('menuBenchmarking', n)}} 
                            mode="string"
                         />
                     </div>
                     <div className="col-span-1 flex justify-center pt-2">
                        <button onClick={() => removeMenu(idx)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                     </div>
                     {m.author && <span className="absolute top-0 right-0 bg-indigo-100 text-indigo-800 text-[10px] px-1 rounded">{m.author}</span>}
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}

      {/* === PART B: GROUP (Tarea 2) === */}
      {activeTab === 'PartB' && (
        <div className="space-y-8">
           <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-sm text-emerald-800 flex gap-3 items-start">
             <Store className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <div>
               <p className="font-bold">Informe Grupal: Modelo de Negocio</p>
               <p>Definid aquí el concepto final del restaurante, alineado con la zona y las materias primas analizadas.</p>
             </div>
           </div>

           {/* 2. Concept - Business Model Canvas Lite */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Store className="w-5 h-5 text-emerald-600"/> Definición del Restaurante Ficticio</h3>
                 <button onClick={handleConceptAI} className="text-indigo-600 text-sm flex items-center gap-1 hover:underline"><Sparkles className="w-4 h-4"/> Ideas con IA</button>
              </div>
              
              {aiSuggestion && <div className="mb-6 p-3 bg-indigo-50 text-sm rounded text-indigo-800 border border-indigo-100">{aiSuggestion}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Restaurante</label>
                    <input 
                      className="w-full p-3 border border-slate-300 rounded-lg text-lg font-serif bg-slate-50 focus:ring-2 focus:ring-emerald-500" 
                      value={state.concept.name}
                      onChange={(e) => updateField('concept', {...state.concept, name: e.target.value})} 
                      placeholder="Ej: La Huerta Viva"
                    />
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Establecimiento</label>
                    <input 
                      className="w-full p-2 border border-slate-300 rounded bg-white" 
                      value={state.concept.restaurantType}
                      onChange={(e) => updateField('concept', {...state.concept, restaurantType: e.target.value})} 
                      placeholder="Ej: Arrocería, Gastrobar, Marisquería..."
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Estilo de Cocina</label>
                    <input 
                      className="w-full p-2 border border-slate-300 rounded bg-white" 
                      value={state.concept.culinaryStyle}
                      onChange={(e) => updateField('concept', {...state.concept, culinaryStyle: e.target.value})} 
                      placeholder="Ej: Tradicional renovada, Fusión, Km0..."
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Cliente Objetivo</label>
                    <input 
                      className="w-full p-2 border border-slate-300 rounded bg-white" 
                      value={state.concept.targetAudience}
                      onChange={(e) => updateField('concept', {...state.concept, targetAudience: e.target.value})} 
                      placeholder="Ej: Turistas, familias, nivel adquisitivo medio-alto..."
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1"><DollarSign className="w-4 h-4"/> Precio Medio Cubierto</label>
                    <input 
                      className="w-full p-2 border border-slate-300 rounded bg-white" 
                      value={state.concept.averagePrice}
                      onChange={(e) => updateField('concept', {...state.concept, averagePrice: e.target.value})} 
                      placeholder="Ej: 35€ - 45€"
                    />
                 </div>

                 <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Descripción del Concepto (Narrativa)</label>
                    <textarea 
                       className="w-full p-3 border rounded h-20 text-sm" 
                       value={state.concept.description}
                       onChange={(e) => updateField('concept', {...state.concept, description: e.target.value})} 
                       placeholder="Describe brevemente la experiencia y el ambiente..."
                    />
                 </div>

                 <div className="col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">ODS Vinculados al Negocio</label>
                    <ODSSelector 
                       selected={state.concept.linkedODS}
                       onChange={(val) => updateField('concept', {...state.concept, linkedODS: val as string[]})}
                       mode="array"
                       min={2}
                    />
                    <p className="text-xs text-slate-400 mt-1">Selecciona al menos 2 objetivos que definan la ética del restaurante.</p>
                 </div>
              </div>
           </div>
           
           {/* Synthesis */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-2">Síntesis del Análisis de Mercado</h3>
             <textarea 
               className="w-full p-4 border border-slate-200 rounded-lg h-24 text-sm"
               placeholder="Justificación: ¿Por qué este modelo funciona en esta zona según vuestro análisis?"
               value={state.synthesis}
               onChange={(e) => updateField('synthesis', e.target.value)}
             />
           </div>

           {/* 3. Map & References */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4"/> Mapa de la Zona</h3>
                 <textarea className="w-full p-3 border rounded h-32 text-sm" placeholder="Describe la ubicación o pega un enlace al mapa..."
                    value={state.zoneMapDescription} onChange={(e) => updateField('zoneMapDescription', e.target.value)} />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                 <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Book className="w-4 h-4"/> Referencias (Min 5)</h3>
                    <button onClick={addReference} className="text-xs text-indigo-600"><Plus className="w-3 h-3"/></button>
                 </div>
                 <ul className="space-y-2">
                    {state.references.map((r, i) => (
                       <li key={i} className="flex gap-2">
                          <span className="text-slate-400 text-sm">{i+1}.</span>
                          <input className="flex-1 p-1 border-b text-sm focus:border-indigo-500 outline-none" value={r}
                             onChange={(e) => {const n=[...state.references]; n[i]=e.target.value; updateField('references', n)}} />
                       </li>
                    ))}
                    {state.references.length === 0 && <button onClick={addReference} className="text-xs text-slate-400 underline">Añadir Referencia</button>}
                 </ul>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Structured Phase 3 Editor (Tarea 3) ---
export const Phase3Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly }) => {
  const state: Phase3Data = data || INITIAL_PHASE_3;
  const [activeTab, setActiveTab] = useState<'Products' | 'Menu' | 'Visual'>('Products');

  const updateField = (field: keyof Phase3Data, value: any) => {
    onUpdate({ ...state, [field]: value });
  };

  // Helpers for Menu
  const categories: DishCategory[] = ['Aperitivo', 'Entrante', 'Principal', 'Postre'];
  
  const addDish = (category: DishCategory) => {
    const newDish: MenuDish = {
      id: Date.now().toString(),
      category,
      name: '',
      ingredients: '',
      elaboration: '',
      allergens: '',
      techniques: '',
      presentation: '',
      ods: '',
      author: ''
    };
    updateField('menu', [...state.menu, newDish]);
  };

  const removeDish = (id: string) => {
    updateField('menu', state.menu.filter(d => d.id !== id));
  };

  const updateDish = (id: string, field: keyof MenuDish, val: string) => {
    const newMenu = state.menu.map(d => d.id === id ? { ...d, [field]: val } : d);
    updateField('menu', newMenu);
  };

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
       updateDish(id, 'image', reader.result as string);
    };
    if(file) {
      reader.readAsDataURL(file);
    }
  };

  const addReference = () => {
    updateField('references', [...state.references, '']);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('Products')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Products' ? 'bg-emerald-600 text-white' : 'bg-white border hover:bg-slate-50'}`}>
           1. Productos de Temporada
        </button>
        <button onClick={() => setActiveTab('Menu')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Menu' ? 'bg-emerald-600 text-white' : 'bg-white border hover:bg-slate-50'}`}>
           2. Creación de Platos (20)
        </button>
        <button onClick={() => setActiveTab('Visual')} className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${activeTab === 'Visual' ? 'bg-emerald-600 text-white' : 'bg-white border hover:bg-slate-50'}`}>
           3. Diseño Visual
        </button>
      </div>

      {/* Tab 1: Products */}
      {activeTab === 'Products' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6 animate-in fade-in">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Leaf className="w-5 h-5 text-emerald-600"/> Selección de Productos</h3>
           
           <div>
             <label className="block text-sm font-bold text-slate-700 mb-1">Lista de productos (ej. "Alcachofas, Murcia, km0")</label>
             <textarea className="w-full p-3 border rounded-lg h-24 text-sm" value={state.products.list} onChange={(e) => updateField('products', {...state.products, list: e.target.value})} />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Sostenibilidad (ODS vinculados)</label>
                 <textarea className="w-full p-3 border rounded-lg h-24 text-sm" placeholder="Ej: Reduce emisiones, ODS 12..." value={state.products.sustainability} onChange={(e) => updateField('products', {...state.products, sustainability: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Análisis de Impacto</label>
                 <textarea className="w-full p-3 border rounded-lg h-24 text-sm" placeholder="Ej: Baja huella de carbono por transporte..." value={state.products.impactAnalysis} onChange={(e) => updateField('products', {...state.products, impactAnalysis: e.target.value})} />
              </div>
           </div>
        </div>
      )}

      {/* Tab 2: Menu Construction */}
      {activeTab === 'Menu' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm border border-blue-100 flex gap-3">
             <Utensils className="w-5 h-5 flex-shrink-0"/>
             <div>
               <p className="font-bold">Instrucciones Grupales:</p>
               <p>Cada miembro debe añadir sus propios platos. Objetivo total: 20 Platos.</p>
             </div>
          </div>

          {categories.map(cat => {
             const dishes = state.menu.filter(d => d.category === cat);
             return (
                <div key={cat} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        {cat}s <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">{dishes.length}/5</span>
                      </h3>
                      <button onClick={() => addDish(cat)} className="text-indigo-600 text-sm font-medium hover:bg-indigo-50 px-3 py-1 rounded transition-colors flex items-center gap-1">
                         <Plus className="w-4 h-4"/> Añadir {cat}
                      </button>
                   </div>
                   <div className="space-y-6">
                      {dishes.map((dish) => (
                         <div key={dish.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative shadow-sm">
                            <button onClick={() => removeDish(dish.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                               <div className="col-span-1 lg:col-span-3 flex flex-col items-center gap-2">
                                  <div className="w-full aspect-square bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden border border-slate-300 relative">
                                     {dish.image ? (
                                        <>
                                          <img src={dish.image} alt="Plato" className="w-full h-full object-cover" />
                                          <button 
                                            onClick={() => updateDish(dish.id, 'image', '')}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </>
                                     ) : (
                                        <Camera className="w-8 h-8 text-slate-400" />
                                     )}
                                  </div>
                                  <label className="cursor-pointer px-3 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1">
                                     <Image className="w-3 h-3" /> {dish.image ? 'Cambiar' : 'Subir Foto'}
                                     <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(dish.id, e.target.files[0])} />
                                  </label>
                               </div>

                               <div className="col-span-1 lg:col-span-9 space-y-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Nombre del Plato</label>
                                        <input className="w-full p-2 border rounded bg-white font-bold" value={dish.name} onChange={(e) => updateDish(dish.id, 'name', e.target.value)} placeholder="Nombre creativo..." />
                                     </div>
                                     <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Ingredientes Clave</label>
                                        <input className="w-full p-2 border rounded bg-white" value={dish.ingredients} onChange={(e) => updateDish(dish.id, 'ingredients', e.target.value)} placeholder="Lista breve..." />
                                     </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                     <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Alérgenos</label>
                                        <input className="w-full p-2 border rounded bg-white text-sm" value={dish.allergens} onChange={(e) => updateDish(dish.id, 'allergens', e.target.value)} />
                                     </div>
                                     <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Técnicas</label>
                                        <input className="w-full p-2 border rounded bg-white text-sm" value={dish.techniques} onChange={(e) => updateDish(dish.id, 'techniques', e.target.value)} />
                                     </div>
                                     <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">ODS (Justificación)</label>
                                        <div className="mt-1">
                                           <ODSSelector 
                                             selected={dish.ods} 
                                             onChange={(val) => updateDish(dish.id, 'ods', val as string)} 
                                             mode="string"
                                           />
                                        </div>
                                     </div>
                                  </div>
                                  
                                  <div>
                                     <label className="text-xs font-bold text-slate-500 uppercase">Elaboración</label>
                                     <textarea 
                                        className="w-full p-2 border rounded bg-white text-sm h-20 resize-y" 
                                        value={dish.elaboration} 
                                        onChange={(e) => updateDish(dish.id, 'elaboration', e.target.value)} 
                                        placeholder="Describa brevemente la elaboración..." 
                                     />
                                  </div>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             );
          })}
        </div>
      )}

      {/* Tab 3: Visual Design */}
      {activeTab === 'Visual' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6 animate-in fade-in">
           <h3 className="text-lg font-bold text-slate-800 mb-4">Diseño Visual de la Carta</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="font-bold text-slate-700 flex items-center gap-2"><Image className="w-4 h-4"/> Enlace Canva / Imagen</label>
                 <input className="w-full p-3 border rounded-lg" placeholder="Pega el enlace a tu diseño de Canva..." value={state.visual.canvaDescription} onChange={(e) => updateField('visual', {...state.visual, canvaDescription: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                 <label className="font-bold text-slate-700 flex items-center gap-2"><Smartphone className="w-4 h-4"/> Código QR (Enlace)</label>
                 <input className="w-full p-3 border rounded-lg" placeholder="URL a la carta digital..." value={state.visual.qrUrl} onChange={(e) => updateField('visual', {...state.visual, qrUrl: e.target.value})} />
              </div>
           </div>

           <div className="space-y-2">
              <label className="font-bold text-slate-700">Versión Física (Descripción)</label>
              <textarea className="w-full p-3 border rounded-lg h-24" placeholder="Ej: Papel reciclado con textura..." value={state.visual.physicalDescription} onChange={(e) => updateField('visual', {...state.visual, physicalDescription: e.target.value})} />
           </div>
        </div>
      )}
    </div>
  );
};

// --- Structured Phase 4 Editor (Execution & Costs) ---
export const Phase4Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, phase3Data }) => {
  const state: Phase4Data = data || INITIAL_PHASE_4;
  const [activeTab, setActiveTab] = useState<'Costs' | 'Execution'>('Costs');

  const updateField = (field: keyof Phase4Data, value: any) => {
    onUpdate({ ...state, [field]: value });
  };

  // Financial Helpers
  const addIngredient = (dishId: string) => {
     const financials = [...(state.financials || [])];
     let entry = financials.find(f => f.dishId === dishId);
     
     if (!entry) {
        entry = { dishId, totalCost: 0, sellingPrice: 0, ingredients: [] };
        financials.push(entry);
     }
     
     entry.ingredients.push({ name: '', quantity: '', price: 0 });
     updateField('financials', financials);
  };

  const updateIngredient = (dishId: string, idx: number, field: keyof IngredientCost, val: any) => {
     const financials = [...(state.financials || [])];
     const entry = financials.find(f => f.dishId === dishId);
     if(entry) {
       (entry.ingredients[idx] as any)[field] = val;
       // Recalculate total
       entry.totalCost = entry.ingredients.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
       updateField('financials', financials);
     }
  };

  // Dish Eval Helpers
  const addDishEval = () => {
    const newDish: DishEval = { id: Date.now().toString(), dishName: '', expectation: '', reality: '', waste: '' };
    updateField('dishes', [...state.dishes, newDish]);
  };

  const removeDishEval = (id: string) => {
    updateField('dishes', state.dishes.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex gap-4 mb-4 border-b border-slate-200 pb-1">
        <button 
          onClick={() => setActiveTab('Costs')}
          className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'Costs' ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          1. Creación de Costes (Escandallos)
        </button>
        <button 
          onClick={() => setActiveTab('Execution')}
          className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'Execution' ? 'bg-blue-50 text-blue-800 border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          2. Ejecución y Cierre
        </button>
      </div>

      {activeTab === 'Costs' && (
         <div className="space-y-8 animate-in fade-in">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-sm text-emerald-800 flex gap-3 items-start">
               <Calculator className="w-5 h-5 flex-shrink-0 mt-0.5" />
               <div>
                 <p className="font-bold">Calculadora de Escandallos:</p>
                 <p>Selecciona los platos diseñados en la Fase 3 y calcula el coste de materia prima para determinar el precio de venta.</p>
               </div>
            </div>

            {!phase3Data?.menu || phase3Data.menu.length === 0 ? (
               <p className="text-center text-slate-500 py-10">Primero debes añadir platos en la Fase 3.</p>
            ) : (
               <div className="space-y-6">
                  {phase3Data.menu.map(dish => {
                     const finance = state.financials?.find(f => f.dishId === dish.id) || { totalCost: 0, sellingPrice: 0, ingredients: [] };
                     
                     return (
                        <div key={dish.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                           <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-slate-800 text-lg">{dish.name} <span className="text-xs text-slate-400 font-normal">({dish.category})</span></h3>
                              <div className="text-right">
                                 <div className="text-xs text-slate-500 uppercase font-bold">Coste Total</div>
                                 <div className="text-xl font-bold text-emerald-600">{finance.totalCost.toFixed(2)}€</div>
                              </div>
                           </div>

                           <div className="mb-4">
                              <table className="w-full text-sm">
                                 <thead>
                                    <tr className="bg-slate-50 text-slate-500">
                                       <th className="text-left p-2 rounded-l">Ingrediente</th>
                                       <th className="text-left p-2">Cantidad</th>
                                       <th className="text-right p-2 rounded-r">Coste (€)</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {finance.ingredients.map((ing, idx) => (
                                       <tr key={idx} className="border-b border-slate-100">
                                          <td className="p-2"><input className="w-full bg-transparent outline-none" placeholder="Ej: Arroz Bomba" value={ing.name} onChange={(e) => updateIngredient(dish.id, idx, 'name', e.target.value)} /></td>
                                          <td className="p-2"><input className="w-full bg-transparent outline-none" placeholder="100g" value={ing.quantity} onChange={(e) => updateIngredient(dish.id, idx, 'quantity', e.target.value)} /></td>
                                          <td className="p-2"><input type="number" className="w-full bg-transparent outline-none text-right" placeholder="0.00" value={ing.price} onChange={(e) => updateIngredient(dish.id, idx, 'price', parseFloat(e.target.value))} /></td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                              <button onClick={() => addIngredient(dish.id)} className="mt-2 text-xs text-indigo-600 font-bold flex items-center gap-1 hover:underline"><Plus className="w-3 h-3"/> Añadir Ingrediente</button>
                           </div>
                           
                           <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                               <label className="text-sm font-bold text-slate-700">Precio de Venta Recomendado (PVR):</label>
                               <input 
                                 type="number" 
                                 className="p-2 border border-slate-300 rounded w-32 text-right font-bold text-slate-800" 
                                 placeholder="0.00"
                                 value={finance.sellingPrice || ''}
                                 onChange={(e) => {
                                    const financials = [...(state.financials || [])];
                                    const entry = financials.find(f => f.dishId === dish.id);
                                    if(!entry) { // Create if only editing price directly
                                       financials.push({ dishId: dish.id, totalCost: 0, sellingPrice: parseFloat(e.target.value), ingredients: [] });
                                    } else {
                                       entry.sellingPrice = parseFloat(e.target.value);
                                    }
                                    updateField('financials', financials);
                                 }}
                               />
                           </div>
                        </div>
                     )
                  })}
               </div>
            )}
         </div>
      )}

      {activeTab === 'Execution' && (
         <div className="space-y-8 animate-in fade-in">
            {/* Dishes Evaluation */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Autoevaluación Sensorial</h3>
                {!isReadOnly && (
                  <button onClick={addDishEval} className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
                    <Plus className="w-4 h-4" /> Evaluar Plato
                  </button>
                )}
              </div>
              <div className="grid gap-6">
                {state.dishes.map((dish, idx) => (
                  <div key={dish.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative group">
                    {!isReadOnly && (
                      <button onClick={() => removeDishEval(dish.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="mb-3">
                      <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nombre del Plato</label>
                      <input
                        className="w-full p-2 border rounded bg-white"
                        value={dish.dishName}
                        onChange={(e) => {
                          const newDishes = [...state.dishes];
                          newDishes[idx].dishName = e.target.value;
                          updateField('dishes', newDishes);
                        }}
                        disabled={isReadOnly}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Expectativa</label>
                        <textarea className="w-full p-2 border rounded bg-white h-20 text-sm" value={dish.expectation} onChange={(e) => {const newDishes=[...state.dishes]; newDishes[idx].expectation=e.target.value; updateField('dishes', newDishes)}} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Realidad (Resultado)</label>
                        <textarea className="w-full p-2 border rounded bg-white h-20 text-sm" value={dish.reality} onChange={(e) => {const newDishes=[...state.dishes]; newDishes[idx].reality=e.target.value; updateField('dishes', newDishes)}} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Análisis de Mermas</label>
                        <textarea className="w-full p-2 border rounded bg-white h-20 text-sm" value={dish.waste} onChange={(e) => {const newDishes=[...state.dishes]; newDishes[idx].waste=e.target.value; updateField('dishes', newDishes)}} />
                      </div>
                    </div>
                  </div>
                ))}
                {state.dishes.length === 0 && <p className="text-slate-400 text-sm italic text-center">No hay platos evaluados.</p>}
              </div>
            </div>

            {/* Brigade Report */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold text-slate-800 mb-2">Informe de Brigada</h3>
               <p className="text-sm text-slate-500 mb-4">Describe el rendimiento del equipo, problemas de comunicación y soluciones aplicadas.</p>
               <textarea
                  className="w-full p-4 border rounded-lg h-40 bg-slate-50 focus:bg-white transition-colors"
                  value={state.brigadeReport}
                  onChange={(e) => updateField('brigadeReport', e.target.value)}
                  placeholder="Redacta aquí el informe..."
               />
            </div>
         </div>
      )}
    </div>
  );
};

// --- Phase 5 Editor (Updated for Official Memory Index) ---
export const Phase5Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, currentUser, config }) => {
  const state: Phase5Data = data || INITIAL_PHASE_5;
  const [activeTab, setActiveTab] = useState<'Checklist' | 'Memory' | 'Links' | 'CoEval'>('Checklist');
  const [newEval, setNewEval] = useState<{ target: string, score: number, justification: string }>({ target: '', score: 0, justification: '' });

  const updateField = (field: keyof Phase5Data, value: any) => {
    onUpdate({ ...state, [field]: value });
  };

  const toggleCheck = (key: keyof typeof state.individualChecklist) => {
    updateField('individualChecklist', {
       ...state.individualChecklist,
       [key]: !state.individualChecklist[key]
    });
  };

  // CoEvaluation Logic
  const handleAddCoEval = () => {
    if(!currentUser) return alert("Debes seleccionar tu usuario en la barra lateral primero.");
    if(!newEval.target) return alert("Selecciona a quién evalúas.");
    if(!newEval.justification) return alert("Escribe una justificación.");

    const entry: CoEvaluationEntry = {
       id: Date.now().toString(),
       reviewer: currentUser,
       target: newEval.target,
       justification: newEval.justification,
       score: newEval.score,
       timestamp: new Date().toISOString()
    };

    updateField('coEvaluations', [...(state.coEvaluations || []), entry]);
    setNewEval({ target: '', score: 0, justification: '' });
  };

  const handleDeleteCoEval = (id: string) => {
    updateField('coEvaluations', state.coEvaluations.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex gap-2 mb-4 border-b border-slate-200 pb-1 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('Checklist')}
          className={`px-4 py-2 font-bold whitespace-nowrap rounded-t-lg transition-colors ${activeTab === 'Checklist' ? 'bg-purple-50 text-purple-800 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          A. Individual
        </button>
        <button 
          onClick={() => setActiveTab('Memory')}
          className={`px-4 py-2 font-bold whitespace-nowrap rounded-t-lg transition-colors ${activeTab === 'Memory' ? 'bg-indigo-50 text-indigo-800 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          B. Memoria Oficial
        </button>
        <button 
          onClick={() => setActiveTab('Links')}
          className={`px-4 py-2 font-bold whitespace-nowrap rounded-t-lg transition-colors ${activeTab === 'Links' ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          C. Enlaces
        </button>
        <button 
          onClick={() => setActiveTab('CoEval')}
          className={`px-4 py-2 font-bold whitespace-nowrap rounded-t-lg transition-colors ${activeTab === 'CoEval' ? 'bg-red-50 text-red-800 border-b-2 border-red-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🔥 Coevaluación Diabólica
        </button>
      </div>

      {activeTab === 'Checklist' && (
         <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-in fade-in">
             <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600"><FileCheck className="w-6 h-6"/></div>
                <div>
                   <h3 className="text-xl font-bold text-slate-800">Preparación Individual</h3>
                   <p className="text-slate-500 text-sm">Valida tu trabajo antes de la defensa oral.</p>
                </div>
             </div>
             
             <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                   <input type="checkbox" className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500" checked={state.individualChecklist.investigationDone} onChange={() => toggleCheck('investigationDone')} />
                   <div>
                      <div className="font-bold text-slate-700">Investigación Completa</div>
                      <div className="text-xs text-slate-500">He revisado que mis aportes de la Fase 1 y 2 están en la memoria.</div>
                   </div>
                </label>
                <label className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                   <input type="checkbox" className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500" checked={state.individualChecklist.dishesDesigned} onChange={() => toggleCheck('dishesDesigned')} />
                   <div>
                      <div className="font-bold text-slate-700">Platos Diseñados y Costeados</div>
                      <div className="text-xs text-slate-500">Mis 4 platos tienen foto, receta y precio calculado.</div>
                   </div>
                </label>
                <label className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                   <input type="checkbox" className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500" checked={state.individualChecklist.selfEvalDone} onChange={() => toggleCheck('selfEvalDone')} />
                   <div>
                      <div className="font-bold text-slate-700">Autoevaluación Realizada</div>
                      <div className="text-xs text-slate-500">He completado la ficha de cata y análisis de mermas.</div>
                   </div>
                </label>
                <label className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                   <input type="checkbox" className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500" checked={state.individualChecklist.defensePrepared} onChange={() => toggleCheck('defensePrepared')} />
                   <div>
                      <div className="font-bold text-slate-700">Defensa Ensayada</div>
                      <div className="text-xs text-slate-500">Conozco mi parte de la exposición y posibles preguntas.</div>
                   </div>
                </label>
             </div>
         </div>
      )}

      {activeTab === 'Memory' && (
         <div className="space-y-8 animate-in fade-in">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm flex gap-2">
              <FileText className="w-5 h-5 flex-shrink-0" />
              <div>
                 <p className="font-bold">Rellena los apartados faltantes del Índice Oficial:</p>
                 <p>Esta sección complementa las Fases 1-4 para generar el PDF final según normativa.</p>
              </div>
            </div>

            {/* 2. Resumen */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-2">2. Resumen del Proyecto</h3>
               <textarea className="w-full p-3 border rounded-lg h-24 text-sm" placeholder="Breve resumen ejecutivo del proyecto..." value={state.abstract} onChange={(e) => updateField('abstract', e.target.value)} />
            </div>

            {/* 3. Intro Additions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="col-span-2 font-bold text-slate-800 border-b pb-2">3. Introducción (Complementos)</div>
               <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">3.2 Objetivos del Proyecto</label>
                  <textarea className="w-full p-3 border rounded-lg h-32 text-sm" placeholder="Objetivos principales..." value={state.projectObjectives} onChange={(e) => updateField('projectObjectives', e.target.value)} />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">3.3 Alcance y Limitaciones</label>
                  <textarea className="w-full p-3 border rounded-lg h-32 text-sm" placeholder="¿Hasta dónde llega el proyecto?" value={state.projectScope} onChange={(e) => updateField('projectScope', e.target.value)} />
               </div>
            </div>

             {/* 4. Riesgos */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-orange-500"/> 4.4 Riesgos Laborales</h3>
               <textarea className="w-full p-3 border rounded-lg h-32 text-sm" placeholder="Identificación de riesgos asociados a la empresa..." value={state.occupationalRisks} onChange={(e) => updateField('occupationalRisks', e.target.value)} />
            </div>

             {/* 5. & 6. Methodology & Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">5.1 Metodología de Trabajo</label>
                  <textarea className="w-full p-3 border rounded-lg h-32 text-sm" value={state.methodology} onChange={(e) => updateField('methodology', e.target.value)} />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">6.1 Análisis de Resultados</label>
                  <textarea className="w-full p-3 border rounded-lg h-32 text-sm" placeholder="Análisis del impacto y resultados obtenidos..." value={state.resultsAnalysis} onChange={(e) => updateField('resultsAnalysis', e.target.value)} />
               </div>
            </div>

            {/* 7. Conclusions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-2">7. Conclusiones y Recomendaciones</h3>
               <textarea className="w-full p-3 border rounded-lg h-40 text-sm" placeholder="Conclusiones finales y recomendaciones futuras..." value={state.finalConclusions} onChange={(e) => updateField('finalConclusions', e.target.value)} />
            </div>
         </div>
      )}

      {activeTab === 'Links' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in">
           <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Presentation className="w-5 h-5"/> Entregables Digitales</h3>
           <div className="space-y-4">
              <div>
                 <label className="font-bold text-slate-700 text-sm flex items-center gap-2"><Laptop className="w-4 h-4"/> Enlace a la Presentación (Genially/Canva/PPT)</label>
                 <input className="w-full p-3 border rounded bg-slate-50" placeholder="https://..." value={state.presentationUrl} onChange={(e) => updateField('presentationUrl', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="font-bold text-slate-700 text-sm flex items-center gap-2"><Smartphone className="w-4 h-4"/> Enlace Carta Digital</label>
                    <input className="w-full p-3 border rounded bg-slate-50" placeholder="https://..." value={state.virtualMenuUrl} onChange={(e) => updateField('virtualMenuUrl', e.target.value)} />
                 </div>
                 <div>
                    <label className="font-bold text-slate-700 text-sm flex items-center gap-2"><Image className="w-4 h-4"/> Evidencia Carta Física</label>
                    <input className="w-full p-3 border rounded bg-slate-50" placeholder="Descripción o URL..." value={state.physicalMenuEvidence} onChange={(e) => updateField('physicalMenuEvidence', e.target.value)} />
                 </div>
              </div>
           </div>
        </div>
      )}
      
      {activeTab === 'CoEval' && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-in fade-in border-t-4 border-t-red-500">
           <div className="flex items-center gap-4 mb-6 border-b pb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600"><Flame className="w-6 h-6"/></div>
              <div>
                 <h3 className="text-xl font-bold text-slate-800">Coevaluación Diabólica</h3>
                 <p className="text-red-600 font-bold text-sm mt-1">Rúbrica: Contribución individual al éxito del equipo (Máx. ±1 puntos)</p>
                 <p className="text-slate-600 text-xs mt-1 italic">
                    "Este punto lo dan los propios compañeros, valorando su participación real. Sirve para ajustar la nota en función del esfuerzo individual."
                 </p>
              </div>
           </div>

           {!currentUser ? (
              <div className="bg-orange-50 p-4 rounded text-orange-800 flex items-center gap-2 border border-orange-200">
                 <AlertCircle className="w-5 h-5"/>
                 <span className="font-bold">ATENCIÓN:</span> Debes seleccionar tu usuario en la barra lateral izquierda para poder evaluar.
              </div>
           ) : (
              <div className="space-y-8">
                 {/* Form */}
                 <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <UserPlus className="w-4 h-4 text-indigo-600"/> Nueva Valoración (Tú eres: {currentUser})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Evaluar a:</label>
                          <select 
                             className="w-full p-2 border rounded"
                             value={newEval.target}
                             onChange={(e) => setNewEval({...newEval, target: e.target.value})}
                          >
                             <option value="">-- Seleccionar Compañero --</option>
                             {config?.members.map((m: any) => (
                                <option 
                                  key={m.name} 
                                  value={m.name} 
                                  disabled={m.name === currentUser}
                                  className={m.name === currentUser ? 'text-slate-400 italic' : ''}
                                >
                                  {m.name} ({m.role}) {m.name === currentUser ? '(Tú)' : ''}
                                </option>
                             ))}
                          </select>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Puntuación: <span className={`${newEval.score > 0 ? 'text-emerald-600' : newEval.score < 0 ? 'text-red-600' : 'text-slate-600'} text-base`}>{newEval.score > 0 ? '+' : ''}{newEval.score.toFixed(1)}</span></label>
                          <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs font-bold text-red-500">-1.0</span>
                              <input 
                                type="range" 
                                min="-1" 
                                max="1" 
                                step="0.1"
                                list="tickmarks"
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                value={newEval.score}
                                onChange={(e) => setNewEval({...newEval, score: parseFloat(e.target.value)})}
                              />
                              <datalist id="tickmarks">
                                <option value="-1"></option>
                                <option value="-0.5"></option>
                                <option value="0"></option>
                                <option value="0.5"></option>
                                <option value="1"></option>
                              </datalist>
                              <span className="text-xs font-bold text-emerald-500">+1.0</span>
                          </div>
                          <div className="text-[10px] text-slate-400 text-center mt-1">Desliza para ajustar decimales (Ej: +0.2, -0.7)</div>
                       </div>
                    </div>
                    <div className="mb-4">
                       <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Justificación (Obligatoria):</label>
                       <textarea 
                          className="w-full p-3 border rounded h-24 text-sm"
                          placeholder="Explica por qué merece este punto (positivo o negativo)..."
                          value={newEval.justification}
                          onChange={(e) => setNewEval({...newEval, justification: e.target.value})}
                       />
                    </div>
                    <button onClick={handleAddCoEval} className="bg-indigo-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-indigo-500">Enviar Valoración</button>
                 </div>

                 {/* List */}
                 <div>
                    <h4 className="font-bold text-slate-800 mb-4">Tus Valoraciones Enviadas</h4>
                    <div className="space-y-3">
                       {(state.coEvaluations || []).filter(c => c.reviewer === currentUser).length === 0 && <p className="text-slate-400 italic text-sm">No has enviado ninguna valoración.</p>}
                       {(state.coEvaluations || []).filter(c => c.reviewer === currentUser).map(ev => {
                          // Handle potential legacy strings just in case
                          const scoreVal = typeof ev.score === 'number' ? ev.score : (ev.score === 'POSITIVE' ? 1 : ev.score === 'NEGATIVE' ? -1 : 0);
                          return (
                          <div key={ev.id} className="border border-slate-200 rounded p-4 bg-white flex justify-between items-start">
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                   <span className="font-bold text-slate-700">Para: {ev.target}</span>
                                   <span className={`text-[10px] px-2 py-0.5 rounded font-bold text-white ${scoreVal > 0 ? 'bg-emerald-500' : scoreVal < 0 ? 'bg-red-500' : 'bg-slate-400'}`}>
                                      {scoreVal > 0 ? '+' : ''}{scoreVal.toFixed(1)} PUNTOS
                                   </span>
                                </div>
                                <p className="text-sm text-slate-600 italic">"{ev.justification}"</p>
                             </div>
                             <button onClick={() => handleDeleteCoEval(ev.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                          </div>
                       )})}
                    </div>
                    
                    {/* Read Only View of others - Locked per requirements */}
                    <div className="mt-8 p-4 bg-slate-100 border border-slate-200 rounded text-xs text-slate-500 text-center flex items-center justify-center gap-2">
                       <Lock className="w-4 h-4 text-slate-400"/>
                       <span>Nota: Las valoraciones de otros compañeros están ocultas para evitar conflictos. Se incluirán automáticamente en el Anexo Confidencial de la Memoria Final (PDF) sin posibilidad de edición.</span>
                    </div>
                 </div>
              </div>
           )}
        </div>
      )}
    </div>
  );
};
