// Program CharRead prompts for and reads four characters 
// from the keyboard and then prints them.         

#include <iostream>
using namespace std;

int main ()
{
  char  char1;
  char  char2;
  char  char3;
  char  char4;

  cout << "Input four characters.  Press Return."  << endl;
  cin >> char1  >> char2  >> char3  >> char4;
  cout << char1  << char2  << char3  << char4;
  return 0;
}


