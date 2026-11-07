// Lyrics with word start times (seconds in input/song.m4a) and one animated card per line.
// word: [text, start, accent?]  accent = CSS colour of the karaoke fill for highlighted words.
const GOLD = '#ffd36b', PINK = '#ff6fae', SKY = '#7fd4ff', ORANGE = '#ffb15c', VIOLET = '#c9a2ff', MINT = '#7cf2c4';
window.SONG = {
  end: 24.03,
  lines: [
    { words: [['Сен', 0.05], ['белең', 0.62], ['мени', 1.58], ['жашоодо', 2.02, GOLD], ['күткөн?', 2.80, PINK]],
      card: { type: 'radar', tint: '#7a3cff', kicker: 'ПОИСК · ВСЮ ЖИЗНЬ', icon: '📡', found: 2.80,
        emojis: [{ e: '💫', at: 0.35, x: -365, y: -150 }, { e: '💗', at: 2.85, x: 360, y: 120, size: 64 }] } },
    { words: [['Эй', 4.40], ['досум,', 5.02], ['карачы', 5.38], ['жерге', 6.38, SKY], ['тийбей', 6.82, SKY], ['басканын', 7.16]],
      card: { type: 'sensor', tint: '#3d8bff', kicker: 'ДАТЧИК · ПОХОДКА', icon: '👣', toast: 4.40, rise: 6.38, fly: 6.82,
        emojis: [{ e: '👀', at: 5.40, x: 360, y: -140, size: 62 }, { e: '🪽', at: 6.9, x: -370, y: 110 }] } },
    { words: [['Жүр,', 7.98], ['артынан', 8.30, ORANGE], ['эрчилийчи', 8.82], ['карабастан', 9.56], ['башканы', 10.56, PINK]],
      card: { type: 'navigator', tint: '#ff7a3c', kicker: 'НАВИГАТОР · ЗА НЕЙ', icon: '🧭', go: 8.30, toggle: 9.56,
        emojis: [{ e: '🏃‍♂️', at: 8.35, x: -370, y: -120 }, { e: '🙈', at: 10.6, x: 365, y: 120, size: 60 }] } },
    { words: [['Узун', 11.36], ['чачтары,', 12.30, VIOLET], ['артка', 13.72], ['ташталып', 14.06, VIOLET]],
      card: { type: 'hair', tint: '#a45cff', kicker: 'ВЕТЕР · ВОЛОСЫ', icon: '🌬️', grow: 11.36, back: 13.72,
        emojis: [{ e: '✨', at: 12.35, x: 360, y: -150 }, { e: '🍃', at: 13.75, x: -380, y: 90, size: 58 }] } },
    { words: [['Сүйүп', 14.72, PINK], ['калдым', 15.30, PINK], ['деп', 15.72], ['айтпаймынбы,', 15.96], ['балким', 16.62], ['кетет', 16.80], ['башталып', 17.22, GOLD]],
      card: { type: 'dialog', tint: '#ff3d8b', kicker: 'СООБЩЕНИЕ · ЕЙ', icon: '💌', click: 16.0, start: 16.62,
        question: 'Сказать «Сүйүп калдым»?', burst: [{ at: 14.72, e: '💖', n: 14 }],
        emojis: [{ e: '🥺', at: 15.0, x: -370, y: -130, size: 60 }, { e: '💘', at: 16.65, x: 365, y: 125, size: 64 }] } },
    { words: [['Жакын', 18.14], ['барып', 18.78], ['таанышып,', 19.12, MINT], ['бири', 20.18], ['бизге', 20.38], ['жагышып', 20.80, PINK]],
      card: { type: 'contact', tint: '#ff5fa2', kicker: 'ЗНАКОМСТВО · НОВОЕ', icon: '🤝', meet: 19.12, like: 20.18, mutual: 20.80,
        burst: [{ at: 19.25, e: '💞', n: 10 }],
        emojis: [{ e: '😊', at: 18.3, x: -370, y: -125, size: 60 }, { e: '🥰', at: 20.85, x: 365, y: 120, size: 64 }] } },
    { words: [['Көз', 21.56, GOLD], ['караштар', 21.92, GOLD], ['алышып', 22.66, PINK]],
      card: { type: 'eyes', tint: '#ff7a3c', kicker: 'ВЗГЛЯД · НАВСТРЕЧУ', icon: '✨', look: 21.92, spark: 22.66,
        burst: [{ at: 22.66, e: '✨', n: 16 }, { at: 22.7, e: '❤️', n: 8 }],
        emojis: [{ e: '😳', at: 22.0, x: -370, y: -125, size: 60 }, { e: '⚡', at: 22.68, x: 365, y: 120, size: 64 }] } },
  ],
};
