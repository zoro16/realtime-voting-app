git stash
git pull
git stash apply
cd client && rm -rf build && npm run build
cd ..
pm2 restart server
