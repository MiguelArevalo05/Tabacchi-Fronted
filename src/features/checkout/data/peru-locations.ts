export const PERU_DEPARTMENTS = [
  "Amazonas",
  "Áncash",
  "Apurímac",
  "Arequipa",
  "Ayacucho",
  "Cajamarca",
  "Callao",
  "Cusco",
  "Huancavelica",
  "Huánuco",
  "Ica",
  "Junín",
  "La Libertad",
  "Lambayeque",
  "Lima",
  "Loreto",
  "Madre de Dios",
  "Moquegua",
  "Pasco",
  "Piura",
  "Puno",
  "San Martín",
  "Tacna",
  "Tumbes",
  "Ucayali",
] as const;

export type PeruDepartment = (typeof PERU_DEPARTMENTS)[number];

/** department → province → districts */
export const PERU_LOCATION_TREE: Record<string, Record<string, string[]>> = {
  Amazonas: {
    Chachapoyas: ["Chachapoyas", "Asunción", "Balsas", "Cheto", "Chiliquín", "Chuquibamba", "Granada", "Huancas", "La Jalca", "Leimebamba", "Levanto", "Magdalena", "Mariscal Castilla", "Molinopampa", "Montevideo", "Olleros", "Quinjalca", "San Francisco de Daguas", "San Isidro de Maino", "Soloco", "Sonche"],
    Bagua: ["Bagua", "Aramango", "Copallín", "El Parco", "Imaza", "La Peca"],
    Bongará: ["Jumbilla", "Chisquilla", "Churuja", "Corosha", "Cuispes", "Florida", "Jazán", "Recta", "San Carlos", "Shipasbamba", "Valera", "Yambrasbamba"],
    Condorcanqui: ["Santa María de Nieva", "El Cenepa", "Río Santiago"],
    Luya: ["Lamud", "Camporredondo", "Cocabamba", "Colcamar", "Conila", "Inguilpata", "Longuita", "Lonya Chico", "Luya", "Luya Viejo", "María", "Ocalli", "Ocumal", "Pisuquía", "Providencia", "San Cristóbal", "San Francisco del Yeso", "San Jerónimo", "San Juan de Lopecancha", "Santa Catalina", "Santo Tomás", "Tingo", "Trita"],
    "Rodríguez de Mendoza": ["Mendoza", "Chirimoto", "Cochamal", "Huambo", "Limabamba", "Longar", "Mariscal Benavides", "Milpuc", "Omia", "San Nicolás", "Santa Rosa", "Totora", "Vista Alegre"],
    Utcubamba: ["Bagua Grande", "Cajaruro", "Cumba", "El Milagro", "Jamalca", "Lonya Grande", "Yamón"],
  },
  Áncash: {
    Huaraz: ["Huaraz", "Cochabamba", "Colcabamba", "Huanchay", "Independencia", "Jangas", "La Libertad", "Olleros", "Pampas", "Pariacoto", "Pira", "Tarica"],
    Santa: ["Chimbote", "Cáceres del Perú", "Coishco", "Macate", "Moro", "Nepeña", "Samanco", "Santa", "Nuevo Chimbote"],
    Casma: ["Casma", "Buena Vista Alta", "Comandante Noel", "Yaután"],
    Huaylas: ["Caraz", "Huallanca", "Huata", "Huaylas", "Mato", "Pamparomas", "Pueblo Libre", "Santa Cruz", "Santo Toribio", "Yuracmarca"],
  },
  Arequipa: {
    Arequipa: ["Arequipa", "Alto Selva Alegre", "Cayma", "Cerro Colorado", "Characato", "Chiguata", "Jacobo Hunter", "La Joya", "Mariano Melgar", "Miraflores", "Mollebaya", "Paucarpata", "Pocsi", "Polobaya", "Quequeña", "Sabandía", "Sachaca", "San Juan de Siguas", "San Juan de Tarucani", "Santa Isabel de Siguas", "Santa Rita de Siguas", "Socabaya", "Tiabaya", "Uchumayo", "Vitor", "Yanahuara", "Yarabamba", "Yura"],
    Camaná: ["Camaná", "José María Quimper", "Mariano Nicolás Valcárcel", "Mariscal Cáceres", "Nicolás de Piérola", "Ocoña", "Quilca", "Samuel Pastor"],
    Caylloma: ["Chivay", "Achoma", "Cabanaconde", "Callalli", "Caylloma", "Coporaque", "Huambo", "Huanca", "Ichupampa", "Lari", "Lluta", "Maca", "Madrigal", "San Antonio de Chuca", "Sibayo", "Tapay", "Tisco", "Tuti", "Yanque"],
  },
  Callao: {
    Callao: ["Callao", "Bellavista", "Carmen de la Legua Reynoso", "La Perla", "La Punta", "Ventanilla"],
  },
  Cusco: {
    Cusco: ["Cusco", "Ccorca", "Poroy", "San Jerónimo", "San Sebastián", "Santiago", "Saylla", "Wanchaq"],
    Urubamba: ["Urubamba", "Chinchero", "Huayllabamba", "Machupicchu", "Maras", "Ollantaytambo", "Yucay"],
    Calca: ["Calca", "Coya", "Lamay", "Lares", "Pisac", "San Salvador", "Taray", "Yanatile"],
  },
  Ica: {
    Ica: ["Ica", "La Tinguiña", "Los Aquijes", "Ocucaje", "Pachacútec", "Parcona", "Pueblo Nuevo", "Salas", "San José de Los Molinos", "San Juan Bautista", "Santiago", "Subtanjalla", "Tate", "Yauca del Rosario"],
    Chincha: ["Chincha Alta", "Alto Laran", "Chavín", "Chincha Baja", "El Carmen", "Grocio Prado", "Pueblo Nuevo", "San Juan de Yanac", "San Pedro de Huacarpana", "Sunampe", "Tambo de Mora"],
    Pisco: ["Pisco", "Huancano", "Humay", "Independencia", "Paracas", "San Andrés", "San Clemente", "Tupac Amaru Inca"],
  },
  Junín: {
    Huancayo: ["Huancayo", "Carhuacallanga", "Chacapampa", "Chicche", "Chilca", "Chongos Alto", "Chupuro", "Colca", "Cullhuas", "El Tambo", "Huacrapuquio", "Hualhuas", "Huancan", "Huasicancha", "Huayucachi", "Ingenio", "Pariahuanca", "Pilcomayo", "Pucará", "Quichuay", "Quilcas", "San Agustín", "San Jerónimo de Tunán", "Saño", "Sapallanga", "Sicaya", "Santo Domingo de Acobamba", "Viques"],
    Chanchamayo: ["La Merced", "Chanchamayo", "Perené", "Pichanaqui", "San Luis de Shuaro", "San Ramón", "Vitoc"],
    Tarma: ["Tarma", "Acobamba", "Huaricolca", "Huasahuasi", "La Unión", "Palca", "Palcamayo", "San Pedro de Cajas", "Tapo"],
  },
  "La Libertad": {
    Trujillo: ["Trujillo", "El Porvenir", "Florencia de Mora", "Huanchaco", "La Esperanza", "Laredo", "Moche", "Poroto", "Salaverry", "Simbal", "Victor Larco Herrera"],
    Ascope: ["Ascope", "Chicama", "Chocope", "Magdalena de Cao", "Paiján", "Rázuri", "Santiago de Cao", "Casa Grande"],
    Chepén: ["Chepén", "Pacanga", "Pueblo Nuevo"],
  },
  Lambayeque: {
    Chiclayo: ["Chiclayo", "Chongoyape", "Eten", "Eten Puerto", "José Leonardo Ortiz", "La Victoria", "Lagunas", "Monsefú", "Nueva Arica", "Oyotún", "Picsi", "Pimentel", "Pomalca", "Pucalá", "Reque", "Santa Rosa", "Saña", "Tumán"],
    Ferreñafe: ["Ferreñafe", "Cañaris", "Incahuasi", "Manuel Antonio Mesones Muro", "Pítipo", "Pueblo Nuevo"],
    Lambayeque: ["Lambayeque", "Chóchope", "Illimo", "Jayanca", "Mochumí", "Morrope", "Motupe", "Olmos", "Pacora", "Salas", "San José", "Túcume"],
  },
  Lima: {
    Lima: ["Lima", "Ancón", "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos", "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María", "La Molina", "La Victoria", "Lince", "Los Olivos", "Lurigancho", "Lurín", "Magdalena del Mar", "Miraflores", "Pachacámac", "Pucusana", "Pueblo Libre", "Puente Piedra", "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo", "San Borja", "San Isidro", "San Juan de Lurigancho", "San Juan de Miraflores", "San Luis", "San Martín de Porres", "San Miguel", "Santa Anita", "Santa María del Mar", "Santa Rosa", "Santiago de Surco", "Surquillo", "Villa El Salvador", "Villa María del Triunfo"],
    Huaral: ["Huaral", "Atavillos Alto", "Atavillos Bajo", "Aucallama", "Chancay", "Ihuarí", "Lampian", "Pacaraos", "San Miguel de Acos", "Santa Cruz de Andamarca", "Sumbilca", "Veintisiete de Noviembre"],
    Cañete: ["San Vicente de Cañete", "Asia", "Calango", "Cerro Azul", "Chilca", "Coayllo", "Imperial", "Lunahuaná", "Mala", "Nuevo Imperial", "Pacarán", "Quilmaná", "San Antonio", "San Luis", "Santa Cruz de Flores", "Zúñiga"],
    Barranca: ["Barranca", "Paramonga", "Pativilca", "Supe", "Supe Puerto"],
  },
  Loreto: {
    Maynas: ["Iquitos", "Alto Nanay", "Belén", "Indiana", "Las Amazonas", "Mazán", "Napo", "Punchana", "Putumayo", "Torres Causana", "Teniente Manuel Clavero", "Fernando Lores", "San Juan Bautista"],
    "Alto Amazonas": ["Yurimaguas", "Balsapuerto", "Jeberos", "Lagunas", "Santa Cruz", "Teniente César López Rojas"],
  },
  Piura: {
    Piura: ["Piura", "Castilla", "Catacaos", "Cura Mori", "El Tallan", "La Arena", "La Unión", "Las Lomas", "Tambo Grande", "Veintiséis de Octubre"],
    Sullana: ["Sullana", "Bellavista", "Ignacio Escudero", "Lancones", "Marcavelica", "Miguel Checa", "Querecotillo", "Salitral"],
    Talara: ["Pariñas", "El Alto", "La Brea", "Lobitos", "Los Organos", "Máncora"],
  },
  Puno: {
    Puno: ["Puno", "Acora", "Amantani", "Atuncolla", "Capachica", "Chucuito", "Coata", "Huata", "Mañazo", "Paucarcolla", "Pichacani", "Platería", "San Antonio", "Tiquillaca", "Vilque"],
    "San Román": ["Juliaca", "Cabana", "Cabanillas", "Caracoto", "San Miguel"],
  },
  "San Martín": {
    Moyobamba: ["Moyobamba", "Calzada", "Habana", "Jepelacio", "Soritor", "Yantalo"],
    Bellavista: ["Bellavista", "Alto Biavo", "Bajo Biavo", "Huallaga", "San Pablo", "San Rafael"],
    "El Dorado": ["San José de Sisa", "Agua Blanca", "San Martín", "Santa Rosa", "Shatoja"],
    Huallaga: ["Saposoa", "Alto Saposoa", "El Eslabón", "Piscoyacu", "Sacanche", "Tingo de Saposoa"],
    Lamas: ["Lamas", "Alonso de Alvarado", "Barranquita", "Caynarachi", "Cuñumbuqui", "Pinto Recodo", "Rumisapa", "San Roque de Cumbaza", "Shanao", "Tabalosos", "Zapatero"],
    "Mariscal Cáceres": ["Juanjuí", "Campanilla", "Huicungo", "Pachiza", "Pajarillo"],
    Picota: ["Picota", "Buenos Aires", "Caspisapa", "Pilluana", "Pucacaca", "San Cristóbal", "San Hilarión", "Tingo de Ponasa", "Tres Unidos"],
    Rioja: ["Rioja", "Awajún", "Elías Soplin Vargas", "Nueva Cajamarca", "Pardo Miguel", "Posic", "San Fernando", "Yorongos", "Yuracyacu"],
    "San Martín": ["Tarapoto", "Alberto Leveau", "Cacatachi", "Chazuta", "Chipao", "El Porvenir", "Huimbayoc", "Juan Guerra", "La Banda de Shilcayo", "Morales", "Papaplaya", "San Antonio", "Sauce", "Shapaja"],
    Tocache: ["Tocache", "Nuevo Progreso", "Polvora", "Shunte", "Uchiza"],
  },
  Tacna: {
    Tacna: ["Tacna", "Alto de la Alianza", "Calana", "Ciudad Nueva", "Coronel Gregorio Albarracín Lanchipa", "Inclán", "Pachía", "Palca", "Pocollay", "Sama", "La Yarada Los Palos"],
    "Jorge Basadre": ["Locumba", "Ilabaya", "Ite"],
  },
  Ucayali: {
    "Coronel Portillo": ["Callería", "Campoverde", "Iparia", "Masisea", "Yarinacocha", "Nueva Requena", "Manantay"],
    Atalaya: ["Raymondi", "Sepahua", "Tahuanía", "Yurúa"],
  },
  Apurímac: {
    Abancay: ["Abancay", "Circa", "Curahuasi", "Huanipaca", "Lambrama", "Pichirhua", "San Pedro de Cachora", "Tamburco"],
    Andahuaylas: ["Andahuaylas", "Andarapa", "Chiara", "Huancarama", "Huancaray", "Huayana", "Kishuara", "Pacobamba", "Pacucha", "Pampachiri", "Pomacocha", "San Antonio de Cachi", "San Jerónimo", "San Miguel de Chaccrampa", "Santa María de Chicmo", "Talavera", "Tumay Huaraca", "Turpo"],
  },
  Ayacucho: {
    Huamanga: ["Ayacucho", "Acocro", "Acos Vinchos", "Carmen Alto", "Chiara", "Ocros", "Pacaycasa", "Quinua", "San José de Ticllas", "San Juan Bautista", "Santiago de Pischa", "Socos", "Tambillo", "Vinchos"],
    Huanta: ["Huanta", "Ayahuanco", "Huamanguilla", "Iguain", "Luricocha", "Santillana", "Sivia", "Llochegua"],
  },
  Cajamarca: {
    Cajamarca: ["Cajamarca", "Asunción", "Chetilla", "Cospan", "Encañada", "Jesús", "Llacanora", "Los Baños del Inca", "Magdalena", "Matara", "Namora", "San Juan", "San Pablo", "San Sebastián", "Sorochuco", "Tacabamba", "Tumbadén"],
    Jaén: ["Jaén", "Bellavista", "Chontali", "Colasay", "Huabal", "Las Pirias", "Pomahuaca", "Pucará", "Sallique", "San Felipe", "San José del Alto", "Santa Rosa"],
  },
  Huancavelica: {
    Huancavelica: ["Huancavelica", "Acobambilla", "Acoria", "Conayca", "Cuenca", "Huachocolpa", "Huayllahuara", "Izcuchaca", "Laria", "Manta", "Mariscal Cáceres", "Moya", "Nuevo Occoro", "Palca", "Pilchaca", "Vilca", "Yauli"],
  },
  Huánuco: {
    Huánuco: ["Huánuco", "Amarilis", "Chinchao", "Churubamba", "Margos", "Quisqui", "San Francisco de Cayrán", "San Pedro de Chaulán", "Santa María del Valle", "Yarumayo"],
    "Leoncio Prado": ["Rupa-Rupa", "Daniel Alomía Robles", "Hermílio Valdizán", "José Crespo y Castillo", "Luyando", "Mariano Dámaso Beraún", "Pucayacu", "Castillo Grande"],
  },
  "Madre de Dios": {
    Tambopata: ["Tambopata", "Inambari", "Las Piedras", "Laberinto"],
    Manu: ["Manu", "Fitzcarrald", "Madre de Dios", "Huepetuhe"],
  },
  Moquegua: {
    "Mariscal Nieto": ["Moquegua", "Carumas", "Cuchumbaya", "Samegua", "San Cristóbal", "Torata"],
    Ilo: ["Ilo", "El Algarrobal", "Pacocha"],
  },
  Pasco: {
    Pasco: ["Chaupimarca", "Huachon", "Huariaca", "Huayllay", "Ninacaca", "Pallanchacra", "Paucartambo", "San Francisco de Asís de Yarusyacán", "Simón Bolívar", "Ticlacayán", "Tinyahuarco", "Vicco", "Yanacancha"],
    Oxapampa: ["Oxapampa", "Chontabamba", "Huancabamba", "Palcazu", "Pozuzo", "Puerto Bermúdez", "Villa Rica"],
  },
  Tumbes: {
    Tumbes: ["Tumbes", "Corrales", "La Cruz", "Pampas de Hospital", "San Jacinto", "San Juan de la Virgen"],
    Zarumilla: ["Zarumilla", "Aguas Verdes", "Matapalo", "Papayal"],
  },
};

