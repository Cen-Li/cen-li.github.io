#include <iostream>
#include <cassert>
#include <stdexcept>

#include "Date.h"

using namespace std;

int Date::DaysOfMonth[13] =
	{0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

Date::Date( int year, MonthEnum month, int date)
	: m_year(year), m_month(month), m_day(date)
{
}

// accessor
int Date::getYear() const
{
	return m_year;
}

Date::MonthEnum Date::getMonth() const
{
	return m_month;
}

int Date::getDate() const
{
	return m_day;
}

// mutator
void Date::setYear( int year )
{
	assert( year > 0 );
	m_year = year;
}

void Date::setMonth( MonthEnum month )
{
	m_month = month;
}

void Date::setDate( int date )
{
	assert( date > 0 );
	assert( date <= DaysOfMonth[m_month] );

	m_day = date;
}

// Operator overloading
bool Date::operator == ( const Date& aDate )
{
	return (m_year == aDate.m_year) &&
		   (m_month == aDate.m_month) &&
		   (m_day == aDate.m_day);
}

bool Date::operator < ( const Date& aDate )
{
	if ( m_year < aDate.m_year ) 
		return true;
	if ( m_year == aDate.m_year && m_month < aDate.m_month )
		return true;
	if ( m_year == aDate.m_year && m_month == aDate.m_month &&
		 m_day < aDate.m_day )
		return true;
	return false;
}
	
Date& Date::operator ++ ()
{
	m_day ++;
	if ( m_day > DaysOfMonth[m_month] )
	{
		m_day -= DaysOfMonth[m_month];
		if ( m_month != Dec )
			m_month = static_cast<MonthEnum>(m_month + 1);
		else
		{
			m_month = Jan;
			m_year ++;
		}
	}
	return *this;
}

Date Date::operator ++ (int)
{
	Date 	originalDate = *this;

	m_day ++;
	if ( m_day > DaysOfMonth[m_month] )
	{
		m_day -= DaysOfMonth[m_month];
		if ( m_month != Dec )
			m_month = static_cast<MonthEnum>(m_month + 1);
		else
		{
			m_month = Jan;
			m_year ++;
		}
	}
	return originalDate;
}

Date Date::operator + (int days) const
{
	Date	tempDate = *this;

	for (int i=0; i<days; i++)
		tempDate++;

	return tempDate;
}


Date operator + (int days, const Date& onedate)
{
	return onedate + days;
}

int Date::operator [](int index) const
{
	switch ( index )
	{
	case 0:	return m_year;	
	case 1:	return m_month;	
	case 2:	return m_day;	
	default: throw runtime_error("Invalid parameter");
	}
}




// Convert the Date to the day of the year
Date::operator int()
{
	int		days = 0;
	MonthEnum	cur = Jan;
	for( ; cur<m_month; cur=static_cast<MonthEnum>(cur+1) )
		days += DaysOfMonth[cur];
	days += m_day;
	return days;
}

// friend functions
ostream& operator << (ostream& out, const Date& date)
{
	out << date.m_year << "-" 
		<< date.m_month << "-"
		<< date.m_day << endl;
	return out;
}

istream& operator >> (istream& in, Date& date)
{
	int		year;
	int		month;
	int		day;

	in >> year >> month >> day;
	date.setYear( year );
	date.setMonth( static_cast<Date::MonthEnum>(month) );
	date.setDate( day );
	return in;
}

int main( void )
{
	Date	zero;
	Date	today(2007, Date::Aug, 28);
	Date	tomorrow(2007, Date::Aug, 29);

	if ( today < tomorrow )
		cout << "Today comes before tomorrow!" << endl;

	if ( (today+1) == tomorrow )
		cout << "+ operator: The day after today is equal to tomorrow!" << endl;

	if ( (++today) == tomorrow )
		cout << "++ operator: The day after today is equal to tomorrow!" << endl;

	cout << today << " : "
		 << "Today is the number " << int(today) << " day of the year!" << endl;

	cout << today+30 << " : "
		 << "30 days later is the number " << int(today+30) << " day of the year!" 
		 << endl;

	cout << 20+today+10 << " : "
		 << "30 days later is the number " << int(today+30) << " day of the year!" 
		 << endl;


	cout << "The year, month, day of the variable today is: " 
	     << today[0] << " - " << today[1] << " - " << today[2] << endl;


	return 0;
}
	


