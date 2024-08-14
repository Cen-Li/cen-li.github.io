// Program UseMny manipulates objects of class Money
// with overloaded operators < and +.

#include <iostream>
using namespace std;

#include "Money.h"

int main ()
{
  Money money(10, 20);
  Money money1(20, 10);
  if (money < money1)
    cout << money.GetDollars() << '.' << money.GetCents() 
	     << " is less than " << money1.GetDollars() << '.' << money1.GetCents() 
		 << endl;
  Money result = money + money1;
  cout << "Result of addition: ";
  cout << result.GetDollars() << '.' << result.GetCents() << endl;
   return  0;
}
