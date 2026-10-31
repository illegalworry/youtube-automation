from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import sys
src=sys.argv[1]; out=sys.argv[2]
F='/usr/share/fonts/opentype/inter/Inter-Black.otf'
im=Image.open(src).convert('RGB')
# crop: face is in left/centre of 1920x1080 frame; shift so face sits left third
W,H=1920,1080
canvas=Image.new('RGB',(W,H),(10,10,20))
k=1.15; canvas.paste(im.resize((int(W*k),int(H*k))),(int(520-560*k),int(600-600*k)))
canvas=ImageEnhance.Contrast(canvas).enhance(1.12); canvas=ImageEnhance.Color(canvas).enhance(1.25)
# darken right side gradient for text
grad=Image.new('L',(W,H)); gd=ImageDraw.Draw(grad)
for x in range(W): gd.line([(x,0),(x,H)],fill=int(max(0,min(200,(x-980)*0.5))))
canvas=Image.composite(Image.new('RGB',(W,H),(6,6,14)),canvas,grad)
d=ImageDraw.Draw(canvas)
def txt(s,xy,size,fill,stroke=10,anchor='la',glow=None):
    f=ImageFont.truetype(F,size)
    if glow:
        g=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(g).text(xy,s,font=f,fill=glow,anchor=anchor,stroke_width=stroke+8,stroke_fill=glow)
        g=g.filter(ImageFilter.GaussianBlur(28)); canvas.paste(g,(0,0),g)
    ImageDraw.Draw(canvas).text(xy,s,font=f,fill=fill,anchor=anchor,stroke_width=stroke,stroke_fill=(0,0,0))
txt('THINK',(1440,250),190,(255,255,255),anchor='mm')
txt('10x',(1440,510),360,(255,196,40),stroke=14,anchor='mm',glow=(255,140,30,200))
txt('FASTER?',(1440,780),190,(255,255,255),anchor='mm')
canvas.resize((1280,720),Image.LANCZOS).save(out,quality=95)
