/*File: 18-String3.cc
This program prompts the user to enter a sentence and outputs the sentence with the first letter of each word captalized.  For example, the user enters the sentence: 
We drank our coffee the Russian way. That is to say we had vodka before it and vodka afterwards.

	Your program should output:
	We Drank Our Coffee The Russian Way. That Is To Say We Had Vodka Before It And Vodka Afterwards.

		with the word "answer"
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

        // find the location of the first "think" in the sentence
	location = instring.find(" ");	
        // keep processing til passing the last appearance of "think" in the sentence

	while(location != string::npos)
	{
		instring[location+1] = toupper(instring[location+1]);
		location = instring.find(" ", location + 1);
	}		
	cout << "Converted to: ";
	cout << instring<< endl;
	return 0;
}
