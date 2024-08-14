// Program Reformat reads characters from file DataIn and 
// writes them to DataOut with the following changes:             
//    all letters are converted to uppercase, digits are
//    unchanged, and all other characters except blanks and         
//    newline markers are removed.                                       

#include <iostream>
#include <cctype>
#include <fstream>
using namespace std;

enum CharType {LO_CASE, UP_CASE, DIGIT, BLANK_NEWLINE, OTHER};

CharType  KindOfChar(char);
// Post: character has been converted to the corresponding            
//       constant in the enumeration type CharType.           

int main ()
{
  ifstream  dataIn;
  ofstream  dataOut;
  char  character;
  dataIn.open("reformat.dat");
  dataOut.open("dataOut.dat");
    
  dataIn.get(character);    // Priming read
  while (dataIn)
  {
    switch (KindOfChar(character))
    {       
      // FILL IN THE Code to output the correct character 
    }
    dataIn.get(character);
  }
  return 0;
}

                                                            
//*************************************************         
                                                            
CharType  KindOfChar(char  character)     
{
  if (isupper(character))              
    return  // TO BE FILLED IN                   
  else if (islower(character)) 
    return  // TO BE FILLED IN 
  else if (isdigit(character))
    return  // TO BE FILLED IN                                                   
  else if (character == ' ' || character == '\n')
    return  // TO BE FILLED IN               
  else
    return  // TO BE FILLED IN
}
