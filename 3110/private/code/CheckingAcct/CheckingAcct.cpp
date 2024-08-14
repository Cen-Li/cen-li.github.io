/*
* This example includes two files: CheckingAcct.h and CheckingAcct.cpp.
* This example is used to present how to define and implement a class.
* It also demonstrates the usage of static member data, static
* member functions, and function overloading.
*/

#include <iostream>
#include "CheckingAcct.h"

using namespace std;

// value constructor
//It is recommended to initialize member using initializer list
//Initializer list can only be used with constructor
//Initialization of member data in initializer list will override
//the in-class initialization (the one initialized when it is declared)
CheckingAcct::CheckingAcct(string name, long acctNO, double balance, double mbalance)
	: m_name(name), m_acctNO(acctNO), m_balance(balance), MinBalance (mbalance)
{
	cout << "CheckingAcct Constructor" << endl;
}

// default constructor
// delegate constructor
CheckingAcct::CheckingAcct() : CheckingAcct("Brown", 321, 1230, 1000)
{
}

// another value constructor
CheckingAcct::CheckingAcct(string name)	: m_name(name)
{
	//question: what's the value of m_balance, m_accountNO, MinBalance?
}

// copy constructor
CheckingAcct::CheckingAcct(const CheckingAcct& rhs)
{
  cout << endl << "copy constructor " << endl;
  m_name = rhs.m_name;
  m_acctNO = rhs.m_acctNO;
  m_balance = rhs.m_balance;
}

// overloaded assignment operator
CheckingAcct & CheckingAcct::operator = (const CheckingAcct & rhs)
{
  cout << "assignment operator" <<endl;
  
  m_name = rhs.m_name;
  m_acctNO = rhs.m_acctNO;
  m_balance = rhs.m_balance;
  // MinBalance = rhs.MinBalance;   // Is this allowed?

  return (*this);
}

// destructor
CheckingAcct::~CheckingAcct()
{
  
}

// accessor methods:
// get methods
string	CheckingAcct::getName() const
{
	return m_name;
}

long	CheckingAcct::getAcctNO() const
{
	return m_acctNO;
}

double	CheckingAcct::getBalance() const
{
	return m_balance;
}

// mutator methods
void CheckingAcct::setName(string newName)
{
	m_name = newName;
}

double CheckingAcct::withdraw(double amount)
{
	m_balance -= amount;
	return m_balance;
}

double CheckingAcct::deposit(double amount)
{
	m_balance += amount;
	return m_balance;
}


// This method has been declared as a static method in .h file
long CheckingAcct::getNextAvlAcctNO()
{
	//You are not allowed to access non-static member data/function
	//within static member functions
	//m_balance = 100;	//wrong
	//getBalance();		//wrong
  
	CheckingAcct	boa;
	boa.m_balance = 1000;	//correct
	boa.getBalance();		//correct
  
	return m_nextAvlAcctNO;
}

//static member data should be initialized in .cpp file
long	CheckingAcct::m_nextAvlAcctNO = 10000;

// This method has been declared as a static method in .h file
CheckingAcct CheckingAcct::createAcct(string name, double balance, double mbalance) {
	return CheckingAcct(name, m_nextAvlAcctNO++, balance, mbalance);
}
