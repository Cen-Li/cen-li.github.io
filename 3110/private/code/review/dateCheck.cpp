#include <iostream>
using namespace std;

int main()
{
    
	int day, month, year;  // for the date
	bool leapYear=false;
	bool isValid = false;
	
	// prompt for the date
	cout << "Please enter a date: (month, day, year) ";
	cin >> month >> day >> year;
	
	// check whether the date is a valid date
	// checking for year
	if (year >0 && year < 2018)
	{
		//Check for month
		if (month > 0 && month < 13)
		{
			// Check for day
			if (month == 4 || month == 6 || month == 9 || month == 11) // these months have 30 days
			{
				if (day > 0 && day < 31)
				{
					isValid = true;
				}
				else
				{
					cout << "Invalid date" << endl;
				}
			}
			else if (month == 2)  // feb
			{
				leapYear = ((year%4==0)  && (year%100!=0)) ||
						   ((year%400==0) && (year%100==0));
				if ((leapYear) && (day >0 && day < 30))
					isValid = true;
				else if ((!leapYear) && (day > 0 && day < 29))
					isValid = true;
				else 
					cout << "Invalid date" << endl;
			}
			else // all other months having 31 days
			{
				if (day > 0 && day < 32)
				{
					isValid = true;
				}
				else
				{
					cout << "Invalid date" << endl;
				}
				
			}
		}
		else
		{
			cout << "Not a valid date." << endl;
		}
		
	}
	else{
		cout << "Not a valid date." << endl;
	}
	
	if (isValid)
		cout << "You entered a valid date" << endl;
	
    return 0;
}
