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

// --- Phase 2 Structures ---

export interface Product {
  id: string;
  name: string;
  producer: string;
  season: string;
  author?: string; // To track who added it
}

export interface Competitor {
  id: string;
  name: string;
  concept: string;
  sustainabilityLevel: string;
  opportunity: string; // What would we do better?
  author?: string;
}

export interface DemandEntry {
  profile: string; // Families, tourists...
  motivations: string;
  ticket: string;
  author?: string;
}

export interface ProposedODS {
  id: string;
  ods: string;
  justification: string;
  author?: string;
}

export interface Phase2Data {
  // PART A: Individual Research (Puzzle Pieces)
  products: Product[];
  competitors: Competitor[];
  demandAnalysis: DemandEntry[];
  proposedODS: ProposedODS[];
  
  // PART B: Group Definition (The Picture)
  synthesis: string; // Conclusions after reading Part A
  concept: {
    name: string;
    slogan: string;
    description: string; // Concept philosophy
    values: string;
    targetAudience: string; // Final decision
  };
  finalODS: string[]; // Official project SDGs
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
export type PhaseContent = string | Phase2Data | Phase4Data;

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
    phase2: Phase2Data; // Structured
    phase3: string; // Text
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