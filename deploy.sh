grunt build
cd dist
git add --all
git commit -m 'publish'
git push
cap production deploy
cd ..