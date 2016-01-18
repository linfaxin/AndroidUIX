# AndroidUI Sample

This is a sample App for AndroidUI. 

If you want to create a new AndroidUI project, these files you should copy to:

1. build.sh : to build the project, you should change the 'packageName' defined in the file. Open the file to see detail.
2. build_res.js : pack resource into js, execute by nodejs, call by build.sh.
3. tsconfig.json : typescript's convert config.


You may need to create these directories:

1. res : put your resource in this directory, like image, layout, values, they will be packed into .js when build.
2. src : suggest you to put all your typescript code in this directory.
3. assets : suggest you to put all your 'not pack in' resources in this directory. Like image, js lib, etc.


These directories will be auto created when build.

1. gen : resources will build here first.
2. build : code & resources build result.


It's enough, if your code or resource change, just execute build.sh to rebuild your project.

If you want to put image in 'res', read [this](https://github.com/linfaxin/AndroidUI4Web/tree/master/sample/res/image) for more information.

