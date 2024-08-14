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

#include <iostream>
#include <string>
#include <stdexcept>

#include "SQueue.h"

using namespace std;

SQueue::SQueue()
	: m_head(NULL), m_tail(NULL)
{
}

SQueue::~SQueue()
{
	while( m_head != NULL )
	{
		Node*	temp = m_head->m_next;
		delete m_head;
		m_head = temp;
	}
}

void SQueue::pushBack( const T& val )
{
	if ( m_head == NULL )
	{
		m_head = new Node(val);
		m_tail = m_head;
	}
	else
	{
		Node* p = new Node(val);
		m_tail->m_next = p;
		m_tail = p;
	}
}

T SQueue::popFront()
{
	if ( m_head == NULL )
		throw std::out_of_range("Queue is empty");
	else
	{
		Node* p= m_head;
		m_head = m_head->m_next;
		return m_head->getVal();
	}
}
	
SQueue::Iterator::Iterator(Node* p)
	:m_node(p)
{}
		
SQueue::Iterator& SQueue::Iterator::operator=(const Iterator& other)
{
	m_node = other.m_node;
	return (*this);
}

bool SQueue::Iterator::operator==(const Iterator& other)
{
	return (m_node == other.m_node);
}

bool SQueue::Iterator::operator!=(const Iterator& other)
{
	return (m_node != other.m_node);
}

SQueue::Iterator& SQueue::Iterator::operator++()
{
	if ( m_node != NULL )
		m_node = m_node->m_next;
	return (*this);
}

SQueue::Iterator SQueue::Iterator::operator++(int)
{
	Iterator temp(*this);

	++(*this);
	return (temp);
}

T& SQueue::Iterator::operator*()
{
	return m_node->getVal();
}


SQueue::Iterator SQueue::begin()
{
	return Iterator(m_head);
}

SQueue::Iterator SQueue::end()
{
	return Iterator(NULL);
}

#include <list>
#include <algorithm>

int main( void )
{
	SQueue	que;

	que.pushBack( 3 );
	que.pushBack( 2 );
	que.pushBack( 9 );
	que.pushBack( 21 );
	que.pushBack( 15 );

	cout << "Integers in the queue" << endl;
	SQueue::Iterator	it;
	for ( it=que.begin(); it!=que.end(); ++it )
		cout << *it << endl;

	list<int>	lst;
	copy(que.begin(), que.end(), back_inserter(lst));
	// copy defined in <algorithm>
	// back_inserter creates an iterator that can insert 
	// elements at the back of a specified container

	cout << endl
		 << "Integers in the list" << endl;

	list<int>::iterator	it2;
	for ( it2=lst.begin(); it2!=lst.end(); ++it2 )
		cout << *it2 << endl;
	cout << endl;

	SQueue::Iterator	pos = find(que.begin(), que.end(), 21);

	if ( *pos == 21 )
		cout << "21 found in the queue" << endl;
	else
		cout << "cannot find 21 in the queue" << endl;
	return 0;
}


