void BinarySearch (int array[], int start, int end, int toFind, bool& found, int& location) 
{
	int mid=(start+end)/2;

	if (start > end)  // when the segment has start index bigger than end index, 
	{		  // we know the value to be found is not in the array, set "found" to false.
			  // and set location to -1
		found = false; 
		location = -1;
	}
	else
	{
		if (array[mid] == toFind)  // base case, found value, return index
		{
			found = true;
			location = mid;
		}
		else if (array[mid] > toFind)   // value should be smaller than the current middle value
			BinarySearch(array, start, mid-1, toFind, found, location);

		else if (key > array[mid])     // value should be bigger than the current middle value
			BinarySearch(array, mid+1, end, toFind, found, location);
	}
}
