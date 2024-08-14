/* This program illustrates 
   1) value-returning function with no parameter
   2) value-returning function with value parameters
*/

#include <iostream>
#include <fstream>
#include <cassert>
using namespace std;

// function prototype declaration
void DisplayWelcome();
void DisplayResults(float amt, float convertedAmt, char type);
void ReadInformation(ifstream &myIn, float& amt, char& type);
float ReadAmount(ifstream& myIn);
char ReadCurrency(ifstream & myIn);
float Convert(float amt, char type);

const float DOLLAR_TO_EURO = 0.87;   // conversion rate

int main()
{
    // variable declaration
    float amount;   // amount to convert
    float convertedAmount; // converted amount
    char  currency;   // type of currency to convert
    ifstream myIn; // input file stream

    // Display welcome message
    DisplayWelcome();

    myIn.open("datafile");
    assert(myIn);

    // read information from the data file
    ReadInformation(myIn, amount, currency);

    // Compute the converted amount based on the currency type provided 
    convertedAmount = Convert(amount, currency);

    // Display the results
    DisplayResults(amount, convertedAmount, currency);

    return 0; 
}

// This function reads the amount for conversion from the data file
float ReadAmount(ifstream & myIn)
{
    float amt;
    myIn >> amt;

    return amt;
}

// This function reads the currency type from the data file
char ReadCurrency(ifstream & myIn)
{
    char type;
    myIn>>type;

    return type;
}

void ReadInformation(ifstream & myIn, float &amt, char &type)
{
    amt = ReadAmount(myIn);
    type = ReadCurrency(myIn);
}

// This function converts the amount of US dollar or Euro to Euro or US dollar
float Convert(float amt, char type)
{
    float convertedAmount;

    if (type=='d')
        convertedAmount = amt * DOLLAR_TO_EURO; 
    else
        convertedAmount = amt / DOLLAR_TO_EURO;

    return convertedAmount;
}

// This function displays welcome message to user
void DisplayWelcome()
{
    cout << "Welcome to my currency converter 1.0!" << endl;
    cout << "Tell me how much to convert, dollar or euro, "<< endl;
    cout << "I will tell you how much it is in euro or dollar." << endl;

    cout << "Lets get started ..." << endl << endl;

}    

void DisplayResults(float amt, float convertedAmt, char type)
{
    if (type == 'd')
       cout << amt << " US Dollars equal to " << convertedAmt << " Euros" << endl;
    else
       cout << amt << " Euros equal to " << convertedAmt << " US Dollars" << endl;

    return;
}
