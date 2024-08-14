// Program Favorit determines the favorite soft drink.
#include <iostream>
using namespace std;

enum DrinksType {COKE, PEPSI, SPRITE, DR_PEPPER};
void Prompt();
// This function provides the input prompts.

int main ()
{
  int sums[4];
  int number;
  DrinksType index;

  for (index = COKE; index <= DR_PEPPER; index =  DrinksType(index+1))
    // FILL IN Code to set sums to zero

  Prompt();
  cin >> number;
  while (number != 4)
  {
    // FILL IN Code to increment the proper drink
    Prompt();
    cin >> number;
  }

  // FILL IN THE Code to write out the totals
  return 0;
}

//*******************************************************

void Prompt()
{
  cout << "Enter a 0 if your favorite is a Coke." << endl;
  cout << "Enter a 1 if your favorite is a Pepsi." << endl;
  cout << "Enter a 2 if your favorite is a Sprite." << endl;
  cout << "Enter a 3 if your favorite is a DrPepper." << endl;
  cout  <<"Enter a 4 if you wish to quit the survey." << endl;
}


