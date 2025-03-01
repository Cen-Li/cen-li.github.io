/*
The template class describes an object that controls a varying-length sequence 
of elements of type std::pair<const Key, Ty>. The sequence is weakly ordered by 
a hash function, which partitions the sequence into an ordered set of subsequences 
called buckets. Within each bucket a comparison function determines whether any 
pair of elements has equivalent ordering. Each element stores two objects, a sort 
key and a value. The sequence is represented in a way that permits lookup, insertion, 
and removal of an arbitrary element with a number of operations that can be 
independent of the number of elements in the sequence (constant time), at least when 
all buckets are of roughly equal length. In the worst case, when all of the elements 
are in one bucket, the number of operations is proportional to the number of elements 
in the sequence (linear time). Moreover, inserting an element invalidates no iterators, 
and removing an element invalidates only those iterators which point at the removed 
element.

template<class Key,
    class Ty,
    class Hash = std::hash<Key>,
    class Pred = std::equal_to<Key>,
    class Alloc = std::allocator<std::pair<const Key, Ty> > >
    class unordered_map;


Parameter		Description

Key				The key type.
Ty				The mapped type.
Hash			The hash function object type.
Pred			The equality comparison function object type.
Alloc			The allocator class.
*/

#include <iostream>
#include <unordered_map>

using namespace std;

struct eqstr
{
  bool operator()(const char* s1, const char* s2) const
  {
    return strcmp(s1, s2) == 0;
  }
};

int main()
{
  unordered_map<const char*, int, hash<const char*>, eqstr> months;
  
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
