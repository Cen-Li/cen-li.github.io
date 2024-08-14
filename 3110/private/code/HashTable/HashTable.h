#ifndef _HASH_H_
#define _HASH_H

#include <stdexcept>
#include <string>
#include <list>
#include <iostream>

class TableException: public std::logic_error
{
public:
	TableException(const std::string& msg="")
		: std::logic_error(msg.c_str())
	{}
};

// assume ItemType must provide a function getKey to return
// the key. The type of key is specified by KeyType.
// ItemType also need to overload the extraction operator <<.
// HashFunction overload function call operator which takes
// a KeyType value as the only parameter, and return an
// integer.
template <class ItemType, class KeyType, int MaxSize, class HashFunction>
class HashTable
{
public:
	// constructor and destructor
	HashTable();
	HashTable(const HashTable<ItemType, KeyType, MaxSize, HashFunction>& table );
	virtual ~HashTable();

	//operations
	virtual bool isEmpty( void ) const;
	virtual int  getLength( void ) const;

	virtual void insert(const ItemType& newItem)
		throw (TableException);

	virtual void remove( const KeyType searchKey );

	virtual void retrieve( KeyType searchKey, ItemType& item ) const
		throw (TableException);

    // This function is used to print the whole hash table. For debug only
    void print ( std::ostream& ) const;
private:
	HashFunction		m_hash;

	std::list<ItemType>	m_table[MaxSize];
	int				  	m_size;
};

#endif

