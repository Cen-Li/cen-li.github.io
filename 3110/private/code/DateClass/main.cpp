#include "Date.h"

int main( )
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
	