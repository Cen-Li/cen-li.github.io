// Program Frame prompts the user to input values that
// represent the dimensions of a print.  The amount of wood
// needed for the frame is calculated and printed on the screen.

#include <iostream>
using namespace std;

int main ()
{  
  int  side;                  // Vertical dimension in inches
  int  top;                   // Horizontal dimension in inches
  int  inchesOfWood;          // Inches of wood needed

  cout << "Enter the vertical dimension of your print." << endl;   
  cout << "The dimension should be in whole inches. "
       << "Press return."  << endl;                                 
  cin >> side;                                             

  cout << "Enter the horizontal dimension of your print." << endl;   
  cout << "The dimension should be in whole inches. "
       << "Press return."  << endl;                                 
  cin  >> top;                                             

  inchesOfWood = top + top + side + side;                  
  cout << "You need "  << inchesOfWood  <<" inches of wood."  << endl;
  return 0;
}