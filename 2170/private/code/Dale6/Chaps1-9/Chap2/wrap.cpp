// Program Wrap writes out the contents of a sandwich wrap.
#include <iostream>
#include <string>
using namespace std;

const string TUNA = "tuna";
const string PICKLE = "pickle";
const string LETTUCE = "lettuce";
const string WRAP = "tortilla";

int main()
{
  string filling;
  string wrap;

  filling = TUNA + " and " + PICKLE + " with " + LETTUCE;
  wrap = filling + " in " + WRAP + '.';
  cout  << "Filling : "  << filling  << endl;
  cout  << "Wrap : " << wrap  << endl;

  return 0;
}

