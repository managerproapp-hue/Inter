
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
  specificFocus: string; // Enfoque asignado (ej. aperitivos)
  trends: TrendEntry[];
  publicAnalysis: PublicAnalysisEntry[];
  menuBenchmarking: MenuBenchmarkEntry[]; // The 5 examples
  graphs: SimpleGraphEntry[];
  
  // PART B: Group Report (Tarea 2 Grupal)
  synthesis: string; // Síntesis de tendencias y público
  concept: {
    description: string; // Descripción del concepto
    initialDish: string; // Plato inicial
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
  elaboration: string; // New: Preparation method
  image?: string; // New: Base64 image string
  allergens: string;
  techniques: string;
  presentation: string;
  ods: string;
  author: string; // Vital for group work tracking
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

// --- Phase 4 Structures ---

export interface DishEval {
  id: string;
  dishName: string;
  expectation: string;
  reality: string;
  waste: string;
}

export interface Phase4Data {
  dishes: DishEval[];
  brigadeReport: string;
}

// Union type for content allows different structures per phase
export type PhaseContent = string | Phase2Data | Phase3Data | Phase4Data;

export interface ProjectConfig {
  projectName: string;
  teamName: string;
  groupNumber?: string;
  deliveryDate?: string;
  zone: string;
  members: Member[];
  createdAt: string;
}

export interface ProjectState {
  config: ProjectConfig | null;
  phases: {
    phase1: string; // Text
    phase2: Phase2Data; // Structured Tarea 2
    phase3: Phase3Data; // Structured Tarea 3
    phase4: Phase4Data; // Structured
    phase5: string; // Text
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
