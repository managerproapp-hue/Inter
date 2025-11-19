import React, { useState } from 'react';
import { Phase2Data, Phase4Data, Product, Competitor, DishEval, DemandEntry, ProposedODS } from '../types';
import { ODS_LIST, INITIAL_PHASE_2, INITIAL_PHASE_4 } from '../constants';
import { Plus, Trash2, Wand2, Sparkles, Check, Search, Briefcase, MapPin, Target, Leaf } from 'lucide-react';
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

// --- Structured Phase 2 Editor (Updated for Puzzle Flow) ---
export const Phase2Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, projectContext }) => {
  const state: Phase2Data = data || INITIAL_PHASE_2;
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [activeTab, setActiveTab] = useState<'PartA' | 'PartB'>('PartA');

  const updateField = (field: keyof Phase2Data, value: any) => {
    onUpdate({ ...state, [field]: value });
  };

  // --- Helpers for Lists (Part A) ---
  const addProduct = () => {
    const newProduct: Product = { id: Date.now().toString(), name: '', producer: '', season: '' };
    updateField('products', [...state.products, newProduct]);
  };
  const removeProduct = (idx: number) => {
    const newList = [...state.products];
    newList.splice(idx, 1);
    updateField('products', newList);
  };

  const addCompetitor = () => {
    const newComp: Competitor = { id: Date.now().toString(), name: '', concept: '', sustainabilityLevel: '', opportunity: '' };
    updateField('competitors', [...state.competitors, newComp]);
  };
  const removeCompetitor = (idx: number) => {
    const newList = [...state.competitors];
    newList.splice(idx, 1);
    updateField('competitors', newList);
  };

  const addDemand = () => {
    const newDemand: DemandEntry = { profile: '', motivations: '', ticket: '' };
    updateField('demandAnalysis', [...state.demandAnalysis, newDemand]);
  };

  const addProposedODS = () => {
    const newODS: ProposedODS = { id: Date.now().toString(), ods: '', justification: '' };
    updateField('proposedODS', [...state.proposedODS, newODS]);
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
          className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'PartA' ? 'bg-slate-100 text-slate-800 border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🅰️ Parte A: Trabajo Individual
        </button>
        <button 
          onClick={() => setActiveTab('PartB')}
          className={`px-4 py-2 font-bold rounded-t-lg transition-colors ${activeTab === 'PartB' ? 'bg-emerald-50 text-emerald-800 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-700'}`}
        >
          🅱️ Parte B: Definición Grupal
        </button>
      </div>

      {/* === PART A: INVESTIGATION === */}
      {activeTab === 'PartA' && (
        <div className="space-y-8">
           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 flex gap-3 items-start">
             <Search className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <div>
               <p className="font-bold">Instrucciones Parte A (Individual):</p>
               <p>Investiga desde casa y rellena tus hallazgos. Al importar tu archivo, se sumará a la lista del grupo.</p>
             </div>
           </div>

           {/* 1. Products */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Leaf className="w-5 h-5 text-emerald-600"/> Productos Locales (Mínimo 3)</h3>
                <button onClick={addProduct} className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir</button>
              </div>
              <div className="space-y-3">
                {state.products.map((p, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 bg-slate-50 p-3 rounded-lg relative group">
                    <input placeholder="Producto" className="col-span-4 p-2 border rounded text-sm" value={p.name} 
                      onChange={(e) => {const n = [...state.products]; n[idx].name = e.target.value; updateField('products', n)}} />
                    <input placeholder="Productor/Origen" className="col-span-4 p-2 border rounded text-sm" value={p.producer} 
                      onChange={(e) => {const n = [...state.products]; n[idx].producer = e.target.value; updateField('products', n)}} />
                    <input placeholder="Temporada" className="col-span-3 p-2 border rounded text-sm" value={p.season} 
                      onChange={(e) => {const n = [...state.products]; n[idx].season = e.target.value; updateField('products', n)}} />
                     <button onClick={() => removeProduct(idx)} className="col-span-1 flex justify-center items-center text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                     {p.author && <span className="absolute top-0 right-0 text-[10px] bg-slate-200 px-1 rounded text-slate-600">{p.author}</span>}
                  </div>
                ))}
              </div>
           </div>

           {/* 2. Benchmarking */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Briefcase className="w-5 h-5 text-indigo-600"/> Análisis Competencia</h3>
                <button onClick={addCompetitor} className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Añadir Restaurante</button>
              </div>
              <div className="space-y-4">
                {state.competitors.map((c, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                      <input placeholder="Nombre Competidor" className="p-2 border rounded font-bold" value={c.name}
                         onChange={(e) => {const n = [...state.competitors]; n[idx].name = e.target.value; updateField('competitors', n)}} />
                      <input placeholder="Nivel Sostenibilidad" className="p-2 border rounded" value={c.sustainabilityLevel}
                         onChange={(e) => {const n = [...state.competitors]; n[idx].sustainabilityLevel = e.target.value; updateField('competitors', n)}} />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                       <input placeholder="Concepto General" className="p-2 border rounded text-sm" value={c.concept}
                         onChange={(e) => {const n = [...state.competitors]; n[idx].concept = e.target.value; updateField('competitors', n)}} />
                       <textarea placeholder="Oportunidad de Mejora (¿Qué haríamos nosotros mejor?)" className="p-2 border rounded text-sm h-16" value={c.opportunity}
                         onChange={(e) => {const n = [...state.competitors]; n[idx].opportunity = e.target.value; updateField('competitors', n)}} />
                    </div>
                    <button onClick={() => removeCompetitor(idx)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                  </div>
                ))}
              </div>
           </div>

           {/* 3. Demand & ODS */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Perfil de Demanda</h3>
                  <button onClick={addDemand} className="text-indigo-600 text-xs"><Plus className="w-3 h-3"/></button>
                </div>
                {state.demandAnalysis.map((d, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded mb-3 text-sm space-y-2">
                     <input placeholder="Perfil (Ej: Familias)" className="w-full p-1 border rounded" value={d.profile}
                        onChange={(e) => {const n = [...state.demandAnalysis]; n[idx].profile = e.target.value; updateField('demandAnalysis', n)}} />
                     <input placeholder="Motivaciones" className="w-full p-1 border rounded" value={d.motivations}
                        onChange={(e) => {const n = [...state.demandAnalysis]; n[idx].motivations = e.target.value; updateField('demandAnalysis', n)}} />
                     <input placeholder="Ticket Medio Estimado" className="w-full p-1 border rounded" value={d.ticket}
                        onChange={(e) => {const n = [...state.demandAnalysis]; n[idx].ticket = e.target.value; updateField('demandAnalysis', n)}} />
                  </div>
                ))}
                 {state.demandAnalysis.length === 0 && <button onClick={addDemand} className="w-full py-2 border-2 border-dashed border-slate-300 rounded text-slate-400 text-sm">Añadir Análisis Demanda</button>}
             </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800">Propuesta ODS (2)</h3>
                  <button onClick={addProposedODS} className="text-emerald-600 text-xs"><Plus className="w-3 h-3"/></button>
                </div>
                {state.proposedODS.map((o, idx) => (
                  <div key={idx} className="bg-emerald-50 p-3 rounded mb-3 text-sm space-y-2 border border-emerald-100">
                     <select className="w-full p-1 border rounded bg-white" value={o.ods}
                        onChange={(e) => {const n = [...state.proposedODS]; n[idx].ods = e.target.value; updateField('proposedODS', n)}}>
                        <option value="">Selecciona ODS...</option>
                        {ODS_LIST.map(x => <option key={x} value={x}>{x}</option>)}
                     </select>
                     <textarea placeholder="Justificación..." className="w-full p-1 border rounded h-16" value={o.justification}
                        onChange={(e) => {const n = [...state.proposedODS]; n[idx].justification = e.target.value; updateField('proposedODS', n)}} />
                  </div>
                ))}
             </div>
           </div>
        </div>
      )}

      {/* === PART B: DEFINITION === */}
      {activeTab === 'PartB' && (
        <div className="space-y-8">
           <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-sm text-emerald-800 flex gap-3 items-start">
             <Target className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <div>
               <p className="font-bold">Instrucciones Parte B (Líder/Grupal):</p>
               <p>Reúne al equipo, lee los datos de la Parte A y define la identidad final del restaurante.</p>
             </div>
           </div>

           {/* 1. Synthesis */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-2">Síntesis del Análisis</h3>
             <p className="text-sm text-slate-500 mb-4">¿Qué conclusiones sacáis tras ver todos los productos y competidores?</p>
             <textarea 
               className="w-full p-4 border border-slate-200 rounded-lg h-32 text-sm"
               placeholder="Ej: Hemos visto que hay mucha competencia en arroces, pero poca en..."
               value={state.synthesis}
               onChange={(e) => updateField('synthesis', e.target.value)}
             />
           </div>

           {/* 2. Concept Identity */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-t-4 border-t-emerald-500">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-slate-800">Identidad del Restaurante</h3>
                 <button onClick={handleConceptAI} className="text-indigo-600 text-sm flex items-center gap-1 hover:underline"><Sparkles className="w-4 h-4"/> Ayuda IA</button>
              </div>

              {aiSuggestion && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800 whitespace-pre-line relative">
                   <button onClick={() => setAiSuggestion('')} className="absolute top-2 right-2 font-bold">×</button>
                   {aiSuggestion}
                </div>
              )}

              <div className="space-y-5">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Restaurante</label>
                   <input className="w-full p-3 border rounded-lg font-bold text-lg text-emerald-900 bg-emerald-50"
                      value={state.concept.name}
                      onChange={(e) => updateField('concept', {...state.concept, name: e.target.value})} />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Eslogan / Propuesta de Valor</label>
                   <input className="w-full p-3 border rounded-lg italic"
                      value={state.concept.slogan}
                      onChange={(e) => updateField('concept', {...state.concept, slogan: e.target.value})} />
                 </div>

                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Descripción del Concepto (Filosofía)</label>
                   <textarea className="w-full p-3 border rounded-lg h-24"
                      value={state.concept.description}
                      onChange={(e) => updateField('concept', {...state.concept, description: e.target.value})} />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Valores (Ej: Km0, Honestidad)</label>
                      <textarea className="w-full p-3 border rounded-lg h-24 text-sm"
                          value={state.concept.values}
                          onChange={(e) => updateField('concept', {...state.concept, values: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Público Objetivo Final</label>
                      <textarea className="w-full p-3 border rounded-lg h-24 text-sm"
                          value={state.concept.targetAudience}
                          onChange={(e) => updateField('concept', {...state.concept, targetAudience: e.target.value})} />
                    </div>
                 </div>
              </div>
           </div>

           {/* 3. Final ODS */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">ODS Oficiales del Proyecto</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ODS_LIST.map(ods => (
                  <label key={ods} className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-all ${state.finalODS.includes(ods) ? 'bg-emerald-100 border-emerald-500' : 'hover:bg-slate-50'}`}>
                    <input type="checkbox" className="hidden" checked={state.finalODS.includes(ods)}
                       onChange={() => {
                         const newOds = state.finalODS.includes(ods) ? state.finalODS.filter(o => o !== ods) : [...state.finalODS, ods];
                         updateField('finalODS', newOds);
                       }} />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${state.finalODS.includes(ods) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-400'}`}>
                       {state.finalODS.includes(ods) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-xs font-medium">{ods}</span>
                  </label>
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