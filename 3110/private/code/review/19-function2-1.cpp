/* This is the program for practice question # 2 in the lecture notes 
   Display the fraction part of a floating point number.
   For example, if the user enters a number 16.753, display 0.753 */
#include <iostream
using namespace std;

float Fraction(float num);

int main ()
{
    float number;

    // promt to enter a float type number
    cout << "Enter a float number: ";
    cin >> number;

    // display the fraction part of the number
    cout << "The floating part of "<< number << " is " << Fraction(number) << endl;

    return 0;
}

// This function returns the fraction part of a float number
float Fraction(float num)
{
    return (num - int(num));
}
