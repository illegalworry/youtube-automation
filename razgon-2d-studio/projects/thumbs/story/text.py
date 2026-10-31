# Adds competitor-style text: a short heavy line with a period (yellow/white, thick black outline, drop shadow)
# and a small red tag. usage: python3 story/text.py in.png out.png "LINE1|LINE2" "TAG" x y [align] [size]
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import sys
src, out, lines, tag, x, y = sys.argv[1], sys.argv[2], sys.argv[3].split('|'), sys.argv[4], int(sys.argv[5]), int(sys.argv[6])
align = sys.argv[7] if len(sys.argv) > 7 else 'l'; size = int(sys.argv[8]) if len(sys.argv) > 8 else 190
F = '/usr/share/fonts/opentype/inter/Inter-Black.otf'
im = Image.open(src).convert('RGB'); im = ImageEnhance.Color(im).enhance(1.35); im = ImageEnhance.Contrast(im).enhance(1.08); im = ImageEnhance.Brightness(im).enhance(1.08)
d = ImageDraw.Draw(im); anc = 'la' if align == 'l' else 'ra'
cols = [(255, 214, 40), (255, 255, 255)]
yy = y
for i, ln in enumerate(lines):
    s = size if i == 0 else int(size * 0.78); f = ImageFont.truetype(F, s)
    d.text((x + 10, yy + 12), ln, font=f, fill=(0, 0, 0), anchor=anc, stroke_width=22, stroke_fill=(0, 0, 0))
    d.text((x, yy), ln, font=f, fill=cols[i % 2], anchor=anc, stroke_width=16, stroke_fill=(0, 0, 0))
    yy += int(s * 1.02)
if tag:
    f = ImageFont.truetype(F, 58); w = d.textlength(tag, font=f) + 50; h = 84
    tx = x if align == 'l' else x - w; ty = yy + 10
    tagim = Image.new('RGBA', (int(w) + 20, h + 20), (0, 0, 0, 0)); td = ImageDraw.Draw(tagim)
    td.rounded_rectangle((10, 10, w + 10, h + 10), 10, fill=(214, 40, 40), outline=(0, 0, 0), width=6)
    td.text((w / 2 + 10, h / 2 + 12), tag, font=f, fill=(255, 255, 255), anchor='mm')
    tagim = tagim.rotate(3 if align == 'l' else -3, expand=True, resample=Image.BICUBIC); im.paste(tagim, (int(tx), int(ty)), tagim)
im.resize((1280, 720), Image.LANCZOS).save(out, quality=95)
