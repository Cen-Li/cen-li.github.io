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
        // declare other variables here
	
	
        // This loop will read one birthday at a time til the end 
        // of the data file is reached
        // For each birthday read:
        // (1) check whether the birthday is valid
        //     if it is not valid, display the message
        // (2) if it is valid compute and display the day of the week
        while (cin>>month >> day >> year)
        {

            cout << month << " " <<  day << " " << year << " => "; 


            // Check for birthday validity 


	    // if the birthday is valid, compute and display its corresponding weekday



        }// end while
   
		
	return 0;
}
