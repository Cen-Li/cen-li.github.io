/*
The hash_map is:
  ▪ An associative container, which a variable size container that supports 
    the efficient retrieval of element values based on an associated key value.
  ▪ Reversible, because it provides a bidirectional iterator to access its elements.
  ▪ Hashed, because its elements are grouped into buckets based on the value of 
    a hash function applied to the key values of the elements.
  ▪ Unique in the sense that each of its elements must have a unique key.
  ▪ A pair associative container, because its element data values are distinct 
    from its key values.
  ▪ A template class, because the functionality it provides is generic and so 
    independent of the specific type of data contained as elements or keys. 
    The data types to be used for elements and keys are, instead, specified as 
    parameters in the class template along with the comparison function and 
    allocator.

hash_compare Class
  * The template class describes an object that can be used by any of the hash 
    associative containers — hash_map, hash_multimap, hash_set, or hash_multiset 
    — as a default Traits parameter object to order and hash the elements they contain.

Each hash associative container stores a hash traits object of type Traits 
(a template parameter). You can derive a class from a specialization of hash_compare 
to selectively override certain functions and objects, or you can supply your own 
version of this class if you meet certain minimum requirements. Specifically, 
for an object hash_comp of type hash_compare<Key, Traits>, the following behavior 
is required by the above containers:
    * For all values _Key of type Key, the call hash_comp(_Key) serves as a hash function, 
      which yields a distribution of values of type size_t. The function supplied by 
      hash_compare returns _Key.
    * For any value _Key1 of type Key that precedes _Key2 in the sequence and has the same 
      hash value (value returned by the hash function), hash_comp(_Key2, _Key1) is false. 
      The function must impose a total ordering on values of type Key. The function supplied 
      by hash_compare returns comp(_Key2, _Key1), where comp is a stored object of type 
      Traits that you can specify when you construct the object hash_comp. For the default 
      Traits parameter type less<Key>, sort keys never decrease in value.
*/


#include <iostream>
#include <hash_map>

using namespace std;

int main()
{
  hash_map<const char*, int> months;
  
  months["january"] = 31;
  months["february"] = 28;
  months["march"] = 31;
  months["april"] = 30;
  months["may"] = 31;
  months["june"] = 30;
  months["july"] = 31;
  months["august"] = 31;
  months["september"] = 30;
  months["october"] = 31;
  months["november"] = 30;
  months["december"] = 31;
  
  cout << "september -> " << months["september"] << endl;
  cout << "april     -> " << months["april"] << endl;
  cout << "june      -> " << months["june"] << endl;
  cout << "november  -> " << months["november"] << endl;
}
