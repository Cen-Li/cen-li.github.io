// Program Area demonstrates stream testing.
#include <iostream>
#include <fstream>
using namespace std;

int main()
{
  int side1;		// One side of a rectangle
  int side2;		// The other side of a rectangle
  ifstream inData;	// File stream
  int area;			// Area of rectangle

  inData.open("myData.dat");
  if (!inData)
  {
    cout << "Input file not found." << endl;
    return 1;
  }
  inData >> side1 >> side2;
  if (!inData)
  {
    cout  << "Data format incorrect.";
    return 2;
  }
  area = side1 * side2;
  cout << "Area is " << area  << endl;
  return 0;
} 
