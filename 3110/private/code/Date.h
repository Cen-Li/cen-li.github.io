/*
 * This example contains two files: Date.h and Date.cpp.
 * The definition and implementation of class Date
 * shows the usage of type declaration within a class,
 * static member data (an array), and operator overloading
 * (including relation operators, arithmetic operators,
 *  prefix/postfix increment operator, insertion operator,
 * and extraction operator)
 */

#ifndef _DATE_H_
#define _DATE_H_

#include <iostream>

class Date
{
public:
	// Define a public data type, which can be used
	// by clients
	enum MonthEnum {Jan=1, Feb, Mar, Apr, May, Jun, 
			Jul, Aug, Sep, Oct, Nov, Dec};
private:
	static int DaysOfMonth[13]; 

public:
	// default constructor
	Date( 	int year=0, 
		MonthEnum month=Jan,
		int date = 1 );

	// accessor
	int getYear() const;
	MonthEnum getMonth() const;
	int getDate() const;

	// mutator
	void setYear( int year );
	void setMonth( MonthEnum month );
	void setDate( int day );

	// Operator overloading
	bool operator == ( const Date& aDate );
	bool operator < ( const Date& aDate );
	
	Date operator + (int days) const;

	Date& operator ++ ();	//prefix increment operator: ++x
	Date  operator ++ (int);//postfix increment operator: x++

	//overload the subscript operator []
	// index = 0; return date
	// index = 1; return month
	// index = 2; return day
	// otherwise, throw an exception
	int operator [](int index) const;

	// Convert the Date to the day of the year
	operator int();

	// friend functions
	friend std::ostream& operator << (std::ostream&, const Date&);
	friend std::istream& operator >> (std::istream&, Date&);

private:
	int			m_year;
	MonthEnum	m_month;	
	int			m_day;
};


//to meet the commutativity rule of addition operator
//so that we can write the following expressions:
//myBirthday + 2   or 2 + myBirthday
Date operator + (int, const Date&);

#endif
