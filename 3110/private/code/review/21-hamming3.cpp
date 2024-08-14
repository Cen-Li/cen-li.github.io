//File: 21-hamming3.cc
//Purpose: To read 8 12-bit hamming code words from a file
//		extract each message, and
//		print each character.  

#include <iostream>
#include <fstream>

#define arraySize 13
using namespace std;
int main()
{
	int hamming[arraySize];
	char digit;
	int message;
	int i,j;
	ifstream myin;

	myin.open("packets.dat");

	for(j=0; j<8; j++)
	{
		//read code word - I'm starting at 1 because it fits the 
		//algorithm better.  This means arraySize is one more than
		//I actually need, and I'm wasting bit zero... because it
		//fits the definition of hamming codes better. :-)
		for (i=1; i<arraySize; i++)
		{
			myin >> digit;
			hamming[i] = digit - '0';
		}
	
		//message is in bits 3, 5, 6, 7, 9, 10, 11, and 12
		//The algorithm is: 
		// b3*128 + b5*64 + b6*32 + b7*16 + b9*8 + b10*4 + b11*2 + b12
		message = hamming[3];
		for(i=5; i<arraySize; i++)
		{
			if(i != 8)
			{
				message *= 2;
				message += hamming[i];	
			}
		}
	
		//print the message
		cout << char(message);
	}
	
	//close file
	myin.close();
	cout << endl;


	return 0;
}
