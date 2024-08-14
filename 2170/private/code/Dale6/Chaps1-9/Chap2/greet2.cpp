// Program Greet prints a greeting on the screen.
#include <iostream>
#include <string>
using namespace std;

const string FIRST_NAME = "Sarah";
const string LAST_NAME = "Sunshine";
int main ()
{
  string message;
  string name;

  name = FIRST_NAME + ' ' + LAST_NAME;
  message = "Good morning " + ' ' + name + '.';
  cout  << message << endl;
  return 0;
}
