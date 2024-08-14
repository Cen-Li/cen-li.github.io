/*
Assignment: OLA1 
Class: CSCI 2170-00X
Course Instructor: Dr. Li
Due Date:  put in due date

Description: This program determines the day of the week
a person is born, using Zeller's formula. The program reads person's
birth date (month, day, year) from a datafile and outputs the day of the week a person is
born. If birth date is invalid, the output is an error message.

Given the example data file:
6 15 1988
1 15 2001
1 37 2001
5 12 2005
2 19 2000
2 29 2001
4 31 2009
1 27 2021
2 29 2021

The program output should be:
Wednesday
Monday
Incorrect Data
Thursday
Saturday
Incorrect Data
Incorrect Data
Wednesday
Incorrect Data
*/

#include <iostream>  // for cin, cout, endl, etc
using namespace std;

int main()
{
	int day; // a person's day of birth from user input.
	int month; // a person's month of birth from user input.
	int year; // a person's year of birth from user input.
	bool leapyear; // check if born in a leap year.
	int d; // day of the month
	int m; // month number
	int modifiedYear; // modified year
	int D; // last two digits of modified year
	int C; // first two digits of modified year
	int f; // result of Zeller's formula
	int remainder; // determines day of the week born
        bool invalid=false;
	
	
        // This loop will read one birthday at a time til the end 
        // of the data file is reached
        // For each birthday read:
        // (1) check whether the birthday is valid
        //     if it is not valid, display the message
        // (2) if it is valid compute and display the day of the week
        while (cin>>month >> day >> year)
        {

            cout << month << " " <<  day << " " << year << " => "; 

	// Check if user input is valid.
	// First, check if year is valid.
	if (year < 1 || year > 2021)	{
 		invalid=true;
	}
	else {
	// Check if month and day are valid.
	if (month < 1 || month > 12)	{
                invalid=true;
	}
	else if (month == 2)	{
		// Calculate leapyear.
		if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0))
			leapyear = true;
		else
			leapyear = false;
		// Check if day is valid.
		if (leapyear)	{
			if (day < 1 || day > 29)	{
                		invalid=true;
			}
		}
		else	{
			if (day < 1 || day > 28)	{
                		invalid=true;
			}
		}
	}
	else if (month==4||month==6||month==9||month==11)	{
		if (day < 1 || day > 30)	{
                		invalid=true;
		}
	}
	else	{
		if (day <1 || day > 31)	{
                		invalid=true;
		}
	}
        }//end else
	
        if (invalid)
        {
             cout << "Incorrect Data" << endl;
        }
        else
        {

	// Determine the day of the month, d
	d = day;
	
	// Determine the month number, m 
	// and determine the modified year
	if (month >=3)	{
		m = month - 2;
		modifiedYear = year;
	}
	else if (month == 1)	{
		m = 11;
		modifiedYear = year - 1;
	}
	else	{
		m = 12;
		modifiedYear = year - 1;
	}
	
	// Determine D and C
	D = modifiedYear % 100;
	C = modifiedYear / 100;
		
	// Zeller's Rule
	f = d + ((13*m-1)/5) + D + (D/4) + (C/4) - 2*C;
		
	// Determine the remainder (f%7).
	if (f%7 < 0)
		remainder = (f%7) + 7;
	else
		remainder = f%7;
	
	// Return day of the week.
	if (remainder == 0)
		cout << "Sunday" << endl;
	else if (remainder == 1)
		cout << "Monday" << endl;
	else if (remainder == 2)
		cout << "Tuesday" << endl;
	else if (remainder == 3)
		cout << "Wednesday" << endl;
	else if (remainder == 4)
		cout << "Thursday" << endl;
	else if (remainder == 5)
		cout << "Friday" << endl;
	else if (remainder == 6)
		cout << "Saturday" << endl;
        } // end else


          invalid=false;
        }// end while
   
		
	return 0;
}
