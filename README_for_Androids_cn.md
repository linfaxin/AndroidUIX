# 转战WebApp: 最适合Android开发者的WebApp框架


### 为什么需要转战WebApp开发

随着移动端设备越来越多, 微信应用号即将发布, 越来越多的页面需要被移动浏览器承载, HTML5开发大热, 我们需要掌握Web开发的技能来适应时代变化.

### 合适的WebApp框架

[AndroidUI-WebApp](https://github.com/linfaxin/AndroidUI-WebApp)是一个高性能的WebApp框架, 在移动浏览器上有与原生App一致的体验.
对Android开发者们来说, 更重要的是:
框架移植自Android, 开发方式和API调用与Android开发保持一致, Android们可以低成本快速上手开发.

<!--more-->

### 框架优点

1. 流畅度. 框架使用Web Canvas渲染页面, 能有接近60fps的流畅度.
2. 原生级别体验. 页面过渡动画, 滚动回弹, 点击响应等等细节都是原生级别的体验.
3. 稳定. 所有UI组件都是移植自Android, 组件内部逻辑与原生Android的一致, 稳定度也一致.
4. 易用. 对Android开发者可以超低成本上手开发.
5. 开发者社区. 所有API文档用法和问题等都可以从Android社区找到.


### Sample App

在线Sample地址: http://linfaxin.com/AndroidUI-WebApp/sample/main.html
预览:
![预览](http://linfaxin.com/image/androidui/sample_app_preview.png)


### 高性能的原因:Canvas

Android中的视图是通过Android的Canvas对象渲染的, AndroidUI-WebApp框架接管Android的视图层, 所有渲染最终由Web Canvas实现.
主流的Web开发是DOM开发, 而DOM节点的性能是公认的慢的, 其他框架不能胜任一个复杂的WebApp开发.
[参考](http://www.csdn.net/article/2015-03-03/2824083-Canvas-UI)


### 与Android开发相似

整个WebApp的开发流程与AndroidApp基本一致

XML语法布局:
```html
<FrameLayout>
    <TextView
            android:text="Hello world"
            android:gravity="center"
    />
</FrameLayout>
```

TypeScript代码:
```TypeScript
module my.app {
    import Activity = android.app.Activity;

    export class MainActivity extends Activity{
    
        protected onCreate(savedInstanceState?:android.os.Bundle):void {
            super.onCreate(savedInstanceState);
            this.setContentView(R.layout.activity_main);
        }
    }
}
```



# 开始开发

Note: 代码使用TypeScript书写, 风格和语法与Java相似, 就算没有接触过TypeScript, 可以很快上手: http://www.typescriptlang.org/Handbook


### 准备环境

1. 下载IDE: 支持Typescript的IDE或者编辑器. (推荐使用[WebStorm11](https://www.jetbrains.com/webstorm/))
2. 安装Node.js: https://nodejs.org/ 
3. 安装[命令行工具](https://github.com/linfaxin/AndroidUI-CLI) : npm install -g androidui-cli
4. 新建项目目录并执行：androidui create

Note: 如果使用WebStorm11, 打开工程后, 需要在设置中开启TypeScript编译以获得更好代码提示和错误检查: 
Preferences -> Languages & Frameworks -> TypeScript: 1.Enable TypeScript Compiler. 2.use tsconfig.json


### 默认工程一览

![目录文件一览](http://linfaxin.com/image/androidui/hello_world_project_dir_preview.png)

目录/文件说明:

1. index.html
App入口页面, 可以修改'title'标签为你的App名字, 'android-ui'标签里定义activity为App的入口Activity

2. androidui-sdk
AndroidUI框架存放的目录, 如果框架版本有更新, 需要升级替换其中的文件.

3. build
存放最终构建生成的js文件.

4. res & gen
res文件夹放图片,布局等资源, 在构建时会生成R文件在gen目录, 在代码引用R文件调用资源

5. src
代码的存放目录



### 查看WebApp

需要先起一个本地服务器, 然后打开index.html文件的地址 (如果使用WebStorm, 可以直接对index.html文件右键->Open In Browser 就可以查看)
打开页面后, 需要打开浏览器的开发者模式和手机模拟器, 具体参考[这里](http://www.cocoachina.com/webapp/20141231/10815.html)


### 布局代码

与Android工程一致, 布局文件存放在res/layout文件夹, 支持xml文件或者html片段.
布局代码内容与Android工程一致, 如默认模版工程中的activity_main.xml文件:
```html
<FrameLayout>
    <TextView
            android:text="Hello world"
            android:gravity="center"
    ></TextView>
</FrameLayout>
```

如果新增了布局文件, 需要先手动build, 才可以在代码中以 R.layout.xxx 方式引用到这个布局:
```bash
npm run build
```


### TypeScript代码

代码存放在src目录, 使用TypeScript书写, 代码风格和语法和Java较为接近, 可以很快上手并书写代码.
框架的API和Android的一致, 上手TypeScript后, 就可以立马开始使用框架了.

需要注意的一些事项是:

1. Java中可以省略this调用方法和属性, 但TypeScript中必须带上. 如: this.setContentView(...)
2. 一个类不能有多个同名的方法
3. 其他常见的Java开发开始写JavaScript会遇到的问题.

修改代码后必须手动build:
```bash
npm run build
```

### 开发效率

WebStorm + TypeScript 使得代码提示和错误检查十分友好, 代码书写的效率接近目前Android开发.
布局开发有提示补全和错误属性检查，但没有布局预览, 也可以先在AndroidStudio里写好复制过来。
在Chrome开发台的调试和断点能力比原生开发体验更优, 界面和代码的调试都比原生Android开发更友好.
界面调试:
![界面调试](http://linfaxin.com/image/androidui/debug_layout.png)
实时查看View属性:
![节点调试](http://linfaxin.com/image/androidui/debug_node.png)
代码调试:
![代码调试](http://linfaxin.com/image/androidui/debug_source.png)


### 移动端的性能

IOS端稳定在50fps+, 全程原生级别的流畅度.
Android端Chrome浏览器根据机子性能在40-50fps左右, 接近原生级别的流畅度.
打包成App(嵌入Runtime):50fps+
Android4.x原生系统默认浏览器:30fps左右.不过国内主流机型都是定制过的系统(小米系统等), 默认浏览器内核已是较新版本, 能有40-50fps.


### 打包成App发布

目前可以使用[Cordova(PhoneGap)](http://cordova.apache.org/)打包方案


### 进入调试

在'android-ui'标签加上debug属性, 所有Android视图节点都会以DOM节点的形式输出到'android-ui'标签里, 可以看到每个节点的大小位置.
Chrome开发台里选中对应节点后, 可以在节点的Properties里看到DOM节点的字段值, 所有Android节点的信息都在AndroidView字段里.


### 支持

加入QQ群：275850460，我将为你提供技术支持 :)


### 特别感谢

[汤涛](https://github.com/AndroidTrending) 为框架的推广做的贡献！
