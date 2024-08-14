#ifndef Type_H
#define Type_H

struct musicType 
{
	string title;
	string artist;

	bool operator < (const musicType &  rhs) const;
};

bool musicType::operator<(const musicType & rhs) const
{
	return (artis < rhs.artist);
}
#endif
