#ifndef MAM_H
#define MAM_H
class mammal
{
public:
    mammal();
    mammal (int W, int H, int A);
    ~mammal();

    void setWeight(int w);
    void setHeight(int h);
    int returnWeight() const;
    int returnHeight() const;
    virtual void speak() const;
private:
    int weight;
    int height;
    int age;
};
#endif
