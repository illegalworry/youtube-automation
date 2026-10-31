# Thumbnail compositor: a full-res still (face on the left) + big glowing text on the right. 1280x720 out.
# usage: python3 story/thumbnail.py <still.png> <out.png> '<json lines>' [faceX] [zoom]
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import sys, json
src, out = sys.argv[1], sys.argv[2]; L = json.loads(sys.argv[3]); fx = float(sys.argv[4]) if len(sys.argv) > 4 else 560; k = float(sys.argv[5]) if len(sys.argv) > 5 else 1.35
F = '/usr/share/fonts/opentype/inter/Inter-Black.otf'; W, H = 1920, 1080
im = Image.open(src).convert('RGB').crop((0, int(sys.argv[6]) if len(sys.argv) > 6 else 70, 1920, 1080 - (int(sys.argv[6]) if len(sys.argv) > 6 else 70))).resize((W, H))      # drop letterbox bars
canvas = ImageEnhance.Brightness(im.filter(ImageFilter.GaussianBlur(40))).enhance(0.45)
canvas.paste(im.resize((int(W * k), int(H * k))), (int(520 - fx * k), int(540 - 540 * k)))
canvas = ImageEnhance.Contrast(canvas).enhance(1.12); canvas = ImageEnhance.Color(canvas).enhance(1.3)
grad = Image.new('L', (W, H)); gd = ImageDraw.Draw(grad)
for x in range(W): gd.line([(x, 0), (x, H)], fill=int(max(0, min(250, (x - 1000) * 0.7))))
canvas = Image.composite(Image.new('RGB', (W, H), (6, 6, 14)), canvas, grad)
def txt(s, xy, size, fill, glow=None):
    f = ImageFont.truetype(F, size)
    if glow:
        g = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(g).text(xy, s, font=f, fill=glow, anchor='mm', stroke_width=20, stroke_fill=glow)
        g = g.filter(ImageFilter.GaussianBlur(30)); canvas.paste(g, (0, 0), g)
    ImageDraw.Draw(canvas).text(xy, s, font=f, fill=fill, anchor='mm', stroke_width=12, stroke_fill=(0, 0, 0))
for t, size, col, gl, y in L: txt(t, (1450, y), size, tuple(col), tuple(gl) if gl else None)
canvas.resize((1280, 720), Image.LANCZOS).save(out, quality=95)
