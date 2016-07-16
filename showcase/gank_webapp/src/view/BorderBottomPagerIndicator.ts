/**
 * Created by linfaxin on 16/2/15.
 */

///<reference path="../../androidui-sdk/android-ui.d.ts"/>
///<reference path="../../gen/R.ts"/>

module com.linfaxin.gankwebapp.view {
    import Activity = android.app.Activity;
    import TextView = android.widget.TextView;
    import Button = android.widget.Button;
    import View = android.view.View;
    import ViewGroup = android.view.ViewGroup;
    import LinearLayout = android.widget.LinearLayout;
    import Gravity = android.view.Gravity;
    import Log = android.util.Log;
    import Color = android.graphics.Color;
    import Paint = android.graphics.Paint;
    import Canvas = android.graphics.Canvas;
    import BaseAdapter = android.widget.BaseAdapter;
    import ViewPager = android.support.v4.view.ViewPager;
    import ListView = android.widget.ListView;
    import PullRefreshLoadLayout = androidui.widget.PullRefreshLoadLayout;
    import Toast = android.widget.Toast;
    import ImageView = android.widget.ImageView;
    import Context = android.content.Context;
    import RadioGroup = android.widget.RadioGroup;
    import CompoundButton = android.widget.CompoundButton;
    import RadioButton = android.widget.RadioButton;
    import OnCheckedChangeListener = android.widget.RadioGroup.OnCheckedChangeListener;

    export class BorderBottomPagerIndicator extends RadioGroup implements ViewPager.OnPageChangeListener{
        onCheckedChangedListener:OnCheckedChangeListener;
        viewPager:ViewPager;
        mPosition=0;
        mPositionOffset=0;
        bottomLinePaint = new Paint();
        
        
        mBottomIndicatorLeft=0;
        mBottomIndicatorRight=0;
        
        colorNormal = 0xff999999;
        colorChecked = 0xff000000;
        colorBottomLine = 0xff666666;
        
        tempRect = new android.graphics.Rect();
    
        constructor(context?:android.content.Context, bindElement?:HTMLElement, defStyle?:any) {
            super(context, bindElement, defStyle);

            this.setOrientation(LinearLayout.HORIZONTAL);
            this.setGravity(Gravity.CENTER);
            this.setMinimumHeight(40 * this.getResources().getDisplayMetrics().density);
            this.bottomLinePaint.setColor(this.colorBottomLine);
            this.setWillNotDraw(false);
            
            super.setOnCheckedChangeListener({
                onCheckedChanged(group:BorderBottomPagerIndicator, checkedId:string) {
                    group.invalidate();
                    let cb = <CompoundButton>group.findViewById(checkedId);
                    if(cb != null){
                        if(group.viewPager!=null){
                            group.viewPager.setCurrentItem(group.indexOfChild(cb));
                        }
                    }
                    cb.getDrawingRect(group.tempRect);
                    group.tempRect.left -= group.tempRect.width()/2;
                    group.tempRect.right += group.tempRect.width()/2;
                    cb.requestRectangleOnScreen(group.tempRect);

                    if(group.onCheckedChangedListener!=null){
                        group.onCheckedChangedListener.onCheckedChanged(group, checkedId);
                    }
                }
            });
        }
        
        addRadioBtns(...btns:string[]){
            for(let s of btns){
                if(s==null) continue;
                this.addRadioBtn(s);
            }
        }
        
        addRadioBtn(text:string, id=View.NO_ID){
            let radioButton = new RadioButton(this.getContext());
            if (id == View.NO_ID) {
                id = text + radioButton.hashCode();
            }
            radioButton.setId(id);
            radioButton.setText(text);
            radioButton.setTextSize(15);
            radioButton.setButtonDrawable(new android.graphics.drawable.ColorDrawable(Color.TRANSPARENT));

            let pad = this.getResources().getDisplayMetrics().density * 8;
            radioButton.setPadding(pad, pad, pad, pad);
            radioButton.setMinWidth(0);
            radioButton.setGravity(Gravity.CENTER);
            radioButton.setBackgroundDrawable(android.R.drawable.item_background);
            
            let textColor = new android.content.res.ColorStateList(
                [[View.VIEW_STATE_CHECKED], []],
                [this.colorChecked, this.colorNormal]
            );
            radioButton.setTextColor(textColor);

    //      this.addView(new View(this.getContext()), new RadioGroup.LayoutParams(0, 10, 0f));
            this.addView(radioButton, new RadioGroup.LayoutParams(0, -1, 1));
        }
        
        setOnCheckedChangeListener(listener:OnCheckedChangeListener) {
            this.onCheckedChangedListener = listener;
        }
        
        checkFirstChild(){
            for(let i =0,size = this.getChildCount();i<size;i++){
                if(this.getChildAt(i) instanceof CompoundButton){
                    (<CompoundButton>this.getChildAt(i)).setChecked(true);
                    return;
                }
            }
        }
        
        getBottomIndicatorRight() {
            return this.mBottomIndicatorRight;
        }
        getBottomIndicatorLeft() {
            return this.mBottomIndicatorLeft;
        }
        getBottomIndicatorWidth(){
            return this.mBottomIndicatorRight - this.mBottomIndicatorLeft;
        }
    
        protected onDraw(canvas:Canvas) {
            let itemWidth = this.getWidth() / this.getChildCount();
            let leftOffset = 0;
            let linePadding = this.getResources().getDisplayMetrics().density * 6;
            try {
                let cb = this.getCurrentCB();
                let positionOffsetFix = this.mPosition - this.indexOfChild(cb) + this.mPositionOffset
                leftOffset = cb.getLeft() + cb.getWidth() * positionOffsetFix;
                itemWidth = cb.getWidth();
                linePadding = ((itemWidth - cb.getPaint().measureText(cb.getText().toString())) / 2 - linePadding);
                
            } catch (e) { 
            }
            this.mBottomIndicatorLeft = leftOffset + linePadding;
            this.mBottomIndicatorRight = leftOffset + itemWidth - linePadding;
            canvas.drawRect(this.mBottomIndicatorLeft, this.getHeight() - this.getResources().getDisplayMetrics().density * 4,
                this.mBottomIndicatorRight, this.getHeight(), this.bottomLinePaint);
        }
        
        private getCBChild(index:number):CompoundButton{
            try {
                return (<CompoundButton>this.getChildAt(index));
            } catch (e) {
                console.warn(e);
            }
            return null;
        }
        
        private getCurrentCB():CompoundButton{
            try {
                return <CompoundButton> this.findViewById(this.getCheckedRadioButtonId());
            } catch (e) {
                console.warn(e);
            }
            return null;
        }
        
        bindViewPager(viewPager:ViewPager){
            this.viewPager = viewPager;
            viewPager.addOnPageChangeListener(this);
            
            let adapter = viewPager.getAdapter();
            if(adapter){
                for(let i=0,count=adapter.getCount(); i<count; i++){
                    let title = adapter.getPageTitle(i);
                    if(title) this.addRadioBtn(title);
                }
            }
        }
        
        onPageSelected(position:number) {
            this.invalidate();
            try {
                this.getCBChild(position).setChecked(true);
            } catch (e) {
                console.warn(e);
            }
        }
        onPageScrolled(position:number, positionOffset:number, positionOffsetPixels:number) {
            this.mPosition = position;
            this.mPositionOffset = positionOffset;
            this.invalidate();
        }
        onPageScrollStateChanged(state:number) {
            if(state==ViewPager.SCROLL_STATE_IDLE){
                this.mPositionOffset = 0;
                this.mPosition = this.viewPager.getCurrentItem();
                this.invalidate();
            }
        }

    }

}