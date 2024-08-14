// Program BoxesWithFunction prompts for the number of dollar signs 
// for the top of the box.  That number / 2 - 2  lines are 
// printed with dollar signs on the sides.        

#include <iostream>
using namespace std;

void  Print(int numSigns);
// FILL IN documentation. 

int main ()
{
  int  number;

  cout << "Enter the number of dollar signs for the top; "
       << "press return."
  cout << "Enter end-of-file character to quit."  << endl;
  cin >> number;
  while (cin)
  {    
    /* FILL IN call to Print */
    cout << "Enter the number of dollar signs for "  
         << "the top; press return."
    cout << "Enter end-of-file character to quit."  
         << endl;
    cin >> number;
  }
  return 0;
}
 
//*******************************************************  
  
void  Print(int numSigns)
// FILL IN documentation.
{
  /* FILL IN code to print numSigns $'s */
  
  /* FILL IN code to print (numSigns / 2)-2 lines with   */
  /* $'s lining up under the left-most and right-most    */
  /* $ ones on the top line.                             */ 

  /* FILL IN code to print numSigns $'s                  */     
}
