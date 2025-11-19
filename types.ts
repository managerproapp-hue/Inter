
export enum RoleType {
  COORDINATOR = 'Coordinador',
  DOCUMENTATION = 'Documentación',
  COMMUNICATION = 'Comunicación',
  RESOURCES = 'Recursos',
  PRODUCTION = 'Producción'
}

export interface Member {
  name: string;
  role: RoleType;
  tasks: string;
}

// --- Phase 2 Structures (Tarea 2) ---

export interface TrendEntry {
  id: string;
  description: string; // "En Altiplano usan uvas ecológicas"
  author?: string;
}

export interface PublicAnalysisEntry {
  id: string;
  profile: string; // Edad, preferencias
  method: string; // Encuesta whatsapp, etc
  linkedODS: string;
  author?: string;
}

export interface MenuBenchmarkEntry {
  id: string;
  restaurantName: string;
  location: string;
  sustainableDish: string;
  ods: string;
  author?: string;
}

export interface SimpleGraphEntry {
  id: string;
  description: string; // Descripción del gráfico
  author?: string;
}

export interface WeeklyReportEntry {
  id: string;
  week: string; // "Semana 1"
  advances: string;
  problems: string;
  contributions: string;
}

export interface Phase2Data {
  // PART A: Individual Analysis (Tarea 2 Individual)
  specificFocus: string; // Tendencias de mercado en la zona (competencia)
  trends: TrendEntry[];
  publicAnalysis: PublicAnalysisEntry[];
  menuBenchmarking: MenuBenchmarkEntry[]; // The 5 examples
  graphs: SimpleGraphEntry[];
  
  // PART B: Group Report (Tarea 2 Grupal - Modelo de Negocio)
  synthesis: string; // Síntesis de tendencias y público
  concept: {
    name: string; // Nombre del Restaurante Ficticio
    restaurantType: string; // EJ: Arrocería, Marisquería, De paso...
    culinaryStyle: string; // EJ: Tradicional, Vanguardia, Fusión, Km0
    targetAudience: string; // EJ: Nivel adquisitivo alto, Familias, Turistas
    averagePrice: string; // EJ: 35€
    description: string; // Descripción general narrativa
    linkedODS: string[]; // Mínimo 2
  };
  zoneMapDescription: string; // Descripción del mapa de zona
  references: string[]; // Lista de referencias (mínimo 5)
  weeklyReports: WeeklyReportEntry[];
}

// --- Phase 3 Structures (Tarea 3) ---

export type DishCategory = 'Aperitivo' | 'Entrante' | 'Principal' | 'Postre';

export interface MenuDish {
  id: string;
  category: DishCategory;
  name: string;
  ingredients: string;
  elaboration: string; 
  image?: string; // Base64 image string
  allergens: string;
  techniques: string;
  presentation: string;
  ods: string;
  author: string; 
}

export interface Phase3Data {
  // Part 1: Products
  products: {
    list: string; // "Alcachofas, Murcia, km0..."
    sustainability: string; // "Reduce emisiones..."
    impactAnalysis: string; // "Baja huella..."
    sources: string[];
  };
  
  // Part 2: The 20 Dishes
  menu: MenuDish[];

  // Part 3: Visual Design
  visual: {
    canvaDescription: string;
    qrUrl: string;
    physicalDescription: string;
  };
  
  references: string[];
}

// --- Phase 4 Structures (NEW: Memoria Parcial y Consolidación) ---

export interface PlanningActivity {
  id: string;
  activity: string;
  dates: string;
  resources: string;
}

export interface Phase4Data {
  // 1. Introduction & Justification
  introContext: string; 
  introObjectives: string;

  // 2. Sector Analysis (RA1)
  sectorCharacterization: string;
  strategyDemand: string;
  odsJustification: string;

  // 3. Project Design (RA2)
  problemDetected: string;
  technicalViability: string;
  essentialParts: string;
  requiredResources: string; // Human & Material
  qualityAspects: string;

  // 4. Planning (RA3)
  timeline: PlanningActivity[];
  logistics: string;
}

// --- Phase 5 Structures (Old Phase 4: Costes y Ejecución) ---

export interface IngredientCost {
  name: string;
  quantity: string;
  price: number;
}

export interface DishFinancial {
  dishId: string; // Links to Phase 3 MenuDish
  totalCost: number;
  sellingPrice: number;
  ingredients: IngredientCost[];
}

export interface DishEval {
  id: string;
  dishName: string;
  expectation: string;
  reality: string;
  waste: string;
}

export interface Phase5Data {
  financials: DishFinancial[]; // Escandallos (Costes)
  dishes: DishEval[]; // Autoevaluación sensorial
  brigadeReport: string;
}

// --- Phase 6 Structures (Old Phase 5: Defensa y Memoria Oficial) ---

export interface CoEvaluationEntry {
  id: string;
  reviewer: string; // Quién escribe
  target: string; // A quién evalúa
  justification: string; // Por qué
  score: number; // Changed to number for decimal scoring (e.g. -0.7, +0.5)
  timestamp: string;
}

export interface Phase6Data {
  // Part A: Individual Checklist
  individualChecklist: {
    investigationDone: boolean;
    dishesDesigned: boolean;
    selfEvalDone: boolean;
    defensePrepared: boolean;
  };

  // Part B: Memory Assembler (Official Index Fields that weren't covered in Phase 4)
  abstract: string; // Resumen del proyecto
  projectScope: string; // 3.3 Alcance y limitaciones
  occupationalRisks: string; // 4.4 Riesgos laborales
  methodology: string; // 5.1 Metodología
  resultsAnalysis: string; // 6.1 Análisis de resultados
  finalConclusions: string; // 7.1 Conclusiones y recomendaciones

  // Defense Links
  presentationUrl: string; 
  virtualMenuUrl: string; 
  physicalMenuEvidence: string; 
  
  // Coevaluación Diabólica
  coEvaluations: CoEvaluationEntry[];
}

// Union type for content allows different structures per phase
export type PhaseContent = string | Phase2Data | Phase3Data | Phase4Data | Phase5Data | Phase6Data;

export interface ProjectConfig {
  projectName: string;
  teamName: string;
  groupNumber?: string;
  deliveryDate?: string;
  zone: string;
  members: Member[];
  createdAt: string;
  // School Identity
  schoolName?: string;
  schoolAddress?: string;
  schoolLogo?: string; // Base64 string
}

export interface ProjectState {
  config: ProjectConfig | null;
  phases: {
    phase1: string; // Text with Config display
    phase2: Phase2Data; // Structured Tarea 2
    phase3: Phase3Data; // Structured Tarea 3
    phase4: Phase4Data; // NEW: Structured Tarea 4 (Memoria Parcial)
    phase5: Phase5Data; // Old Phase 4
    phase6: Phase6Data; // Old Phase 5
  };
  lastModifiedBy: string;
  lastModifiedDate: string;
}

export interface Contribution {
  phaseId: string;
  author: string;
  content: PhaseContent;
  timestamp: string;
}

export enum AppMode {
  LANDING = 'LANDING',
  SETUP = 'SETUP',
  WORKSPACE = 'WORKSPACE',
}

export interface LearningOutcome {
  code: string;
  description: string;
  criteria: string[];
}
