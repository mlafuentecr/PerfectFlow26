import { BREATH_BACKGROUNDS } from './breathingPrefs';
import { Language } from './i18n';

export type LearnItem = {
  id: string;
  title: string;
  backgroundKey: (typeof BREATH_BACKGROUNDS)[number]['key'];
  content: string;
};

type LearnJson = { items: LearnItem[] };

const data = require('../assets/data/learn.json') as LearnJson;

export const LEARN_ITEMS: LearnItem[] = data.items;

export const getLearnItemById = (id: string) => LEARN_ITEMS.find((item) => item.id === id);

export const getLearnItemImage = (backgroundKey: LearnItem['backgroundKey']) => {
  return BREATH_BACKGROUNDS.find((b) => b.key === backgroundKey)?.src ?? BREATH_BACKGROUNDS[0].src;
};

export const getWordCount = (text: string) => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export const getExcerpt = (text: string, max = 120) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}...`;
};

const LEARN_COPY_ES: Record<string, { title: string; excerpt: string }> = {
  'understanding-stress': {
    title: 'Entender el estrés',
    excerpt: 'El estrés es una alarma natural del cuerpo. Si se mantiene activo por mucho tiempo, agota mente y cuerpo.',
  },
  'what-is-anxiety': {
    title: '¿Qué es la ansiedad?',
    excerpt: 'La ansiedad anticipa peligro antes de que ocurra. Respirar lento ayuda a recuperar control y presencia.',
  },
  'power-of-breath': {
    title: 'El poder de la respiración',
    excerpt: 'Tu respiración es el puente más rápido entre mente y cuerpo. Un ritmo estable mejora claridad y equilibrio emocional.',
  },
  'sleep-and-nervous-system': {
    title: 'Sueño y sistema nervioso',
    excerpt: 'Si tu mente sigue en alerta por la noche, una respiración suave puede ayudarte a pasar de activación a descanso.',
  },
  'focus-with-breath': {
    title: 'Enfoque con respiración',
    excerpt: 'Antes de estudiar o trabajar, unos minutos de respiración estructurada reducen ruido mental y mejoran concentración.',
  },
  'anger-regulation': {
    title: 'Regulación del enojo',
    excerpt: 'Cuando hay enojo, primero regula el cuerpo. Respirar con ritmo crea espacio entre impulso y acción.',
  },
  'panic-reset': {
    title: 'Reinicio del pánico',
    excerpt: 'En pánico, menos es más: exhala más largo que inhalas y usa señales simples de seguridad para estabilizarte.',
  },
  'confidence-state': {
    title: 'Respiración y confianza',
    excerpt: 'La confianza también es un estado corporal. Respirar con estructura antes de un reto mejora calma y presencia.',
  },
  'sadness-support': {
    title: 'Apoyo para la tristeza',
    excerpt: 'En tristeza, elige ritmos suaves. La respiración coherente puede darte contención sin bloquear la emoción.',
  },
  'low-energy-reset': {
    title: 'Reinicio de energía baja',
    excerpt: 'Cuando falta energía, una secuencia corta y controlada puede aumentar alerta sin perder estabilidad.',
  },
};

const LEARN_CONTENT_ES: Record<string, string> = {
  'understanding-stress':
    'El estrés es el sistema de alarma natural de tu cuerpo. Puede ayudarte a reaccionar rápido ante un peligro real, pero cuando permanece activo demasiado tiempo puede agotar tu mente y tu cuerpo. Las señales de estrés crónico incluyen respiración superficial, tensión muscular, mal sueño, irritabilidad y ruido mental constante. Una forma práctica de interrumpir el estrés es hacer más lenta tu respiración, especialmente la exhalación. Las exhalaciones largas le indican a tu sistema nervioso que estás a salvo y que puede calmarse. Empieza con dos minutos inhalando 4 segundos y exhalando 6 segundos. Mantén los hombros suaves y la mandíbula relajada. La constancia importa más que la intensidad: una práctica corta diaria construye resiliencia emocional real con el tiempo.',
  'what-is-anxiety':
    'La ansiedad es un estado orientado al futuro en el que tu cerebro predice peligro antes de que ocurra. Suele aparecer como pensamientos acelerados, presión en el pecho, inquietud y una fuerte necesidad de certeza. La ansiedad no es debilidad; es un sistema de protección trabajando de más. La respiración ayuda porque cambia tu atención de escenarios imaginados a sensaciones reales del cuerpo. El patrón 4-7-8 es especialmente útil porque reduce el ritmo y promueve una sensación de control. Si tu ansiedad está alta, mantenlo simple: coloca una mano en el pecho, otra en el abdomen y sigue solo tres rondas lentas. Con el tiempo, tu cuerpo aprende que la calma es accesible y repetible.',
  'power-of-breath':
    'La respiración es el puente más rápido entre el cuerpo y la mente. No siempre puedes controlar tus pensamientos de inmediato, pero sí puedes influir en tu respiración. Respirar rápido y superficialmente puede aumentar la química del estrés. Respirar lento y estable puede mejorar la estabilidad emocional y la claridad mental. La respiración coherente, alrededor de cinco segundos al inhalar y cinco al exhalar, ayuda a regular el ritmo cardíaco y favorece el enfoque. Por eso muchas personas de alto rendimiento usan la respiración antes de presentaciones, los atletas antes de competir y los terapeutas en técnicas de grounding. La meta no es una técnica perfecta. La meta es un ritmo repetible en el que puedas confiar en momentos reales.',
  'sleep-and-nervous-system':
    'Si tu mente sigue activa por la noche, es posible que tu sistema nervioso todavía esté en modo de alerta. La respiración puede ayudar a pasar de la activación al descanso. Antes de dormir, reduce la estimulación, baja las luces y elige una secuencia suave como 4-7-8 o inhalar 4 y exhalar 6. Mantén un ritmo cómodo y evita forzar respiraciones profundas. Puedes acompañarlo con una frase simple como: "Inhalo calma, exhalo tensión". Practicar entre cinco y diez minutos puede reducir la tensión física y ayudarte a conciliar el sueño. Dormir mejor luego mejora la regulación emocional al día siguiente, creando un ciclo positivo.',
  'focus-with-breath':
    'El enfoque no consiste en forzar la atención; consiste en reducir el ruido interno. Antes de trabajar o estudiar, usa de uno a tres minutos de Box Breathing: inhalar 4, sostener 4, exhalar 4, sostener 4. La estructura ayuda a organizar la atención y reduce el cambio mental impulsivo. Si sostener el aire se siente incómodo, acorta la pausa y mantén el ritmo estable. También puedes usar respiración coherente para tareas que requieren resistencia. Los pequeños rituales antes de una tarea entrenan a tu cerebro para entrar en un estado de enfoque más rápido. La clave es la constancia: misma señal, mismo patrón de respiración, mismo inicio.',
  'anger-regulation':
    'El enojo suele venir acompañado de calor, presión y urgencia. En ese estado, intentar razonar de inmediato puede ser difícil. Primero regula la fisiología y luego responde. Box Breathing ofrece una secuencia clara que puede reducir la reactividad y devolverte control. Otra opción útil es inhalar 4 y exhalar 6 para alargar la fase de liberación. Mantén una postura firme y relaja tus manos y mandíbula mientras respiras. Después de uno o dos minutos, es posible que notes más espacio entre el impulso y la acción. Ese espacio es donde ocurren mejores decisiones.',
  'panic-reset':
    'Durante el pánico, la meta es seguridad y simplicidad. Evita instrucciones complejas. Empieza con una exhalación más lenta que la inhalación: inhala 4, exhala 6. Mantén la respiración suave, no máxima. Nombra cinco cosas que puedas ver y mantén una mano sobre el pecho para darte grounding. Si contar se vuelve difícil, repite solamente "exhalación larga" y sigue tu propio ritmo. El pánico sube y baja; tu respiración ayuda a acortar el pico y a reducir el miedo a la sensación. Después de que pase la ola, continúa con un minuto de respiración estable para estabilizarte.',
  'confidence-state':
    'La confianza también es, en parte, un estado corporal. Cuando tu respiración está caótica, tu mente suele interpretar el momento como amenaza. Respirar con estructura antes de eventos importantes puede crear firmeza. Prueba Box Breathing durante dos minutos antes de una reunión, entrevista o presentación. Mantén la columna erguida y la exhalación controlada. No se trata de fingir calma; se trata de crear soporte fisiológico para pensar con claridad y estar presente. La confianza crece cuando tu cuerpo aprende: "Puedo volver a mi centro a propósito".',
  'sadness-support':
    'La tristeza puede sentirse pesada y lenta. En esos momentos, elige ritmos suaves en lugar de técnicas intensas. La respiración coherente suele funcionar bien: inhala 5, exhala 5 durante algunos minutos. Puedes añadir frases de autocompasión durante la exhalación, como "Estoy aquí" o "Esto también puede moverse". La intención no es suprimir la emoción, sino crear seguridad mientras la sientes. La respiración puede dar estructura cuando las emociones se sienten difusas. Con la repetición, esto se convierte en un ancla emocional confiable.',
  'low-energy-reset':
    'Cuando la energía está baja, una secuencia corta de respiración activa puede mejorar tu estado de alerta. Usa un estilo suave de Wim Hof: inhalación y exhalación controladas a un ritmo moderado durante 30 a 45 segundos y luego recuperación con respiración normal. Hazlo con suavidad y evita hiperventilar. Detente si sientes mareo o incomodidad. Esto funciona mejor como reinicio durante el día, no justo antes de dormir. Después, sigue con un minuto de respiración calmada para integrar. La meta es energía estable y utilizable, no intensidad.',
};

export const getLearnCardCopy = (item: LearnItem, language: Language) => {
  if (language !== 'es') {
    return { title: item.title, excerpt: getExcerpt(item.content, 120) };
  }

  const localized = LEARN_COPY_ES[item.id];
  if (!localized) {
    return { title: item.title, excerpt: getExcerpt(item.content, 120) };
  }

  return localized;
};

export const getLocalizedLearnItem = (item: LearnItem, language: Language): LearnItem => {
  if (language !== 'es') return item;

  const localizedCopy = LEARN_COPY_ES[item.id];
  const localizedContent = LEARN_CONTENT_ES[item.id];

  return {
    ...item,
    title: localizedCopy?.title ?? item.title,
    content: localizedContent ?? item.content,
  };
};
