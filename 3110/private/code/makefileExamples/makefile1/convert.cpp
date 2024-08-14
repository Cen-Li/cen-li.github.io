/* This program illustrates 
   1) void function with no parameter
   2) void function with value parameters
*/

#include <iostream>
using namespace std;

// function prototype declaration
void DisplayWelcome();
void DisplayResults(float amt, float convertedAmt, char type);

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

// This function displays welcome message to user
void DisplayWelcome()
{
    cout << "Welcome to my currency converter 1.0!" << endl;
    cout << "Tell me how much to convert, dollar or euro, "<< endl;
    cout << "I will tell you how much it is in euro or dollar." << endl;

    cout << "Lets get started ..." << endl << endl;

    return;
}    

void DisplayResults(float amt, float convertedAmt, char type)
{
    if (type == 'd')
       cout << amt << " US Dollars equal to " << convertedAmt << " Euros" << endl;
    else
       cout << amt << " Euros equal to " << convertedAmt << " US Dollars" << endl;

    return;
}
