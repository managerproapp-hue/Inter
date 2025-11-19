
import { LearningOutcome, RoleType, Phase2Data, Phase4Data } from "./types";

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
  "1. Fin de la Pobreza", "2. Hambre Cero", "3. Salud y Bienestar", "4. Educación de Calidad",
  "5. Igualdad de Género", "6. Agua Limpia y Saneamiento", "7. Energía Asequible y No Contaminante",
  "8. Trabajo Decente", "9. Industria, Innovación e Infraestructura", "10. Reducción de las Desigualdades",
  "11. Ciudades y Comunidades Sostenibles", "12. Producción y Consumo Responsables", 
  "13. Acción por el Clima", "14. Vida Submarina", "15. Vida de Ecosistemas Terrestres",
  "16. Paz, Justicia e Instituciones Sólidas", "17. Alianzas para lograr los objetivos"
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
    description: '',
    initialDish: '',
    linkedODS: []
  },
  zoneMapDescription: '',
  references: [],
  weeklyReports: []
};

export const INITIAL_PHASE_4: Phase4Data = {
  dishes: [],
  brigadeReport: ''
};

export const CURRICULUM: Record<string, LearningOutcome[]> = {
  "Proyecto Gastronómico": [
    {
      code: "RA 1",
      description: "Identifica necesidades del sector productivo, relacionándolas con proyectos afines que puedan satisfacerlas.",
      criteria: ["a) Se han clasificado las empresas del sector.", "b) Se han analizado las características de la zona."]
    },
    {
      code: "RA 2",
      description: "Diseña proyectos relacionados con las competencias expresadas en el título, incluyendo y desarrollando las fases que lo componen.",
      criteria: ["a) Se ha definido la estructura organizativa.", "b) Se han previsto los recursos materiales y personales."]
    }
  ]
};

export const PHASES = [
  { id: 'phase1', title: 'Fase 1: Definición y Contexto', type: 'text', icon: 'MapPin' },
  { id: 'phase2', title: 'Fase 2: Inmersión e Ideación (Tarea 2)', type: 'structured', icon: 'Search' },
  { id: 'phase3', title: 'Fase 3: Diseño de Oferta', type: 'text', icon: 'Utensils' },
  { id: 'phase4', title: 'Fase 4: Ejecución Práctica', type: 'structured', icon: 'ChefHat' },
  { id: 'phase5', title: 'Fase 5: Conclusiones y Venta', type: 'text', icon: 'Target' },
];

export const ROLE_DEFINITIONS = [
  {
    role: RoleType.COORDINATOR,
    tagline: "Lidera la organización y el tiempo del equipo.",
    officialTasks: [
      "Controla el calendario y asegura que el grupo cumple los plazos.",
      "Reparte las tareas de forma equilibrada entre los miembros.",
      "Supervisa el trabajo global del equipo y asegura el avance según lo planeado.",
      "Media en caso de conflictos internos para mantener un ambiente positivo."
    ]
  },
  {
    role: RoleType.DOCUMENTATION,
    tagline: "Gestiona la información y el formato de entrega.",
    officialTasks: [
      "Recopila y organiza los archivos generados por el equipo.",
      "Asegura que la Memoria Final cumpla con el formato exigido.",
      "Toma nota de los acuerdos en las reuniones (actas).",
      "Mantiene ordenada la carpeta del proyecto."
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
