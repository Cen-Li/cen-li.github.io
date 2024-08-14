#include "type.h"

bool musicType::operator<(const musicType & rhs) const
{
	return (artis < rhs.artist);
}
