
import React, { useState } from 'react';
import { Phase2Data, Phase4Data, TrendEntry, PublicAnalysisEntry, MenuBenchmarkEntry, SimpleGraphEntry, WeeklyReportEntry, DishEval } from '../types';
import { ODS_LIST, INITIAL_PHASE_2, INITIAL_PHASE_4 } from '../constants';
import { Plus, Trash2, Wand2, Sparkles, Check, Search, Briefcase, MapPin, Target, Leaf, PieChart, Book, Users } from 'lucide-react';
import { enhanceText, suggestConcept } from '../services/geminiService';

interface EditorProps {
  data: any;
  onUpdate: (data: any) => void;
  isReadOnly?: boolean;
  projectContext: string;
}

// --- Text Phase Editor (1, 3, 5) ---
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

// --- Structured Phase 2 Editor (Updated for Tarea 2) ---
export const Phase2Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, projectContext }) => {
  const state: Phase2Data = data || INITIAL_PHASE_2;
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
          🅱️ Informe Grupal
        </button>
      </div>

      {/* === PART A: INDIVIDUAL (Tarea 2) === */}
      {activeTab === 'PartA' && (
        <div className="space-y-8">
           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex gap-3 items-start">
             <Search className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <div>
               <p className="font-bold">Tarea 2 - Análisis Individual:</p>
               <p>Completa tu investigación sobre tendencias, público y 5 cartas de ejemplo.</p>
             </div>
           </div>

           {/* Specific Focus */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-2">Enfoque específico asignado (ej. aperitivos, vinos, postres)</label>
              <input 
                className="w-full p-3 border border-slate-300 rounded bg-slate-50"
                placeholder="Escribe aquí tu rol específico..."
                value={state.specificFocus}
                onChange={(e) => updateField('specificFocus', e.target.value)}
              />
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
                       <div className="grid grid-cols-2 gap-2">
                         <input className="p-2 border rounded" placeholder="Método (Ej: Encuesta)" value={p.method}
                           onChange={(e) => {const n=[...state.publicAnalysis]; n[idx].method=e.target.value; updateField('publicAnalysis', n)}} />
                         <select className="p-2 border rounded" value={p.linkedODS}
                            onChange={(e) => {const n=[...state.publicAnalysis]; n[idx].linkedODS=e.target.value; updateField('publicAnalysis', n)}}>
                              <option value="">ODS...</option>
                              {ODS_LIST.map(o => <option key={o} value={o}>{o.split('.')[0]}</option>)}
                         </select>
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
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded border relative">
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
                        <select className="w-full p-2 border rounded text-sm" value={m.ods}
                            onChange={(e) => {const n=[...state.menuBenchmarking]; n[idx].ods=e.target.value; updateField('menuBenchmarking', n)}}>
                              <option value="">ODS...</option>
                              {ODS_LIST.map(o => <option key={o} value={o}>{o.split('.')[0]}</option>)}
                         </select>
                     </div>
                     <div className="col-span-1 flex justify-center">
                        <button onClick={() => removeMenu(idx)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                     </div>
                     {m.author && <span className="absolute top-0 right-0 bg-indigo-100 text-indigo-800 text-[10px] px-1 rounded">{m.author}</span>}
                  </div>
                ))}
              </div>
           </div>

           {/* Graph */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><PieChart className="w-4 h-4"/> Gráfico Simple</h3>
                <button onClick={addGraph} className="text-xs text-indigo-600"><Plus className="w-3 h-3"/></button>
             </div>
             {state.graphs.map((g, idx) => (
                <div key={idx} className="mb-2">
                   <input className="w-full p-3 border rounded bg-slate-50" placeholder="Descripción del gráfico (ej. Tabla de preferencias)..." 
                     value={g.description} onChange={(e) => {const n=[...state.graphs]; n[idx].description=e.target.value; updateField('graphs', n)}} />
                </div>
             ))}
           </div>
        </div>
      )}

      {/* === PART B: GROUP (Tarea 2) === */}
      {activeTab === 'PartB' && (
        <div className="space-y-8">
           <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-sm text-emerald-800 flex gap-3 items-start">
             <Target className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <div>
               <p className="font-bold">Informe Grupal (Consolidación):</p>
               <p>Sintetiza las tendencias individuales y define el concepto final.</p>
             </div>
           </div>

           {/* 1. Synthesis */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-2">Síntesis del Análisis (Tendencias y Cartas)</h3>
             <textarea 
               className="w-full p-4 border border-slate-200 rounded-lg h-32 text-sm"
               placeholder="Ej: En Cartagena el público valora los mariscos sostenibles..."
               value={state.synthesis}
               onChange={(e) => updateField('synthesis', e.target.value)}
             />
           </div>

           {/* 2. Concept */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-slate-800">Concepto del Restaurante</h3>
                 <button onClick={handleConceptAI} className="text-indigo-600 text-sm flex items-center gap-1 hover:underline"><Sparkles className="w-4 h-4"/> Ayuda IA</button>
              </div>
              
              {aiSuggestion && <div className="mb-4 p-3 bg-indigo-50 text-sm rounded text-indigo-800">{aiSuggestion}</div>}

              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Descripción del Concepto</label>
                    <textarea className="w-full p-3 border rounded h-20 text-sm" value={state.concept.description}
                       onChange={(e) => updateField('concept', {...state.concept, description: e.target.value})} placeholder="Ej: Restaurante costero sostenible..."/>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Plato Inicial (Ejemplo)</label>
                    <input className="w-full p-3 border rounded text-sm" value={state.concept.initialDish}
                       onChange={(e) => updateField('concept', {...state.concept, initialDish: e.target.value})} placeholder="Ej: Aperitivo de mejillones Km0..."/>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">ODS Vinculados (Mínimo 2)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded border">
                       {ODS_LIST.map(ods => (
                          <label key={ods} className="flex items-center gap-2 text-xs cursor-pointer">
                             <input type="checkbox" checked={state.concept.linkedODS.includes(ods)}
                               onChange={() => {
                                  const current = state.concept.linkedODS;
                                  const updated = current.includes(ods) ? current.filter(x => x !== ods) : [...current, ods];
                                  updateField('concept', {...state.concept, linkedODS: updated});
                               }} />
                             {ods.split('.')[0]}...
                          </label>
                       ))}
                    </div>
                 </div>
              </div>
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

           {/* 4. Weekly Reports */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-slate-800">Reportes Semanales</h3>
                 <button onClick={addWeeklyReport} className="text-emerald-600 text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/> Añadir Semana</button>
              </div>
              <div className="space-y-4">
                 {state.weeklyReports.map((w, idx) => (
                    <div key={idx} className="border p-4 rounded-lg bg-slate-50">
                       <input className="font-bold bg-transparent border-b mb-2 w-full" value={w.week}
                          onChange={(e) => {const n=[...state.weeklyReports]; n[idx].week=e.target.value; updateField('weeklyReports', n)}} />
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase">Avances</label>
                             <textarea className="w-full p-2 border rounded h-16" value={w.advances}
                               onChange={(e) => {const n=[...state.weeklyReports]; n[idx].advances=e.target.value; updateField('weeklyReports', n)}} />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase">Problemas</label>
                             <textarea className="w-full p-2 border rounded h-16" value={w.problems}
                               onChange={(e) => {const n=[...state.weeklyReports]; n[idx].problems=e.target.value; updateField('weeklyReports', n)}} />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase">Contribuciones</label>
                             <textarea className="w-full p-2 border rounded h-16" value={w.contributions}
                               onChange={(e) => {const n=[...state.weeklyReports]; n[idx].contributions=e.target.value; updateField('weeklyReports', n)}} />
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// --- Structured Phase 4 Editor ---
export const Phase4Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly }) => {
  const state: Phase4Data = data || INITIAL_PHASE_4;

  const updateField = (field: keyof Phase4Data, value: any) => {
    onUpdate({ ...state, [field]: value });
  };

  const addDish = () => {
    const newDish: DishEval = { id: Date.now().toString(), dishName: '', expectation: '', reality: '', waste: '' };
    updateField('dishes', [...state.dishes, newDish]);
  };

  const removeDish = (id: string) => {
    updateField('dishes', state.dishes.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Dishes Evaluation */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Autoevaluación de Platos</h3>
          {!isReadOnly && (
            <button onClick={addDish} className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
              <Plus className="w-4 h-4" /> Evaluar Plato
            </button>
          )}
        </div>
        <div className="grid gap-6">
          {state.dishes.map((dish, idx) => (
            <div key={dish.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative group">
              {!isReadOnly && (
                <button onClick={() => removeDish(dish.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
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
                  <textarea
                    className="w-full p-2 border rounded bg-white h-20 text-sm"
                    value={dish.expectation}
                    onChange={(e) => {
                      const newDishes = [...state.dishes];
                      newDishes[idx].expectation = e.target.value;
                      updateField('dishes', newDishes);
                    }}
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Realidad (Resultado)</label>
                  <textarea
                    className="w-full p-2 border rounded bg-white h-20 text-sm"
                    value={dish.reality}
                    onChange={(e) => {
                      const newDishes = [...state.dishes];
                      newDishes[idx].reality = e.target.value;
                      updateField('dishes', newDishes);
                    }}
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Análisis de Mermas</label>
                  <textarea
                    className="w-full p-2 border rounded bg-white h-20 text-sm"
                    value={dish.waste}
                    onChange={(e) => {
                      const newDishes = [...state.dishes];
                      newDishes[idx].waste = e.target.value;
                      updateField('dishes', newDishes);
                    }}
                    disabled={isReadOnly}
                  />
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
            disabled={isReadOnly}
         />
      </div>
    </div>
  );
};
