//The example contains: Employee.h/cpp HourlyEmployee.h/cpp 
//						SalariedEmployee.h/cpp

//This is the file: hourlyemployee.cpp 
//This is the implementation for the class HourlyEmployee.
//The interface for the class HourlyEmployee is in 
//the header file hourlyemployee.h.

#include <string>
#include <iostream>
#include "HourlyEmployee.h"

using std::string;
using std::cout;
using std::endl;

HourlyEmployee::HourlyEmployee( ) : Employee( ), m_wageRate(0), m_hours(0)
{
	cout << "HourlyEmployee constructor executing" << endl;
}

HourlyEmployee::HourlyEmployee(string theName, string theNumber,
                               double theWageRate, double theHours)
        : Employee(theName, theNumber), m_wageRate(theWageRate), m_hours(theHours)
{
	cout << "HourlyEmployee constructor executing" << endl;
}

void HourlyEmployee::setRate(double newWageRate)
{
    m_wageRate = newWageRate;
}

double HourlyEmployee::getRate( ) const
{
    return m_wageRate;
}

void HourlyEmployee::setHours(double hoursWorked)
{
    m_hours = hoursWorked;
}

double HourlyEmployee::getHours( ) const
{
    return m_hours;
}

void HourlyEmployee::printCheck( ) const
{
    cout << "\n________________________________________________\n";
    cout << "Pay to the order of " << getName( ) << endl;
    cout << "The sum of " << getNetPay( ) << " Dollars\n";
    cout << "________________________________________________\n";
    cout << "Check Stub: NOT NEGOTIABLE\n";
    cout << "Employee Number: " << getSsn( ) << endl;
    cout << "Hourly Employee. \nHours worked: " << m_hours 
         << " Rate: " << m_wageRate << " Pay: " << getNetPay( ) << endl; 
	cout << "_________________________________________________\n";
}
