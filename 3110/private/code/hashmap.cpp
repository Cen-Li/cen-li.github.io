/*

The hash_map is:

  * An associative container, which a variable size container that supports 

    the efficient retrieval of element values based on an associated key value.

  * Reversible, because it provides a bidirectional iterator to access its elements.

  * Hashed, because its elements are grouped into buckets based on the value of 

    a hash function applied to the key values of the elements.

  * Unique in the sense that each of its elements must have a unique key.

  * A pair associative container, because its element data values are distinct 

    from its key values.

  * A template class, because the functionality it provides is generic and so 

    independent of the specific type of data contained as elements or keys. 

    The data types to be used for elements and keys are, instead, specified as 

    parameters in the class template along with the comparison function and 

    allocator.



hash_compare Class

  * The template class describes an object that can be used by any of the hash 

    associative containers   hash_map, hash_multimap, hash_set, or hash_multiset 

      as a default Traits parameter object to order and hash the elements they contain.



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





#include <ostream>

#include <hash_map> //header for hash_map

#include <iostream>

#include <fstream>

#include <string>



using namespace std;

using namespace stdext; //hash_map is defined in the namespace stdext



typedef string MyStr;



class MyInt {

   int i;

public:

   friend ostream& operator<<(ostream& ii, MyInt& jj);

   MyInt(int j = 0) {

      i = j;

   }

};



class greater_str {

public:

   bool operator()(const MyStr & x, const MyStr & y) const {

      if ( x < y)

         return true;



      return false;

   }

};





class less_str {

public:

   bool operator()(const MyStr & x, const MyStr & y) const {

      if ( x > y )

         return true;



      return false;

   }

};



ostream& operator<<(ostream& o, MyInt& j) {

   o << j.i;

   return o;

}



int main() {

   typedef pair <MyStr, MyInt> Int_Pair;



   hash_map <MyStr, MyInt>::iterator hm1_Iter, hm3_Iter, hm4_Iter, hm5_Iter, hm6_Iter;



   hash_map <MyStr, MyInt, hash_compare <MyStr, greater_str > >::iterator hm2_Iter;



   // Create an empty hash_map hm0 of key type integer

   hash_map <MyStr, MyInt> hm0;



   // Create an empty hash_map hm1 with the key comparison

   // function of less than, then insert 4 elements

   hash_map <MyStr, MyInt, hash_compare <MyStr, less_str > > hm1;



   hm1["one"] = 0;

   hm1.insert( Int_Pair( "two", 10 ) );

   hm1.insert( Int_Pair( "three", 20 ) );

   hm1.insert( Int_Pair( "four", 30 ) );

   hm1.insert( Int_Pair( "five", 40 ) );



   // Create an empty hash_map hm2 with the key comparison

   // function of geater than, then insert 2 elements

   hash_map <MyStr, MyInt, hash_compare <MyStr, greater_str > > hm2;

   hm2.insert( Int_Pair( "one", 10 ) );

   hm2.insert( Int_Pair( "two", 20 ) );



   // Create a hash_map hm3 with the 

   // allocator of hash_map hm1

   hash_map <MyStr, MyInt>::allocator_type hm1_Alloc;

   hm1_Alloc = hm1.get_allocator( );

   hash_map <MyStr, MyInt, hash_compare <MyStr, less_str > > hm3( hash_compare <MyStr, less_str > (), hm1_Alloc );

   hm3.insert( Int_Pair( "three", 30 ) );





   // Create a copy, hash_map hm4, of hash_map hm1

   hash_map <MyStr, MyInt, hash_compare <MyStr, less_str > > hm4( hm1 );



   // Create a hash_map hm5 by copying the range hm1[_First, _Last)

   hash_map <MyStr, MyInt>::const_iterator hm1_bcIter, hm1_ecIter;

   hm1_bcIter = hm1.begin();

   hm1_ecIter = hm1.begin();

   hm1_ecIter++;

   hm1_ecIter++;

   hash_map <MyStr, MyInt> hm5(hm1_bcIter, hm1_ecIter);



   // Create a hash_map hm6 by copying the range hm4[_First, _Last)

   // and with the allocator of hash_map hm2

   hash_map <MyStr, MyInt>::allocator_type hm2_Alloc;

   hm2_Alloc = hm2.get_allocator( );

   hash_map <MyStr, MyInt, hash_compare <MyStr, less_str > > hm6( hm4.begin( ), ++hm4.begin( ), hash_compare <MyStr, less_str > ( ), hm2_Alloc);



   cout << "hm1 =";

   for ( hm1_Iter = hm1.begin(); hm1_Iter != hm1.end(); hm1_Iter++ )

      cout << " " << hm1_Iter -> second;

   cout << endl;

   

   cout << "hm2 =";

   for ( hm2_Iter = hm2.begin( ); hm2_Iter != hm2.end( ); hm2_Iter++ )

      cout << " " << hm2_Iter -> second;

   cout << endl;



   cout << "hm3 =";

   for ( hm3_Iter = hm3.begin( ); hm3_Iter != hm3.end( ); hm3_Iter++ )

      cout << " " << hm3_Iter -> second;

   cout << endl;



   cout << "hm4 =";

   for ( hm4_Iter = hm4.begin( ); hm4_Iter != hm4.end( ); hm4_Iter++ )

      cout << " " << hm4_Iter -> second;

   cout << endl;



   cout << "hm5 =";

   for ( hm5_Iter = hm5.begin( ); hm5_Iter != hm5.end( ); hm5_Iter++ )

      cout << " " << hm5_Iter -> second;

   cout << endl;



   cout << "hm6 =";

   for ( hm6_Iter = hm6.begin( ); hm6_Iter != hm6.end( ); hm6_Iter++ )

      cout << " " << hm6_Iter -> second;

   cout << endl;



   return 0;

}

