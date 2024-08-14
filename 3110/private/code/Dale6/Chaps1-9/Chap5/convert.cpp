// Program Convert converts a temperature from Fahrenheit to 
// Celsius or a temperature from Celsius to Fahrenheit,
// depending on whether the user enters an F or a C.

#include <iostream>
using namespace std;

int main ()
{
  char letter;		// Place to store input letter
  int tempIn;		// Temperature to be converted
  int tempOut;		// Converted temperature

  cout <<"Input Menu" << endl << endl;
  cout <<"F:  Convert from Fahrenheit to Celsius" << endl;
  cout <<"C:  Convert from Celsius to Fahrenheit" << endl;
  cout <<"Type a C or an F, then press return." << endl;
  cin  >> letter;

  cout <<"Type an integer number, then press return."
       << endl;
  cin  >> tempIn;

  if (letter == 'C')
    tempOut = (9 * tempIn / 5) + 32;
  else
    tempOut = 5 * (tempIn - 32) / 9;
  cout << "Temperature to convert: " << tempIn << endl;
  cout << "Converted temperature:  " << tempOut << endl;
  return 0;
}
