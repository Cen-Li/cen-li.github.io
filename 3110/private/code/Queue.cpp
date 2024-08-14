/* 
 * This example includes two files: Queue.h and Queue.cpp.
 * This example is used to present how to use function template
 * and class template, i.e. generic programming
 */

#include <iostream>
#include <stdexcept>
#include <string>

#include "Queue.h"

using namespace std;

template <class T, int MAX>
Queue<T, MAX>::Queue()
	: m_tail(-1)
{
}

template <class T, int MAX>
void Queue<T,MAX>::add(const T & item)
{
	if (m_tail == MAX-1)
		throw runtime_error("No more space");
	m_data[++m_tail] = item;
}

// Function shift is declared as a global function
// on purpose in order to show the usage of function template.

template<class T>
void shift( T values[], int size )
{
	for ( int i=0; i<size-1; i++ )
		values[i] = values[i+1];
}
	
template <class T, int MAX>
void Queue<T,MAX>::remove()
{
	if (m_tail == -1)
		throw runtime_error("No data in the queue");
	shift( m_data, MAX );
	m_tail--;
}


template <class T, int MAX>
T Queue<T,MAX>::getHead() const
{
	if ( m_tail != -1 )
		return m_data[0];
	else
		throw runtime_error("empty queue");
}


template <class T, int MAX>
void Queue<T,MAX>::print() const
{
	cout << endl;
	cout << "The contents in the Queue are" << endl;
	cout << "# : value" << endl;
	for (int i=0; i<=m_tail; i++)
		cout << i << " : " << m_data[i] << endl;
	cout << "end of the queue" << endl << endl;
}

int main( void )
{
	cout << "Example: int Queue with size 20" << endl << endl;

	Queue<int, 20>	intQ;

	intQ.add(300);
	intQ.add(400);
	intQ.add(200);
	cout << "Before remove" << endl;
	intQ.print();
	intQ.remove();
	cout << "After remove" << endl;
	intQ.print();

	cout << "Example: string Queue with default size" << endl << endl;
	Queue<string>	strQ;
	
	strQ.add("string 1");
	strQ.add("string 2");
	strQ.add("string 3");
	
	cout << "Before remove" << endl;
	cout << "1st element is \"" << strQ.getHead() 
		 << "\"" << endl << endl;
	strQ.remove();
	cout << "After remove" << endl;
	cout << "1st element is \"" << strQ.getHead() 
		 << "\"" << endl << endl;

	for ( int i=0; i<50; i++ )
	{
		try {
			strQ.add("Whatever");
		} catch (runtime_error  re)
		{
			cout << "Exception occurs when i=" << i << endl;
			cout << re.what() << endl;
			return -1;
		}
	}

	return 0;
}
