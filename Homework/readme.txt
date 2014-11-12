Author: 郁森<senyu@mail.dlut.edu.cn>/一杉<yusen.ys@alibaba-inc.com>

Homewrok
│  readme.txt [注释]
│
├─HTML [网页演示]
│  ├─AStar.v1 [A*启发式搜索的HTML演示代码,仅算法执行演示]
│  │  │  index.html 
│  │  │
│  │  ├─css
│  │  │      base.css
│  │  │      index_pcpage.css
│  │  │
│  │  └─js
│  │      │  main.js [angular控制器+优先队列实现+A*算法代码]
│  │      │
│  │      ├─angular
│  │      │      angular.js
│  │      │
│  │      └─jquery
│  │              jquery-1.8.2.min.js
│  │
│  └─DBFS.v2  [双向宽搜的HTML演示代码,包含可通过键盘上下左右键操作的游戏,以及自定义原始状态]
│      │  index.html
│      │
│      ├─css
│      │      base.css
│      │      index_pcpage.css
│      │
│      └─js
│          │  main.js [angular控制器+DBFS算法代码]
│          │
│          ├─angular
│          │      angular.js
│          │
│          └─jquery
│                  jquery-1.8.2.min.js
│
└─NodeJS [控制台演示]
        astar.js [A*启发式搜索算法代码]
        dbfs.js [双向宽搜算法代码]
        node.exe [NodeJS环境，必须]
        双向宽搜.bat  [控制台演示双向宽搜算法运算结果]
        启发式搜索.bat [控制台演示A*启发式搜索运算结果]