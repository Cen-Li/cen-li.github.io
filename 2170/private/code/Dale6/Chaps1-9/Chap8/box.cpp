// Program Box writes a box using periods.
#include <iostream>
#include <iomanip>
using namespace std;

void WriteBox();			// Function prototype
// Post: A (20 x 4) box of dots is written on the screen.

int main()
{   
  cout << "A box: " << endl;
  WriteBox();
  cout << "Box has been drawn." << endl;
  return 0;
}

//********************************************

void WriteBox()              // Name of the action
// Post: A box (20 x 4) is printed using periods. 
 
{                         			    // Begin action
  cout << "...................." << endl;
  cout << "." << setw(19)  << "." << endl;
  cout << "." << setw(19)  << "." << endl; 
  cout << "...................." << endl;
}							           // End action        
 
