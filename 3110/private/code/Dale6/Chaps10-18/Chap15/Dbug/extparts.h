// This is the specification file for ExtParts.

#include "Parts.h"

class  ExtParts
{
public:
  long  NumInStockIs() const;
  void  Print() const;
  void  Initialize(long, long, float);
  ExtParts();
  ExtParts(long, long, float);
private:
  long  inStock;
}

