# Creative thumbnails: (1) before/after split 10% -> 100%, (2) "brain loading" bar overheating.
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import sys
B = '/usr/share/fonts/opentype/inter/Inter-Black.otf'; W, H = 1920, 1080
def load(p, crop=0): return Image.open(p).convert('RGB')
def face_crop(im, cx, cy, size):  # square crop around the face
    return im.crop((cx - size // 2, cy - size // 2, cx + size // 2, cy + size // 2))
def glow_text(c, s, xy, size, fill, glow=None, stroke=12, anchor='mm'):
    f = ImageFont.truetype(B, size)
    if glow:
        g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).text(xy, s, font=f, fill=glow, anchor=anchor, stroke_width=stroke + 10, stroke_fill=glow)
        g = g.filter(ImageFilter.GaussianBlur(26)); c.paste(g, (0, 0), g)
    ImageDraw.Draw(c).text(xy, s, font=f, fill=fill, anchor=anchor, stroke_width=stroke, stroke_fill=(0, 0, 0))
S = 'build/stills/'
# ---------- 1. before / after
before = load(S + '105.6s_105.60.png'); after = load(S + '3.9s_3.90.png')
c = Image.new('RGB', (W, H))
L = ImageEnhance.Color(face_crop(before, 576, 600, 860)).enhance(0.15); L = ImageEnhance.Brightness(L).enhance(0.7).resize((980, 980))
R = ImageEnhance.Color(face_crop(after, 1344, 600, 860)).enhance(1.4).resize((1100, 1100))
c.paste(L, (-40, 150)); c.paste(R, (880, 40))
d = ImageDraw.Draw(c, 'RGBA')
d.polygon([(900, 0), (1060, 0), (980, H), (820, H)], fill=(0, 0, 0, 255))                       # jagged divider
for i in range(3): d.line([(980 - i * 4, 0), (900 - i * 4, H)], fill=(255, 230, 120, 200 - i * 60), width=6)
glow_text(c, '10%', (440, 170), 210, (170, 170, 180), stroke=12)
glow_text(c, '100%', (1430, 170), 230, (95, 242, 232), glow=(40, 220, 210))
# lightning bolt in the middle
bolt = [(1000, 380), (900, 600), (980, 600), (900, 820), (1080, 540), (990, 540), (1060, 380)]
g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).polygon(bolt, fill=(255, 210, 40, 255)); gb = g.filter(ImageFilter.GaussianBlur(30)); c.paste(gb, (0, 0), gb); c.paste(g, (0, 0), g)
ImageDraw.Draw(c).line(bolt + [bolt[0]], fill=(0, 0, 0), width=8)
c.resize((1280, 720), Image.LANCZOS).save('out/thumbnail_alt.png', quality=95)
# ---------- 2. brain loading bar, overheating
im = load(S + '3.9s_3.90.png'); c = ImageEnhance.Brightness(im.filter(ImageFilter.GaussianBlur(40))).enhance(0.4)
fc = ImageEnhance.Color(face_crop(im, 1344, 600, 860)).enhance(1.3).resize((1000, 1000)); c.paste(fc, (-120, 160))
red = Image.new('RGBA', (W, H), (255, 40, 20, 0)); rd = ImageDraw.Draw(red)
for r in range(700, 0, -20): rd.ellipse((380 - r, 520 - r, 380 + r, 520 + r), fill=(255, 40, 20, int(60 * (1 - r / 700))))
c.paste(red, (0, 0), red)
d = ImageDraw.Draw(c, 'RGBA')
x0, y0, w, h = 900, 430, 900, 150
d.rounded_rectangle((x0 - 14, y0 - 14, x0 + w + 14, y0 + h + 14), 40, fill=(10, 10, 16, 255), outline=(255, 255, 255, 255), width=10)
for i in range(10):
    col = (95, 242, 232) if i < 6 else (255, 190, 40) if i < 8 else (255, 60, 40)
    d.rounded_rectangle((x0 + 12 + i * (w - 24) / 10, y0 + 12, x0 + (i + 1) * (w - 24) / 10 + 4, y0 + h - 12), 14, fill=col + (255,))
d.rectangle((x0 + w + 14, y0 + 40, x0 + w + 44, y0 + h - 40), fill=(255, 255, 255, 255))   # battery nub
glow_text(c, 'BRAIN', (x0 + w / 2, 300), 150, (255, 255, 255))
glow_text(c, '⚠ 100%', (x0 + w / 2, 760), 150, (255, 70, 50), glow=(230, 30, 20)) if False else glow_text(c, '100% — OVERHEATING', (x0 + w / 2, 760), 74, (255, 70, 50), glow=(230, 30, 20))
c.resize((1280, 720), Image.LANCZOS).save('out/thumbnail_alt3.png', quality=95)
