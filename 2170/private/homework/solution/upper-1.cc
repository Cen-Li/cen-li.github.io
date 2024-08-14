#include <iostream>
#include <string>
using namespace std;

int main()
{
    string line, nextPart;
    string fstr=" ";   // the string containing only the blank character
    int location;  // location of the first letter of the next word
	
    int found;
	
    //get the user input
    cout<<"Please Enter Your Sentence: "<<endl;
    getline(cin,line);
    
    if (line.length() > 0)  // if this is not an empty string, change the first character
        line[0] = toupper(line[0]);
    
    
    location = 0;
    nextPart = line;
    found = nextPart.find(fstr);
    while(found!=string::npos)
    {
        location = location + found + 1;
       
        line[location]=toupper(line[location]);  // change the first letter of the next word to upper case
        
        nextPart = nextPart.substr(found+1);  // advance past the current fstr
	found=nextPart.find(fstr);  // find the next fstr
    }

    cout<<line<<endl;
	
    return 0;
}
