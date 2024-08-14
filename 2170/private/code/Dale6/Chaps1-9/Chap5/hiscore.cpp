// Program HiScore reads and prints three test scores.
// The largest value of the three is printed with an
// appropriate message.
// Assumption:  The scores are unique.

#include <iostream>
using namespace std;

int main ()
{
  int  test1Score;
  int  test2Score;
  int  test3Score;

  cout << "Enter score for test 1; press return." << endl;
  cin >> test1Score;
  cout << "Enter score for test 2; press return." << endl;
  cin >> test2Score;
  cout << "Enter score for test 3; press return."  << endl;
  cin >> test3Score;

  cout << "The three test scores are: " << endl;
  cout << test1Score << endl;
  cout << test2Score << endl;
  cout << test3Score << endl;

  /* TO BE FILLED IN */
  return 0;
}

