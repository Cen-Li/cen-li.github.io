/* 
 * This example includes two files: SQueue.h and SQueue.cpp.
 * This example is used to present how to define homemade
 * iterators, just like those iterators provided by STL. It
 * also shows the way to define a class i(called inner class)
 * within another class (outer class).
 * Facts about inner class:
 *  1. Inner class is in the namespace of outerclass, i.e. it can 
 *     use any data type defined in outer class.
 *  2. Inner class cannot access any nonstatic members of outer class
 *  3. Inner class can be public, private, or protected. If it is public,
 *     users of outer class can use it just like any normal type in the 
 *     following form: 
 *     outerClassName::innerClassName
 */

#ifndef _SQUEUE_H_
#define _SQUEUE_H_

#include <iterator>
#include <string>


typedef int T;

// A simple queue as a singly-linked list
class SQueue
{
private:
	// The Node class holds the value
	class Node {
	public:
		Node(const T& val) : m_next(NULL), m_val(val){}

		T& getVal() { return m_val; }

		Node*	m_next;
	private:
		T	m_val;
	};

	Node*	m_head;
	Node*	m_tail;

public:
	//Constructor
	SQueue();
	~SQueue();

	void pushBack( const T& val );
	T popFront();
	
	// Here is homemade iterator. The only kind of iterator this data
	// structure can reasonably support is a forward, so that's what I
	// provide. I embedded the definition of the iterator within the
	// class it will iterate through for convenience.
	// The homemade iterator inherits from the Iterator class in <iterator>
	// so that standard algorithms in STL can use them.
	class Iterator : public std::iterator<std::forward_iterator_tag, T>
	{
	public:
		Iterator(Node* p=NULL);
		
		Iterator& operator=(const Iterator& other);
		bool operator == (const Iterator& other);
		bool operator != (const Iterator& other);
		Iterator& operator++();
		Iterator operator++(int);
		T& operator*();
	private:
		Node* m_node;
	};	
	Iterator begin();
	Iterator end();

};


#endif
