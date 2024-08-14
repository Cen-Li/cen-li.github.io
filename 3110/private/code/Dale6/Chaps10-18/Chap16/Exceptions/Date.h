//****************************************
// SPECIFICATION File for a Date ADT
//****************************************
class MonthError
{};
class DayError
{};

class YearError
{};
class Date
{
public:
  Date();
  Date(int initMonth, int initDay, int initYear);
  // Knowledge Responsibilities
  int GetMonth() const;
  int GetDay() const;
  int GetYear() const;
  bool operator<(const Date& otherDate) const;
  bool operator>(const Date& otherDate) const;
  bool operator==(const Date& otherDate) const;
private:
  int month;
  int day;
  int year;
};
