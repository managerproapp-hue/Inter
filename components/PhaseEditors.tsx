import React, { useState } from 'react';
import { Phase2Data, Phase4Data, Product, Competitor, DishEval } from '../types';
import { ODS_LIST, INITIAL_PHASE_2, INITIAL_PHASE_4 } from '../constants';
import { Plus, Trash2, Wand2, Sparkles, Check } from 'lucide-react';
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

// --- Structured Phase 2 Editor ---
export const Phase2Editor: React.FC<EditorProps> = ({ data, onUpdate, isReadOnly, projectContext }) => {
  const state: Phase2Data = data || INITIAL_PHASE_2;
  const [aiSuggestion, setAiSuggestion] = useState('');

  const updateField = (field: keyof Phase2Data, value: any) => {
    onUpdate({ ...state, [field]: value });
  };

  const addProduct = () => {
    const newProduct: Product = { id: Date.now().toString(), name: '', producer: '', season: '' };
    updateField('products', [...state.products, newProduct]);
  };

  const removeProduct = (id: string) => {
    updateField('products', state.products.filter(p => p.id !== id));
  };

  const handleConceptAI = async () => {
    // Extract zone from context string roughly
    const zone = projectContext.split('Zona:')[1]?.split(',')[0] || 'Murcia';
    const suggestions = await suggestConcept(zone);
    setAiSuggestion(suggestions);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Concept Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Concepto Gastronómico</h3>
          <button onClick={handleConceptAI} className="text-indigo-600 text-sm flex items-center gap-1 hover:underline">
            <Sparkles className="w-3 h-3" /> Ideas IA
          </button>
        </div>
        
        {aiSuggestion && (
          <div className="mb-4 p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800 whitespace-pre-line">
             <div className="flex justify-between mb-2 font-bold">Sugerencias Gemini: <button onClick={() => setAiSuggestion('')} className="text-xs">Cerrar</button></div>
             {aiSuggestion}
          </div>
        )}

        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Nombre del Restaurante"
            className="w-full p-3 border rounded-lg"
            value={state.concept.name}
            onChange={(e) => updateField('concept', { ...state.concept, name: e.target.value })}
            disabled={isReadOnly}
          />
          <input
            type="text"
            placeholder="Eslogan o Propuesta de Valor"
            className="w-full p-3 border rounded-lg"
            value={state.concept.slogan}
            onChange={(e) => updateField('concept', { ...state.concept, slogan: e.target.value })}
            disabled={isReadOnly}
          />
          <textarea
            placeholder="Valores fundamentales (ej: Km0, Economía Circular...)"
            className="w-full p-3 border rounded-lg h-24"
            value={state.concept.values}
            onChange={(e) => updateField('concept', { ...state.concept, values: e.target.value })}
            disabled={isReadOnly}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Despensa Local (Materia Prima)</h3>
          {!isReadOnly && (
            <button onClick={addProduct} className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
              <Plus className="w-4 h-4" /> Añadir Producto
            </button>
          )}
        </div>
        <div className="space-y-3">
          {state.products.map((prod, idx) => (
            <div key={prod.id} className="grid grid-cols-12 gap-2 items-center">
              <input
                placeholder="Producto"
                className="col-span-4 p-2 border rounded bg-slate-50 text-sm"
                value={prod.name}
                onChange={(e) => {
                  const newProds = [...state.products];
                  newProds[idx].name = e.target.value;
                  updateField('products', newProds);
                }}
                disabled={isReadOnly}
              />
              <input
                placeholder="Productor/Origen"
                className="col-span-4 p-2 border rounded bg-slate-50 text-sm"
                value={prod.producer}
                onChange={(e) => {
                  const newProds = [...state.products];
                  newProds[idx].producer = e.target.value;
                  updateField('products', newProds);
                }}
                disabled={isReadOnly}
              />
              <input
                placeholder="Temporada"
                className="col-span-3 p-2 border rounded bg-slate-50 text-sm"
                value={prod.season}
                onChange={(e) => {
                  const newProds = [...state.products];
                  newProds[idx].season = e.target.value;
                  updateField('products', newProds);
                }}
                disabled={isReadOnly}
              />
              {!isReadOnly && (
                <button onClick={() => removeProduct(prod.id)} className="col-span-1 text-red-400 hover:text-red-600 flex justify-center">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {state.products.length === 0 && <p className="text-slate-400 text-sm italic text-center">No hay productos añadidos.</p>}
        </div>
      </div>

      {/* ODS Selection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Objetivos de Desarrollo Sostenible</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ODS_LIST.map(ods => (
            <label key={ods} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${state.ods.includes(ods) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'}`}>
              <input
                type="checkbox"
                className="hidden"
                checked={state.ods.includes(ods)}
                onChange={() => {
                  if (isReadOnly) return;
                  const newOds = state.ods.includes(ods) 
                    ? state.ods.filter(o => o !== ods)
                    : [...state.ods, ods];
                  updateField('ods', newOds);
                }}
              />
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${state.ods.includes(ods) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}>
                {state.ods.includes(ods) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm font-medium text-slate-700">{ods}</span>
            </label>
          ))}
        </div>
      </div>
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