// Program UseMny manipulates objects of class ExtMoney.

#include <iostream>
using namespace std;

#include "ExtMoney.h"

int main ()
{
  Money money;
  cout << "money initialized by default constructor " << endl;
  money.Print();
  cout << endl;
  ExtMoney extMoney1;
  cout << "extMoney initialized by default constructor " << endl;
  extMoney1.Print();
  cout << endl;
  ExtMoney extMoney2(3000, 88, "forints");  
  cout << "extMoney initialized by parameterized constructor "  << endl;
  extMoney2.Print();
  return  0;
}

