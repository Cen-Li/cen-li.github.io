//The example contains: Employee.h/cpp HourlyEmployee.h/cpp 
//						SalariedEmployee.h/cpp

//This is the file salariedemployee.cpp 
//This is the implementation for the class SalariedEmployee.
//The interface for the class SalariedEmployee is in 
//the header file salariedemployee.h.
#include <iostream>
#include <string>
#include "SalariedEmployee.h"
using namespace std;

SalariedEmployee::SalariedEmployee( ) : Employee( ), m_salary(0)
{
	cout << "SalariedEmployee default constructor executing" << endl;
}

SalariedEmployee::SalariedEmployee(string newName, string newNumber,
                                  double newWeeklyPay)
    : Employee(newName, newNumber), m_salary(newWeeklyPay)
{
	cout << "SalariedEmployee non-default constructor executing" << endl;
}

double SalariedEmployee::getSalary( ) const 
{
	return m_salary;
}

void SalariedEmployee::setSalary(double newSalary)
{
	m_salary = newSalary;
}

void SalariedEmployee::printCheck( ) const
{
    cout << "\n__________________________________________________\n";
    cout << "Pay to the order of " << getName( ) << endl;
    cout << "The sum of " << getNetPay( ) << " Dollars\n";
    cout << "_________________________________________________\n";
    cout << "Check Stub NOT NEGOTIABLE \n";
    cout << "Employee Number: " << getSsn( ) << endl;
    cout << "Salaried Employee. Regular Pay: " 
         << m_salary << endl; 
    cout << "_________________________________________________\n";
}
