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

export interface Product {
  id: string;
  name: string;
  producer: string;
  season: string;
}

export interface Competitor {
  id: string;
  name: string;
  strengths: string;
  weaknesses: string;
}

export interface DishEval {
  id: string;
  dishName: string;
  expectation: string;
  reality: string;
  waste: string;
}

export interface Phase2Data {
  products: Product[];
  competitors: Competitor[];
  concept: {
    name: string;
    slogan: string;
    values: string;
  };
  ods: string[];
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
  groupNumber?: string; // New field
  deliveryDate?: string; // New field
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