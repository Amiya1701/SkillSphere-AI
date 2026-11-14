USE skillsphere;

INSERT IGNORE INTO technologies (name,slug,description,category,icon) VALUES
('Artificial Intelligence','artificial-intelligence','Foundations of intelligent systems, search, reasoning and modern AI.','AI','✦'),
('Machine Learning','machine-learning','Learn data-driven modeling from preprocessing to evaluation.','AI','◉'),
('Deep Learning','deep-learning','Neural networks, CNNs, sequence models and modern deep learning.','AI','◈'),
('Data Structures & Algorithms','dsa','Core data structures, algorithms and problem solving.','Core CS','⌘'),
('DBMS','dbms','Database design, SQL, normalization, transactions and indexing.','Core CS','▦'),
('Computer Networks','computer-networks','Networking models, protocols, addressing and security basics.','Core CS','◎'),
('Operating Systems','operating-systems','Processes, memory, scheduling, filesystems and concurrency.','Core CS','◌'),
('Java','java','Object-oriented programming and practical Java development.','Programming','☕'),
('Python','python','Python fundamentals for software development and data work.','Programming','🐍'),
('React','react','Build component-based modern web interfaces.','Development','⚛');

INSERT IGNORE INTO roadmap_topics (technology_id,title,description,difficulty,estimated_hours,order_no)
SELECT id,'Python Foundations','Syntax, functions, collections and modules needed for ML.','Beginner',4,1 FROM technologies WHERE slug='machine-learning';
INSERT IGNORE INTO roadmap_topics (technology_id,title,description,difficulty,estimated_hours,order_no)
SELECT id,'NumPy & Pandas','Work with arrays, tables and practical data preparation.','Beginner',5,2 FROM technologies WHERE slug='machine-learning';
INSERT IGNORE INTO roadmap_topics (technology_id,title,description,difficulty,estimated_hours,order_no)
SELECT id,'Data Preprocessing','Cleaning, encoding, scaling and splitting datasets.','Beginner',4,3 FROM technologies WHERE slug='machine-learning';
INSERT IGNORE INTO roadmap_topics (technology_id,title,description,difficulty,estimated_hours,order_no)
SELECT id,'Linear Regression','Understand supervised learning, loss and prediction.','Beginner',3,4 FROM technologies WHERE slug='machine-learning';
INSERT IGNORE INTO roadmap_topics (technology_id,title,description,difficulty,estimated_hours,order_no)
SELECT id,'Logistic Regression','Learn binary classification and probability-based prediction.','Intermediate',3,5 FROM technologies WHERE slug='machine-learning';
INSERT IGNORE INTO roadmap_topics (technology_id,title,description,difficulty,estimated_hours,order_no)
SELECT id,'Decision Trees','Learn tree-based classification and regression.','Intermediate',4,6 FROM technologies WHERE slug='machine-learning';
INSERT IGNORE INTO roadmap_topics (technology_id,title,description,difficulty,estimated_hours,order_no)
SELECT id,'Model Evaluation','Accuracy, precision, recall, F1, confusion matrix and validation.','Intermediate',3,7 FROM technologies WHERE slug='machine-learning';

INSERT IGNORE INTO roadmap_topics (technology_id,title,description,difficulty,estimated_hours,order_no)
SELECT id,'Arrays & Strings','Foundational problem-solving patterns.','Beginner',4,1 FROM technologies WHERE slug='dsa';
INSERT IGNORE INTO roadmap_topics (technology_id,title,description,difficulty,estimated_hours,order_no)
SELECT id,'Linked Lists','Nodes, pointers, traversal and common patterns.','Beginner',4,2 FROM technologies WHERE slug='dsa';
INSERT IGNORE INTO roadmap_topics (technology_id,title,description,difficulty,estimated_hours,order_no)
SELECT id,'Stacks & Queues','LIFO/FIFO structures and their applications.','Beginner',3,3 FROM technologies WHERE slug='dsa';
INSERT IGNORE INTO roadmap_topics (technology_id,title,description,difficulty,estimated_hours,order_no)
SELECT id,'Trees','Binary trees, BSTs and traversal algorithms.','Intermediate',6,4 FROM technologies WHERE slug='dsa';
INSERT IGNORE INTO roadmap_topics (technology_id,title,description,difficulty,estimated_hours,order_no)
SELECT id,'Graphs','Graph representations, BFS, DFS and shortest paths.','Advanced',7,5 FROM technologies WHERE slug='dsa';

INSERT IGNORE INTO resources (topic_id,title,type,provider,url,description)
SELECT id,'StatQuest: Linear Regression','FREE_VIDEO','YouTube','https://www.youtube.com/results?search_query=StatQuest+linear+regression','Search results for a high-quality free explanation.' FROM roadmap_topics WHERE title='Linear Regression';
INSERT IGNORE INTO resources (topic_id,title,type,provider,url,description)
SELECT id,'Google Machine Learning Crash Course','FREE_ARTICLE','Google','https://developers.google.com/machine-learning/crash-course','Free official learning material.' FROM roadmap_topics WHERE title='Linear Regression';
INSERT IGNORE INTO resources (topic_id,title,type,provider,url,description)
SELECT id,'Machine Learning Specialization','PAID_COURSE','Coursera','https://www.coursera.org/specializations/machine-learning-introduction','Paid course option; check current availability and pricing.' FROM roadmap_topics WHERE title='Linear Regression';

INSERT IGNORE INTO quiz_questions (topic_id,question,option_a,option_b,option_c,option_d,correct_option)
SELECT id,'Which type of learning uses labeled examples?','Unsupervised learning','Supervised learning','Reinforcement learning','Clustering','B' FROM roadmap_topics WHERE title='Linear Regression';
INSERT IGNORE INTO quiz_questions (topic_id,question,option_a,option_b,option_c,option_d,correct_option)
SELECT id,'What does a regression model primarily predict?','A continuous value','Only categories','A database schema','A network packet','A' FROM roadmap_topics WHERE title='Linear Regression';
