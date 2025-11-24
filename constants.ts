
import { LearningOutcome, RoleType, Phase2Data, Phase3Data, Phase4Data, Phase5Data, Phase6Data } from "./types";

export const ZONES = [
  "Altiplano (Jumilla, Yecla – vinos, productos de secano)",
  "Noroeste (Caravaca, Cehegín, Moratalla – montaña, turismo rural)",
  "Río Mula y Valle de Ricote (Mula, Bullas, Ricote – huertas, frutas)",
  "Vega del Segura (Alta y Media) (Cieza, Molina de Segura, Alcantarilla – agricultura sostenible)",
  "Huerta de Murcia y Oriental (Murcia capital, Santomera, Beniel – público urbano)",
  "Valle del Guadalentín (Lorca, Mazarrón, Águilas, Totana – arroz, mariscos)",
  "Campo de Cartagena y Mar Menor (Cartagena, Los Alcázares, San Javier, San Pedro – pescados, turismo costero)"
];

export const ROLES = [
  RoleType.COORDINATOR,
  RoleType.DOCUMENTATION,
  RoleType.COMMUNICATION,
  RoleType.RESOURCES,
  RoleType.PRODUCTION
];

export const ODS_LIST = [
  "1. Fin de la pobreza",
  "2. Hambre cero",
  "3. Salud y bienestar",
  "4. Educación de calidad",
  "5. Igualdad de género",
  "6. Agua limpia y saneamiento",
  "7. Energía asequible y no contaminante",
  "8. Trabajo decente y crecimiento económico",
  "9. Industria, innovación e infraestructura",
  "10. Reducción de las desigualdades",
  "11. Ciudades y comunidades sostenibles",
  "12. Producción y consumo responsables",
  "13. Acción por el clima",
  "14. Vida submarina",
  "15. Vida de ecosistemas terrestres",
  "16. Paz, justicia e instituciones sólidas",
  "17. Alianzas para lograr los objetivos"
];

export const INITIAL_PHASE_2: Phase2Data = {
  // Part A (Individual)
  specificFocus: '',
  trends: [],
  publicAnalysis: [],
  menuBenchmarking: [],
  graphs: [],
  
  // Part B (Group)
  synthesis: '',
  concept: { 
    name: '',
    restaurantType: '',
    culinaryStyle: '',
    targetAudience: '',
    averagePrice: '',
    description: '',
    linkedODS: []
  },
  zoneMapDescription: '',
  references: [],
  weeklyReports: []
};

export const INITIAL_PHASE_3: Phase3Data = {
  products: {
    list: '',
    sustainability: '',
    impactAnalysis: '',
    sources: []
  },
  menu: [],
  visual: {
    canvaDescription: '',
    qrUrl: '',
    physicalDescription: ''
  },
  references: []
};

// NEW PHASE 4: Memoria Parcial
export const INITIAL_PHASE_4: Phase4Data = {
  introContext: '',
  introObjectives: '',
  mapImage: '',
  sectorCharacterization: '',
  strategyDemand: '',
  odsJustification: '',
  problemDetected: '',
  technicalViability: '',
  essentialParts: '',
  requiredResources: '',
  qualityAspects: '',
  timeline: [],
  logistics: ''
};

// Old Phase 4 becomes 5
export const INITIAL_PHASE_5: Phase5Data = {
  financials: [],
  dishes: [],
  brigadeReport: ''
};

// Old Phase 5 becomes 6
export const INITIAL_PHASE_6: Phase6Data = {
  individualChecklist: {
    investigationDone: false,
    dishesDesigned: false,
    selfEvalDone: false,
    defensePrepared: false
  },
  // Official Index Fields
  abstract: '',
  projectScope: '',
  occupationalRisks: '',
  methodology: 'La metodología empleada se basa en el aprendizaje basado en proyectos (ABP) y el método Flujo Puzle, distribuyendo roles específicos entre los miembros del equipo para simular un entorno de trabajo real en hostelería.',
  resultsAnalysis: '',
  finalConclusions: '',
  
  // Links
  presentationUrl: '',
  virtualMenuUrl: '',
  physicalMenuEvidence: '',
  
  // Coevaluación
  coEvaluations: []
};