export const PERU_PROVINCES: Record<PeruDepartment, string[]> = Object.fromEntries(
  PERU_DEPARTMENTS.map((department) => [
    department,
    Object.keys(PERU_LOCATION_TREE[department] ?? {}),
  ])
) as Record<PeruDepartment, string[]>;

function locationKey(department: string, province: string): string {
  return `${department}|${province}`;
}

export function getProvincesForDepartment(department: string): string[] {
  const fromTree = Object.keys(PERU_LOCATION_TREE[department] ?? {});
  if (fromTree.length > 0) return fromTree;
  return PERU_PROVINCES[department as PeruDepartment] ?? [];
}

export function getDistrictsForProvince(department: string, province: string): string[] {
  const districts = PERU_LOCATION_TREE[department]?.[province];
  return districts ?? [];
}

export function hasPredefinedDistricts(department: string, province: string): boolean {
  return getDistrictsForProvince(department, province).length > 0;
}

/** @deprecated use PERU_LOCATION_TREE */
export const PERU_DISTRICTS: Record<string, string[]> = Object.fromEntries(
  Object.entries(PERU_LOCATION_TREE).flatMap(([department, provinces]) =>
    Object.entries(provinces).map(([province, districts]) => [
      locationKey(department, province),
      districts,
    ])
  )
);
