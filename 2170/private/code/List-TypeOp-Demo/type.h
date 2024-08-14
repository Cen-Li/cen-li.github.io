#ifndef Type_H
#define Type_H

struct musicType 
{
	string title;
	string artist;

	bool operator < (const musicType &  rhs) const;
};

#endif
