template<class ItemType>
void SelectSort(ItemType values[], int numValues)
// Pre:  < is defined on ItemType.
// Post: The elements in the array values are sorted in
//   ascending order using the selection sort algorithm.
{
  int endIndex = numValues-1;
  int indexOfMin;
  ItemType temp;
  for (int current = 0; current < endIndex; current++)
  {
    indexOfMin = current;
    for (int index = startIndex+1; index <= endIndex; index++)
      if (values[index] < values[indexOfMin])
        indexOfMin = index;
  
   // Swap values[current] and values[indexOfMin]
     temp = values[current];
     values[current] = values[indexOfMin];
     values[indexOfMin] = temp;
  }
}

