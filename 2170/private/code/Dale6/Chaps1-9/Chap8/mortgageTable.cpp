//******************************************************************
// Mortgage Payment Tables program
// This program prints a table showing loan amount, interest rate,
// length of loan, monthly payments, and total cost of a mortgage.
//******************************************************************

#include <iostream>
#include <cmath>
#include <iomanip>
#include <fstream>

using namespace std;

// Function prototypes
void PrintHeading(ofstream&);
void DeterminePayment(float, int, float, float&);
void PrintResults(ofstream&, float, int, float, float);

int main()
{
    // Input variables
    float loanAmount;
    float yearlyRate;
    int numberOfYears;
    float payment;

    // Declare and open output file
    ofstream dataOut;
    dataOut.open("mortgage.out");
  
    PrintHeading(dataOut);
 
    // Prompt for and read loan amount
    cout << "Input the total loan amount; "
         << "a negative value stops processing." << endl; 
    cin >> loanAmount;
  
    // Loop calculating monthly payments
    while (loanAmount >= 0.0)
    {     
        // Prompt for and read interest rate and number of years.
        cout << "Input the interest rate." << endl;
        cin >> yearlyRate;
        cout << "Enter the number of years for the loan" << endl;
        cin >> numberOfYears;

        DeterminePayment(loanAmount, numberOfYears, yearlyRate,
            payment);
        PrintResults(dataOut, loanAmount, numberOfYears, 
            yearlyRate, payment);
        // Prompt for and read loan amount
        cout << "Input the total loan amount; "
             << "a negative value stops processing."  << endl; 
        cin >> loanAmount; 
    }

    dataOut.close(); 
    return 0;
}  
  
//******************************************************************

void DeterminePayment
    ( /* in */ float loanAmount,  // Loan amount
      /* in */ int numberOfYears, // Term of loan
      /* in */ float yearlyRate,  // Interest rate 
      /* inout */ float& payment )// Monthly payment

// Calculates the monthly payment for a loan amount using the
// formula for compound interest.
// Precondition:
//     Arguments contain valid data.
// Postcondition:
//     payment contains the monthly payment as calculated by the
//     compound interest formula    

{
    // local variables
    float monthlyRate;
    int numberOfPayments;

    monthlyRate = yearlyRate   / 1200;  
    numberOfPayments = numberOfYears * 12;
    payment = (loanAmount * pow(1 + monthlyRate, numberOfPayments)    
               * monthlyRate) / 
               (pow(1 + monthlyRate, numberOfPayments) - 1);      
}             

//******************************************************************

void PrintResults( /* inout */ ofstream& dataOut,  // Output file
                   /* in */    float loanAmount,   // Loan amount 
                   /* in */    int numberOfYears,  // Term of loan
                   /* in */    float yearlyRate,   // Interest rate
                   /* in */    float payment )     // Payment

// Prints the loan amount, number of years, yearly interest rate,
// and payment amount on file dataOut
// Precondition:
//     File dataOut has been opened successfully &&
//     All arguments contain valid data
// Postcondition:
//     Loan amount, number of years, yearly interest rate, and
//     payment have been printed on dataOut with proper 
//     documentation.

{
    dataOut << fixed << setprecision(2) << setw(12) << loanAmount 
            << setw(12) << numberOfYears << setw(12) 
            << yearlyRate << setw(15) << payment 
            << setw(12) << numberOfYears*12*payment << endl;
}  

//******************************************************************

void PrintHeading( /* inout */ ofstream& dataOut )  // Output file

// Prints the heading on file dataOut for each column in the table.
// Precondition:
//   File dataOut has been opened successfully
// Postcondition:
//   "Loan Amount", "No. Years", "Interest Rate", "Payment",
//   "Total Paid" have been written on file dataOut.

{
    dataOut << fixed << setprecision(2) << setw(12) << "Loan Amount" 
            << setw(12) << "No. Years" << setw(15) 
            << "Interest Rate" << setw(12) << "Payment" 
            << setw(12) << "Total Paid" << endl;
}


