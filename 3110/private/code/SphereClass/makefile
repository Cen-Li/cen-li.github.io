CC=c++
CFLAGS=-g

## Create the executable RunProg
RunProg:Sphere.o main.o
	$(CC) Sphere.o main.o -o RunProg

## Create the object file for the ADT Sphere
Sphere.o:Sphere.cpp
	$(CC) $(CFLAGS) -c Sphere.cpp

main.o:main.cpp
	$(CC) $(CFLAGS) -c main.cpp

clean: 
	rm *.o
