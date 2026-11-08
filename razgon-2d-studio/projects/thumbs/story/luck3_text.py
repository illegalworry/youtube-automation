# Text for the 3 clickbait thumbnails (Lilita One, white/yellow, dark outline + shadow, red plaque with white frame).
# usage (from projects/thumbs/): python3 story/luck3_text.py   -> ../luck9/out/clickbait3/*.png
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
HERE = os.path.dirname(os.path.abspath(__file__)); F = os.path.join(HERE, 'fonts', 'LilitaOne.ttf')
OUT = os.path.join(HERE, '..', '..', 'luck9', 'out', 'clickbait3'); os.makedirs(OUT, exist_ok=True)
COLS = [(255, 255, 255), (255, 212, 28)]; OUTLINE = (16, 12, 24)

def block(im, lines, x, y, size, align='L', cols=COLS, stroke=11, rot=0):
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
    fg = Image.new('RGBA', im.size, (0, 0, 0, 0)); fd = ImageDraw.Draw(fg)
    f = ImageFont.truetype(F, size); yy = y
    for i, ln in enumerate(lines):
        w = int(fd.textlength(ln, font=f)); lx = x if align == 'L' else (im.width - x - w if align == 'R' else x - w // 2)
        sd.text((lx + 8, yy + 14), ln, font=f, fill=(0, 0, 0, 210), stroke_width=stroke + 3, stroke_fill=(0, 0, 0, 210))
        fd.text((lx, yy), ln, font=f, fill=cols[i % len(cols)] + (255,), stroke_width=stroke, stroke_fill=OUTLINE + (255,))
        yy += int(size * 0.92)
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8))); im.alpha_composite(fg)
    return yy

def plaque(im, label, x, y, size=54, align='L', rot=2.5, fill=(222, 38, 38)):
    f = ImageFont.truetype(F, size); d = ImageDraw.Draw(im); w = int(d.textlength(label, font=f)) + 50; h = int(size * 1.4)
    t = Image.new('RGBA', (w + 20, h + 20), (0, 0, 0, 0)); td = ImageDraw.Draw(t)
    td.rounded_rectangle((10, 10, w + 10, h + 10), 8, fill=fill, outline=(255, 255, 255), width=4)
    td.text((w / 2 + 10, h / 2 + 12), label, font=f, fill=(255, 255, 255), anchor='mm')
    t = t.rotate(rot, expand=True, resample=Image.BICUBIC)
    px = x if align == 'L' else (im.width - x - t.width if align == 'R' else x - t.width // 2)
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); sh.paste((0, 0, 0, 190), (px + 6, y + 10), t.split()[3]); im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(7)))
    im.alpha_composite(t, (px, y))

S = os.path.join(HERE, '..', 'build', 'stills')
def load(name): return ImageEnhance.Color(Image.open(os.path.join(S, name)).convert('RGBA')).enhance(1.12)
def save(im, name): im.convert('RGB').save(os.path.join(OUT, name), quality=95)

# 1 — split: DAY 1 | DAY 9
im = load('1s_1.00.png')
block(im, ['DAY 1'], 60, 30, 190, 'L', [(255, 226, 40)], 12)
block(im, ['DAY 9'], 60, 30, 190, 'R', [(255, 255, 255)], 12)
plaque(im, 'WHAT HAPPENED?', 960, 945, 76, 'C', 0)
save(im, '01_day1_vs_day9.png')
# 2 — terrified
im = load('3s_3.00.png')
y = block(im, ['FINALLY', 'SCARED.'], 70, 40, 150, 'L')
plaque(im, 'AFTER 8 DAYS', 74, y + 18)
save(im, '02_finally_scared.png')
# 3 — laughing at the truck
im = load('5s_5.00.png')
y = block(im, ["I CAN'T", 'DIE.'], 70, 80, 165, 'L')
plaque(im, '9 DAYS OF LUCK', 74, y + 18)
save(im, '03_i_cant_die.png')
print('ok')
