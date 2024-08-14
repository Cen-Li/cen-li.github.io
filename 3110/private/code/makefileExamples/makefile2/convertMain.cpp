/* This program illustrates 
   1) void function with no parameter
   2) void function with value parameters

   This part only contains the main function
*/


#include "convertHeader.h"

const float DOLLAR_TO_EURO = 0.87;   // conversion rate

int main()
{
    // variable declaration
    float amount;   // amount to convert
    float convertedAmount; // converted amount
    char  currency;   // type of currency to convert

    // Display welcome message
    DisplayWelcome();

    // prompt user to enter information
    cout << "Enter amount to convert: ";
    cin>>amount;
    cout <<"Enter the type of currency to convert (d for dollar, e for euro): "; 
    cin >> currency;
 
    // Compute the converted amount based on the currency type provided 
    if (currency=='d')
        convertedAmount = amount * DOLLAR_TO_EURO; 
    else
        convertedAmount = amount / DOLLAR_TO_EURO;

    // Display the results
    DisplayResults(amount, convertedAmount, currency);

    return 0; 
}
