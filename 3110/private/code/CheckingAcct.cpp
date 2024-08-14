/*
* This example includes two files: CheckingAcct.h and CheckingAcct.cpp.
* This example is used to present how to define and implement a class.
* It also demonstrates the usage of static member data, static
* member functions, and function overloading.
*/

#include <iostream>
#include "CheckingAcct.h"

using namespace std;

//It is recommended to initialize member using initializer list
//Initializer list can only be used with constructor
//Initialization of member data in initializer list will override
//the in-class initialization (the one initialized when it is declared)
CheckingAcct::CheckingAcct(string name, long acctNO,
	double balance, double mbalance)
	: m_name(name), m_acctNO(acctNO), 
	  m_balance(balance), MinBalance (mbalance)
{
	cout << "CheckingAcct Constructor" << endl;
}

//delegate constructor
CheckingAcct::CheckingAcct() 
	: CheckingAcct("Dong", 321, 1230, 1000)
{

}

CheckingAcct::CheckingAcct(string name)
	: m_name(name)
{
	//question: what's the value of m_balance, m_accountNO, MinBalance?
}


CheckingAcct::~CheckingAcct()
{
}

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

long CheckingAcct::getNextAvlAcctNO(void)
{
	//You are not allowed to access non-static member data/function
	//within static member functions
	//m_balance = 100	//wrong
	//getBalance();		//wrong
	CheckingAcct	boa;
	boa.m_balance = 1000;	//correct
	boa.getBalance();		//correct

	return m_nextAvlAcctNO;
}


//static member data should be initialized in .cpp file
long	CheckingAcct::m_nextAvlAcctNO = 10000;

CheckingAcct CheckingAcct::createAcct(string name,
	double balance, double mbalance) {
	return CheckingAcct(name, m_nextAvlAcctNO++, balance, mbalance);
}





int main(void)
{
	CheckingAcct	john("John", 1234, 3456.43, 1000);
	cout << "Jason's checking account: "
		<< john.getAcctNO()
		<< " : " << john.getBalance()
		<< endl;

	CheckingAcct	david("David");
	cout << "David's checking account: "
		<< david.getAcctNO()
		<< " : " << david.getBalance()
		<< endl;

  //static member data/function must be accessed through class name
	CheckingAcct	newCustomer1 = CheckingAcct::createAcct("Jason", 456.34, 100);

	cout << "Jason's checking account: "
		<< newCustomer1.getAcctNO()
		<< " : " << newCustomer1.getBalance()
		<< endl;

	CheckingAcct	newCustomer2 = CheckingAcct::createAcct("Joe", 23436.34, 5654);
	cout << "Joe's checking account: "
		<< newCustomer2.getAcctNO()
		<< " : " << newCustomer2.getBalance()
		<< endl;
}