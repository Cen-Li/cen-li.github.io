// Program Rectangle prompts for and reads two integer   
// values that represent the sides of a rectangle.    
// The area of the rectangle is calculated and printed.
#include <iostream>
using namespace std;

void GetData(int& firstValue, int& secondValue);
// function prototype
// GetData gets two integer values.

int main()
{
  int  height;
  int  width;
  int  area;

  GetData(height, width);
  area = height * width;


  cout << "The area of the " << height << " by "
       << width << " rectangle is " << area << endl;
  return 0;
}

//******************************************************

void GetData(int& firstValue, int& secondValue) 
// Post: The user has been prompted to input two values        
//       representing the length and width of a rectangle. 
//       These values have been read and returned in 
//       firstValue and secondValue.   
{   
  cout << "Enter two integer values representing "
       << "a rectangle.  Press return."  << endl;
  cin >> firstValue >> secondValue;
}
