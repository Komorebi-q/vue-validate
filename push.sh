set -e

git add .
git commit -m "add some test func"

git pull origin master
git add .
git commit -m "merge"

#git push origin master
