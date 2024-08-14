/*File: 18-String3.cc
   Find the location of all the appearance of the word "apple" in the line of text read. For example, the user enters the sentence:
   My grandma used all the apples from the our orchard to make delicious apple butter and apple pie.
   Your program should output:
   The work "apple" appeared at locations: 24, 70, 87
   Two usage of function "substr":
      substr(x, y)
      substr(x)
*/

#include <iostream>
#include <string>
#include <cctype>
using namespace std;

int main()
{
	string instring;   // store the input sentence
	string remainstring;  // the part of the sentence remain to be examined
	string newstring = ""; 
	int position=0;  // keeps tract of the number of positions til the next appearance of "think"
	int location;   // location of the next appearance of "think"

        // prompt the user to enter a sentence
	cout << "input string: ";
	getline(cin,instring);

        // find the location of the first blank character in the sentence
	location = instring.find("apple");	

	cout << "The word apple appeared at locations: "; 

        // keep processing til passing the last appearance of " " in the sentence
	while(location != string::npos)
	{
		cout << location;
		location = instring.find("apple", location + 1);
		if (location != string::npos)
		    cout << ", ";
	}		
	cout << endl;

	return 0;
}
