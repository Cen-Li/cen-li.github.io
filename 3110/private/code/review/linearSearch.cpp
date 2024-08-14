int LinearSearch (const int a[], int aSize, int toFind) 
{ 
     // Look through all items, starting at the front. 
     for (int i = 0; i < aSize; i++)     
         if (a[i] == toFind)            
             return i; 
  
     // You've gone through the whole list without success.  
     return -1; 
}

