/**
 * Created by linfaxin on 16/2/14.
 */

///<reference path="../androidui-sdk/android-ui.d.ts"/>
///<reference path="../gen/R.ts"/>

module com.linfaxin.gankwebapp {
    import Activity = android.app.Activity;
    import ActionBarActivity = android.app.ActionBarActivity;
    import ProgressBar = android.widget.ProgressBar;
    import FrameLayout = android.widget.FrameLayout;
    import Toast = android.widget.Toast;
    import TextView = android.widget.TextView;
    import ExpandableListView = android.widget.ExpandableListView;
    import BaseExpandableListAdapter = android.widget.BaseExpandableListAdapter;
    import ImageView = android.widget.ImageView;
    import View = android.view.View;
    import Intent = android.content.Intent;
    
    export class DayDetailActivity extends ActionBarActivity{
        static Extra_Date = 'date';

        date:string;
        protected onCreate(savedInstanceState?:android.os.Bundle):void {
            super.onCreate(savedInstanceState);
            const activity = this;

            this.date = this.getIntent().getStringExtra(DayDetailActivity.Extra_Date);
            if(!this.date){
                this.finish();
                return;
            }
            this.setTitle(this.date);
            this.date = this.date.replace('-', '/').replace('-', '/');

            let pd = new ProgressBar(this);
            this.setContentView(pd, new FrameLayout.LayoutParams(-2, -2, android.view.Gravity.CENTER));
            
            setTimeout(()=>{
                //延时请求，确保Activity切换动画结束
                fetch('http://faxnode.duapp.com/gank_api/day/'+this.date)
                .then((response)=>{
                    return response.json();
                }).then((json)=>{
                    this.initPage(json.results);
                }).catch((e)=>{
                    console.error(e);
                    Toast.makeText(activity, '载入失败', Toast.LENGTH_SHORT).show();
                })
            }, 350);

        }
        
        private initPage(mapData){
            let activity = this;
            let fuliArray = mapData['福利'];
            delete mapData['福利'];
            
            let adapter = new DetailAdapter(mapData);
            let list = new ExpandableListView(this);
            
            if(fuliArray){
                let fuli:ItemModel = fuliArray[0];
                let imageView = new ImageView(this);
                imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
                imageView.setLayoutParams(new android.widget.AbsListView.LayoutParams(-1, this.getResources().getDisplayMetrics().widthPixels * 0.8));
                imageView.setImageURI(fuli.url);
                imageView.setOnClickListener({
                    onClick(view:android.view.View){
                        activity.startActivity(new android.content.Intent('com.linfaxin.gankwebapp.PhotoActivity')
                            .putExtra('url', fuli.url));
                    }
                });
                list.addHeaderView(imageView);
                let onScrollChanged = list.onScrollChanged;
                list.onScrollChanged = (l:number, t:number, oldl:number, oldt:number) => {
                    if (t < 0) {
                        imageView.setPivotX(imageView.getWidth() / 2);
                        imageView.setPivotY(imageView.getHeight());
                        let scale = 1 - (t - 1) / imageView.getHeight();
                        imageView.setScaleX(scale);
                        imageView.setScaleY(scale);
                    }
                    onScrollChanged.call(list, l, t, oldl, oldt);
                }
            }
            
            list.setExpandableAdapter(adapter);
            
            for(let i = 0, count = adapter.getGroupCount(); i<count; i++){
                list.expandGroup(i);
            }
            this.setContentView(list);
        }

    }
    
    class DetailAdapter extends BaseExpandableListAdapter {
        data = new Map<string, Array<ItemModel>>();
        constructor(mapData) {
            super();
            for(let key in mapData){
                this.data.set(key, mapData[key]);
            }
        }

        getGroupCount(): number{
            return this.data.size;
        }
        getChildrenCount(groupPosition: number): number{
            return Array.from(this.data.values())[groupPosition].length;
        }
        getGroup(groupPosition: number): string{
            return Array.from(this.data.keys())[groupPosition];
        }
        getChild(groupPosition: number, childPosition: number): ItemModel{
            return Array.from(this.data.values())[groupPosition][childPosition];
        }
        getGroupId(groupPosition: number): number{
            return -1;
        }
        getChildId(groupPosition: number, childPosition: number): number{
            return -1;
        }
        hasStableIds(): boolean{
            return false;
        }
        isChildSelectable(groupPosition: number, childPosition: number): boolean{
            return false;
        }
        
        getGroupView(groupPosition: number, isExpanded: boolean, convertView: android.view.View, parent: android.view.ViewGroup): android.view.View{
            let groupTitle = this.getGroup(groupPosition);
            if(!isExpanded) groupTitle = '+ ' + groupTitle;
            let density = parent.getResources().getDisplayMetrics().density;
            let textView = <TextView>convertView || new TextView(parent.getContext());
            textView.setTextSize(18);
            textView.setText(groupTitle);
            textView.setPadding(16 * density, 16 * density, 16 * density, 16 * density);
            return textView;
        }
        
        getChildView(groupPosition: number, childPosition: number, isLastChild: boolean, 
                convertView: android.view.View, parent: android.view.ViewGroup): android.view.View{
            let item = this.getChild(groupPosition, childPosition);
            convertView = convertView || android.view.View.inflate(parent.getContext(), R.layout.day_detail_list_item);
            (<TextView>convertView.findViewById(R.id.title)).setText(item.desc);
            (<TextView>convertView.findViewById(R.id.summary)).setText(item.who);
            convertView.setOnClickListener({
                onClick(v:View){
                    (<Activity>v.getContext()).startActivity(
                        new Intent("com.linfaxin.gankwebapp.WebViewActivity")
                            .putExtra(WebViewActivity.Extra_Title, item.desc)
                            .putExtra(WebViewActivity.Extra_Url, item.url)
                    );
                }
            });
            return convertView;
        }

    }
}