if (__name__ == '__main__'):   
    
    readfile = open('cancerBefore.data', 'r')
    alllines = readfile.readlines()
    resultfile = open('cancerAfter.data', 'w')

    for line in alllines:
        data=line.split(',')
        i=0
        for l in data:
            if i==22 or i==20 or i==23 or i==27 or i==7 or i==2 or i==3 or i==0:
               resultfile.write(l)
               resultfile.write(',')
            elif i==len(data)-1:
               resultfile.write(l)
            i += 1
