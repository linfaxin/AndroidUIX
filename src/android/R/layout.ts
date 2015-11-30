
module android.R{

    const div = document.createElement('div');
    function stringToElement(html:string):Element {
        div.innerHTML = html;
        return div.firstElementChild;
    }

    export class layout{

        static get number_picker():HTMLElement {
            return <HTMLElement>stringToElement(`
                    <merge>
                        <ImageButton android:id="@+id/increment"
                            android:layout_width="fill_parent"
                            android:layout_height="wrap_content"
                            android:background="transparent"
                            android:state_pressed="#ddd"
                            android:paddingTop="22dip"
                            android:paddingBottom="22dip"
                            android:contentDescription="@string/number_picker_increment_button" ></ImageButton>

                        <View
                            android:id="@+id/numberpicker_input"
                            android:layout_width="fill_parent"
                            android:layout_height="wrap_content"></View>

                        <ImageButton android:id="@+id/decrement"
                            android:layout_width="fill_parent"
                            android:layout_height="wrap_content"
                            android:background="transparent"
                            android:state_pressed="#ddd"
                            android:paddingTop="22dip"
                            android:paddingBottom="22dip"
                            android:contentDescription="@string/number_picker_decrement_button" ></ImageButton>
                    </merge>`)
                .cloneNode(true);
        }


    }
}