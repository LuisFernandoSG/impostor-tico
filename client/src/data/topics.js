export const TOPICS = [
  {
    id: 'food',
    name: 'Comida',
    icon: '🍽️',
    description: 'Sabores clásicos, antojos callejeros y platillos que unen mesas completas.',
    words: [
      { word: 'Pizza', hint: 'Masa redonda con queso derretido y mil combinaciones.' },
      { word: 'Sushi', hint: 'Bocados enrollados con arroz y mar en cada pieza.' },
      { word: 'Tacos', hint: 'Tortillas plegadas que abrazan guisos sazonados.' },
      { word: 'Hamburguesa', hint: 'Pan suave con carne, vegetales y salsas apiladas.' },
      { word: 'Ceviche', hint: 'Pescado fresco “cocinado” con cítricos chispeantes.' },
      { word: 'Lasagna', hint: 'Capas de pasta, salsa y queso horneadas en armonía.' },
      { word: 'Ramen', hint: 'Caldo reconfortante con fideos y toppings abundantes.' },
      { word: 'Arepas', hint: 'Discos de maíz rellenos que se disfrutan recién tostados.' },
      { word: 'Paella', hint: 'Arroz dorado con mariscos, pollo y azafrán.' },
      { word: 'Helado', hint: 'Postre frío y cremoso con sabores infinitos.' }
    ]
  },
  {
    id: 'places',
    name: 'Lugares',
    icon: '🗺️',
    description: 'Escenarios para explorar: ciudades, naturaleza y rincones soñados.',
    words: [
      { word: 'Biblioteca', hint: 'Silencio, historias y estantes interminables.' },
      { word: 'Playa', hint: 'Arena entre los dedos y olas que van y vienen.' },
      { word: 'Montaña', hint: 'Caminos empinados y vistas que quitan el aliento.' },
      { word: 'Museo', hint: 'Colecciones que viajan por el tiempo y la cultura.' },
      { word: 'Mercado', hint: 'Puestos coloridos, voces y aromas mezclados.' },
      { word: 'Parque', hint: 'Árboles, bancas y gente paseando sin prisa.' },
      { word: 'Aeropuerto', hint: 'Pantallas, maletas y despedidas emocionantes.' },
      { word: 'Cabaña', hint: 'Refugio de madera entre bosques y chimeneas.' },
      { word: 'Cafetería', hint: 'Tazas humeantes y conversaciones que se alargan.' },
      { word: 'Estadio', hint: 'Gradas, cánticos y adrenalina deportiva.' }
    ]
  },
  {
    id: 'daily',
    name: 'Vida cotidiana',
    icon: '🧺',
    description: 'Objetos y momentos que aparecen todos los días.',
    words: [
      { word: 'Agenda', hint: 'Aliada para recordar citas y pendientes.' },
      { word: 'Llaves', hint: 'Pequeñas guardianas de puertas y secretos.' },
      { word: 'Paraguas', hint: 'Se abre como flor cuando llueve.' },
      { word: 'Auriculares', hint: 'Pequeños accesorios para escuchar sin molestar.' },
      { word: 'Microondas', hint: 'Hace sonar un “ding” cuando calienta tu comida.' },
      { word: 'Cargador', hint: 'Cable imprescindible cuando queda 2% de batería.' },
      { word: 'Espejo', hint: 'Devuelve tu reflejo antes de salir de casa.' },
      { word: 'Bicicleta', hint: 'Dos ruedas para llegar lejos con pedaladas.' },
      { word: 'Termo', hint: 'Mantiene tu bebida caliente o fría cuando sales.' },
      { word: 'Planta', hint: 'Decora, respira y necesita un poco de agua.' }
    ]
  },
  {
    id: 'entertainment',
    name: 'Diversión',
    icon: '🎉',
    description: 'Juegos, actividades y planes para el tiempo libre.',
    words: [
      { word: 'Concierto', hint: 'Luces, escenario y música en vivo a todo volumen.' },
      { word: 'Cine', hint: 'Pantalla gigante, palomitas y trailers.' },
      { word: 'Videojuego', hint: 'Control en mano y misiones por completar.' },
      { word: 'Karaoke', hint: 'Micrófonos y valientes que cantan sus hits.' },
      { word: 'Camping', hint: 'Carpa, fogata y estrellas brillando.' },
      { word: 'Trampolín', hint: 'Saltos sin parar como si no hubiera gravedad.' },
      { word: 'Patineta', hint: 'Tabla con ruedas y trucos en movimiento.' },
      { word: 'Pintura', hint: 'Lienzos, pinceles y manchas creativas.' },
      { word: 'Puzzle', hint: 'Piezas encajando para revelar una imagen.' },
      { word: 'Escape room', hint: 'Enigmas, candados y reloj contando.' }
    ]
  },
  {
    id: 'technology',
    name: 'Tecnología',
    icon: '💡',
    description: 'Inventos, gadgets y palabras futuristas.',
    words: [
      { word: 'Robot', hint: 'Puede tener sensores, servos y obedecer instrucciones.' },
      { word: 'Dron', hint: 'Vuela con hélices y graba desde el aire.' },
      { word: 'Algoritmo', hint: 'Secuencia lógica que resuelve problemas paso a paso.' },
      { word: 'Impresora 3D', hint: 'Capa a capa crea objetos tangibles.' },
      { word: 'Nube', hint: 'Almacena archivos sin ocupar espacio físico.' },
      { word: 'Realidad virtual', hint: 'Gafas puestas y estás en otro mundo.' },
      { word: 'Código QR', hint: 'Cuadrícula pixelada que abre enlaces al instante.' },
      { word: 'Batería', hint: 'Fuente de energía que se agota y se recarga.' },
      { word: 'Antena', hint: 'Captura señales invisibles para transmitir datos.' },
      { word: 'Firewall', hint: 'Muralla digital que protege redes.' }
    ]
  },
  {
    id: 'costa-rica',
    name: 'Costa Rica',
    icon: '🌴',
    description: 'Expresiones, sabores y paisajes ticos.',
    words: [
      { word: 'Pura Vida', hint: 'Saludo optimista que sirve para casi todo.' },
      { word: 'Gallo Pinto', hint: 'Desayuno con arroz, frijoles y natilla.' },
      { word: 'Imperial', hint: 'Cerveza dorada con águila orgullosa.' },
      { word: 'Sarchí', hint: 'Carretas coloridas y artesanía tradicional.' },
      { word: 'Arenal', hint: 'Volcán perfecto para termales y aventuras.' },
      { word: 'Caribe Sur', hint: 'Playas de arena oscura y ritmo calipso.' },
      { word: 'Café chorreador', hint: 'Método tradicional para preparar la bebida nacional.' },
      { word: 'Perezoso', hint: 'Animal tranquilo que abraza las ramas.' },
      { word: 'Casado', hint: 'Plato completo con arroz, frijoles y plátano maduro.' },
      { word: 'Celeste', hint: 'Color que viste a la selección nacional.' }
    ]
  }
];

export const getTopicById = (topicId) => TOPICS.find((topic) => topic.id === topicId);
