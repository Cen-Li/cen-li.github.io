// main.cpp
// This is the client program for the CharCountList class
// The program counts the frequency of the characters appeared in a data file
// It illustrates:
// - how to access list member functions
// - use list iterator to step through the list

#include "CharCountList.h"

#include <fstream>
#include <iostream>
#include <cassert>
using namespace std;

int main()
{
    CharCountList  oneList;  // created an empty CharCountList object
    ifstream        myIn;
    char            ch;      // read in the next character
    ItemType        item;    // place holder to store the item retrieved from the list

    // open the data file
    myIn.open("charData.dat");
    assert(myIn);

    // read the character one-by-one til the end of the data file
    // Add the character to the list with count 1 when the character
    // is read the first time
    // After the first time, increment the counter of that character by 1
    while ((myIn >> ch) &&(!oneList.IsFull())) {
        if (!oneList.IsThere(ch)) {
            oneList.Store(ch);
        }
        else  {
            oneList.IncrementCount(ch);
        }
    }

    // Display the frequncy of the characters
    while (oneList.HasNextItem())   {
        item = oneList.GetNextItem();
        cout << item.letter << " appeared " <<  item.count << " times" << endl;
    }

    myIn.close();

    return 0;
}
