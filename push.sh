set -e


git add .
git commit -m "$1"

git pull origin master
git add .
git commit -m "merge"

git push origin master
