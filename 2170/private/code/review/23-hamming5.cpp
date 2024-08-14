//File: 23-hamming5.cc
//Purpose: To read a file of 12-bit hamming code words 
//		correct any error
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
	int errorbit;
	int temp;
	int i,j;
	ifstream myin;

	myin.open("packets.dat");

	//read code word - I'm starting at 1 because it fits the 
	//algorithm better.  This means arraySize is one more than
	//I actually need, and I'm wasting bit zero... because it
	//fits the definition of hamming codes better. :-)
	for (i=1; i<arraySize; i++)
	{
		myin >> digit;
		hamming[i] = digit - '0';
	}
	while(myin)
	{
		
		//The error location is:
		// (b8+b9+b10+b11+b12)%2*8 +(b4+b5+b6+b7+b12)%2*4 + (b2+b3+b6+b7+b10+b11)%2*2 + (b1+b3+b5+b7+b9+b11)%2
		temp = 0;
		for(i=8;i<arraySize; i++)
			temp += hamming[i];
		temp %= 2;
		temp *= 8;
		errorbit = temp;

		temp = 0;
		for(i=4; i<8; i++)
			temp += hamming[i];
		temp += hamming[12];
		temp %= 2;
		temp *= 4;
		errorbit += temp;

		temp = 0;
		for(i=2; i<12;i+=4)
			temp = temp + hamming[i] + hamming[i+1];
		temp %= 2;
		temp *= 2;
		errorbit += temp;

		temp = 0;
		for(i=1;i<12;i+=2)
			temp += hamming[i];
		temp %= 2;
		errorbit += temp;

		if(errorbit)
		    hamming[errorbit] = (hamming[errorbit]+1)%2;
				
		
	
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

		//read next packet
		for (i=1; i<arraySize; i++)
		{
			myin >> digit;
			hamming[i] = digit - '0';
		}
	}
	
	//close file
	myin.close();
	cout << endl;

	return 0;
}
