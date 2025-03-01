#ifndef Sorted_List_Class
#define Sorted_List_Class
#include <iostream>
using namespace std;

template <class T>
struct Node
{
	T item;
	Node<T>* link;
};

template <class T>
class sortedListClass
{
public:
	//Default constructor for the sortedListClass
	sortedListClass();

	//Destructor for the sortedListClass
	~sortedListClass();
	
	//Inserts an entry into the list (remaining in alphabetical order)
	void Insert(const T& value);
	
	//Prints the entire list
	void printList() const;

        //friend ostream & operator<< (ostream & os, const sortedListClass<T> & rhs);
	
protected:
	Node<T>* head;
};

#endif

// sortedListClass.cpp

#include <iostream>
#include <cassert>

using namespace std;

template <class T>
sortedListClass<T>::sortedListClass()
{
    	head = NULL;
}

template <class T>
sortedListClass<T>::~sortedListClass()
{
	Node<T>* cur = head;
	while (cur != NULL)
	{
		head = head->link;
		cur->link = NULL;
		delete cur;
		cur = head;
	}
}

template <class T>
void sortedListClass<T>::Insert(const T& value)
{
	Node<T>* newPtr, *cur, *prev;
	newPtr = new Node<T>;
	newPtr->item = value;

	prev = NULL;
	cur = head;
	while (cur != NULL && cur->item < value)
	{
		prev = cur;
		cur = cur->link;
	}
	
	if (prev != NULL) // insertion in the middle or at the end case
	{
		newPtr->link = cur;
		prev->link = newPtr;
	}
	else // insertion at the beginning of the list case
	{
		newPtr->link = cur;
		head = newPtr;
	}
}

template <class T>
void sortedListClass<T>::printList() const
{
	Node<T>* tmp;

	tmp = head;
	while (tmp != NULL)  {
		cout << tmp->item << endl;
		tmp = tmp->link;
	}
}

/*
template <class T>
ostream& operator << (ostream& os, const sortedListClass<T>& rhs)
{
	Node<T>* tmp;

	tmp = rhs.head;
	while (tmp != NULL)  {
		os << *(tmp->item) << endl;
		tmp = tmp->link;
	}

	return os;
}
*/

#include <cstdlib>
#include <ctime>
#include <iostream>
#include <string>
using namespace std;

int main()
{
    sortedListClass<int> intList;
    sortedListClass<float> floatList;
    sortedListClass<string> stringList;

    srand(time(0));

    // Build a list of integer numbers
    for (int i=0; i<10; i++)
        intList.Insert(rand()%100);
    cout << "Sorted list of integers: " << endl;
    intList.printList();

    for (int i=0; i<10; i++)
    	floatList.Insert(rand()%100+0.5);
    cout << "Sorted list of floating values: " << endl;
    floatList.printList();

    for (int i=0; i<5; i++)  {
    	string name;
        cout << "enter a name:" << endl;
	cin >> name; 
	stringList.Insert(name);
    }
    cout << "Sorted list of names:" << endl;
    stringList.printList();

    return 0;
}
