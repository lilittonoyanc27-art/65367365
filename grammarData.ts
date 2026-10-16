import { GrammarItem } from './types';

export const GRAMMAR_LESSONS: GrammarItem[] = [
  {
    id: 'gram_gerundio',
    title: 'Герундий (Gerundio) и конструкция «ir + gerundio»',
    subtitle: 'Постепенное развитие действия во времени и слитное написание местоимений',
    level: 'A2 — B1',
    rule: 'Герундий в испанском образуется при помощи суффиксов -ando (для глаголов на -ar: alejando, dejando) и -iendo (для глаголов на -er/-ir: yendo от ir). В сочетании с глаголом ir он выражает постепенное, плавное нарастание или угасание действия.',
    explanation: 'В тексте песни Наталия использует эту конструкцию дважды, чтобы показать движение времени и чувств: когда она уезжала из Монтевидео («me fui alejando») и когда её слезы постепенно высохли («se fueron yendo»). Обратите внимание: когда к герундию присоединяется местоимение («dejando + lo»), оно пишется слитно, а на ударный слог ставится графическое ударение: dejándolo!',
    examples: [
      {
        es: 'Me fui alejando con lágrimas en los ojos.',
        ru: 'Я уезжала всё дальше и дальше со слезами на глазах.',
        highlight: 'fui alejando',
        explanation: '«ir + gerundio» показывает процесс постепенного удаления от родного дома.',
      },
      {
        es: 'Las lágrimas se fueron yendo.',
        ru: 'Слёзы постепенно уходили (исчезали).',
        highlight: 'fueron yendo',
        explanation: 'Действие происходит не в одну секунду, а шаг за шагом.',
      },
      {
        es: 'Dejándolo todo por mis fantasías.',
        ru: 'Оставляя всё ради своих мечтаний.',
        highlight: 'Dejándolo',
        explanation: 'Местоимение «lo» (всё это) присоединилось в конец герундия: de-JÁN-do-lo (ставится графический акцент).',
      },
    ],
  },
  {
    id: 'gram_indefinido_vs_imperfecto',
    title: 'Pretérito Indefinido vs Imperfecto',
    subtitle: 'Как Наталия рассказывает историю своего переезда в Буэнос-Айрес',
    level: 'A2',
    rule: 'Pretérito Indefinido обозначает завершенные факты и ключевые шаги (fui, viví, fue, volé), а Pretérito Imperfecto описывает фон, возраст и постоянные характеристики в прошлом (era una niña).',
    explanation: 'Песня представляет собой автобиографический монолог. Наталия уехала из родного Уругвая в Аргентину в подростковом возрасте, чтобы стать актрисой и певицей. Она использует Indefinido для ключевых решений: «viví lo duro que fue» (я пережила это), «volé por tantos caminos» (я облетела столько дорог), и Imperfecto для воспоминания о детстве: «cuando era una niña».',
    examples: [
      {
        es: 'Cuando era una niña...',
        ru: 'Когда я была ребёнком...',
        highlight: 'era',
        explanation: 'Imperfecto: описание возраста и фона в прошлом.',
      },
      {
        es: 'Viví lo duro que fue dejar todo atrás.',
        ru: 'Я пережила, как тяжело было оставить всё позади.',
        highlight: 'Viví / fue',
        explanation: 'Indefinido: конкретные пережитые жизненные этапы.',
      },
      {
        es: 'Volé por tantos caminos.',
        ru: 'Я пролетела по стольким дорогам.',
        highlight: 'Volé',
        explanation: 'Indefinido (volar -> yo volé): совершенное действие.',
      },
    ],
  },
  {
    id: 'gram_expresiones',
    title: 'Золотые идиомы и речевые обороты',
    subtitle: 'Выражения, которые сделают вашу испанскую речь живой и естественной',
    level: 'A1 — B2',
    rule: 'Идиомы не переводятся дословно. Запомните их как цельные разговорные блоки.',
    explanation: 'Песня полна выразительных фразеологизмов, которые носители испанского используют ежедневно в Рио-де-ла-Плата и по всему испаноязычному миру.',
    examples: [
      {
        es: '¡Vale la pena luchar por un sueño!',
        ru: 'Стоит того бороться за мечту!',
        highlight: 'Vale la pena',
        explanation: '«valer la pena» = стоить усилий. Очень частая конструкция: «¿Vale la pena?» (Оно того стоит?).',
      },
      {
        es: 'Con mi sueño a cuestas.',
        ru: 'С мечтой за плечами (неся её с собой).',
        highlight: 'a cuestas',
        explanation: '«llevar algo a cuestas» = нести что-то на своих плечах или спине.',
      },
      {
        es: 'Y sin darme cuenta casi toco el cielo.',
        ru: 'И сама того не замечая, почти коснулась неба.',
        highlight: 'sin darme cuenta',
        explanation: '«darse cuenta de» = понимать, замечать. «sin darse cuenta» = незаметно для себя.',
      },
      {
        es: 'Viví lo duro que fue...',
        ru: 'Я пережила, как (насколько) тяжело это было...',
        highlight: 'lo duro que',
        explanation: 'Конструкция «lo + прилагательное + que» усиливает степень признака: «lo difícil que es» (как это трудно), «lo bueno que fue» (как это было здорово).',
      },
    ],
  },
  {
    id: 'gram_subjuntivo_deseo',
    title: 'Субхунтив в пожеланиях и эмоциях',
    subtitle: '«¡Que viva el candombe!» — почему здесь стоит форма «viva», а не «vive»?',
    level: 'B1',
    rule: 'После скрытого или явного пожелания (desear, esperar, querer) с союзом que употребляется Modo Subjuntivo.',
    explanation: 'Фраза «¡Que viva el candombe!» — это классическая формула тоста и восклицания (полная конструкция: «¡[Deseo / Quiero] que viva el candombe!»). Глагол vivir меняет гласную с «e» на «a» в сослагательном наклонении 3-го лица: él/ella viva.',
    examples: [
      {
        es: '¡Que viva el candombe de sangre caliente!',
        ru: 'Да здравствует кандомбе, полный горячей крови!',
        highlight: 'Que viva',
        explanation: 'Subjuntivo глагола vivir в значении пламенного пожелания долгой жизни и процветания традиции.',
      },
      {
        es: '¡Que tengas un buen día!',
        ru: 'Хорошего тебе дня!',
        highlight: 'Que tengas',
        explanation: 'Аналогичная повседневная конструкция пожелания с Subjuntivo.',
      },
    ],
  },
];
