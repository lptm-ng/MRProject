import random

# Makes a racetrack map and returns the coordinates of the path the track takes
# width - width of the map
# height - height of the map
# debug - enable debug prints
# randomize_start - moves the start to a random location on the path; if false, start will be near (0,0)
def make_loop(width,height,debug=False,randomize_start=True):
    if debug: print("Generating Path...")
    free_cell={}
    for x in range(1,width-1):
        for y in range(1, height-1):
            free_cell[(x,y)]=1
    path=[]
    for x in range(0,width):
        path.append((x,0))
    for y in range(1,height):
        path.append((width-1,y))
    for x in range(width-2,-1,-1):
        path.append((x,height-1))
    for y in range(height-2,-1,-1):
        path.append((0,y))

    cracks=random.randint(min(width,height),width+height)
    if debug: print("Adding Variety...")
    for i in range(cracks):
        crack_path(path,free_cell)

    if randomize_start:
        if debug: print("Randomizing starting position")
        path=randomize_path_start(path)
    if debug: print("Finished generating path")
    if debug: print(path)
    return path[:-1]

def crack_path(path,free_cells):
    pos=random.randrange(0,len(path))
    corn=-1
    i=pos
    while True:
        a = path[i-1]
        b = path[ i ]
        c = path[(i+1)%len(path)]
        if is_corner(a,b,c):
            if corn >= 0:
                i=i-1
                break
            else:
                corn=i
        i=(i+1)%len(path)
        

def randomize_path_start(path):
    path = path[:-1]
    steps=random.randrange(0,len(path))
    path=path[steps:]+path[:steps]
    path.append(path[0])
    return path

def is_corner(a,b,c):
    return abs(a[0]-b[0])+abs(b[0]-c[0])==1


if __name__ == "__main__":
    make_loop(8,5,True,True)
