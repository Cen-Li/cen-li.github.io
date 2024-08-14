// Program Arrays manipulates values in an array.             

#include <iostream>
using namespace std;

int main ()
{
  const int MAX_ARRAY = 5;                                                       
  int numbers[MAX_ARRAY];      
  int index;
  int sum;

  // Stored values in the array. 
  for (index = 0; index < MAX_ARRAY; index++)
    numbers[index] = index * index;                        

  // The values in the array are summed. 
  sum = 0; 
  for (index = 0; index < MAX_ARRAY; index++)
    sum = sum + numbers[index];
  cout << "Sum is " << sum << endl;
  return 0;
}                                                

