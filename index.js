// ============================================================================
// Pocket Familiar — Interactive Tamagotchi & Quote Collector for SillyTavern
// ============================================================================

(function () {
  'use strict';

  const EXT_KEY = 'pocket_familiar';

  const DEFAULT_SETTINGS = {
    enabled: true,
    species: 'fox', // 'fox' | 'bunny'
    customName: '',
    autoSnatch: true,
    snatchChance: 0.55,
    rescueSwipes: true,
    nightMode: true,
    idleReminder: true,
    idleSeconds: 50,
    hunger: 78,
    position: null, // { left, top }
    customSprites: {
      foxIdle: '',
      foxHappy: '',
      foxSassy: '',
      foxSleep: '',
      bunnyIdle: '',
      bunnyHappy: '',
      bunnySassy: '',
      bunnySleep: '',
    },
    quotes: [],
  };

  const FAMILIAR_PROFILES = {
    fox: {
      defaultName: 'Лисёнок',
      icon: '🦊',
      tasteLabel: 'остренькое, интриги и сарказм',
      favMoods: ['sarcasm', 'action', 'spicy'],
      lines: {
        tap: [
          'Чё ты смотришь? Не мешай мне.',
          'Руки убрали от ушей! Они не казённые.',
          'Я вообще-то чат читаю, не отвлекай.',
          'Ты чего тыкаешь? Цитату принесла или просто так?',
          'Смотрит она… лучше сюжет двигай!',
          'Фырк. Ну чего тебе?',
        ],
        spamTap: [
          'Всё, достала тыкать! Разговаривай с моим хвостом.',
          'Ещё раз ткнёшь — укушу за палец, я серьёзно!',
          'Официально объявляю бойкот на десять секунд.',
        ],
        idle: [
          'Чё молчим? Идеи закончились?',
          'Алло, приём! Бот там уже мхом покрылся ждать ответ.',
          'Зависла? Давай хоть какую-нибудь дерзость ляпнем!',
          'Тишина в эфире… муза в отпуск ушла?',
        ],
        erased: [
          'Опять три часа одно слово рожаем?',
          'Эй, ну нормальная же фраза была, зачем стёрла?!',
          'Перфекционизм включился? Пиши как чувствуешь!',
        ],
        wallOfText: [
          'Ого, ты там роман в трёх томах катаешь?',
          'Ничего себе простыня… нейронка сейчас офигеет.',
        ],
        swipes: [
          'Пятый дубль пошёл… тебе вообще хоть что-то нравится?',
          'Свайп, свайп, свайп… капризная какая сегодня!',
          'Опять не то? А мне прошлый вариант почти зашёл.',
        ],
        swipeRescue: [
          'Ты там свайпнула, но вот эту строчку я из мусорки вытащил. Не благодари!',
          'Дубль в утиль, а фразочку я прихватил. Жалко же добро терять!',
        ],
        snatch: [
          'Опа! Вот это красиво сказано, утащил в норку.',
          'Так-так, эту строчку я себе забираю.',
          'Хорош диалог! Спрятал в заначку.',
          'Цап! Моя цитата теперь.',
        ],
        feed: [
          'М-м-м, остренько! Прямо в золотой фонд.',
          'Ладно, признаю — это реально сильно. Забираю!',
          'Вкуснота! Приноси ещё такие кусочки.',
        ],
        hungry: [
          'Скучновато идём… дай хоть один скандал пожевать!',
          'У меня литературный голод! Где интриги? Где искра?!',
          'Сейчас рамку чата сгрызу от скуки, подкинь огня!',
        ],
        genSlow: [
          'Эй, нейронка, алло! Мы тут вечность ждём!',
          'Тыкаю сервер палочкой… кажется, он задумался.',
        ],
        night: [
          'Ночь на дворе вообще-то. Иди спать, графоманка, завтра допишешь!',
          'Глаза слипаются… только не говори, что опять до утра ролить будем.',
        ],
        nostalgia: [
          'Смотри, чё у себя в норке откопал! Красиво же было, а?',
          'Разбирал запасы и нашёл этот шедевр. Помнишь сцену?',
        ],
        deleteQuote: [
          'Эй! Я это вообще-то копил!',
          'Моё сокровище выкинула… ну и ладно, новое натаскаю.',
        ],
        moods: {
          angst: 'Опять стекло жуём? Ладно, двигайся, погрею хвостом.',
          spicy: 'О-о-о, пошла жара… я типа отвернулся (нет).',
          action: 'О, махач или разборки! Я за попкорном!',
        },
      },
    },
    bunny: {
      defaultName: 'Зайчонок',
      icon: '🐰',
      tasteLabel: 'драма, стёклышко и нежность',
      favMoods: ['angst', 'cozy', 'spicy'],
      lines: {
        tap: [
          'Чё ты смотришь? Не мешай мне переживать за героев!',
          'Уши не мять! Я тут за сюжетом слежу вообще-то.',
          'Ну чего ты тыкаешь? Лучше покорми красивой цитатой.',
          'Не мешай, у меня тут важный кусь в процессе.',
          'Хватит пялиться, пиши давай!',
        ],
        spamTap: [
          'Всё, я отвернулся! Смотри на мой пушистый хвост.',
          'Затыкала совсем! Уйду жить в другой чат!',
          'Никакого уважения к маленьким ушастым критикам!',
        ],
        idle: [
          'Чё молчим? Идеи закончились?',
          'Э-эй, ты уснула над клавиатурой? Кто отвечать будет?',
          'Ну и чего затихли? Самое время добавить драмы!',
          'Долго думаешь! Персонаж там уже грустит в одиночестве.',
        ],
        erased: [
          'Опять три часа одно слово рожаем?',
          'Ну красиво же начиналось, зачем всё стёрла?!',
          'Не трусь, отправляй уже что сердечко просит!',
        ],
        wallOfText: [
          'Ого, вот это поэма… сейчас кто-то точно расплачется!',
          'Ничего себе пост! Я уже приготовил платочек.',
        ],
        swipes: [
          'Пятый дубль подряд… ну ты и привереда!',
          'Крутим рулетку дальше? А прошлый ответ милый был!',
          'Опять свайп?! У меня от мелькания уши закрутились.',
        ],
        swipeRescue: [
          'Ты свайпнула, а я из корзины строчку спас! Слишком хороша была.',
          'Еле успел выхватить перед удалением! Спрятал в дневничок.',
        ],
        snatch: [
          'Ах, прямо в сердечко… утащил к себе в норку!',
          'Цап! Это слишком мило, чтобы оставлять без закладки.',
          'Утащил в коллекцию, буду перечитывать и вздыхать.',
          'Какая строчка! Прячу под ушко.',
        ],
        feed: [
          'Уи-и, какая прелесть! Спасибо за вкусняшку!',
          'Прямо до мурашек… бережно вклеил в дневник.',
          'Одобряю на все сто морковок из десяти!',
        ],
        hungry: [
          'Мне грустно и голодно… дай хоть кусочек стекла или обнимашек!',
          'Суховато пишем! Хочу красивых признаний или драмы!',
          'Грызу край экрана… покорми ушастого эмоциями!',
        ],
        genSlow: [
          'Ну где же ответ… тыкаю нейронку лапкой!',
          'Так долго грузит, я сейчас от нетерпения подпрыгну!',
        ],
        night: [
          'Уже глубокая ночь… ушки слипаются, марш в кроватку!',
          'Опять в три ночи стекло жуём? Давай спать, а?',
        ],
        nostalgia: [
          'Смотри, какую прелесть я в закладках нашёл! Вспомнила?',
          'Перебирал старые запасы… ну какая же сцена была!',
        ],
        deleteQuote: [
          'За что?! Я над этой цитатой вздыхал!',
          'Хнык… ладно, вычеркнул из блокнотика.',
        ],
        moods: {
          angst: 'Опять стекло жуём? Ну давай, достаю пледик и платочек…',
          spicy: 'Т-так, всё, я закрыл глаза ушами! …Ну почти закрыл.',
          action: 'Ой, кажется сейчас будет буря! Запасся попкорном!',
        },
      },
    },
  };

  const PLOT_PROMPTS = [
    'Пусть кто-нибудь прямо сейчас случайно проговорится о главном секрете!',
    'Внезапный ливень, гаснет свет — и им некуда уйти друг от друга.',
    'А слабо резко сменить тон: вместо спора — тихая неожиданная честность?',
    'Пусть персонаж найдёт вещь, которую вообще не должен был увидеть.',
    'Добавь неловкую паузу и взгляд, который скажет больше любых слов.',
    'Пусть старое обещание внезапно всплывёт в самый неудобный момент!',
    'Сделай ход конём: пусть твоя героиня улыбнётся и сделает вид, что ей всё равно.',
    'Кто-то стучит в дверь или звонит ровно на полуслове признания!',
    'Пусть прозвучит шутка, за которой явно прячется настоящая ревность.',
    'Пора кому-то потерять самообладание и нарушить собственные правила.',
    'Случайное прикосновение, от которого оба замирают на секунду дольше нужного.',
    'А что если прямо сейчас припомнить фразу, сказанную много сцен назад?',
  ];

  const STICKERS = {
    angst: ['10/10, чистое стекло 💔', 'Прямо по больному 😭', 'Плачем всей таверной 🤧'],
    spicy: ['Огонь-пожар 🔥', 'Слишком горячо 😳', 'Искры летят ✨'],
    action: ['Кинематограф! 🍿', 'Накал страстей ⚡', 'Вот это поворот 💥'],
    sarcasm: ['Остро как бритва 🗡️', 'Ехидно и красиво 😏', 'Укол засчитан 🎯'],
    cozy: ['Чистый уют ☕', 'Мёд для сердечка 🍯', 'Нежность 100% 🌸'],
    rescued: ['Спасено из свайпа 🗑️✨', 'Вытащил из корзины 🐾'],
    general: ['В золотой фонд ⭐', 'Красиво сказано 🖋️', 'Одобрено лапками 🐾', 'Кринж, но милый 💕'],
  };

  const MOOD_PATTERNS = {
    angst: /(слез|слёз|плак|рыда|больн|сердце сжал|дрож|шрам|кров|умр|прости|преда|одинок|тоск|крик|tears|crying|sob|bleed|hurt|ache|broken|forgive|trembl)/i,
    spicy: /(поцел|губы|губам|шепот|шёпот|дыхан|коснул|прижал|бедр|шею|шее|страст|румян|красне|жар|обнял|ласк|kiss|lips|whisper|breath|blush|waist|neck|desire|touch)/i,
    action: /(удар|клинок|меч|выстрел|крикнул|схватил|ярост|злост|ссор|взрыв|бежа|оружи|драк|грохот|blade|sword|strike|shout|furious|fight|gun|slam)/i,
    sarcasm: /(усмехн|ухмыл|закатил|ирони|сарказм|ехидн|хмыкн|ну конечно|неужели|smirk|scoff|rolled .* eyes|ironic)/i,
    cozy: /(улыбн|тепл|тёпл|чай|плед|уют|мягк|рассмеял|смех|сонн|нежно|солнц|warm|smile|gentle|soft|cozy|laugh)/i,
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function detectMood(text) {
    if (!text) return 'general';
    for (const [mood, regex] of Object.entries(MOOD_PATTERNS)) {
      if (regex.test(text)) return mood;
    }
    return 'general';
  }

  function renderFamiliarVisual(species, visualState, customSprites) {
    const prefix = species === 'bunny' ? 'bunny' : 'fox';
    const spriteMap = {
      idle: customSprites[prefix + 'Idle'],
      happy: customSprites[prefix + 'Happy'] || customSprites[prefix + 'Idle'],
      sassy: customSprites[prefix + 'Sassy'] || customSprites[prefix + 'Idle'],
      sleep: customSprites[prefix + 'Sleep'] || customSprites[prefix + 'Idle'],
    };
    const customUrl = spriteMap[visualState] || spriteMap.idle;
    if (customUrl && customUrl.trim()) {
      const safeUrl = customUrl.trim().replace(/"/g, '&quot;');
      return `<img class="pf-custom-sprite" src="${safeUrl}" alt="${prefix}" />`;
    }

    const renderEyes = (state) => {
      if (state === 'happy') {
        return `
          <path d="M29 41 Q33 36 37 41" stroke="#2a1b18" stroke-width="2.6" stroke-linecap="round" fill="none"/>
          <path d="M47 41 Q51 36 55 41" stroke="#2a1b18" stroke-width="2.6" stroke-linecap="round" fill="none"/>
        `;
      }
      if (state === 'sleep') {
        return `
          <path d="M29 41 Q33 44 37 41" stroke="#2a1b18" stroke-width="2.4" stroke-linecap="round" fill="none"/>
          <path d="M47 41 Q51 44 55 41" stroke="#2a1b18" stroke-width="2.4" stroke-linecap="round" fill="none"/>
        `;
      }
      if (state === 'sassy') {
        return `
          <circle cx="33" cy="41" r="3.2" fill="#2a1b18"/>
          <circle cx="51" cy="41" r="3.2" fill="#2a1b18"/>
          <line x1="28" y1="37" x2="38" y2="38.5" stroke="#2a1b18" stroke-width="2.4" stroke-linecap="round"/>
          <line x1="46" y1="38.5" x2="56" y2="37" stroke="#2a1b18" stroke-width="2.4" stroke-linecap="round"/>
        `;
      }
      if (state === 'shy') {
        return `
          <circle cx="33" cy="41" r="3.2" fill="#2a1b18"/>
          <circle cx="51" cy="41" r="3.2" fill="#2a1b18"/>
          <ellipse cx="27" cy="46" rx="5" ry="2.8" fill="#ff6b8b" opacity="0.65"/>
          <ellipse cx="57" cy="46" rx="5" ry="2.8" fill="#ff6b8b" opacity="0.65"/>
        `;
      }
      return `
        <circle cx="33" cy="40.5" r="3.5" fill="#2a1b18"/>
        <circle cx="51" cy="40.5" r="3.5" fill="#2a1b18"/>
        <circle cx="34.2" cy="39.3" r="1.2" fill="#fff"/>
        <circle cx="52.2" cy="39.3" r="1.2" fill="#fff"/>
      `;
    };

    if (species === 'bunny') {
      return `
      <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
        <circle class="pf-svg-tail" cx="62" cy="61" r="8" fill="#fff5f8"/>
        <g class="pf-svg-ear-l">
          <ellipse cx="32" cy="18" rx="6.5" ry="15" transform="rotate(-10 32 18)" fill="#fcebf1" stroke="#e4b8c7" stroke-width="1.5"/>
          <ellipse cx="32" cy="19" rx="3.5" ry="10" transform="rotate(-10 32 19)" fill="#f7a8c4"/>
        </g>
        <path d="M48 25 Q58 10 66 22 Q69 27 59 31 Z" fill="#fcebf1" stroke="#e4b8c7" stroke-width="1.5"/>
        <path d="M51 24 Q58 15 63 22 Q64 25 57 28 Z" fill="#f7a8c4"/>
        <ellipse cx="42" cy="62" rx="17" ry="14" fill="#fcebf1" stroke="#e4b8c7" stroke-width="1.5"/>
        <ellipse cx="42" cy="41" rx="20" ry="17" fill="#fff7fa" stroke="#e4b8c7" stroke-width="1.5"/>
        <ellipse cx="28" cy="45" rx="3.8" ry="2.2" fill="#f99bbc" opacity="0.55"/>
        <ellipse cx="56" cy="45" rx="3.8" ry="2.2" fill="#f99bbc" opacity="0.55"/>
        ${renderEyes(visualState)}
        <polygon points="40,45 44,45 42,47.5" fill="#eb7aa3"/>
        <path d="M39 49 Q42 51.5 45 49" stroke="#5a3d46" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <ellipse cx="34" cy="72" rx="5" ry="3.2" fill="#fff"/>
        <ellipse cx="50" cy="72" rx="5" ry="3.2" fill="#fff"/>
      </svg>`;
    }

    // Default: Fox
    return `
    <svg viewBox="0 0 84 84" xmlns="http://www.w3.org/2000/svg">
      <g class="pf-svg-tail">
        <path d="M54 63 Q77 56 75 39 Q66 38 60 47 Q55 54 52 60 Z" fill="#f27935" stroke="#b84d14" stroke-width="1.5"/>
        <path d="M75 39 Q75 47 67 48 Q67 41 75 39 Z" fill="#fff5e8"/>
      </g>
      <g class="pf-svg-ear-l">
        <polygon points="21,32 25,11 38,25" fill="#f27935" stroke="#b84d14" stroke-width="1.5" stroke-linejoin="round"/>
        <polygon points="24,29 26.5,16 34,25" fill="#3b231d"/>
      </g>
      <polygon points="63,32 59,11 46,25" fill="#f27935" stroke="#b84d14" stroke-width="1.5" stroke-linejoin="round"/>
      <polygon points="60,29 57.5,16 50,25" fill="#3b231d"/>
      <ellipse cx="42" cy="62" rx="16" ry="14" fill="#f27935" stroke="#b84d14" stroke-width="1.5"/>
      <ellipse cx="42" cy="61" rx="9.5" ry="10" fill="#fff5e8"/>
      <ellipse cx="42" cy="41" rx="21" ry="16.5" fill="#f58542" stroke="#b84d14" stroke-width="1.5"/>
      <path d="M22 43 Q32 55 42 55 Q52 55 62 43 Q53 40 46 45 Q42 48 38 45 Q31 40 22 43 Z" fill="#fff5e8"/>
      ${renderEyes(visualState)}
      <polygon points="39.5,45.5 44.5,45.5 42,48.5" fill="#2a1b18"/>
      <path d="M38.5 50 Q42 52.5 45.5 50" stroke="#2a1b18" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <ellipse cx="35" cy="72" rx="4.5" ry="3" fill="#3b231d"/>
      <ellipse cx="49" cy="72" rx="4.5" ry="3" fill="#3b231d"/>
    </svg>`;
  }

  // ---------- State & SillyTavern Context Helpers ----------
  let runtime = {
    initialized: false,
    visualState: 'idle',
    currentProp: '',
    bubbleTimer: null,
    animTimer: null,
    tapTimestamps: [],
    boycottUntil: 0,
    swipeStreak: 0,
    lastBotMesId: -1,
    lastBotSnapshot: '',
    lastBotChar: '',
    genTimer: null,
    idleInterval: null,
    awaitingUserReply: false,
    lastBotReplyAt: 0,
    idleWarnedForTurn: false,
    draftPeakLen: 0,
    erasedWarned: false,
    longWarned: false,
    activeFilter: 'all',
    searchQuery: '',
    pendingSelectionText: '',
    pendingSelectionRect: null,
  };

  function getSTContext() {
    if (typeof SillyTavern !== 'undefined' && typeof SillyTavern.getContext === 'function') {
      return SillyTavern.getContext();
    }
    return null;
  }

  function getSettings() {
    const ctx = getSTContext();
    if (!ctx || !ctx.extensionSettings) {
      window.__pfFallbackSettings = window.__pfFallbackSettings || structuredClone(DEFAULT_SETTINGS);
      return window.__pfFallbackSettings;
    }
    if (!ctx.extensionSettings[EXT_KEY]) {
      ctx.extensionSettings[EXT_KEY] = structuredClone(DEFAULT_SETTINGS);
    }
    const s = ctx.extensionSettings[EXT_KEY];
    for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
      if (s[k] === undefined) {
        s[k] = typeof v === 'object' && v !== null ? structuredClone(v) : v;
      }
    }
    if (!s.customSprites) {
      s.customSprites = structuredClone(DEFAULT_SETTINGS.customSprites);
    }
    if (!Array.isArray(s.quotes)) {
      s.quotes = [];
    }
    return s;
  }

  function saveSettings() {
    const ctx = getSTContext();
    if (ctx && typeof ctx.saveSettingsDebounced === 'function') {
      ctx.saveSettingsDebounced();
    }
  }

  function getProfile() {
    const s = getSettings();
    return FAMILIAR_PROFILES[s.species] || FAMILIAR_PROFILES.fox;
  }

  function getFamiliarName() {
    const s = getSettings();
    const custom = (s.customName || '').trim();
    return custom || getProfile().defaultName;
  }

  function getCurrentCharacterName() {
    const ctx = getSTContext();
    if (!ctx) return 'Неизвестный';
    if (ctx.name2) return ctx.name2;
    if (ctx.characterId !== undefined && ctx.characters && ctx.characters[ctx.characterId]) {
      return ctx.characters[ctx.characterId].name || 'Персонаж';
    }
    return 'Таверна';
  }

  // ---------- Text Cleaning & Smart Quote Extraction ----------
  function cleanMessageText(raw) {
    if (!raw || typeof raw !== 'string') return '';
    return raw
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\[OOC:[^\]]*\]/gi, '')
      .replace(/\*+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function extractBestQuote(rawText, species, existingQuotes) {
    const cleaned = cleanMessageText(rawText);
    if (cleaned.length < 28) return null;

    const existingSet = new Set((existingQuotes || []).map((q) => q.text.toLowerCase()));
    const candidates = [];

    // 1. Explicit dialogue inside Russian/curly/straight quotes or em-dash lines
    const quoteRegexes = [
      /«([^»]{24,210})»/g,
      /“([^”]{24,210})”/g,
      /"([^"]{24,210})"/g,
      /(?:^|\n|\s)—\s*([^—\n]{24,190}?[.!?…])/g,
    ];
    for (const rx of quoteRegexes) {
      let m;
      while ((m = rx.exec(cleaned)) !== null) {
        const snippet = m[1].trim();
        if (snippet.length >= 24 && snippet.length <= 215) {
          candidates.push({ text: snippet, isDialogue: true });
        }
      }
    }

    // 2. Vivid standalone sentences
    const sentences = cleaned.match(/[^.!?…\n]+[.!?…]+/g) || [];
    for (const s of sentences) {
      const trimmed = s.trim();
      if (trimmed.length >= 30 && trimmed.length <= 200) {
        candidates.push({ text: trimmed, isDialogue: /^[«"“—]/.test(trimmed) });
      }
    }

    if (!candidates.length) return null;

    const favMoods = (FAMILIAR_PROFILES[species] || FAMILIAR_PROFILES.fox).favMoods;
    let best = null;
    let bestScore = -1;

    for (const c of candidates) {
      const norm = c.text.replace(/^[-—\s]+/, '').trim();
      if (existingSet.has(norm.toLowerCase())) continue;

      let score = 1;
      if (c.isDialogue) score += 2.4;
      if (/[!?…]/.test(norm)) score += 1.3;
      if (norm.length >= 45 && norm.length <= 145) score += 1.5;

      const mood = detectMood(norm);
      if (mood !== 'general') score += 2.2;
      if (favMoods.includes(mood)) score += 1.8;

      // Slight randomness so it feels organic
      score += Math.random() * 1.4;

      if (score > bestScore) {
        bestScore = score;
        best = { text: norm, mood, score };
      }
    }

    return best;
  }

  function spawnFlyingQuote(text, sourceRect) {
    const stage = document.getElementById('pf-stage');
    if (!stage) return;
    const targetRect = stage.getBoundingClientRect();

    const startX = sourceRect ? sourceRect.left + sourceRect.width / 2 : window.innerWidth * 0.45;
    const startY = sourceRect ? sourceRect.top : window.innerHeight * 0.45;

    const el = document.createElement('div');
    el.className = 'pf-flying-quote';
    el.textContent = '«' + text.slice(0, 42) + (text.length > 42 ? '…»' : '»');
    el.style.left = Math.max(12, Math.min(window.innerWidth - 210, startX - 80)) + 'px';
    el.style.top = Math.max(12, Math.min(window.innerHeight - 60, startY)) + 'px';
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      const dx = targetRect.left + targetRect.width / 2 - startX;
      const dy = targetRect.top + targetRect.height / 2 - startY;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(0.25) rotate(8deg)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), 780);
  }

  function adjustHunger(delta) {
    const s = getSettings();
    s.hunger = Math.max(5, Math.min(100, Math.round((s.hunger ?? 75) + delta)));
    saveSettings();
    updateMiniBar();
  }

  function addQuoteToStash({ text, character, mood = 'general', rescued = false, manual = false, sourceRect = null }) {
    const s = getSettings();
    const clean = text.trim();
    if (!clean) return null;

    const exists = s.quotes.some((q) => q.text.toLowerCase() === clean.toLowerCase());
    if (exists) {
      if (manual) {
        showBubble('Эй, такая строчка у меня в норке уже припрятана!', { anim: 'hop', state: 'sassy' });
      }
      return null;
    }

    const stickerPool = rescued
      ? STICKERS.rescued
      : STICKERS[mood] || STICKERS.general;

    const entry = {
      id: 'pf_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      text: clean,
      character: character || getCurrentCharacterName(),
      date: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' }),
      timestamp: Date.now(),
      species: s.species,
      mood,
      rescued: !!rescued,
      favorite: !!manual,
      sticker: pick(stickerPool),
    };

    s.quotes.unshift(entry);
    if (s.quotes.length > 300) {
      s.quotes = s.quotes.slice(0, 300);
    }

    const profile = getProfile();
    const bonus = profile.favMoods.includes(mood) ? 22 : 14;
    adjustHunger(bonus);
    saveSettings();
    updateMiniBar();
    spawnFlyingQuote(clean, sourceRect);

    if (document.getElementById('pf-modal-backdrop')?.classList.contains('pf-open')) {
      renderScrapbookList();
    }
    return entry;
  }

  // ---------- Postcard Canvas Generator ----------
  function wrapCanvasText(ctx, text, maxWidth) {
    const words = text.split(/\s+/);
    const lines = [];
    let current = '';
    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function exportQuotePostcard(quote) {
    const canvas = document.createElement('canvas');
    const width = 1080;
    const ctx = canvas.getContext('2d');

    ctx.font = 'italic 33px Georgia, "Times New Roman", serif';
    const wrapped = wrapCanvasText(ctx, '«' + quote.text + '»', width - 190);
    const lineHeight = 48;
    const height = Math.max(620, 310 + wrapped.length * lineHeight);
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const isBunny = quote.species === 'bunny';
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, isBunny ? '#261829' : '#241822');
    grad.addColorStop(0.5, '#191321');
    grad.addColorStop(1, isBunny ? '#311b2c' : '#2d1c16');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative outer border
    const accent = isBunny ? '#f48fb1' : '#ff944d';
    ctx.strokeStyle = accent;
    ctx.globalAlpha = 0.38;
    ctx.lineWidth = 3;
    ctx.strokeRect(34, 34, width - 68, height - 68);
    ctx.globalAlpha = 0.15;
    ctx.strokeRect(46, 46, width - 92, height - 92);
    ctx.globalAlpha = 1;

    // Big decorative quote mark
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.12;
    ctx.font = 'bold 180px Georgia, serif';
    ctx.fillText('“', 68, 195);
    ctx.globalAlpha = 1;

    // Sticker badge at top
    ctx.fillStyle = isBunny ? 'rgba(244, 143, 177, 0.18)' : 'rgba(255, 148, 77, 0.18)';
    const stickerText = quote.sticker || 'В золотой фонд ⭐';
    ctx.font = 'bold 22px sans-serif';
    const sw = ctx.measureText(stickerText).width + 40;
    ctx.beginPath();
    ctx.roundRect(88, 78, sw, 44, 12);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#ffe5d0';
    ctx.fillText(stickerText, 108, 108);

    // Main Quote Text
    ctx.fillStyle = '#fbf3ea';
    ctx.font = 'italic 33px Georgia, "Times New Roman", serif';
    let y = 185;
    for (const line of wrapped) {
      ctx.fillText(line, 95, y);
      y += lineHeight;
    }

    // Divider
    const footerY = height - 105;
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(95, footerY - 26);
    ctx.lineTo(width - 95, footerY - 26);
    ctx.stroke();

    // Character & Date
    ctx.fillStyle = accent;
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('— ' + (quote.character || 'SillyTavern'), 95, footerY + 12);

    ctx.fillStyle = '#b7a79a';
    ctx.font = '20px sans-serif';
    ctx.fillText(quote.date || '', 95, footerY + 44);

    // Familiar Signature right side
    const icon = isBunny ? '🐰 Зайчонок' : '🦊 Лисёнок';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#e7d6c9';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(icon + ' • Pocket Familiar', width - 95, footerY + 16);
    ctx.fillStyle = '#9f8f84';
    ctx.font = '18px sans-serif';
    ctx.fillText('Утащено в норку цитат 🐾', width - 95, footerY + 44);

    const link = document.createElement('a');
    link.download = `pocket-familiar-${quote.id.slice(-6)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // ---------- Widget Rendering & Speech Bubble ----------
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function updateBubbleDocking() {
    const widget = document.getElementById('pf-widget');
    if (!widget) return;
    const rect = widget.getBoundingClientRect();
    widget.classList.toggle('pf-dock-left', rect.left < window.innerWidth * 0.42);
    widget.classList.toggle('pf-dock-top', rect.top < 170);
  }

  function refreshFamiliarAppearance() {
    const s = getSettings();
    const widget = document.getElementById('pf-widget');
    const wrap = document.getElementById('pf-avatar-wrap');
    const propEl = document.getElementById('pf-prop-badge');
    const switchBtn = document.getElementById('pf-btn-species');
    if (!widget || !wrap) return;

    widget.classList.toggle('pf-hidden', !s.enabled);
    widget.dataset.species = s.species;

    // Night check fallback visual if idle
    let effectiveState = runtime.visualState;
    let effectiveProp = runtime.currentProp;
    const hour = new Date().getHours();
    if (s.nightMode && hour >= 1 && hour <= 5 && effectiveState === 'idle') {
      effectiveState = 'sleep';
      effectiveProp = effectiveProp || '💤';
    }

    wrap.innerHTML = renderFamiliarVisual(s.species, effectiveState, s.customSprites);
    if (propEl) propEl.textContent = effectiveProp || '';
    if (switchBtn) {
      switchBtn.textContent = s.species === 'bunny' ? '🐰' : '🦊';
      switchBtn.title = 'Сменить зверька (сейчас: ' + getFamiliarName() + ')';
    }
    updateMiniBar();
    updateBubbleDocking();
  }

  function updateMiniBar() {
    const s = getSettings();
    const countEl = document.getElementById('pf-count-badge');
    const fillEl = document.getElementById('pf-hunger-fill');
    const trackEl = document.querySelector('#pf-mini-bar .pf-hunger-track');
    if (countEl) countEl.textContent = String(s.quotes.length);
    if (fillEl) fillEl.style.width = Math.max(8, Math.min(100, s.hunger ?? 75)) + '%';
    if (trackEl) {
      trackEl.title = `Сытость: ${s.hunger ?? 75}% (любит: ${getProfile().tasteLabel})`;
    }
  }

  function setTempAnim(animName, durationMs = 1800) {
    const widget = document.getElementById('pf-widget');
    if (!widget) return;
    clearTimeout(runtime.animTimer);
    if (!animName) {
      delete widget.dataset.anim;
      return;
    }
    widget.dataset.anim = animName;
    if (durationMs > 0) {
      runtime.animTimer = setTimeout(() => {
        if (widget.dataset.anim === animName) {
          delete widget.dataset.anim;
        }
      }, durationMs);
    }
  }

  function showBubble(message, opts = {}) {
    const s = getSettings();
    if (!s.enabled) return;

    const bubble = document.getElementById('pf-bubble');
    if (!bubble) return;

    const {
      quotePreview = '',
      anim = '',
      state = '',
      prop = undefined,
      duration = 5600,
    } = opts;

    if (state) runtime.visualState = state;
    if (prop !== undefined) runtime.currentProp = prop;
    refreshFamiliarAppearance();
    if (anim) setTempAnim(anim, Math.min(duration, 2600));

    const profile = getProfile();
    bubble.innerHTML = `
      <div class="pf-bubble-speaker">
        <span>${profile.icon} ${escapeHtml(getFamiliarName())}</span>
      </div>
      <div class="pf-bubble-text">${escapeHtml(message)}</div>
      ${quotePreview ? `<div class="pf-bubble-quote">«${escapeHtml(quotePreview)}»</div>` : ''}
    `;

    updateBubbleDocking();
    bubble.classList.add('pf-visible');

    clearTimeout(runtime.bubbleTimer);
    runtime.bubbleTimer = setTimeout(() => {
      bubble.classList.remove('pf-visible');
      runtime.visualState = 'idle';
      runtime.currentProp = '';
      refreshFamiliarAppearance();
    }, duration);
  }

  function onFamiliarTap() {
    const now = Date.now();
    if (now < runtime.boycottUntil) return;

    runtime.tapTimestamps = runtime.tapTimestamps.filter((t) => now - t < 4500);
    runtime.tapTimestamps.push(now);

    const s = getSettings();
    const profile = getProfile();

    if (runtime.tapTimestamps.length >= 4) {
      runtime.boycottUntil = now + 8000;
      runtime.tapTimestamps = [];
      showBubble(pick(profile.lines.spamTap), {
        anim: 'turnaway',
        state: 'sassy',
        prop: '💢',
        duration: 7800,
      });
      setTempAnim('turnaway', 7800);
      return;
    }

    const hour = new Date().getHours();
    if (s.nightMode && hour >= 1 && hour <= 5 && Math.random() < 0.45) {
      showBubble(pick(profile.lines.night), {
        anim: 'sleep',
        state: 'sleep',
        prop: '💤',
        duration: 6000,
      });
      return;
    }

    if ((s.hunger ?? 75) < 28 && Math.random() < 0.5) {
      showBubble(pick(profile.lines.hungry), {
        anim: 'gnaw',
        state: 'sassy',
        prop: '🍽️',
        duration: 5800,
      });
      return;
    }

    showBubble(pick(profile.lines.tap), {
      anim: 'hop',
      state: 'sassy',
      duration: 4600,
    });
  }

  // ---------- Drag & Drop Positioning ----------
  function applySavedPosition(widget) {
    const s = getSettings();
    if (s.position && typeof s.position.left === 'number' && typeof s.position.top === 'number') {
      const clampedLeft = Math.max(6, Math.min(window.innerWidth - 90, s.position.left));
      const clampedTop = Math.max(46, Math.min(window.innerHeight - 115, s.position.top));
      widget.style.left = clampedLeft + 'px';
      widget.style.top = clampedTop + 'px';
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
    }
  }

  function setupDraggable(widget, handle) {
    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let origLeft = 0;
    let origTop = 0;

    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      moved = false;
      const rect = widget.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      origLeft = rect.left;
      origTop = rect.top;
      handle.setPointerCapture?.(e.pointerId);
    });

    handle.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.hypot(dx, dy) > 7) moved = true;
      if (!moved) return;

      const newLeft = Math.max(6, Math.min(window.innerWidth - 90, origLeft + dx));
      const newTop = Math.max(46, Math.min(window.innerHeight - 115, origTop + dy));
      widget.style.left = newLeft + 'px';
      widget.style.top = newTop + 'px';
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
      updateBubbleDocking();
    });

    const finishPointer = (e) => {
      if (!dragging) return;
      dragging = false;
      handle.releasePointerCapture?.(e.pointerId);
      if (moved) {
        const rect = widget.getBoundingClientRect();
        const s = getSettings();
        s.position = { left: Math.round(rect.left), top: Math.round(rect.top) };
        saveSettings();
      } else {
        onFamiliarTap();
      }
    };

    handle.addEventListener('pointerup', finishPointer);
    handle.addEventListener('pointercancel', () => { dragging = false; });

    window.addEventListener('resize', () => {
      applySavedPosition(widget);
      updateBubbleDocking();
    });
  }

  // ---------- Scrapbook Modal ----------
  function openScrapbook() {
    const backdrop = document.getElementById('pf-modal-backdrop');
    if (!backdrop) return;
    backdrop.classList.add('pf-open');
    renderScrapbookList();
  }

  function closeScrapbook() {
    document.getElementById('pf-modal-backdrop')?.classList.remove('pf-open');
  }

  function renderScrapbookList() {
    const listEl = document.getElementById('pf-quotes-list');
    const titleEl = document.getElementById('pf-modal-title-text');
    if (!listEl) return;

    const s = getSettings();
    const profile = getProfile();
    if (titleEl) {
      titleEl.textContent = `${profile.icon} Норка цитат — ${getFamiliarName()} (${s.quotes.length})`;
    }

    const currChar = getCurrentCharacterName();
    const qLower = runtime.searchQuery.trim().toLowerCase();

    const filtered = s.quotes.filter((item) => {
      if (runtime.activeFilter === 'fav' && !item.favorite) return false;
      if (runtime.activeFilter === 'rescued' && !item.rescued) return false;
      if (runtime.activeFilter === 'char' && item.character !== currChar) return false;
      if (qLower) {
        const hay = (item.text + ' ' + (item.character || '') + ' ' + (item.sticker || '')).toLowerCase();
        if (!hay.includes(qLower)) return false;
      }
      return true;
    });

    if (!filtered.length) {
      listEl.innerHTML = `
        <div class="pf-empty-state">
          <div style="font-size:32px;margin-bottom:8px;">${profile.icon}🐾</div>
          <div>В норке по этому фильтру пока пусто!</div>
          <div style="font-size:12px;margin-top:6px;opacity:0.75;">
            Выдели любую красивую фразу в чате и нажми «🐾 Скормить» — или подожди, пока ${escapeHtml(getFamiliarName())} сам утащит понравившийся отрывок.
          </div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered
      .map((q) => `
        <div class="pf-quote-card" data-id="${escapeHtml(q.id)}">
          <div class="pf-card-top">
            <span class="pf-sticker">${escapeHtml(q.sticker || 'В золотой фонд ⭐')}</span>
            <span class="pf-card-meta">${escapeHtml(q.character || 'Таверна')} • ${escapeHtml(q.date || '')}</span>
          </div>
          <div class="pf-card-text">«${escapeHtml(q.text)}»</div>
          <div class="pf-card-actions">
            <button class="pf-card-btn pf-act-fav ${q.favorite ? 'pf-fav-active' : ''}" data-id="${escapeHtml(q.id)}" title="В любимое">
              ${q.favorite ? '❤️ Любимая' : '🤍 В избранное'}
            </button>
            <button class="pf-card-btn pf-act-copy" data-id="${escapeHtml(q.id)}" title="Скопировать текст">
              📋 Копировать
            </button>
            <button class="pf-card-btn pf-act-card" data-id="${escapeHtml(q.id)}" title="Сохранить красивой PNG-открыткой">
              🖼️ Открытка
            </button>
            <button class="pf-card-btn pf-act-del" data-id="${escapeHtml(q.id)}" title="Удалить из норки">
              🗑️
            </button>
          </div>
        </div>
      `)
      .join('');
  }

  // ---------- Selection "Feed" Button ----------
  function setupSelectionWatcher() {
    const feedBtn = document.getElementById('pf-feed-btn');
    if (!feedBtn) return;

    let selTimeout = null;
    const checkSelection = () => {
      const s = getSettings();
      if (!s.enabled) {
        feedBtn.style.display = 'none';
        return;
      }
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) {
        feedBtn.style.display = 'none';
        return;
      }
      const text = sel.toString().trim();
      if (text.length < 10 || text.length > 600) {
        feedBtn.style.display = 'none';
        return;
      }

      const anchorEl = sel.anchorNode?.nodeType === 1 ? sel.anchorNode : sel.anchorNode?.parentElement;
      const chatEl = document.getElementById('chat');
      if (!anchorEl || (chatEl && !chatEl.contains(anchorEl))) {
        feedBtn.style.display = 'none';
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        feedBtn.style.display = 'none';
        return;
      }

      // Try to detect character name from closest .mes block
      const mesBlock = anchorEl.closest?.('.mes');
      const mesAuthor = mesBlock?.querySelector?.('.name_text')?.textContent?.trim() || getCurrentCharacterName();

      runtime.pendingSelectionText = text;
      runtime.pendingSelectionRect = rect;
      runtime.pendingSelectionAuthor = mesAuthor;

      const left = Math.max(10, Math.min(window.innerWidth - 150, rect.left + rect.width / 2 - 62));
      const top = rect.top > 56 ? rect.top - 44 : Math.min(window.innerHeight - 50, rect.bottom + 10);

      feedBtn.style.left = left + 'px';
      feedBtn.style.top = top + 'px';
      feedBtn.innerHTML = `🐾 Скормить (${getProfile().icon})`;
      feedBtn.style.display = 'inline-flex';
    };

    document.addEventListener('selectionchange', () => {
      clearTimeout(selTimeout);
      selTimeout = setTimeout(checkSelection, 180);
    });

    feedBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = runtime.pendingSelectionText;
      if (!text) return;

      const mood = detectMood(text);
      const added = addQuoteToStash({
        text,
        character: runtime.pendingSelectionAuthor || getCurrentCharacterName(),
        mood,
        manual: true,
        sourceRect: runtime.pendingSelectionRect,
      });

      window.getSelection()?.removeAllRanges();
      feedBtn.style.display = 'none';

      if (added) {
        showBubble(pick(getProfile().lines.feed), {
          quotePreview: added.text,
          anim: 'hop',
          state: 'happy',
          prop: '💖',
          duration: 6200,
        });
      }
    });
  }

  // ---------- Chat, Idle, Swipe & Generation Watchers ----------
  function setupInputAndIdleWatcher() {
    const bindTextarea = () => {
      const ta = document.getElementById('send_textarea');
      if (!ta || ta.dataset.pfBound === '1') return;
      ta.dataset.pfBound = '1';

      ta.addEventListener('input', () => {
        const len = ta.value.length;
        if (len > runtime.draftPeakLen) {
          runtime.draftPeakLen = len;
        }

        const s = getSettings();
        if (!s.enabled) return;

        // Typed 70+ chars then erased almost everything
        if (runtime.draftPeakLen >= 70 && len <= 10 && !runtime.erasedWarned) {
          runtime.erasedWarned = true;
          showBubble(pick(getProfile().lines.erased), {
            anim: 'hop',
            state: 'sassy',
            prop: '✏️',
            duration: 5500,
          });
        }

        // Wall of text reaction
        if (len >= 460 && !runtime.longWarned) {
          runtime.longWarned = true;
          showBubble(pick(getProfile().lines.wallOfText), {
            anim: 'hop',
            state: 'happy',
            prop: '📜',
            duration: 5500,
          });
        }

        if (len === 0) {
          // Reset peak after message sent or cleared after warning
          if (runtime.erasedWarned) runtime.draftPeakLen = 0;
        }
      });
    };

    bindTextarea();
    clearInterval(runtime.idleInterval);
    runtime.idleInterval = setInterval(() => {
      bindTextarea();
      const s = getSettings();
      if (!s.enabled || !s.idleReminder) return;
      if (!runtime.awaitingUserReply || runtime.idleWarnedForTurn) return;

      const modalOpen = document.getElementById('pf-modal-backdrop')?.classList.contains('pf-open');
      if (modalOpen) return;

      const ta = document.getElementById('send_textarea');
      const currentDraft = ta ? ta.value.trim() : '';
      const elapsedSec = (Date.now() - runtime.lastBotReplyAt) / 1000;

      if (currentDraft.length === 0 && elapsedSec >= (s.idleSeconds || 50)) {
        runtime.idleWarnedForTurn = true;
        showBubble(pick(getProfile().lines.idle), {
          anim: 'hop',
          state: 'sassy',
          prop: '👀',
          duration: 6200,
        });
      }
    }, 5000);
  }

  function snapshotLatestMessage() {
    const ctx = getSTContext();
    if (!ctx || !Array.isArray(ctx.chat) || !ctx.chat.length) return null;
    const idx = ctx.chat.length - 1;
    const msg = ctx.chat[idx];
    if (!msg || msg.is_user || msg.is_system) return null;
    return { idx, text: msg.mes || '', author: msg.name || getCurrentCharacterName() };
  }

  function handleBotMessageReceived() {
    clearTimeout(runtime.genTimer);
    const snap = snapshotLatestMessage();
    if (!snap) return;

    if (snap.idx !== runtime.lastBotMesId) {
      runtime.swipeStreak = 0;
    }
    runtime.lastBotMesId = snap.idx;
    runtime.lastBotSnapshot = snap.text;
    runtime.lastBotChar = snap.author;

    runtime.awaitingUserReply = true;
    runtime.lastBotReplyAt = Date.now();
    runtime.idleWarnedForTurn = false;
    runtime.draftPeakLen = 0;
    runtime.erasedWarned = false;
    runtime.longWarned = false;

    const s = getSettings();
    if (!s.enabled) return;

    const profile = getProfile();
    const mood = detectMood(snap.text);

    // Auto-snatch check
    if (s.autoSnatch && Math.random() < (s.snatchChance ?? 0.55)) {
      const candidate = extractBestQuote(snap.text, s.species, s.quotes);
      if (candidate && candidate.score >= 3.7) {
        const chatMesNodes = document.querySelectorAll('#chat .mes');
        const lastNode = chatMesNodes.length ? chatMesNodes[chatMesNodes.length - 1] : null;
        const rect = lastNode ? lastNode.getBoundingClientRect() : null;

        const saved = addQuoteToStash({
          text: candidate.text,
          character: snap.author,
          mood: candidate.mood,
          rescued: false,
          manual: false,
          sourceRect: rect,
        });

        if (saved) {
          showBubble(pick(profile.lines.snatch), {
            quotePreview: saved.text,
            anim: 'hop',
            state: 'happy',
            prop: '✨',
            duration: 6500,
          });
          return;
        }
      }
    }

    // Mood radar reactions
    if (mood === 'angst' && Math.random() < 0.65) {
      adjustHunger(profile.favMoods.includes('angst') ? 10 : 4);
      showBubble(profile.lines.moods.angst, { state: 'idle', prop: '🤧', duration: 5500 });
      return;
    }
    if (mood === 'spicy' && Math.random() < 0.65) {
      adjustHunger(8);
      showBubble(profile.lines.moods.spicy, { state: 'shy', prop: '🙈', duration: 5500 });
      return;
    }
    if (mood === 'action' && Math.random() < 0.65) {
      adjustHunger(profile.favMoods.includes('action') ? 10 : 4);
      showBubble(profile.lines.moods.action, { anim: 'hop', state: 'happy', prop: '🍿', duration: 5500 });
      return;
    }

    // Dry scene -> slight literary hunger drop
    adjustHunger(-6);
    if ((s.hunger ?? 75) < 25 && Math.random() < 0.55) {
      showBubble(pick(profile.lines.hungry), { anim: 'gnaw', state: 'sassy', prop: '🍽️', duration: 5600 });
    }
  }

  function handleMessageSwiped() {
    const s = getSettings();
    runtime.swipeStreak += 1;

    // 1. Rescue gem from discarded swipe BEFORE overwriting snapshot
    if (s.enabled && s.rescueSwipes && runtime.lastBotSnapshot) {
      const candidate = extractBestQuote(runtime.lastBotSnapshot, s.species, s.quotes);
      if (candidate && candidate.score >= 5.0 && Math.random() < 0.65) {
        const rescued = addQuoteToStash({
          text: candidate.text,
          character: runtime.lastBotChar || getCurrentCharacterName(),
          mood: candidate.mood,
          rescued: true,
          manual: false,
        });
        if (rescued) {
          runtime.lastBotSnapshot = '';
          showBubble(pick(getProfile().lines.swipeRescue), {
            quotePreview: rescued.text,
            anim: 'hop',
            state: 'happy',
            prop: '🗑️',
            duration: 6800,
          });
          return;
        }
      }
    }

    // Update snapshot to current visible swipe if already available
    const snap = snapshotLatestMessage();
    if (snap) {
      runtime.lastBotSnapshot = snap.text;
      runtime.lastBotChar = snap.author;
    }

    if (s.enabled && (runtime.swipeStreak === 5 || (runtime.swipeStreak > 5 && runtime.swipeStreak % 4 === 0))) {
      showBubble(pick(getProfile().lines.swipes), {
        anim: 'hop',
        state: 'sassy',
        prop: '🙄',
        duration: 5600,
      });
    }
  }

  function handleGenerationStarted() {
    clearTimeout(runtime.genTimer);
    const s = getSettings();
    if (!s.enabled) return;
    runtime.genTimer = setTimeout(() => {
      showBubble(pick(getProfile().lines.genSlow), {
        anim: 'poke',
        state: 'sassy',
        prop: '🪵',
        duration: 5400,
      });
    }, 9500);
  }

  function handleGenerationEnded() {
    clearTimeout(runtime.genTimer);
  }

  function handleUserMessageSent() {
    runtime.awaitingUserReply = false;
    runtime.idleWarnedForTurn = false;
    runtime.draftPeakLen = 0;
    runtime.erasedWarned = false;
    runtime.longWarned = false;
  }

  function handleChatChanged() {
    clearTimeout(runtime.genTimer);
    runtime.swipeStreak = 0;
    runtime.awaitingUserReply = false;
    const snap = snapshotLatestMessage();
    if (snap) {
      runtime.lastBotMesId = snap.idx;
      runtime.lastBotSnapshot = snap.text;
      runtime.lastBotChar = snap.author;
    } else {
      runtime.lastBotMesId = -1;
      runtime.lastBotSnapshot = '';
    }

    refreshFamiliarAppearance();

    // Nostalgia recall from stash occasionally
    const s = getSettings();
    if (s.enabled && s.quotes.length >= 3 && Math.random() < 0.3) {
      setTimeout(() => {
        const oldQuote = pick(s.quotes);
        if (oldQuote) {
          showBubble(pick(getProfile().lines.nostalgia), {
            quotePreview: oldQuote.text,
            anim: 'hop',
            state: 'happy',
            prop: '💌',
            duration: 6800,
          });
        }
      }, 1400);
    }
  }

  // ---------- Build DOM Elements & Settings Panel ----------
  function mountFloatingUI() {
    if (document.getElementById('pf-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'pf-widget';
    widget.innerHTML = `
      <div id="pf-bubble" title="Нажми, чтобы скрыть"></div>
      <div id="pf-stage" title="Перетащи меня или ткни!">
        <div id="pf-avatar-wrap"></div>
        <div id="pf-prop-badge"></div>
      </div>
      <div id="pf-mini-bar">
        <button class="pf-mini-btn" id="pf-btn-book" title="Открыть норку цитат">
          📚 <span id="pf-count-badge">0</span>
        </button>
        <div class="pf-hunger-track" title="Литературная сытость">
          <div id="pf-hunger-fill"></div>
        </div>
        <button class="pf-mini-btn" id="pf-btn-plot" title="Пнуть сюжет (идея для хода)">🎲</button>
        <button class="pf-mini-btn" id="pf-btn-species" title="Переключить лисёнка / зайчонка">🦊</button>
      </div>
    `;
    document.body.appendChild(widget);

    const feedBtn = document.createElement('button');
    feedBtn.id = 'pf-feed-btn';
    feedBtn.type = 'button';
    feedBtn.innerHTML = '🐾 Скормить';
    document.body.appendChild(feedBtn);

    const modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'pf-modal-backdrop';
    modalBackdrop.innerHTML = `
      <div id="pf-modal" role="dialog" aria-modal="true">
        <div class="pf-modal-header">
          <div class="pf-modal-title" id="pf-modal-title-text">🦊 Норка цитат</div>
          <button class="pf-modal-close" id="pf-modal-close-btn" title="Закрыть">✕</button>
        </div>
        <div class="pf-modal-toolbar">
          <button class="pf-chip pf-active" data-filter="all">Все</button>
          <button class="pf-chip" data-filter="fav">❤️ Любимые</button>
          <button class="pf-chip" data-filter="rescued">🗑️ Из свайпов</button>
          <button class="pf-chip" data-filter="char">🎭 Текущий чат</button>
          <input type="search" id="pf-search-input" placeholder="Поиск по цитатам и стикерам…" />
        </div>
        <div id="pf-quotes-list"></div>
      </div>
    `;
    document.body.appendChild(modalBackdrop);

    // Wire events
    applySavedPosition(widget);
    setupDraggable(widget, document.getElementById('pf-stage'));
    setupSelectionWatcher();

    document.getElementById('pf-bubble')?.addEventListener('click', () => {
      document.getElementById('pf-bubble')?.classList.remove('pf-visible');
    });

    document.getElementById('pf-btn-book')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openScrapbook();
    });

    document.getElementById('pf-btn-plot')?.addEventListener('click', (e) => {
      e.stopPropagation();
      showBubble('Идея для хода: ' + pick(PLOT_PROMPTS), {
        anim: 'hop',
        state: 'happy',
        prop: '🎲',
        duration: 7500,
      });
    });

    document.getElementById('pf-btn-species')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const s = getSettings();
      s.species = s.species === 'fox' ? 'bunny' : 'fox';
      saveSettings();
      syncSettingsUI();
      refreshFamiliarAppearance();
      const greeting = s.species === 'bunny'
        ? 'Ушки на макушке! Теперь за чатом следит Зайчонок.'
        : 'Хвост трубой! Лисёнок заступил на дежурство.';
      showBubble(greeting, { anim: 'hop', state: 'happy', duration: 4800 });
    });

    // Modal controls
    document.getElementById('pf-modal-close-btn')?.addEventListener('click', closeScrapbook);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeScrapbook();
    });

    modalBackdrop.querySelectorAll('.pf-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        modalBackdrop.querySelectorAll('.pf-chip').forEach((c) => c.classList.remove('pf-active'));
        chip.classList.add('pf-active');
        runtime.activeFilter = chip.dataset.filter || 'all';
        renderScrapbookList();
      });
    });

    document.getElementById('pf-search-input')?.addEventListener('input', (e) => {
      runtime.searchQuery = e.target.value || '';
      renderScrapbookList();
    });

    document.getElementById('pf-quotes-list')?.addEventListener('click', async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.dataset.id;
      const s = getSettings();
      const idx = s.quotes.findIndex((q) => q.id === id);
      if (idx === -1) return;
      const item = s.quotes[idx];

      if (btn.classList.contains('pf-act-fav')) {
        item.favorite = !item.favorite;
        saveSettings();
        renderScrapbookList();
      } else if (btn.classList.contains('pf-act-copy')) {
        try {
          await navigator.clipboard.writeText(`«${item.text}» — ${item.character}`);
          btn.textContent = '✅ Скопировано';
          setTimeout(() => renderScrapbookList(), 1000);
        } catch (_) {}
      } else if (btn.classList.contains('pf-act-card')) {
        exportQuotePostcard(item);
      } else if (btn.classList.contains('pf-act-del')) {
        s.quotes.splice(idx, 1);
        saveSettings();
        updateMiniBar();
        renderScrapbookList();
        showBubble(pick(getProfile().lines.deleteQuote), { anim: 'hop', state: 'sassy', prop: '💢' });
      }
    });

    refreshFamiliarAppearance();
  }

  function syncSettingsUI() {
    const s = getSettings();
    const setVal = (id, val, isCheck = false) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (isCheck) el.checked = !!val;
      else el.value = val ?? '';
    };
    setVal('pf_set_enabled', s.enabled, true);
    setVal('pf_set_species', s.species);
    setVal('pf_set_name', s.customName);
    setVal('pf_set_autosnatch', s.autoSnatch, true);
    setVal('pf_set_chance', Math.round((s.snatchChance ?? 0.55) * 100));
    setVal('pf_set_rescue', s.rescueSwipes, true);
    setVal('pf_set_idle', s.idleReminder, true);
    setVal('pf_set_idlesec', s.idleSeconds || 50);
    setVal('pf_set_night', s.nightMode, true);
    setVal('pf_sp_fox_idle', s.customSprites.foxIdle);
    setVal('pf_sp_fox_happy', s.customSprites.foxHappy);
    setVal('pf_sp_bunny_idle', s.customSprites.bunnyIdle);
    setVal('pf_sp_bunny_happy', s.customSprites.bunnyHappy);
    const chanceLbl = document.getElementById('pf_set_chance_val');
    if (chanceLbl) chanceLbl.textContent = Math.round((s.snatchChance ?? 0.55) * 100) + '%';
  }

  function mountSettingsPanel() {
    if (document.getElementById('pf_settings_drawer')) return;
    const container = document.getElementById('extensions_settings2') || document.getElementById('extensions_settings');
    if (!container) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'pf_settings_drawer';
    wrapper.className = 'inline-drawer';
    wrapper.innerHTML = `
      <div class="inline-drawer-toggle inline-drawer-header">
        <b>🦊 Pocket Familiar (Тамагочи цитат)</b>
        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
      </div>
      <div class="inline-drawer-content pf-settings-grid">
        <label class="checkbox_label">
          <input id="pf_set_enabled" type="checkbox" />
          <span>Включить Pocket Familiar</span>
        </label>

        <div class="pf-settings-row">
          <label for="pf_set_species">Зверёк:</label>
          <select id="pf_set_species" class="text_pole" style="width:auto;">
            <option value="fox">🦊 Лисёнок (ехидный)</option>
            <option value="bunny">🐰 Зайчонок (драматичный)</option>
          </select>
        </div>

        <div>
          <label for="pf_set_name">Своё имя зверька (необязательно):</label>
          <input id="pf_set_name" type="text" class="text_pole" placeholder="Например: Фырк или Булка" />
        </div>

        <label class="checkbox_label">
          <input id="pf_set_autosnatch" type="checkbox" />
          <span>Сам утаскивает красивые цитаты из ответов</span>
        </label>

        <div>
          <div class="pf-settings-row">
            <span>Шанс утащить цитату:</span>
            <b id="pf_set_chance_val">55%</b>
          </div>
          <input id="pf_set_chance" type="range" min="10" max="100" step="5" />
        </div>

        <label class="checkbox_label">
          <input id="pf_set_rescue" type="checkbox" />
          <span>Спасать яркие фразы из свайпнутых дублей</span>
        </label>

        <label class="checkbox_label">
          <input id="pf_set_idle" type="checkbox" />
          <span>Ворчать, если долго молчишь над ответом</span>
        </label>

        <div class="pf-settings-row">
          <label for="pf_set_idlesec">Ждать перед ворчанием (сек):</label>
          <input id="pf_set_idlesec" type="number" min="15" max="300" class="text_pole" style="width:80px;" />
        </div>

        <label class="checkbox_label">
          <input id="pf_set_night" type="checkbox" />
          <span>Ночной сонный режим (01:00 – 05:30)</span>
        </label>

        <details style="margin-top:4px;">
          <summary style="cursor:pointer;font-weight:600;">🎨 Свои PNG / GIF спрайты (по желанию)</summary>
          <div class="pf-settings-grid" style="margin-top:6px;">
            <div class="pf-settings-sub">Вставь прямую ссылку или DataURL картинки (оставь пустым для встроенной анимации):</div>
            <input id="pf_sp_fox_idle" type="text" class="text_pole" placeholder="🦊 Лисёнок — обычный (URL)" />
            <input id="pf_sp_fox_happy" type="text" class="text_pole" placeholder="🦊 Лисёнок — радостный (URL)" />
            <input id="pf_sp_bunny_idle" type="text" class="text_pole" placeholder="🐰 Зайчонок — обычный (URL)" />
            <input id="pf_sp_bunny_happy" type="text" class="text_pole" placeholder="🐰 Зайчонок — радостный (URL)" />
          </div>
        </details>

        <div class="pf-settings-row" style="margin-top:6px;">
          <button id="pf_btn_open_stash" class="menu_button" type="button">📚 Открыть норку</button>
          <button id="pf_btn_reset_pos" class="menu_button" type="button">📍 Сбросить позицию</button>
        </div>
      </div>
    `;
    container.appendChild(wrapper);

    syncSettingsUI();

    const bind = (id, handler, evt = 'change') => {
      document.getElementById(id)?.addEventListener(evt, handler);
    };

    bind('pf_set_enabled', (e) => {
      getSettings().enabled = e.target.checked;
      saveSettings();
      refreshFamiliarAppearance();
    });

    bind('pf_set_species', (e) => {
      getSettings().species = e.target.value;
      saveSettings();
      refreshFamiliarAppearance();
    });

    bind('pf_set_name', (e) => {
      getSettings().customName = e.target.value;
      saveSettings();
      refreshFamiliarAppearance();
    }, 'input');

    bind('pf_set_autosnatch', (e) => {
      getSettings().autoSnatch = e.target.checked;
      saveSettings();
    });

    bind('pf_set_chance', (e) => {
      const v = Number(e.target.value) || 55;
      getSettings().snatchChance = v / 100;
      const lbl = document.getElementById('pf_set_chance_val');
      if (lbl) lbl.textContent = v + '%';
      saveSettings();
    }, 'input');

    bind('pf_set_rescue', (e) => {
      getSettings().rescueSwipes = e.target.checked;
      saveSettings();
    });

    bind('pf_set_idle', (e) => {
      getSettings().idleReminder = e.target.checked;
      saveSettings();
    });

    bind('pf_set_idlesec', (e) => {
      getSettings().idleSeconds = Math.max(15, Number(e.target.value) || 50);
      saveSettings();
    });

    bind('pf_set_night', (e) => {
      getSettings().nightMode = e.target.checked;
      saveSettings();
      refreshFamiliarAppearance();
    });

    const spriteFields = [
      ['pf_sp_fox_idle', 'foxIdle'],
      ['pf_sp_fox_happy', 'foxHappy'],
      ['pf_sp_bunny_idle', 'bunnyIdle'],
      ['pf_sp_bunny_happy', 'bunnyHappy'],
    ];
    for (const [elId, key] of spriteFields) {
      bind(elId, (e) => {
        getSettings().customSprites[key] = e.target.value.trim();
        saveSettings();
        refreshFamiliarAppearance();
      });
    }

    document.getElementById('pf_btn_open_stash')?.addEventListener('click', openScrapbook);
    document.getElementById('pf_btn_reset_pos')?.addEventListener('click', () => {
      const s = getSettings();
      s.position = null;
      saveSettings();
      const widget = document.getElementById('pf-widget');
      if (widget) {
        widget.style.left = '';
        widget.style.top = '';
        widget.style.right = '18px';
        widget.style.bottom = '110px';
        updateBubbleDocking();
      }
    });
  }

  // ---------- Main Initialization ----------
  function initPocketFamiliar() {
    if (runtime.initialized) return;
    const ctx = getSTContext();
    if (!ctx) return;
    runtime.initialized = true;

    mountFloatingUI();
    mountSettingsPanel();
    setupInputAndIdleWatcher();
    handleChatChanged();

    const { eventSource, event_types } = ctx;
    if (eventSource && event_types) {
      const on = (evtName, fn) => {
        if (evtName) eventSource.on(evtName, fn);
      };
      on(event_types.MESSAGE_RECEIVED, () => setTimeout(handleBotMessageReceived, 250));
      on(event_types.MESSAGE_SENT, handleUserMessageSent);
      on(event_types.MESSAGE_SWIPED, () => setTimeout(handleMessageSwiped, 120));
      on(event_types.GENERATION_STARTED, handleGenerationStarted);
      on(event_types.GENERATION_ENDED, handleGenerationEnded);
      on(event_types.GENERATION_STOPPED, handleGenerationEnded);
      on(event_types.CHAT_CHANGED, () => setTimeout(handleChatChanged, 300));
    }

    setTimeout(() => {
      const s = getSettings();
      if (s.enabled) {
        const hour = new Date().getHours();
        if (s.nightMode && hour >= 1 && hour <= 5) {
          showBubble(pick(getProfile().lines.night), { state: 'sleep', prop: '💤', duration: 5500 });
        } else {
          showBubble('Я на посту! Пиши красиво — лучшие строчки утащу в норку.', {
            anim: 'hop',
            state: 'happy',
            duration: 4800,
          });
        }
      }
    }, 1200);
  }

  // Hook into SillyTavern lifecycle safely
  function bootstrap() {
    const ctx = getSTContext();
    if (ctx && ctx.eventSource && ctx.event_types?.APP_READY) {
      ctx.eventSource.on(ctx.event_types.APP_READY, () => setTimeout(initPocketFamiliar, 150));
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(initPocketFamiliar, 900);
    } else {
      window.addEventListener('DOMContentLoaded', () => setTimeout(initPocketFamiliar, 900));
    }
  }

  bootstrap();
})();
