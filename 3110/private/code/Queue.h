/* 
 * This example includes two files: Queue.h and Queue.cpp.
 * This example is used to present how to use function template
 * and class template, i.e. generic programming
 */

#ifndef _QUEUE_H_
#define _QUEUE_H_

#include <string>

// The class T must overload operator <<
// otherwise the function print doesn't 
// work correctly.

// T is a type parameter
// MAX is a value parameter, its default value
// is 30
template <class T, int MAX=30>
class Queue
{
	T	m_data[MAX]; //storage of queue items
	int	m_tail; // index of last item

public:
	//Constructor
	Queue();

	void add(const T & item);
	void remove( void );
	T getHead() const;
	void print() const;

};

#include "Queue.cpp"

#endif
