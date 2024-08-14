//File: 24-hammingFunc.cc
//Purpose: To read a file of 12-bit hamming code words 
//		correct any error
//		extract each message, and
//		print each character.  

#include <iostream>
#include <fstream>
using namespace std;
#define arraySize 13

void ReadPacket(int hamming[13], ifstream& myin);
int FindError(int hamming[13]);
int ExtractMessage(int hamming[13]);

int main()
{
	int hamming[arraySize];
	char digit;
	int message;
	int errorbit;
	int i,j;
	ifstream myin;

	myin.open("packets.dat");

	ReadPacket(hamming,myin);

	while(myin)
	{
		errorbit = FindError(hamming);
		if(errorbit)
			hamming[errorbit] = (hamming[errorbit]+1)%2;
				
		//print the message
		cout << char(ExtractMessage(hamming));

		//read next packet
		ReadPacket(hamming,myin);
	}
	
	//close file
	myin.close();
	cout << endl;


	return 0;
}

//function:  ReadPacket reads the packets from the file into the array
//read code word - I'm starting at 1 because it fits the 
//algorithm better.  This means arraySize is one more than
//I actually need, and I'm wasting bit zero... because it
//fits the definition of hamming codes better. :-)

void ReadPacket(int hamming[13], ifstream& myin)
{
	int i;
	char digit;

	for (i=1; i<arraySize; i++)
	{
		myin >> digit;
		hamming[i] = digit - '0';
	}

	return;
}


//function: FindError returns the location of the error
//The error location is:
// (b8+b9+b10+b11+b12)%2*8 +(b4+b5+b6+b7+b12)%2*4 + (b2+b3+b6+b7+b10+b11)%2*2 + (b1+b3+b5+b7+b9+b11)%2
//Return of 0 means there is no error

int FindError(int hamming[13])
{
	int temp, errorbit;
	int i;

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

	return errorbit;
}


//Function:  ExtractMessage determines the message embedded in the code word
//message is in bits 3, 5, 6, 7, 9, 10, 11, and 12
//The algorithm is: 
// b3*128 + b5*64 + b6*32 + b7*16 + b9*8 + b10*4 + b11*2 + b12

int ExtractMessage(int hamming[13])
{
	int message;
	int i;

	message = hamming[3];
	for(i=5; i<arraySize; i++)
	{
		if(i != 8)
		{
			message *= 2;
			message += hamming[i];	
		}
	}

	return message;
}
