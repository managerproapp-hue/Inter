
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
  
  // Visuals & Polish
  coverImage: '',
  teamImage: '',
  polishedTexts: {
    intro: '',
    analysis: '',
    design: '',
    planning: ''
  },

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
        "i) Se ha establecido la relación entre los productos/servicios ofrecidos y su posible aporte a los Objetivos de Desarrollo Sostenible (ODS)."
      ]
    },
    {
      code: "RA 2",
      description: "Proponer soluciones viables a las necesidades del sector, considerando costes y desarrollando un proyecto básico.",
      criteria: [
        "a) Se han detectado y priorizado las necesidades del sector.",
        "b) Se han generado, en equipo, propuestas de solución.",
        "c) Se ha recopilado información relevante sobre las soluciones planteadas.",
        "d) Se han incorporado elementos innovadores con potencial de aplicación práctica.",
        "e) Se ha realizado un análisis de viabilidad técnica de las propuestas.",
        "f) Se ha definido las partes esenciales que componen el proyecto.",
        "g) Se ha estimado la dotación de recursos humanos y materiales requeridos.",
        "h) Se ha elaborado un presupuesto económico detallado.",
        "i) Se ha redactado la documentación técnica necesaria para el diseño del proyecto.",
        "j) Se han considerado los aspectos de calidad inherentes al proyecto.",
        "k) Se ha presentado públicamente el contenido más relevante del proyecto propuesto."
      ]
    },
    {
      code: "RA 3",
      description: "Planificar la ejecución de las actividades derivadas de la solución propuesta, definiendo un plan de intervención y su documentación asociada.",
      criteria: [
        "a) Se ha establecido una cronología detallada para cada actividad.",
        "b) Se ha asignado los recursos y la logística necesarios para cada fase.",
        "c) Se han identificado los permisos o autorizaciones obligatorios, en caso de requerirse.",
        "d) Se han detectado las actividades con riesgos potenciales durante su ejecución.",
        "e) Se ha integrado el plan de prevención de riesgos laborales y se han previsto los equipos de protección necesarios.",
        "f) Se han asignado recursos humanos y materiales específicos a cada tarea.",
        "g) Se han contemplado posibles contingencias o imprevistos.",
        "h) Se han diseñado medidas correctivas para hacer frente a dichos imprevistos.",
        "i) Se ha elaborado toda la documentación técnica y administrativa requerida."
      ]
    },
    {
      code: "RA 4",
      description: "Supervisar la ejecución de las actividades, asegurando el cumplimiento del plan establecido.",
      criteria: [
        "a) Se ha definido un procedimiento claro para el seguimiento de las actividades.",
        "b) Se ha verificado que los resultados obtenidos cumplen con los estándares de calidad esperados.",
        "c) Se han detectado desviaciones respecto al plan inicial o a los resultados previstos.",
        "d) Se ha comunicado oportunamente cualquier desviación relevante a los responsables.",
        "e) Se han implementado y documentado las acciones correctivas necesarias.",
        "f) Se ha generado la documentación final para la evaluación integral de las actividades y del proyecto global."
      ]
    },
    {
      code: "RA 5",
      description: "Comunicar información de forma clara, ordenada y estructurada, tanto interna como externamente.",
      criteria: [
        "a) Se ha mantenido una actitud metódica y organizada en la transmisión de la información.",
        "b) Se ha facilitado comunicación verbal efectiva, tanto en horizontal (entre pares) como en vertical (con superiores o subordinados).",
        "c) Se ha utilizado herramientas informáticas para la comunicación interna en el equipo.",
        "d) Se ha adquirido familiaridad con la terminología técnica del sector en otros idiomas de uso internacional."
      ]
    }
  ],
  "Productos Culinarios (0048)": [
    {
      code: "RA 1",
      description: "Organiza los procesos productivos y de servicio en cocina, interpretando información oral o escrita.",
      criteria: ["a) Se han identificado y caracterizado los distintos ámbitos de producción y servicio en cocina."]
    },
    {
      code: "RA 3",
      description: "Elabora productos culinarios a partir de un conjunto de materias primas, evaluando alternativas creativas y funcionales.",
      criteria: [
        "b) Se ha valorado el aprovechamiento integral de los recursos disponibles (materias primas, tiempos, técnicas).",
        "c) Se han diseñado elaboraciones que combinan los ingredientes de manera lógica, equilibrada y creativa."
      ]
    }
  ],
  "Postres en Restauración (0028)": [
    {
      code: "RA 7",
      description: "Presenta postres emplatados a partir de elaboraciones de pastelería y repostería, integrando criterios estéticos y funcionales.",
      criteria: [
        "c) Se han aplicado técnicas de presentación y decoración acordes a las características del producto final y al contexto de servicio, garantizando equilibrio visual, textural y conceptual."
      ]
    }
  ],
  "Ofertas Gastronómicas (0045)": [
    {
      code: "RA 4",
      description: "Calcula el coste global de la oferta gastronómica, analizando y ponderando todas las variables que lo componen.",
      criteria: [
        "d) Se han calculado y valorado los costes asociados a cada elaboración de cocina y/o pastelería/repostería, incluyendo materias primas, mano de obra, desperdicios, energía y otros gastos indirectos, con el fin de garantizar la viabilidad económica de la oferta."
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
