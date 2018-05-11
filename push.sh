set -e

git pull 
git add .
git commit -m "merge"

git add .
git commit -m "$1"

git push 
