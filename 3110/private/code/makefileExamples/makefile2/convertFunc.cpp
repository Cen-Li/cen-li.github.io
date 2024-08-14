/* This part only contains the function definitions
*/

#include "convertHeader.h"

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
