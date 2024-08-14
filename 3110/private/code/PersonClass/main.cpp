// 1. copy constructor
// 2. overloaded ==, <, > operators
// 3. overloaded <<, >> operators
// 4. declare an array of objects (default constructor)
// 5. pass objects as function parameter (by value and by reference)

#include "person.h"
#include <fstream>
#include <cstdlib>
#include <cassert>

int main()
{
  PersonClass Person1;
  PersonClass Person2;
  ifstream myIn("person.dat");
  assert(myIn);

  /*
  // input from keyboard
  cin >> Person1;
  cout << "Person 1 is " << endl;
  cout << Person1;
  cout << endl;

  cin >> Person2;
  */

  myIn >> Person1;
  myIn >> Person2;
  PersonClass Person3(Person2);
  if ((Person2 > Person3)||(Person2 < Person3))
  {
    cerr << "Error !" << endl;
    exit(-1);
  }
  else
  {
     cout << "Person2 is the same as Person 3 as" << endl;
     cout << Person3;
  }

  cout << "print out the two persons in order" << endl;
  if (Person1 < Person2)
  {
     cout << Person1 << endl;
     cout << Person2 << endl;
  }
  else
  {
     cout << Person2 << endl;
     cout << Person1 << endl;
  }

  myIn.close();
}

/* Pass object to function as parameters
void Compare(PersonClass P1, PersonClass P2)
//void Compare(const PersonClass& P1, const PersonClass& P2)
{


}
*/
