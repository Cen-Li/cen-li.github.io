#include "showdog.h"

showdog::showdog() : dog()
{
   // cout << "executing showdog's default constructor" << endl;
   category = PUPPY; 
}

showdog::showdog(int W, int H, int A, BREED  B, ShowCategory C):
  dog(W, H, A, B), category(C)
{
   // cout << "executing showdog's value constructor" << endl;
}

showdog::showdog(const showdog& other):dog(other),category(other.category)
{
   //cout << "executing showdog's copy constructor" <<endl;
}

showdog::~showdog()
{
    //cout << "executing showdog's destructor" << endl;
}

void showdog::setCategory(ShowCategory C)
{
    category = C;
}

ShowCategory showdog::returnCategory() const
{
    return category;
}

void showdog::printCategory() const
{
    static string categoryNames[6] = {"PUPPY", "12_TO_18_MONTH_OLD", "NOVICE", "BRED_BY_EXHIBITOR", "AMERICAN_BRED", "OPEN"};
    cout << categoryNames[category];
}

void showdog::print() const
{
    dog::print();
    printCategory();
}

void showdog::speak() const
{
    cout << "I am the best, I am the prettiest!" << endl;
}

showdog & showdog::operator = (const showdog & rhs)
{
    if (this != & rhs)
    {
        weight = rhs.weight;
        height = rhs.height;
        age = rhs.age;
        itsBreed = rhs.itsBreed;
        category = rhs.category;
    }

    return *this;
}

ostream & operator << (ostream & os, const showdog& rhs)
{
    static string breedNames[6]={"COLLIE", "DACHOUND", "COCKER", "LAB", "POODLE", "TERRIER"};
    static string categoryNames[6] = {"PUPPY", "12_TO_18_MONTH_OLD", "NOVICE", "BRED_BY_EXHIBITOR", "AMERICAN_BRED", "OPEN"};
 
    os << "weight: " << rhs.weight<< " pounds" << endl;
    os << "height: " << rhs.height<< " inches" << endl;
    os << "breed: " << breedNames[rhs.itsBreed] << endl;
    os << "category: " << categoryNames[rhs.category] << endl;

    return os;
}

istream & operator >> (istream & is, showdog & rhs)
{
    string s;

    is >> rhs.weight >> rhs.height >> rhs.age;

    is >> s;
    switch (s[0])
    {
    case 'D': rhs.itsBreed = DACHOUND; break;
    case 'L': rhs.itsBreed = LAB; break;
    case 'T': rhs.itsBreed = TERRIER; break;
    case 'P': rhs.itsBreed = POODLE; break;
    case 'C': if (s == "COLLIE") {  
                rhs.itsBreed = COLLIE; break;
              }
              else {
                rhs.itsBreed = COCKER; break;
              }
    }

    is >> s;
    switch (s[0]) {
    case 'P': rhs.category = PUPPY; break;
    case 'T': rhs.category = Twelve_TO_18_MONTH_OLD; break;
    case 'N': rhs.category = NOVICE; break;
    case 'B': rhs.category = BRED_BY_EXHIBITOR; break;
    case 'A': rhs.category = AMERICAN_BRED; break;
    case 'O': rhs.category = OPEN;
    }

    return is;
}
