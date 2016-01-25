#init node_modules, include typescript & babel
if [ ! -d node_modules ]; then
  npm install
fi


cd src
./build.sh
cd ..


cd sample
./build.sh
cd ..

