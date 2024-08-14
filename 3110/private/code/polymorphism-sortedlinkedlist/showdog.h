
#include "dog.h"
#ifndef SHOWDOG_H
#define SHOWDOG_H

enum ShowCategory {PUPPY, Twelve_TO_18_MONTH_OLD, NOVICE, BRED_BY_EXHIBITOR, AMERICAN_BRED, OPEN};

class showdog : public dog 
{ 
public:
        showdog();
        showdog(int W, int H, int A, BREED  B, ShowCategory C);
        showdog(const showdog& other);
        
        ~showdog();

        void setCategory(ShowCategory c);
        ShowCategory returnCategory() const;
        void printCategory() const;

        virtual void speak() const;
        virtual void print() const;

        showdog & operator = (const showdog & rhs);

        friend ostream & operator << (ostream & os, const showdog& rhs);
        friend istream & operator >> (istream & os, showdog& rhs);

protected:
        ShowCategory  category;
        
};
#endif
