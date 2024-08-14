#ifndef Sale_H
#define Sale_H

class Sale
{
public:
	Sale();
	Sale(double thePrice);
	double GetPrice() const;
	void SetPrice(double newPrice);
	double  Bill () const;
	//virtual double  Bill () const;
	double Savings (const Sale & other) const;
private:
	double price;
};

Sale::Sale() : price (0)
{}

Sale :: Sale(double thePrice)
{	price = thePrice;
}

double Sale::Bill() const
{	return price;
}

double Sale::GetPrice() const
{	return price;
}

void Sale::SetPrice(double newPrice) 
{	price = newPrice;
}

double Sale::Savings(const Sale & other) const
{
	return (Bill() - other.Bill());
}

#endif
