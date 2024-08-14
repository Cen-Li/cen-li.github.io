//Program InOut reads and prints eight int values.

#include <iostream>
using namespace std;

int main ()
{
  cout << "enter the values as shown"  << endl;

  int  a, b, c, d, e, f, g, h;

  cin  >> a  >> b  >> c;
  cin.ignore(80, '\n');
  cin >> d  >> e  >> f;
  cin.ignore(80, '\n');
  cin  >> g  >> h;
  cout << " a " << a << "   b " << b  << "   c " << c << endl;
  cout << " d " << d << "   e " << e  << "   f " << f  << endl;
  cout << " g " << g << "   h " << h  << endl;
  return 0;
}

