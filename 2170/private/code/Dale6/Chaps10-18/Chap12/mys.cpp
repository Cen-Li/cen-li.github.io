// Program Mystery manipulates instances of class Mystery.

#include <iostream>
using namespace std;


int main ()
{
  Mystery  mystery1;
  Mystery  mystery2;
  Mystery  mystery3;
  mystery1.Initialize(10, 59);
  mystery2.Initialize(20, 70);
  mystery3 = mystery1.What(mystery2);
  cout << "$" << mystery3.FirstIs << "."
	  << mystery3.SecondIs  << endl;
  return 0;
}

