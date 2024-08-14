//File: 20-hamming.cc
//Purpose: To read a 12-bit hamming code word from a file
//	extract the message, and print the character.  

#include <iostream>
#include <fstream>
#include <cassert>

#define arraySize 13
using namespace std;
int main()
{
	int hamming[arraySize];
	char digit;
	int message;
	int i;
	ifstream myin;

	myin.open("packets.dat");
	assert(myin);

	//read code word - I'm starting at 1 because it fits the 
	//algorithm better.  This means arraySize is one more than
	//I actually need, and I'm wasting bit zero... because it
	//fits the definition of hamming codes better. :-)
	for (i=1; i<arraySize; i++) {
		myin >> digit;
		hamming[i] = digit - '0';
	}

	//message is in bits 3, 5, 6, 7, 9, 10, 11, and 12
	//The algorithm is: 
	// b3*128 + b5*64 + b6*32 + b7*16 + b9*8 + b10*4 + b11*2 + b12
	message = hamming[3];
	// compute with bit 3 to 12
	for(i=5; i<arraySize; i++) {
		if(i != 8) {  // skip over bit 8
			message *= 2;
			message += hamming[i];	
		}
	}

	//print the message
	cout << char(message) << endl;

	//close file
	myin.close();
	return 0;
}
