// 19-function-1.cc
// 1.  review void function and value-returning function
// 2.  review value parameter and reference parameter

// This program asks the user to enter a range of integer in terms of its
// lower bound and upper bound  [lower bound .... upper bound] 
// It finds all the perfect numbers in this range

#include <iostream>
using namespace std;

bool IsPerfect(int number);
void GetRange(int& lower, int& upper);

int main() 
{
    int lower, upper;   // lower and upper bound

    // Get the range from the user
    GetRange(lower, upper);

    // Check each value in the range to see if it is a perfect number
    for (int i=lower; i<upper; i++)  {
        // output the value if it is perfect
	if (IsPerfect(i))  {
           cout << i << endl;
        }
    }

    return 0;
}

// This function checks to see if a number passed in is perfect
bool IsPerfect(int number) 
{
    int sum=0;
    // Compute the sum of its divisors
    for (int i=1; i<=number/2; i++)   {
	if (number%i == 0) {
	    sum += i;
        }
    }

    // If the sum of the divisors equals to the number, then it is perfect
    if (sum == number)
       return true;
    else
       return false;
}

// Read the range from the user. 
// The upper and lower bounds of the range are passed by to the calling
// function using reference parameter
void GetRange(int &lower, int &upper)
{
    do  {
       cout << "Enter the lower and upper bound of a positive integer range: ";
       cin >> lower >> upper;
    }
    while (!((lower > 0)&&(upper > 0) && (lower < upper)));
}
