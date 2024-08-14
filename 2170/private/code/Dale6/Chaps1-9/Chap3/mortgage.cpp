//*****************************************************************
// Mortgage Payment Calculator program
// This program determines the monthly payments on a mortgage given
// the loan amount, the yearly interest, and the number of years.
//*****************************************************************

#include <iostream>					// Access cout
#include <cmath>					// Access power function
#include <iomanip>					// Access manipulators
using namespace std;

const float LOAN_AMOUNT = 50000.00;	// Amount of the loan
const float YEARLY_INTEREST = 0.0524;	// Yearly interest rate
const int NUMBER_OF_YEARS = 7;		// Number of years 

int main()
{
    // local variables
    float monthlyInterest;			// Monthly interest rate
    int numberOfPayments;               // Total number of payments
    float payment;				     // Monthly payment
    
    // Calculate values
    monthlyInterest = YEARLY_INTEREST / 12;  
    numberOfPayments = NUMBER_OF_YEARS * 12;
    payment = (LOAN_AMOUNT * 
               pow(monthlyInterest + 1, numberOfPayments)
               * monthlyInterest)/( pow(monthlyInterest + 1,  
               numberOfPayments) - 1 ); 

    // Output results 
    cout << fixed << setprecision(2) << "For a loan amount of " 
         << LOAN_AMOUNT  << " with an interest rate of " 
         << YEARLY_INTEREST << " and a " << NUMBER_OF_YEARS 
         << " year mortgage, " << endl;          
    cout << " your monthly payments are $" << payment 
         << "." << endl;
    return 0;
}  

