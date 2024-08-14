#ifndef DiscountedSale_H
#define DiscountedSale_H

#include "sale.h"

class DiscountSale : public Sale
{
public:	
	DiscountSale();
	DiscountSale(double thePrice, double theDiscount);
	
	double  GetDiscount() const;
	void 	SetDiscount(double newDiscount);
	double  Bill()  const;
private:
	double discount;
};

DiscountSale::DiscountSale() : Sale(0), discount (0)
{}

DiscountSale::DiscountSale(double thePrice, double theDiscount)
:Sale(thePrice), discount(theDiscount)
{}

double DiscountSale::GetDiscount() const
{	return discount;
}

void DiscountSale::SetDiscount(double newDiscount)
{	discount = newDiscount;
}

double DiscountSale::Bill() const
{	double fraction = discount / 100;
	return (1-fraction)*GetPrice();
}

#endif
