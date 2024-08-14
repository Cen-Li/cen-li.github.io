CC=c++
CFLAGS=-g

## Create the executable RunProg
sortedListRun:sortedList.o type.o main.o
	$(CC) sortedList.o type.o main.o -o sortedListRun 

## Create the object file for the ADT time class 
type.o:type.cpp
	$(CC) $(CFLAGS) -c type.cpp

sortedList.o:sortedList.cpp
	$(CC) $(CFLAGS) -c sortedList.cpp

main.o:main.cpp
	$(CC) $(CFLAGS) -c main.cpp

clean:
	rm *.o
