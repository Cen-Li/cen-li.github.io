// Program ReadData is a test bed for you to try various 
// combinations of input statements with different data 
// configurations.  
// It determines the cost of a sheet of glass given the  
// dimensions and the price per square foot of glass.     

#include <iostream>
#include <iomanip>
using namespace std;

const  int inchesInSqFt = 144;

int main ()
{
  int  length;			    // Measured in inches
  int  width;       		// Measured in inches 
  float  price;            	// Sold by square foot 
  float  cost;

  cout  << fixed  << showpoint;

  /*  TO BE FILLED IN. */
  
  cout << "Width: "  << setw(5)  << width
       << "  Length: "  << setw(5)  << length
       << "  Price: "  << setw(6)  << setprecision(2)
       << price  << endl;
  cost = ((width * length) / inchesInSqFt) * price;
  cout << "The cost of the glass is $"  << setw(6) 
       << cost  << endl;
  return 0;
}
