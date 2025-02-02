from PIL import Image
import numpy as np
import random
import pathi as map_gen


def generate_random_map_image(width,height):
    straight = Image.open("racetrack/Straight.png").convert('L')
    grass = Image.open("racetrack/Grass.png")
    curve = Image.open("racetrack/Curve.png")
    canvas = Image.new('L', (width*100,height*100),255)
    #print(canvas)

    for i in range(width):
        for j in range(height):
            im = random.choice([grass, curve, straight])
            angle = random.choice([0,90,180,270])
            flip = random.choice([1, 0])
            im = im.rotate(angle)
            if flip == 1:
                im = im.transpose(Image.FLIP_LEFT_RIGHT)
            
            canvas.paste(im,(i*100,j*100))
    return canvas

def generate_map_image(width,height,path):
    straight_h = Image.open("racetrack/Straight.png").convert('L')
    grass = Image.open("racetrack/Grass.png")
    canvas = Image.new('L', (width*100,height*100),255)
    #print(canvas)

    straight_v = straight_h.copy()
    straight_v=straight_v.rotate(90)

    curve1 = Image.open("racetrack/Curve.png") # Left down
    curve2=curve1.copy()
    curve2=curve2.rotate(90) # Down Right
    curve3=curve2.copy()
    curve3=curve3.rotate(90) # Right Top
    curve4=curve3.copy()
    curve4=curve4.rotate(90) # Top Left

    tileDict={
        (3,0) : straight_h,
        (-3,0) : straight_h,
        (0,3) : straight_v,
        (0,-3) : straight_v,
        (2,1) : curve1,
        (-1,-2) : curve1,
        (-2,1) : curve2,
        (1,-2) : curve2,
        (-2,-1) : curve3,
        (1,2) : curve3,
        (2,-1) : curve4,
        (-1,2) : curve4
    }

    for i in range(width):
        for j in range(height):
            canvas.paste(grass,(i*100,j*100))

    for i in range(len(path)):
        a=path[i-1]
        b=path[i]
        c=path[(i+1)%len(path)]
        cd=((b[0]+c[0]-2*a[0]),(b[1]+c[1]-2*a[1])) # coordinate difference
        canvas.paste(tileDict.get(cd,grass),(b[0]*100,b[1]*100))

    return canvas

def do_stuff():
    w=6
    h=6
    path=map_gen.make_loop(w,h)
    canvas=generate_map_image(w,h,path)
    canvas.save("racetrack/canvas.png")

if __name__=="__main__":
    do_stuff()