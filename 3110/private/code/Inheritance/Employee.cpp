//The example contains: Employee.h/cpp HourlyEmployee.h/cpp 
//						SalariedEmployee.h/cpp
//This is the file: employee.cpp 
//This is the implementation for the class Employee.
//The interface for the class Employee is in the header file employee.h.
#include <string>
#include <cstdlib>
#include <iostream>
#include "Employee.h"

using namespace std;


Employee::Employee( ) : m_name("No name yet"), m_ssn("No number yet"), m_netPay(0)
{
	cout << "Employee default constructor executing" << endl;
}


Employee::Employee(string theName, string theNumber) 
       : m_name(theName), m_ssn(theNumber), m_netPay(0) 
{			
	cout << "Employee non-default constructor executing" << endl;
}

string Employee::getName( ) const 
{
    return m_name;
}

string Employee::getSsn( ) const 
{
    return m_ssn;
}

double Employee::getNetPay( ) const 
{
	return m_netPay;
}

void Employee::setName(string newName)
{
	m_name = newName;
}

void Employee::setSsn(string newSsn)
{
	m_ssn = newSsn;
}

void Employee::setNetPay (double newNetPay)
{
	m_netPay = newNetPay;
}

void Employee::printCheck( ) const
{
    cout << "\nERROR: printCheck FUNCTION CALLED FOR AN \n"
         << "UNDIFFERENTIATED EMPLOYEE. Aborting the program.\n" 
         << "Check with the author of the program about this bug.\n";
    exit(1);
}




    

