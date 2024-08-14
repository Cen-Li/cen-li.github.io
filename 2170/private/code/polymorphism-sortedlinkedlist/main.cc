// main.cc

#include "showdog.h"
#include "sortedListClass.h"

#include <iostream>
#include <fstream>
#include <cassert>
#include <cstdlib>  // exit()
using namespace std;

void DeleteDog(sortedListClass & allDogs);
void PrintInfo(sortedListClass & allDogs);

int main()
{
    ifstream myIn;
    char type;   // 'd' for dog, 's' for showdog
    sortedListClass listOfDogs;
    int weight, height, age;
    string breed, category;
    dog  *new_dog;
    dog  aDog;
    showdog aShowDog;

    myIn.open("dogs.dat");
    assert(myIn);

    // read "dog" or "showdog" records from the data file til end of file
    // For each "dog" or "showdog", create a new object dynamically.
    // Insert the object into the linked list 
    // The base type of the linked list is the base class "mammal"
    while (myIn >> type)  {
        if (type == 'd') {

            myIn >> aDog;
            new_dog = new dog(aDog);

            listOfDogs.Insert(new_dog);
        }
        else if (type == 's') {
            myIn >> aShowDog;
            new_dog = new showdog(aShowDog);
            listOfDogs.Insert(new_dog);
        }
        else {
            cerr << "error in data file. exit ..." << endl;
            exit(-1);
        }
    }
    myIn.close();

    PrintInfo(listOfDogs);

    DeleteDog(listOfDogs);
    cout << "after deletion, display the list again ..." << endl;
    PrintInfo(listOfDogs);

    return 0;
}

// This function displays the list of dogs and show dogs currently
// stored in the list of dogs
// allDogs (IN): the list of dogs and showdogs
void PrintInfo(sortedListClass & allDogs)
{
    // This loop illustrates how Polymorphism works in linked list
    // List iterator methods (Reset, GetNextItem) are used 
    mammal *m;   // key !!  pointer type is a must
    bool success;
    int count=0;

    cout << endl;
    allDogs.Reset();
    while (count < allDogs.GetLength()) {
        allDogs.GetNextItem(m, success);
        if (success) {
            cout << *m;
            m->speak();
            cout << endl;
        }
        count ++;
   }
}

// This function prompts the user to delete a dog 
// by supplying the weight-height combination
// allDogs (IN/OUT): the list of dogs and showdogs
void DeleteDog(sortedListClass & allDogs)
{
    int height, weight;
    mammal *m;   // key!!

    cout << "Enter height: ";
    cin >> height;
    cout << "Enter weight: ";
    cin >> weight;
    m = new mammal(weight, height, 0);
    allDogs.Delete(m);
}
