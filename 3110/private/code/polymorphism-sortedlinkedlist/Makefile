CC=g++
## Create the executable RunProg
run:    mammal.o  dog.o  showdog.o sortedListClass.o main.o
	$(CC) mammal.o dog.o showdog.o sortedListClass.o main.o -o run

## Create the object file for the mammal, dog, showdog, and sortedListClass classes
mammal.o:	mammal.cpp
	$(CC) -c mammal.cpp

dog.o:	dog.cpp
	$(CC) -c dog.cpp

showdog.o:	showdog.cpp
	$(CC) -c showdog.cpp

main.o:	main.cc
	$(CC) -c  main.cc

clean: 
	rm *.o
