#include <iostream>
using namespace std;
void f(int *, int );
void g(int *&, int *);

int main()
{
	int	*p, *q, *r;
	int	x, y;

	p = &x;
	*p = 7;
	q = &y;
	y = (*p) + 1;
	cout << *p << "  " << *q << "  " << x << "   " << y << endl;

	q = p;
	*q = 3;
	cout << *p << "  " << *q << "  " << x << "   " << y << endl;

	x = 7; y = 9;
	r = &x;
	f(r, y );
	cout << *p << "  " << *q << "  " << x << "   " << y << endl;

	x = 7; y = 9;
	q = new int;
	*q = x + y;
	x = x + (*q);
	cout << *p << "  " << *q << "  " << x << "   " << y << endl;

	x = 7, y = 9;
	g(p, q);
	cout << *p << "  " << *q << "  " << x << "   " << y << endl;

	delete q;
	p = NULL;
	q = NULL;
	return 0;
}

void f ( int * p1, int p2 )
{
	p2 = p2 * 2;
	*p1 = (*p1) + p2;
}

void g(int *&a, int *b ) // pointer a is passed by reference
{
	a = new int;
	*a = *b;
	b = new int;
	*b = (*a) + 5;
}
