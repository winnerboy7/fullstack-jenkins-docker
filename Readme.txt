References:
https://www.melivecode.com/th/article/fullstack-jenkins-docker

Repository:
https://github.com/winnerboy7/fullstack-jenkins-docker.git

# GitHub Actions CI/CD for Next.js Application
git init
git add .
git commit -m "Initial commit"
git branch -M master
git remote add origin https://github.com/winnerboy7/fullstack-jenkins-docker.git
git pull origin master --allow-unrelated-histories
git push -u origin master

git checkout -b feature
git add .
git commit -m "Add Feature"

git checkout master
git merge feature
git add .
git commit -m "Add GitHub Actions CI/CD"
git push -u origin master
