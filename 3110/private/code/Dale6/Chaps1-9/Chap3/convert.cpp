// Program Convert converts a temperature from Fahrenheit to 
// Celsius and a temperature from Celsius to Fahrenheit.
#include <iostream>
using namespace std;

const int TEMP_IN_F = 32;  
const int TEMP_IN_C = 0;

int main ()
{
  int fToC;	// Place to store Celsius answer
  int cToF;	// Place to store Fahrenheit answer 

  cToF = (9 * TEMP_IN_C / 5) + 32;                      
  fToC = 5 * (TEMP_IN_F - 32) / 9; 
  cout << TEMP_IN_F  << " in Fahrenheit is " << fToC
       << " in Celsius. "  << endl; 
  return 0;
}
