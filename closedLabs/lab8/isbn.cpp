#include <iostream>
#include <string>
#include <fstream>
#include <cstdlib>  // atoi is defined
#include <cassert>
using namespace std;

// Function Prototypes
//Provide function prototypes for CheckDigit and IsValidISBN
int CheckDigit(const string isbn, int length);
bool IsValidISBN(string isbn);

int main( )
{
	string		isbn;		//ISBN number to be processed	
	bool		isValid;	//indicates if the isbn is valid
	ifstream	myIn;

	myIn.open("isbn.dat");
	assert(myIn);
	while ( myIn >> isbn)	//read a ISBN number from data file
 	{
 		// Add statement that makes the function call to find out the value of isValid.
 		isValid = IsValidISBN(isbn);

 		if ( isValid )	
			cout << isbn << " is a valid ISBN number" << endl;
     		else
 			cout << isbn << " is not a valid ISBN number" << endl;
	}

	myIn.close();
     	return 0;
}
 
// Define CheckDigit function here. 
int CheckDigit(const string isbn, int length)
{
	int sum=0;
	int result;
 	for (int i=0; i<length; i+=2) {
	    sum += (isbn[i]-'0')*1 + (isbn[i+1]-'0')*3;
	}
	result = 10 - sum%10;
	if (result < 10)
	    return result;
	else 
	    return 0;
} 
 
// Define the IsValidISBN function here.
bool IsValidISBN(string isbn)
{ 
     if (CheckDigit(isbn, isbn.length()-1) == isbn[isbn.length()-1]-'0')
     	return true;
     else
     	return false;
}
