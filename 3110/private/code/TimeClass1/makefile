CC=c++
CFLAGS=-g

## Create the executable RunProg
timeRun:time.o main.o
	$(CC) time.o main.o -o timeRun 

## Create the object file for the ADT time class 
time.o:time.cpp
	$(CC) $(CFLAGS) -c time.cpp

main.o:main.cpp
	$(CC) $(CFLAGS) -c main.cpp

clean:
	rm *.o
