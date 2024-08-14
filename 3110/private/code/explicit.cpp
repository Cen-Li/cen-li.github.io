#include <iostream>
#include <string>

using namespace std;

class Ghost
{
	public:
		Ghost( int x ) : m_speed(x) {}

		// then try this version to see the difference
		// explicit Ghost( int x ) : m_speed(x) {}

		int getSpeed() const
		{	
			return m_speed; 
		}

	private:
		int		m_speed;
};

int main( void )
{
	Ghost		ghost1 ( 10 );
	cout << "speed = " << ghost1.getSpeed() << endl;

	ghost1 = 5;
	cout << "speed = " << ghost1.getSpeed() << endl;

	Ghost		ghost2 = 3;
	cout << "speed = " << ghost2.getSpeed() << endl;

	return 0;
}
