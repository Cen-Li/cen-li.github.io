// This example is used to illustrate the use of virtual fuction and late binding

#include <iostream>
using namespace std;

#include "sale.h"
#include "discount.h"

bool operator < (const Sale& first, const Sale & second);

int main()
{
	Sale 		simple(10.00);
	DiscountSale  	disc(11.00, 10);

	if (disc < simple)
	{
		cout << "Discounted item is cheaper";
		cout << "Saving is $" << simple.Savings(disc) << endl;
	}
	else
		cout << "Discounted item is not cheaper." << endl;
}

bool operator < (const Sale& first, const Sale& second)
{
	return (first.Bill() < second.Bill());
}

