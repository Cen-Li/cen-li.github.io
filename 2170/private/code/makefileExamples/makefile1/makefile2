CC=c++
CFLAGS=-I.

convert: convert.o 
	$(CC) $(CFLAGS) convert.o -o convert

convert.o: convert.cpp
	$(CC) $(CFLAGS) -c convert.cpp

clean:
	rm *.o 
