///<reference path="../../../dist/android-ui.d.ts"/>
module sample.app.R {
    android.content.res.Resources.buildResourcesElement.innerHTML = `
<!-- color.html -->
<android-color id="white">white</android-color>
<android-color id="light_gray">#999</android-color>
<android-color id="red">#fb3b00</android-color>
<android-color id="red_press">#8A2000</android-color>
<android-color id="green">#5fcf53</android-color>
<android-color id="green_press">#45963C</android-color>


<!-- styles.html -->
<android-style id="page_text"
               android:padding="12dp"
               android:layout_width="wrap_content"
               android:layout_height="wrap_content"
               android:background="#55000000"
               android:textColor="white"
               android:layout_gravity="center"></android-style>

<android-style id="btn_custom1"
               android:padding="8dp"
               android:layout_margin="6dp"
               android:textColor="@color/white"
               android:cornerRadius="4dp"
               android:background="#f00"
               android:state_pressed="@style/btn_custom1/pressed"
               android:state_disable="@style/btn_custom1/disable">
    <android-style id="pressed"
                   android:background="#f66">
    </android-style>
    <android-style id="disable"
                   android:textColor="@color/light_gray"
                   android:background="#faa">
    </android-style>
</android-style>
<android-style id="line_spit"
               android:layout_height="4dp"
               android:layout_width="match_parent"
        ></android-style>
<android-style id="textStyle"
               android:textSize="12sp"
               android:padding="8dp"
               android:textColor="#333"
               android:background="#eee"
               android:layout_width="wrap_content"
               android:layout_height="wrap_content"
        ></android-style>

<android-style id="imageStyle"
               android:background="#eee"
               android:layout_width="wrap_content"
               android:layout_height="wrap_content"
               android:layout_marginBottom="12dp"
        ></android-style>

`;
}