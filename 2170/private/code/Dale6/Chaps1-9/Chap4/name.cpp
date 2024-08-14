//******************************************************************
// Format Names program
// This program reads in a social security number, a first name, a 
// middle name or initial, and a last name from file inData.  
// The name is written to file outData in three formats: 
//    1. First name, middle name, last name, and social security 
//    number.
//    2. last name, first name, middle name, and social 
//    security number
//    3. last name, first name, middle initial, and social security
//    number
//    4.  First name, middle initial, last name
//******************************************************************

#include <fstream>              		     // Access ofstream
#include <string>						// Access string

using namespace std;

int main()
{
    // Declare and open files
    ifstream inData;
    ofstream outData;
    inData.open("name.dat");
    outData.open("name.out");
  
    // Declare variables
    string socialNum;					// Social security number
    string firstName;					// First name
    string lastName;					// Last name
    string middleName;					// Middle name
    string initial;						// Middle initial
  
    // Read in data from file inData
    inData >> socialNum >> firstName >> middleName >> lastName;
    
    // Access middle initial and append a period
    initial = middleName.substr(0, 1) + '.';
  
    // Output information in required formats
    outData << firstName << ' ' << middleName << ' ' << lastName 
            << ' ' << socialNum << endl;
    outData << lastName << ", " << firstName << ' ' << middleName 
            << ' ' << socialNum  << endl;
    outData << lastName << ", " << firstName << ' ' << initial 
            << ' ' << socialNum  << endl;
    outData << firstName << ' ' << initial << ' ' << lastName;
  
    // Close files
    inData.close();
    outData.close();
    return 0;
}  
  
  
