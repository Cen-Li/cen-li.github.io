//File: 18-String2.cc
//Purpose:  This program will read a string and replace all occurances of the word "think"
//		with the word "answer"
//   Two usage of function "substr":
//      substr(x, y)
//      substr(x)

#include <iostream>
#include <string>
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
	location = instring.find("think");	
        // keep processing til passing the last appearance of "think" in the sentence
	cout<< "position=" << position<< " location=" << location << endl;

	while(location != string::npos)
	{
                // copy the substring before the next "think" onto the new string
		newstring = newstring + instring.substr(position,location-position);
 
                // pad on the new substring
		newstring = newstring + "answer";

		position = location+5;
		location = instring.find("think", location+5);
	}	
        // pad on everything after the last "think"
	newstring = newstring + instring.substr(position);
	/*
	input string: I think you thinker some
	position=0 location=2
	position=7 location=12
	position=17 location=-1
	Converted to: I answer you thinkeranswerer some*/
	cout << "Converted to: ";
	cout << newstring << endl;
	return 0;
}
