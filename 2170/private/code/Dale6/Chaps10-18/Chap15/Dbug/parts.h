// This is a specification file for class Parts.

class  Parts
{
public:
  long  IdNumIs() const;
  float  PriceIs() const;
  void  Print() const;
  void  Initialize(long, float);
  Parts();
  Parts(long, float);
private:
  long  idNum;
  float  price;
}

