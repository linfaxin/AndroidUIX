
///<reference path="../../dist/android-ui.d.ts"/>
///<reference path="../gen/R.ts"/>

module sample.app {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import TextView = android.widget.TextView;
    import Button = android.widget.Button;
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import LinearLayout = android.widget.LinearLayout;
    import Gravity = android.view.Gravity;
    import Log = android.util.Log;
    import Color = android.graphics.Color;
    import BaseAdapter = android.widget.BaseAdapter;
    import ListView = android.widget.ListView;
    import ExpandableListView = android.widget.ExpandableListView;
    import BaseExpandableListAdapter = android.widget.BaseExpandableListAdapter;



    export class SampleExpandableListViewActivity extends ActionBarActivity {
        onCreate():void {
            super.onCreate();
            this.setTitle('ExpandableListView')
            let listView = new ExpandableListView(this);
            this.setContentView(listView);

            listView.setExpandableAdapter(new MyListAdapter());
            listView.expandGroup(0);
        }
    }

    class MyListAdapter extends BaseExpandableListAdapter{
        data = [
            {'name':'A', 'items':['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']},
            {'name':'B', 'items':['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10']},
            {'name':'C', 'items':['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10']},
            {'name':'D', 'items':['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10']},
            {'name':'E', 'items':['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10']},
            {'name':'F', 'items':['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10']},
            {'name':'G', 'items':['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10']},
            {'name':'H', 'items':['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10']},
            {'name':'I', 'items':['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9', 'I10']},
            {'name':'J', 'items':['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10']},
            {'name':'K', 'items':['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10']},
        ]

        getGroupCount():number {
            return this.data.length;
        }

        getChildrenCount(groupPosition:number):number {
            return this.data[groupPosition].items.length;
        }

        getGroup(groupPosition:number):string {
            return this.data[groupPosition].name;
        }

        getChild(groupPosition:number, childPosition:number):string {
            return this.data[groupPosition].items[childPosition];
        }

        getGroupView(groupPosition:number, isExpanded:boolean, convertView:android.view.View,
                     parent:android.view.ViewGroup):android.view.View {
            let tv:TextView = <TextView>convertView;
            if(tv==null){
                tv = new TextView();
                const density = android.content.res.Resources.getDisplayMetrics().density;
                tv.setTextSize(18);
                tv.setPadding(12 * density, 6 * density, 6 * density, 6 * density);
                tv.setBackgroundColor(0x88888888);
            }
            tv.setText(this.getGroup(groupPosition));
            return tv;
        }

        getChildView(groupPosition:number, childPosition:number, isLastChild:boolean, convertView:android.view.View,
                     parent:android.view.ViewGroup):android.view.View {
            if(convertView==null){
                convertView = View.inflate(parent.getContext(), R.layout.sample_expand_listview_item, null);
            }
            (<TextView>convertView.findViewById('item_child_text')).setText(this.getChild(groupPosition, childPosition));
            return convertView;
        }

        getGroupId(groupPosition:number):number {
            return 0;
        }

        getChildId(groupPosition:number, childPosition:number):number {
            return 0;
        }

        hasStableIds():boolean {
            return false;
        }

        isChildSelectable(groupPosition:number, childPosition:number):boolean {
            return false;
        }
    }
}