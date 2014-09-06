#include <stdio.h>
#include <string.h>
#include <iostream>
#include <queue>
#define FUCK puts("fuck!")
#define STOP system("pause")
#define MAXN 388211
using namespace std;
struct state{
	int sta,pos,step;
	int visit;
}st[MAXN],source,target;
int temp[10],tar[10],sou[10];
int d[9][4]={{0,4,0,2},{0,5,1,3},{0,6,2,0},{1,7,0,5},{2,8,4,6},{3,9,5,0},{4,0,0,8},{5,0,7,9},{6,0,8,0}};
int num;
int convert(int a[],state &b)
{
	b.sta=0;
	for(int i = 0; i < 9; i ++) 
	{	
		if(a[i]!=0)
			b.sta |=((a[i]-1)<<(24-i*3));
		else
		{
			b.pos = i;
			b.sta |=(a[i]<<(24-i*3));
		}
	}
	return 1;
}
state exchange(state a,int pos)
{
	int temp = 7<<((9-pos)*3);
	state s;
	s.sta = a.sta;
	temp = temp & a.sta;
	temp = ((temp>>((9-pos)*3))<<((9-a.pos-1)*3));
	s.sta |= temp;
	s.sta &= ~(7<<((9-pos)*3));
	s.pos = pos-1;
	return s;
}
int search(state a)
{
	int index = a.sta%MAXN;
	bool flag = true;
	while(flag)
	{
		if(!st[index].sta)
		{
			st[index].sta = a.sta;
			st[index].pos = a.pos;
			flag = false;
		}
		else if(!(st[index].sta^a.sta)&&!(st[index].pos^a.pos))
			flag = false;
		else
			index = (index+1)%MAXN;
	}
	return index;
}
int main()
{
	freopen("in.txt","r",stdin);
	clock_t start,end;
	for(int j=0;j<8;j++)temp[j] = j+1;
	temp[8]=0;
	convert(temp,target);
	while(1)
	{
		int i = 0;
		memset(st,0,sizeof(st));
		char ch;
		while((ch=getchar())!='\n')
		{
			if(ch<='9'&&ch>='0')
				sou[i++] = ch - '0';
			else if(ch=='x')
				sou[i++] =0;
		}
		convert(sou,source);
		start = clock();
		i = search(source);
		queue<int>q;
		q.push(i);
		i = search(target);
		st[i].visit = 1;
		st[i].step = 1;
		q.push(i);
		if(!(source.sta^target.sta)&&!(source.pos^target.pos))
		{
			printf("0\n");
			while(!q.empty())q.pop();
				continue;
		}
		int index;
		int count = 0;
		bool isSolve = false;
		while(!q.empty()&&!isSolve)
		{
			count ++;
			index = q.front();
			for(int j = 0; j < 4; j ++)
			{
				if(d[st[index].pos][j])
				{
					int flag = search(exchange(st[index],d[st[index].pos][j]));
					if(!st[flag].step)
					{
						st[flag].step = st[index].step + 1;	
						st[flag].visit = st[index].visit;
						q.push(flag);
					}	
					else
					{
						if(st[flag].visit^st[index].visit)
						{
							isSolve = true;
							printf("%d\n",st[index].step+st[flag].step);
						}
					}
				}
			}
			q.pop();
		}
		while(!q.empty())q.pop();
		end = clock();
		printf("Time:%dms\nstate number:%d\n",end-start,count);
	}
	system("pause");
        return 0;
}
