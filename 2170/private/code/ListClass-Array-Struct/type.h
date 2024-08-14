#include <string>
using namespace std;

struct DateType
{
	int month;
	int day;
	int year;
};

struct BookStruct
{
	string title;
	string author;
	DateType dateBorrowed;
	float price;
};
