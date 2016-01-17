# AndroidUI Sample

This is a sample App for AndroidUI. 

If you want create a new AndroidUI project, this files you should copy to:

1. build.sh : build the project, you should change the 'packageName' defined in the file. Open the file see detail.
2. build_res.js : pack resource into js, execute by nodejs, call by build.sh.
3. tsconfig.json : typescript's convert config.


You may need create this directory:

1. res : put your resource in this directory, like image, layout, values, they will pack into js when build.
2. src : it's suggest you put all your typescript code in this directory.
3. assets : it's suggest you put all your 'not pack in' resources in this directory. Like image, js lib, and so on...


These directories will auto create when build.

1. gen : resources will build to here first.
2. build : code & resources build result.


It's enough, if your code or resource change, just execute build.sh to build your project.

If you want put image in 'res', read [this](https://github.com/linfaxin/AndroidUI4Web/tree/master/sample/res/image) for more information.

