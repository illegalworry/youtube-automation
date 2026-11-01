# Ifverse-style text: line 1 white, line 2 yellow with a period, chunky Lilita One, dark outline + soft drop shadow,
# optional small red tag below. Works on the 1920x1080 still.
# usage: python3 story/text2.py in.png out.png "LINE1|LINE2" "TAG" [x] [y] [size] [align L|R] [out_width]
#   align R: x is the margin from the right edge.  out_width: 1280 (default) or 1920 for full 1080p.
import sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
src, out, lines, tag = sys.argv[1], sys.argv[2], sys.argv[3].split('|'), sys.argv[4]
x = int(sys.argv[5]) if len(sys.argv) > 5 else 70; y = int(sys.argv[6]) if len(sys.argv) > 6 else 50; size = int(sys.argv[7]) if len(sys.argv) > 7 else 170
align = (sys.argv[8] if len(sys.argv) > 8 else 'L').upper(); ow = int(sys.argv[9]) if len(sys.argv) > 9 else 1280
F = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fonts', 'LilitaOne.ttf')
im = Image.open(src).convert('RGBA'); im = ImageEnhance.Color(im).enhance(1.15)
cols = [(255, 255, 255), (255, 212, 28)]; outline = (16, 12, 24)
sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
fg = Image.new('RGBA', im.size, (0, 0, 0, 0)); fd = ImageDraw.Draw(fg)
yy = y; f = ImageFont.truetype(F, size)
for i, ln in enumerate(lines):
    lx = x if align == 'L' else im.width - x - int(fd.textlength(ln, font=f))
    sd.text((lx + 8, yy + 14), ln, font=f, fill=(0, 0, 0, 200), stroke_width=14, stroke_fill=(0, 0, 0, 200))
    fd.text((lx, yy), ln, font=f, fill=cols[i % 2] + (255,), stroke_width=11, stroke_fill=outline + (255,))
    yy += int(size * 0.92)
if tag:
    tf = ImageFont.truetype(F, 54); w = int(fd.textlength(tag, font=tf)) + 44; h = 76
    t = Image.new('RGBA', (w + 20, h + 20), (0, 0, 0, 0)); td = ImageDraw.Draw(t)
    td.rounded_rectangle((10, 10, w + 10, h + 10), 8, fill=(222, 38, 38), outline=(255, 255, 255), width=4)
    td.text((w / 2 + 10, h / 2 + 12), tag, font=tf, fill=(255, 255, 255), anchor='mm')
    t = t.rotate(2.5, expand=True, resample=Image.BICUBIC)
    fg.alpha_composite(t, (x + 4 if align == 'L' else im.width - x - t.width - 4, yy + 18))
im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8))); im.alpha_composite(fg)
im = im.convert('RGB')
if ow != im.width: im = im.resize((ow, round(ow * im.height / im.width)), Image.LANCZOS)
im.save(out, quality=95)
