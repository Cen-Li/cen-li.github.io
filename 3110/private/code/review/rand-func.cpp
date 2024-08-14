// Example to show value returning function
#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

float GetRandom(int lower, int upper);
bool IsPrime(int value);

int main()
{
    int lower, upper;
    float value;

    srand(time(0));

    // get the ranger
    cout << "Enter the ranger (lower, upper):";
    cin >> lower >> upper;

    // Print 10 randome values in the range specified
    for (int i=0; i<10; i++)
    {
        // Call function GetRandom to return a random number in the range specified
        value = GetRandom(lower, upper);
        cout << value << endl;
        // call function IsPrime to check whether value is a prime number
        if (IsPrime(value))
        {
            cout << "It is a prime." << endl;
        }
    }

    return 0;
}

//IsPrime checks whether "value" is a prime number. It returns true if it is a prime
// It return false if it is not 
// Input: a value to be determined
// Output: boolean value "true" if value is prime; "false" if value is not prime
bool IsPrime(int value)
{
    // Try all the numbers between 2 and value/2,
    // if it is a divisor of "value", then the value must not be a prime number
    // can return the value "false" right away
    for (int i=2; i<value/2; i++)
    {
	if (value%i == 0)
	   return false;
    }

    // Only after all the numbers between 2 and value/2 have been tested and are not
    // divisors of "value", we can determine that "value" is a prime number, return true
    return true;

}

// Returns a random num in the range [lower, upper]
// Input: the lower and upper bound of the range
// Output: a random number in the range
float GetRandom(int lower, int upper)
{
    float number;

    number = float(rand()%(upper-lower+1)+lower);

    return number;
}
