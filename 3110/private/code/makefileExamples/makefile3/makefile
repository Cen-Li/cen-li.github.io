CC=c++
CFLAGS=-g

## Create the executable RunProg
RunProg:Sphere.o MainProgram.o
	$(CC) Sphere.o MainProgram.o -o RunProg

## Create the object file for the ADT Sphere
Sphere.o:Sphere.cpp
	$(CC) $(CFLAGS) -c Sphere.cpp

MainProgram.o:MainProgram.cpp
	$(CC) $(CFLAGS) -c MainProgram.cpp

clean: 
	rm *.o
