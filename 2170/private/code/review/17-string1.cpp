//File: 17-string1.cc
//Purpose:  Practice with string functions:
//   - length()
//   - substr(x, y)
//   - find(x)
//   - string::npos
//   - toupper, tolower
#include <iostream>
#include <string>
using namespace std;

int main()
{
	string A = "I did not trip and fall. I attacked the floor and I believe I am winning.";
	string B = "and";
	int i;

	// string functions
	cout << A.length() << endl;
	cout << A.find(B) << endl;
	cout << A.substr(6,12) << endl;
	cout << A.substr(25).find(B) << endl;
	cout << A.substr(A.find("tr"),4) << endl;
	cout << A.substr(65,7).find(B.substr(1,1)) << endl;
	cout << A.find("end") << endl;
	cout << string::npos << endl;

        // characters in a string may be accessed individually using subscript
	for(i=0;i<A.length();i++)
		A[i] = toupper(A[i]);
	cout << A << endl;
	return 0;
}	