export const CURRICULUM: Record<string, LearningOutcome[]> = {
  "Módulo de Proyecto (Principal)": [
    {
      code: "RA 1",
      description: "Analizar y caracterizar las empresas del sector según su estructura organizativa y la naturaleza de sus productos o servicios.",
      criteria: [
        "a) Se han identificado los modelos empresariales más representativos del sector.",
        "b) Se ha descrito la estructura organizativa típica de estas empresas.",
        "c) Se han definido las funciones y características de los principales departamentos.",
        "d) Se ha especificado el rol y las responsabilidades de cada área funcional.",
        "e) Se ha evaluado el volumen de negocio en función de las demandas y necesidades del cliente.",
        "f) Se ha diseñado una estrategia adecuada para responder a dichas demandas.",
        "g) Se ha valorado la dotación necesaria de recursos humanos y materiales.",
        "h) Se ha implementado un sistema de seguimiento de resultados acorde con la estrategia definida.",
        "i) Se ha establecido la relación entre los productos/servicios ofrecidos y su posible aporte a los ODS."
      ]
    },
    {
      code: "RA 2",
      description: "Proponer soluciones viables a las necesidades del sector, considerando costes y desarrollando un proyecto básico.",
      criteria: [
        "a) Se han detectado y priorizado las necesidades del sector.",
        "b) Se han generado, en equipo, propuestas de solución.",
        "c) Se ha recopilado información relevante sobre las soluciones planteadas.",
        "d) Se ha realizado un análisis de viabilidad técnica de las propuestas.",
        "f) Se ha definido las partes esenciales que componen el proyecto.",
        "g) Se ha estimado la dotación de recursos humanos y materiales requeridos.",
        "h) Se ha elaborado un presupuesto económico detallado.",
        "j) Se han considerado los aspectos de calidad inherentes al proyecto.",
      ]
    },
    {
      code: "RA 3",
      description: "Planificar la ejecución de las actividades derivadas de la solución propuesta, definiendo un plan de intervención y su documentación asociada.",
      criteria: [
        "a) Se ha establecido una cronología detallada para cada actividad.",
        "b) Se ha asignado los recursos y la logística necesarios para cada fase.",
        "d) Se han detectado las actividades con riesgos potenciales durante su ejecución.",
        "e) Se ha integrado el plan de prevención de riesgos laborales.",
      ]
    }
  ]
};

export const PHASES = [
  { id: 'phase1', title: 'Fase 1: Definición y Contexto', type: 'text', icon: 'MapPin' },
  { id: 'phase2', title: 'Fase 2: Inmersión e Ideación', type: 'structured', icon: 'Search' },
  { id: 'phase3', title: 'Fase 3: Diseño de Oferta', type: 'structured', icon: 'Utensils' },
  { id: 'phase4', title: 'Fase 4: Consolidación y Diseño', type: 'structured', icon: 'FileText' },
  { id: 'phase5', title: 'Fase 5: Ejecución y Costes', type: 'structured', icon: 'ChefHat' },
  { id: 'phase6', title: 'Fase 6: Memoria y Defensa', type: 'structured', icon: 'Presentation' },
];

export const ROLE_DEFINITIONS = [
  {
    role: RoleType.COORDINATOR,
    tagline: "Lidera la organización y el tiempo del equipo.",
    officialTasks: [
      "Controla el calendario y asegura que el grupo cumple los plazos.",
      "Reparte las tareas de forma equilibrada entre los miembros.",
      "Supervisa el trabajo global del equipo y asegura el avance según lo planeado.",
      "Recopila los archivos de todas las fases y los unifica."
    ]
  },
  {
    role: RoleType.DOCUMENTATION,
    tagline: "Gestiona la información y el formato de entrega.",
    officialTasks: [
      "Recopila y organiza los archivos generados por el equipo.",
      "Asegura que la Memoria Final cumpla con el formato exigido.",
      "Toma nota de los acuerdos en las reuniones (actas).",
      "Verifica que no falte ningún apartado de la Memoria Parcial."
    ]
  },
  {
    role: RoleType.COMMUNICATION,
    tagline: "Portavoz y gestor de la presentación.",
    officialTasks: [
      "Actúa como interlocutor principal con el profesorado.",
      "Prepara el guion de la defensa oral.",
      "Asegura la coherencia en el tono y estilo de la redacción.",
      "Coordina la presentación visual (diapositivas, soportes)."
    ]
  },
  {
    role: RoleType.RESOURCES,
    tagline: "Investigador de medios y materiales.",
    officialTasks: [
      "Busca fuentes de información fiables y recursos necesarios.",
      "Gestiona el presupuesto ficticio si el proyecto lo requiere.",
      "Localiza proveedores y referencias técnicas de la zona.",
      "Asegura que no falte información clave en cada fase."
    ]
  },
  {
    role: RoleType.PRODUCTION,
    tagline: "Control de calidad y viabilidad.",
    officialTasks: [
      "Revisa que el contenido cumpla con los Criterios de Evaluación.",
      "Verifica la viabilidad técnica de las propuestas gastronómicas.",
      "Detecta errores o inconsistencias antes de la entrega.",
      "Asegura que la propuesta sea realista y ejecutable."
    ]
  }
];
