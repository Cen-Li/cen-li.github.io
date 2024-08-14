//File: 27-struct1.cc
//Purpose:  To create a colored phrase to print in the terminal window
#include <iostream>
using namespace std;
struct text
{
	string words; //the string to print out
	string bold; //1 is bold 22 is normal font
	string textColor; //30 is black
		   //31 is red
		   //32 is green
		   //33 is yellow
		   //34 is blue
		   //35 is magenta
		   //36 is cyan
		   //37 is white
	string beginString; //the beginning of the print string
	string endString;   //the ending of the print string
	string printString; //the actual print string
};

int main()
{
	text coloredPhrase;
	int inval;

	coloredPhrase.beginString = "\033["; //the beginning of the print string
	coloredPhrase.endString = "\033[0m";   //the ending of the print string
	cout << "What phrase would you like me to print?";
	getline(cin,coloredPhrase.words);
	cout << "Would you prefer boldface or normal font? (enter 1 for bold and 2 for normal) ";
	cin >> inval;
	if(inval != 1 && inval != 2)
		cout << "That is an invalid choice\n";
	else
	{
		if (inval == 1)
			coloredPhrase.bold = "1;";
		else
			coloredPhrase.bold = "22;";

		cout << "choose a text color\n"
			<< "0 for black\n"
			<< "1 for red \n"
		   	<< "2 for green\n"
		   	<< "3 for yellow\n"
		   	<< "4 for blue\n"
		   	<< "5 for magenta\n"
		   	<< "6 for cyan\n"
		   	<< "7 for white\n";
		cin >> inval;
		switch(inval)
		{
			case 0: coloredPhrase.textColor = "30";break;		
			case 1: coloredPhrase.textColor = "31";break;		
			case 2: coloredPhrase.textColor = "32";break;		
			case 3: coloredPhrase.textColor = "33";break;		
			case 4: coloredPhrase.textColor = "34";break;		
			case 5: coloredPhrase.textColor = "35";break;		
			case 6: coloredPhrase.textColor = "36";break;		
			case 7: coloredPhrase.textColor = "37";break;		
			default: cout << "invalid choice\n";
		}
		if(inval >= 0 && inval <= 7)
		{
			coloredPhrase.printString = coloredPhrase.beginString + 
						    coloredPhrase.bold +
						    coloredPhrase.textColor +
						    "m" +
						    coloredPhrase.words +
						    coloredPhrase.endString;

			cout << coloredPhrase.printString << endl << endl;
		}
		return 0;
	}
}		
