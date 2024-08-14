#ifndef Sorted_List_Class
#define Sorted_List_Class

#include <iostream>
using namespace std;

template <class T>
struct Node
{
	T item;
	Node<T>* link;

	bool operator != (const Node<T> rhs) { return item != rhs.item;}
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

protected:
	Node<T>* head;
};

#endif
