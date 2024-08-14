// Program Switches demonstrates the use of the Switch 
// statement.

#include <iostream>
using namespace std;

int main ()
{
  char  letter;
  int  first;
  int  second;
  int  answer;


  cout << "Enter an A for addition or an S for"
       << " subtraction, followed by two integer numbers."  
       << endl << "Press return.  Enter a Q to quit." << endl;
  cin >> letter;
  while (letter != 'Q')
  {
    cin  >> first  >> second;

    switch (letter)
    {
      case 'A' : answer = (first + second);
                 cout << first  << " + "  << second
                 << " is "  << answer  << endl;
                 break;
      case 'S' : answer = (first - second);
		     cout << first << " - "  << second
			    << " is "  << answer  << endl;
		     break;
    }
    cin  >> letter;
  }
  return 0;
}
