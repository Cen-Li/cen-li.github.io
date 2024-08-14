CC=c++
CFLAGS=-I.

convert: convertMain.o convertFunc.o 
	$(CC) $(CFLAGS) convertMain.o convertFunc.o -o convert

convertMain.o: convertMain.cpp 
	$(CC) $(CFLAGS) -c convertMain.cpp 

convertFunc.o: convertFunc.cpp 
	$(CC) $(CFLAGS) -c convertFunc.cpp

clean:
	rm *.o 
