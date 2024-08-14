CC=g++
CFLAGS=-I.

inventory: inventory.o 
	$(CC) $(CFLAGS) inventory.o -o inventory 

inventory.o: inventory.cpp
	$(CC) $(CFLAGS) -c inventory.cpp

clean:
	rm *.o 
