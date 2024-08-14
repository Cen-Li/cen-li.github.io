#include <iostream>
#include <cstdlib>
using namespace std;

int main() {
	
	float usage;
	float bill;
	char  type;
	
	// prompt for water usage
	cout << "Enter the amount of water used:";
	cin >> usage;
	
	// prompt for user type
	cout << "Enter the user type ('H' for home use, ...) :" ;
	cin >> type;
	
        // Check for User input
 	if (usage <=0 || (type != 'H' && type  != 'C' && type != 'I'))
        {
           cout << "Incorrect Input. Computation not carried out. " << endl;
           return 0;
	}

	// compute the bill
	if (type == 'H') {
		bill = 5.0 + 0.005*usage;
	}
	else if (type == 'C') {
		if (usage <= 4000000) {
			bill = 1000.0;
		}
		else {
			bill = 1000.0 + (usage - 4000000)*0.00025;
		}
	}
	else if (type == 'I') {
		if (usage <= 4000000)
			bill = 1000.0;
		else if (usage <= 10000000)
			bill = 2000.0;
		else
			bill = 3500.0;
	}
	
	
	cout << "The water bill amount is " << bill << endl;
	return 0;
}
