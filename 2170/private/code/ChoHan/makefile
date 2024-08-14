CC=c++
CFLAGS=-g

## Create the executable Run
Run:Die.o Dealer.o Player.o main.o
	$(CC) Die.o Dealer.o Player.o main.o -o Run 

Die.o:Die.cpp
	$(CC) $(CFLAGS) -c Die.cpp

Dealer.o:Dealer.cpp
	$(CC) $(CFLAGS) -c Dealer.cpp

Player.o:Player.cpp
	$(CC) $(CFLAGS) -c Player.cpp

main.o:main.cpp
	$(CC) $(CFLAGS) -c main.cpp

clean:
	rm *.o
