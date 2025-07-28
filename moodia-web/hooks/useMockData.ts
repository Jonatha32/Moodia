'use client';

import { Post } from '@/types';

const mockUsers = [
  { id: 'user1', name: 'Ana García', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
  { id: 'user2', name: 'Carlos López', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { id: 'user3', name: 'María Rodríguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { id: 'user4', name: 'Diego Martín', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  { id: 'user5', name: 'Sofía Chen', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
  { id: 'user6', name: 'Alejandro Ruiz', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
];

const mockPostsByMood: Record<string, Post[]> = {
  focus: [
    {
      id: 'f1', userId: 'user3', userName: 'María Rodríguez', userAvatar: mockUsers[2].avatar,
      title: 'Deep Work Session', description: '4 horas de programación pura. Sin distracciones, solo código y café. La concentración profunda es un arte que requiere práctica constante.',
      mood: 'focus', imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=600&fit=crop',
      reactions: { love: ['user1'], support: ['user2'], helpful: [], inspiring: ['user4'], learned: [], share: [] },
      createdAt: new Date(), context: 'La concentración es mi superpoder'
    },
    {
      id: 'f2', userId: 'user1', userName: 'Ana García', userAvatar: mockUsers[0].avatar,
      title: 'Estudiando para el examen', description: 'Técnica Pomodoro funcionando perfectamente. 25 min estudio, 5 min descanso. Mi mente está más clara que nunca.',
      mood: 'focus', imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=600&fit=crop',
      reactions: { love: [], support: ['user3'], helpful: ['user2'], inspiring: [], learned: ['user4'], share: [] },
      createdAt: new Date(), context: 'Cada minuto cuenta hacia mi meta'
    },
    {
      id: 'f3', userId: 'user4', userName: 'Diego Martín', userAvatar: mockUsers[3].avatar,
      title: 'Sesión de escritura matutina', description: 'Levantarme a las 5 AM para escribir ha cambiado mi vida. La quietud de la mañana alimenta mi creatividad de formas increíbles.',
      mood: 'focus', imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=600&fit=crop',
      reactions: { love: ['user1', 'user2'], support: ['user3'], helpful: ['user5'], inspiring: ['user6'], learned: [], share: ['user1'] },
      createdAt: new Date(), context: 'Las mañanas son sagradas para mi proceso creativo'
    },
    {
      id: 'f4', userId: 'user6', userName: 'Alejandro Ruiz', userAvatar: mockUsers[5].avatar,
      title: 'Preparando mi tesis', description: 'Mes 6 de investigación intensiva. Cada día descubro algo nuevo que me acerca más a mi objetivo. La disciplina se vuelve adicción.',
      mood: 'focus', imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
      reactions: { love: ['user2'], support: ['user1', 'user3', 'user4'], helpful: ['user5'], inspiring: ['user2'], learned: ['user1'], share: [] },
      createdAt: new Date(), context: 'Mi futuro se construye con cada página que escribo'
    }
  ],
  creative: [
    {
      id: 'c1', userId: 'user2', userName: 'Carlos López', userAvatar: mockUsers[1].avatar,
      title: 'Arte digital experimental', description: 'Mezclando técnicas tradicionales con herramientas digitales. Cada trazo cuenta una historia diferente. El proceso creativo me tiene completamente absorto.',
      mood: 'creative', imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
      reactions: { love: ['user1', 'user3'], support: [], helpful: [], inspiring: ['user4'], learned: [], share: ['user1'] },
      createdAt: new Date(), context: 'El arte es mi lenguaje universal'
    },
    {
      id: 'c2', userId: 'user5', userName: 'Sofía Chen', userAvatar: mockUsers[4].avatar,
      title: 'Escribiendo mi primera novela', description: 'Capítulo 3 terminado. Los personajes cobran vida propia en mi mente. Es increíble cómo las palabras se convierten en mundos enteros.',
      mood: 'creative', imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=600&fit=crop',
      reactions: { love: ['user2'], support: ['user1', 'user3'], helpful: [], inspiring: ['user4'], learned: [], share: [] },
      createdAt: new Date(), context: 'Cada palabra es un paso hacia mi sueño'
    },
    {
      id: 'c3', userId: 'user1', userName: 'Ana García', userAvatar: mockUsers[0].avatar,
      title: 'Sesión de pintura nocturna', description: 'La noche despierta mi lado más creativo. Los colores fluyen de manera diferente cuando el mundo duerme. Esta obra habla de libertad.',
      mood: 'creative', imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=600&fit=crop',
      reactions: { love: ['user2', 'user4'], support: ['user3'], helpful: [], inspiring: ['user5', 'user6'], learned: [], share: ['user2'] },
      createdAt: new Date(), context: 'El arte nocturno tiene una magia especial'
    },
    {
      id: 'c4', userId: 'user3', userName: 'María Rodríguez', userAvatar: mockUsers[2].avatar,
      title: 'Diseñando mi app soñada', description: 'Llevaba meses con esta idea en la cabeza. Finalmente los wireframes están tomando forma. La creatividad y la tecnología se fusionan perfectamente.',
      mood: 'creative', imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=600&fit=crop',
      reactions: { love: ['user1'], support: ['user2', 'user4'], helpful: ['user5'], inspiring: ['user6'], learned: ['user2'], share: ['user1'] },
      createdAt: new Date(), context: 'Transformar ideas en realidad es mi pasión'
    }
  ],
  explorer: [
    {
      id: 'e1', userId: 'user4', userName: 'Diego Martín', userAvatar: mockUsers[3].avatar,
      title: 'Descubriendo senderos ocultos', description: 'Nueva ruta de hiking encontrada. La naturaleza siempre tiene secretos por revelar. Cada sendero es una metáfora de la vida.',
      mood: 'explorer', imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=600&fit=crop',
      reactions: { love: ['user1'], support: [], helpful: ['user3'], inspiring: ['user2', 'user5'], learned: [], share: ['user1'] },
      createdAt: new Date(), context: 'Cada paso es una nueva aventura'
    },
    {
      id: 'e2', userId: 'user6', userName: 'Alejandro Ruiz', userAvatar: mockUsers[5].avatar,
      title: 'Probando cocina tailandesa', description: 'Primera vez haciendo Pad Thai desde cero. Los sabores son una explosión. Cocinar es explorar culturas desde la cocina.',
      mood: 'explorer', imageUrl: 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=400&h=600&fit=crop',
      reactions: { love: ['user2'], support: [], helpful: [], inspiring: [], learned: ['user1', 'user3'], share: [] },
      createdAt: new Date(), context: 'La cocina es mi laboratorio de sabores'
    },
    {
      id: 'e3', userId: 'user1', userName: 'Ana García', userAvatar: mockUsers[0].avatar,
      title: 'Explorando barrios desconocidos', description: 'Perderse en la ciudad es encontrarse a uno mismo. Hoy descubrí un café increíble en un callejón que nunca había visto.',
      mood: 'explorer', imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=600&fit=crop',
      reactions: { love: ['user2', 'user3'], support: ['user4'], helpful: ['user5'], inspiring: ['user6'], learned: [], share: ['user2'] },
      createdAt: new Date(), context: 'La curiosidad es mi brújula personal'
    },
    {
      id: 'e4', userId: 'user3', userName: 'María Rodríguez', userAvatar: mockUsers[2].avatar,
      title: 'Aprendiendo un nuevo idioma', description: 'Semana 3 de japonés. Cada kanji es un pequeño universo por descubrir. Mi cerebro se expande con cada nueva palabra.',
      mood: 'explorer', imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&h=600&fit=crop',
      reactions: { love: ['user1'], support: ['user2', 'user4'], helpful: ['user5', 'user6'], inspiring: ['user1'], learned: ['user2', 'user4'], share: [] },
      createdAt: new Date(), context: 'Cada idioma es una nueva forma de ver el mundo'
    }
  ],
  reflective: [
    {
      id: 'r1', userId: 'user1', userName: 'Ana García', userAvatar: mockUsers[0].avatar,
      title: 'Meditación matutina', description: '20 minutos de silencio que transformaron mi día. La paz interior es real. En el silencio encuentro respuestas que el ruido oculta.',
      mood: 'reflective', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      reactions: { love: ['user3'], support: ['user2'], helpful: [], inspiring: ['user4', 'user5'], learned: [], share: [] },
      createdAt: new Date(), context: 'El silencio habla más que mil palabras'
    },
    {
      id: 'r2', userId: 'user3', userName: 'María Rodríguez', userAvatar: mockUsers[2].avatar,
      title: 'Reflexiones sobre el crecimiento', description: 'Un año atrás no me imaginaba donde estoy hoy. El cambio es la única constante. Cada experiencia me ha moldeado.',
      mood: 'reflective', imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=600&fit=crop',
      reactions: { love: ['user1', 'user2'], support: ['user4'], helpful: [], inspiring: ['user5'], learned: [], share: [] },
      createdAt: new Date(), context: 'Mirando hacia atrás para avanzar mejor'
    },
    {
      id: 'r3', userId: 'user5', userName: 'Sofía Chen', userAvatar: mockUsers[4].avatar,
      title: 'Escribiendo en mi diario', description: 'Las páginas de mi diario son testigos de mi evolución. Cada entrada es un diálogo conmigo misma. La escritura sana.',
      mood: 'reflective', imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=600&fit=crop',
      reactions: { love: ['user1', 'user6'], support: ['user2', 'user3'], helpful: ['user4'], inspiring: ['user1', 'user2'], learned: ['user3'], share: ['user4'] },
      createdAt: new Date(), context: 'Escribir es mi forma de autoconocimiento'
    },
    {
      id: 'r4', userId: 'user2', userName: 'Carlos López', userAvatar: mockUsers[1].avatar,
      title: 'Contemplando las estrellas', description: 'La inmensidad del universo pone todo en perspectiva. Somos pequeños, pero nuestros sueños pueden ser infinitos.',
      mood: 'reflective', imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
      reactions: { love: ['user3', 'user4'], support: ['user1'], helpful: [], inspiring: ['user5', 'user6'], learned: ['user1'], share: ['user3'] },
      createdAt: new Date(), context: 'Las estrellas me recuerdan lo mágico que es existir'
    }
  ],
  chill: [
    {
      id: 'ch1', userId: 'user5', userName: 'Sofía Chen', userAvatar: mockUsers[4].avatar,
      title: 'Tarde de lluvia y café', description: 'Libro, manta, lluvia en la ventana. La felicidad está en los momentos simples. No necesito más que esto para sentirme completa.',
      mood: 'chill', imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
      reactions: { love: ['user1', 'user2'], support: [], helpful: [], inspiring: ['user3'], learned: [], share: [] },
      createdAt: new Date(), context: 'Los momentos lentos son los más valiosos'
    },
    {
      id: 'ch2', userId: 'user2', userName: 'Carlos López', userAvatar: mockUsers[1].avatar,
      title: 'Playlist perfecta encontrada', description: 'Música lo-fi que acompaña perfectamente este domingo relajado. Cada nota me transporta a un estado de paz total.',
      mood: 'chill', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
      reactions: { love: ['user4'], support: [], helpful: [], inspiring: [], learned: [], share: ['user1', 'user3'] },
      createdAt: new Date(), context: 'La música es el soundtrack de mi alma'
    },
    {
      id: 'ch3', userId: 'user4', userName: 'Diego Martín', userAvatar: mockUsers[3].avatar,
      title: 'Atardecer desde mi balcón', description: 'No hay prisa, no hay agenda. Solo yo, una taza de té y este cielo que se pinta de colores. La vida puede ser muy simple.',
      mood: 'chill', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      reactions: { love: ['user1', 'user5'], support: ['user2'], helpful: [], inspiring: ['user3', 'user6'], learned: [], share: ['user5'] },
      createdAt: new Date(), context: 'A veces parar es la mejor decisión'
    }
  ],
  relax: [
    {
      id: 'rel1', userId: 'user6', userName: 'Alejandro Ruiz', userAvatar: mockUsers[5].avatar,
      title: 'Día de spa casero', description: 'Mascarilla facial, baño relajante, velas aromáticas. El autocuidado es prioridad. Mi cuerpo y mente merecen este descanso.',
      mood: 'relax', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
      reactions: { love: ['user1'], support: ['user2', 'user3'], helpful: [], inspiring: ['user5'], learned: [], share: [] },
      createdAt: new Date(), context: 'Cuidarme es un acto de amor propio'
    },
    {
      id: 'rel2', userId: 'user1', userName: 'Ana García', userAvatar: mockUsers[0].avatar,
      title: 'Sesión de yoga matutina', description: 'Empezar el día conectando con mi respiración. Cada postura es una conversación silenciosa conmigo misma.',
      mood: 'relax', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      reactions: { love: ['user2', 'user5'], support: ['user3', 'user4'], helpful: ['user6'], inspiring: ['user2'], learned: [], share: ['user3'] },
      createdAt: new Date(), context: 'El yoga es mi medicina diaria'
    },
    {
      id: 'rel3', userId: 'user3', userName: 'María Rodríguez', userAvatar: mockUsers[2].avatar,
      title: 'Desconectando del mundo digital', description: 'Teléfono en modo avión, laptop cerrada. Solo yo y mis pensamientos. La paz mental no tiene precio.',
      mood: 'relax', imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=600&fit=crop',
      reactions: { love: ['user1', 'user4'], support: ['user2', 'user5'], helpful: ['user6'], inspiring: ['user1', 'user5'], learned: ['user2'], share: [] },
      createdAt: new Date(), context: 'A veces la mejor conexión es la desconexión'
    }
  ],
  motivated: [
    {
      id: 'm1', userId: 'user6', userName: 'Alejandro Ruiz', userAvatar: mockUsers[5].avatar,
      title: 'Nuevo récord personal', description: '150kg en peso muerto. Cada día más fuerte, cada día más disciplinado. La mente es el músculo más importante que entreno.',
      mood: 'motivated', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop',
      reactions: { love: ['user2'], support: ['user1', 'user3', 'user4'], helpful: [], inspiring: ['user5'], learned: [], share: [] },
      createdAt: new Date(), context: 'Los límites solo existen en la mente'
    },
    {
      id: 'm2', userId: 'user4', userName: 'Diego Martín', userAvatar: mockUsers[3].avatar,
      title: 'Maratón completada', description: '42km de pura determinación. Cada kilómetro fue una lección de resistencia mental. Cruzar la meta fue cruzar mis propios límites.',
      mood: 'motivated', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=600&fit=crop',
      reactions: { love: ['user1', 'user2'], support: ['user3', 'user5'], helpful: [], inspiring: ['user6'], learned: [], share: [] },
      createdAt: new Date(), context: 'Corriendo hacia mis sueños, literalmente'
    },
    {
      id: 'm3', userId: 'user2', userName: 'Carlos López', userAvatar: mockUsers[1].avatar,
      title: 'Lanzando mi startup', description: 'Después de 2 años de desarrollo, finalmente estamos listos. El miedo y la emoción se mezclan, pero la determinación es más fuerte.',
      mood: 'motivated', imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=600&fit=crop',
      reactions: { love: ['user1', 'user3'], support: ['user4', 'user5', 'user6'], helpful: ['user1'], inspiring: ['user3', 'user4'], learned: [], share: ['user5'] },
      createdAt: new Date(), context: 'Es hora de convertir los sueños en realidad'
    },
    {
      id: 'm4', userId: 'user5', userName: 'Sofía Chen', userAvatar: mockUsers[4].avatar,
      title: 'Superando mis miedos', description: 'Hoy hablé en público por primera vez. Las manos me temblaban, pero mi voz sonó firme. Cada miedo vencido es una victoria personal.',
      mood: 'motivated', imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=600&fit=crop',
      reactions: { love: ['user1', 'user2', 'user6'], support: ['user3', 'user4'], helpful: [], inspiring: ['user1', 'user6'], learned: ['user3'], share: [] },
      createdAt: new Date(), context: 'El crecimiento está del otro lado del miedo'
    }
  ]
};

export function useMockData() {
  const getPostsByMood = (mood: string) => {
    return mockPostsByMood[mood] || [];
  };

  const getAllPosts = () => {
    return Object.values(mockPostsByMood).flat();
  };

  const getRandomPosts = (count: number = 10) => {
    const allPosts = getAllPosts();
    return allPosts.sort(() => Math.random() - 0.5).slice(0, count);
  };

  return {
    getPostsByMood,
    getAllPosts,
    getRandomPosts,
    mockUsers
  };
}