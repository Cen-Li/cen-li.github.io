#include <list>
#include "HashTable.h"

using namespace std;

template <class ItemType, class KeyType, int MaxSize, class HashFunction>
HashTable<ItemType, KeyType, MaxSize, HashFunction>::HashTable()
	: m_size(0)
{
	for ( int i=0; i<MaxSize; i++ )
        m_table[i].clear();
}


template <class ItemType, class KeyType, int MaxSize, class HashFunction>
HashTable<ItemType, KeyType, MaxSize, HashFunction>::HashTable(
		const HashTable<ItemType, KeyType, MaxSize, HashFunction>& table )
{
	m_size = table.m_size;

	for ( int i=0; i<MaxSize; i++)
		m_table[i] = table.m_table[i];
}
	
template <class ItemType, class KeyType, int MaxSize, class HashFunction>
HashTable<ItemType, KeyType, MaxSize, HashFunction>::~HashTable()
{}

template <class ItemType, class KeyType, int MaxSize, class HashFunction>
bool HashTable<ItemType, KeyType, MaxSize, HashFunction>::isEmpty( void ) const
{
	return (m_size == 0);
}

template <class ItemType, class KeyType, int MaxSize, class HashFunction>
int HashTable<ItemType, KeyType, MaxSize, HashFunction>::getLength( void ) const
{
	return m_size;
}

template <class ItemType, class KeyType, int MaxSize, class HashFunction>
void HashTable<ItemType, KeyType, MaxSize, HashFunction>::insert(const ItemType& newItem)
		throw (TableException)
{
	int		index = m_hash( newItem.getKey() );

	try
	{
		m_table[index].push_front( newItem );
        m_size ++;
	}
	catch (bad_alloc e)
	{
		throw TableException( e.what() );
	}
}	

template <class ItemType, class KeyType, int MaxSize, class HashFunction>
void HashTable<ItemType, KeyType, MaxSize, HashFunction>::remove( const KeyType searchKey )
{
	int		index = m_hash( searchKey );

	list<ItemType>::iterator	it = m_table[index].begin();

	for ( ; it != m_table[index].end(); it++ )
	{
		if (it->getKey() == searchKey )
		{
			m_table[index].erase( it );
			return;
		}
	}
    m_size--;
}

template <class ItemType, class KeyType, int MaxSize, class HashFunction>
void HashTable<ItemType, KeyType, MaxSize, HashFunction>::retrieve( 
		KeyType searchKey, ItemType& item ) const
		throw (TableException)
{
	int		index = m_hash( searchKey );

	list<ItemType>::const_iterator	it = m_table[index].begin();

	for ( ; it != m_table[index].end(); it++ )
	{
		if (it->getKey() == searchKey )
		{
			item =(*it);
			return;
		}
	}
	throw TableException("Cannot find the value");
}


template< class ItemType, class KeyType, int MaxSize, class HashFunction >
void HashTable<ItemType, KeyType, MaxSize, HashFunction>::print(ostream& out) const
{
    out << "HashTable: size = " << MaxSize << ", value number= " << m_size << endl;

    out << "Index \t Value" << endl;
    for ( int i=0; i<MaxSize; i++ )
    {
        out << i << " \t ";

        if ( m_table[i].empty() )
            out << "/";
        else
        {
            list<ItemType>::const_iterator   it = m_table[i].begin();
            for ( ; it != m_table[i].end(); )
            {
                out << (*it);
                if ( (++it) != m_table[i].end() )
                    out << " --> ";
            }
        }
        out << endl;
    }

    return;
}
