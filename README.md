# AndroidUI For Web

移植Android的UI组件到Web端, 以Android的方式布局和处理界面.
[点击查看Sample](http://linfaxin.com/AndroidUI4Web/sample/main.html)


### 特点

1. 完整Native端组件体验
2. 高性能: 使用 Web Canvas 绘制UI.
3. 可靠: UI组件由Android源码转换而来, 同Android官方组件一样的可靠.
4. 拓展: 所有流行的Github第三方Android UI库可以轻易移植到Web端.
5. 易用: 标签式声明组件, 与Html标签完美融合.



### 例子

```html
<android-Activity style="width: 100%; height:100%;display: none;">
    <ScrollView>
        <LinearLayout
                android:orientation="vertical"
                android:padding="12dp"
                android:gravity="center">
            <TextView >文本</TextView>
            <Button onclick="location.href='#'">按钮</Button>
        </LinearLayout>
    </ScrollView>
</android-Activity>
```
[点击查看Sample](http://linfaxin.com/AndroidUI4Web/sample/main.html)


### 最后

还有很多非核心的UI组件需要移植, 期待Star & PR