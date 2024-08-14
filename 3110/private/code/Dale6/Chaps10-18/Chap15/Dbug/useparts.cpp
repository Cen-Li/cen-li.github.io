// UseParts manipulates objects of Parts and ExtParts.

#include "extParts.h"

void  Print(Parts& part);

int main ()
{
  Parts  part1;
  Parts  part2(1066, 13.30);
  ExtParts  extPart1;
  ExtParts  extPart2(100, 1492, 14.50);

  part1.Print();
  part2.Print();
  extPart1.Print();
  extPart2.Print();

  Print(part1);
  Print(part2);
  Print(extPart1);
  Print(extPart2);

  return 0;
}

void  Print(Parts&  part)
{
  part.Print();
}




