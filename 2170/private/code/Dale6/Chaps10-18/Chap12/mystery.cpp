#include "mystery.h"

void Mystery::Mystery(long newFirst, long newSecond)
// Initialize sets the member variables of an instance of
// Mystery.
{
  first = newFirst;
  second = newSecond;
}

long Mystery::FirstIs
// FirstAre returns the value of class member first.
{
  return first;
}

long Mystery::SecondIs
// SecondAre returns the value of class member second.
{
  return second;
}

Mystery Mystery::What(Mystery  value)
// Pre:  both operands have been initialized. *)
{
  Mystery  result;
  result.second = second + value.second;
  result.first = first + value.first;
  return result;
}
