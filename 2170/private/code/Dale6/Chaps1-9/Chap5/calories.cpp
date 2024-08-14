// Program Calories calculates a person's percentage of 
// calories from fat and prints an appropriate message. 

#include <iostream>
#include <string>
using namespace std;

int main ()
{
  string foodItem;
  int   gramsOfFat;
  int   calories;
  float fatCalPercent;

  cout << "Enter the name of a food item."  
       << "  Press return."  << endl;
  getline(cin, foodItem);

  cout << "Enter the grams of fat; press return."  << endl;
  cin >> gramsOfFat;

  cout << "Enter the number of calories; press return."
       << endl;
  cin >> calories;
  
  /* TO BE FILLED IN */
  return 0;
}

