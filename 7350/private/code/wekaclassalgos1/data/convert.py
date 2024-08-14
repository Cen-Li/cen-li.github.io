if (__name__ == '__main__'):   
    
    readfile = open('breast-cancer.data', 'r')
    alllines = readfile.readlines()
    resultfile = open('bc', 'w')

    for line in alllines:
        data=line.split(',')
        i=0
	for l in data:
            if i!=0 and i<len(data)-1:
               resultfile.write(l)
               resultfile.write(',')
            elif i==len(data)-1:
               resultfile.write(l)
            i += 1
