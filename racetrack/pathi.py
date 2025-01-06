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
    for y in range(height-2,0,-1):
        path.append((0,y))

    cracks=random.randint(min(width,height),width+height)
    if debug: print("Adding Variety...")
    for i in range(cracks):
        path,free_cell=crack_path(path,free_cell)

    if randomize_start:
        if debug: print("Randomizing starting position")
        path=randomize_path_start(path)
    if debug: print("Finished generating path")
    if debug: print(path)
    return path

def crack_path(path,free_cells):
    pos=random.randrange(0,len(path))
    corn=-1
    i=pos
    crack_len=0
    while crack_len<len(path):
        a = path[i-1]
        b = path[ i ]
        c = path[(i+1)%len(path)]
        if is_corner(a,b,c):
            if corn >= 0:
                break
            else:
                corn=crack_len+1
        i=(i+1)%len(path)
        crack_len+=1
    crack_len=random.randrange(1,crack_len+1)
    if crack_len<corn: # Cracking a straight
        o=path[pos] # Origin
        crack_dir=(path[(pos+crack_len)%len(path)][0]-path[pos][0],path[(pos+crack_len)%len(path)][1]-path[pos][1])
        mov_vec=(int(crack_dir[0]/abs(crack_dir[0])) if crack_dir[0]!=0 else 0,(int(crack_dir[1]/abs(crack_dir[1])) if crack_dir[1]!=0 else 0))
        m=random.randrange(0,2)*2-1
        crack_dir=(int(crack_dir[1]!=0)*m,int(crack_dir[0]!=0)*m)
        print(pos,crack_len,crack_dir)
        crack_depth=0
        while True:
            row_free=True
            crack_depth+=1
            row_o = (o[0]+crack_depth*crack_dir[0],o[1]+crack_depth*crack_dir[1]) # Row-Origin
            for i in range(crack_len+1):
                nc=(row_o[0]+mov_vec[0]*i,row_o[1]+mov_vec[1]*i)
                if free_cells.get(nc,0)!=1:
                    row_free=False
                    break
            if not row_free:
                break
        print("Cracking Straight: ",o,crack_len,crack_dir,crack_depth,mov_vec)
        if crack_depth>1:
            crack_depth=random.randrange(1,crack_depth)
            #Clear all tiles that are being cracked
            for i in range(1,crack_len):
                free_cells[path[(pos+i)%len(path)]]=1
            print("Before",path)
            new_path_seg=[]
            for i in range(1,crack_depth+1):
                new_path_seg.append((o[0]+crack_dir[0]*i,o[1]+crack_dir[1]*i))
            for i in range(1,crack_len+1):
                new_path_seg.append((o[0]+crack_dir[0]*crack_depth+mov_vec[0]*i,o[1]+crack_dir[1]*crack_depth+mov_vec[1]*i))
            for i in range(crack_depth-1,0,-1):
                new_path_seg.append((o[0]+crack_dir[0]*(i)+mov_vec[0]*crack_len,o[1]+crack_dir[1]*(i)+mov_vec[1]*crack_len))
            for i in new_path_seg:
                free_cells[i]=0
            if pos+crack_len>len(path):
                path=path[(pos+crack_len)%len(path):pos+1]+new_path_seg
            else:
                path=path[:pos+1]+new_path_seg+path[pos+crack_len:]
            print("After",path)
        print("Done making Straight Crack")
    else:   # Cracking a Corner
        o = path[pos] # Origin
        e = path[(pos+crack_len)%len(path)] # End
        #cv = (int((path[(pos+crack_len)%len(path)][0]-path[pos][0])>0)*2-1,int((path[(pos+crack_len)%len(path)][1]-path[pos][1])>0)*2-1)# Corner Vector
        all_free=True
        #print("Making Corner Crack", crack_len)
        #print(o)
        for i in range(1,crack_len):
            c=path[(pos+crack_len-i)%len(path)]
            c=(o[0]-(c[0]-e[0]),o[1]-(c[1]-e[1]))
            #print("Original:",path[(pos+crack_len-i)%len(path)])
            #print("New:",c)
            if free_cells.get(c,0)!=1:
                all_free=False
                #print("Failed")
                break
        #print(path[(pos+crack_len)%len(path)])
        if all_free:
            new_path_seg=path[pos+1:pos+crack_len]+(path[0:(pos+crack_len)%len(path)] if (pos+crack_len)>len(path) else [])
            for i in range(1,crack_len):
                c=path[(pos+crack_len-i)%len(path)]
                nc=(o[0]-(c[0]-e[0]),o[1]-(c[1]-e[1]))
                free_cells[c]=1
                free_cells[nc]=0
                #print(i-1)
                new_path_seg[i-1]=nc
            for i in range(1,crack_len):
                path[(pos+i)%len(path)]=new_path_seg[i-1]
        print("Done making Corner Crack")

    return path,free_cells


def randomize_path_start(path):
    #path = path[:-1]
    steps=random.randrange(0,len(path))
    path=path[steps:]+path[:steps]
    #path.append(path[0])
    return path

def move_start_to_next_straight(path):
    i=0
    started=False
    while (not started) or i!=0:
        started=True


def is_corner(a,b,c):
    return abs(a[0]-b[0])+abs(b[0]-c[0])==1


if __name__ == "__main__":
    make_loop(8,5,True,False)