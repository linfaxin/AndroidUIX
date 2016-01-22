/*
 * Copyright (C) 2010 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

///<reference path="../../../android/content/res/Resources.ts"/>
///<reference path="../../../android/R/layout.ts"/>
///<reference path="../../../android/R/attr.ts"/>
///<reference path="../../../android/widget/ListPopupWindow.ts"/>
///<reference path="../../../android/view/KeyEvent.ts"/>
///<reference path="../../../android/view/LayoutInflater.ts"/>
///<reference path="../../../android/view/Menu.ts"/>
///<reference path="../../../android/view/MenuItem.ts"/>
///<reference path="../../../android/view/View.ts"/>
///<reference path="../../../android/view/ViewGroup.ts"/>
///<reference path="../../../android/view/ViewTreeObserver.ts"/>
///<reference path="../../../android/widget/AdapterView.ts"/>
///<reference path="../../../android/widget/TextView.ts"/>
///<reference path="../../../android/widget/ImageView.ts"/>
///<reference path="../../../android/widget/BaseAdapter.ts"/>
///<reference path="../../../android/widget/FrameLayout.ts"/>
///<reference path="../../../android/widget/ListAdapter.ts"/>
///<reference path="../../../android/widget/PopupWindow.ts"/>
///<reference path="../../../java/util/ArrayList.ts"/>

module android.view.menu {
import Resources = android.content.res.Resources;
import R = android.R;
import ListPopupWindow = android.widget.ListPopupWindow;
import KeyEvent = android.view.KeyEvent;
import LayoutInflater = android.view.LayoutInflater;
import MenuItem = android.view.MenuItem;
import Menu = android.view.Menu;
import View = android.view.View;
import MeasureSpec = android.view.View.MeasureSpec;
import ViewGroup = android.view.ViewGroup;
import Context = android.content.Context;
import ViewTreeObserver = android.view.ViewTreeObserver;
import AdapterView = android.widget.AdapterView;
import TextView = android.widget.TextView;
import ImageView = android.widget.ImageView;
import BaseAdapter = android.widget.BaseAdapter;
import FrameLayout = android.widget.FrameLayout;
import ListAdapter = android.widget.ListAdapter;
import PopupWindow = android.widget.PopupWindow;
import ArrayList = java.util.ArrayList;
/**
 * Presents a menu as a small, simple popup anchored to another view.
 *
 * @hide
 */
export class MenuPopupHelper implements AdapterView.OnItemClickListener, View.OnKeyListener,
    ViewTreeObserver.OnGlobalLayoutListener, PopupWindow.OnDismissListener
        //, MenuPresenter
    {

    private static TAG:string = "MenuPopupHelper";

    static ITEM_LAYOUT:string = R.layout.popup_menu_item_layout;

    private mContext:Context;

    private mInflater:LayoutInflater;

    private mPopup:ListPopupWindow;

    private mMenu:Menu;

    private mPopupMaxWidth:number = 0;

    private mAnchorView:View;

    //private mOverflowOnly:boolean;

    private mTreeObserver:ViewTreeObserver;

    private mAdapter:MenuPopupHelper.MenuAdapter;

    //private mPresenterCallback:Callback;

    //mForceShowIcon:boolean;

    private mMeasureParent:ViewGroup;

    constructor(context:Context, menu:Menu, anchorView:View=null) {
        this.mContext = context;
        this.mInflater = LayoutInflater.from(context);
        this.mMenu = menu;
        //this.mOverflowOnly = overflowOnly;
        const res:Resources = context.getResources();
        this.mPopupMaxWidth = Math.max(res.getDisplayMetrics().widthPixels / 2, res.getDisplayMetrics().density * 320);
        this.mAnchorView = anchorView;
        //menu.addMenuPresenter(this);
    }

    setAnchorView(anchor:View):void  {
        this.mAnchorView = anchor;
    }

    //setForceShowIcon(forceShow:boolean):void  {
    //    this.mForceShowIcon = forceShow;
    //}

    show():void  {
        if (!this.tryShow()) {
            throw Error(`new IllegalStateException("MenuPopupHelper cannot be used without an anchor")`);
        }
    }

    tryShow():boolean  {
        this.mPopup = new ListPopupWindow(this.mContext, R.attr.popupMenuStyle);
        this.mPopup.setOnDismissListener(this);
        this.mPopup.setOnItemClickListener(this);
        this.mAdapter = new MenuPopupHelper.MenuAdapter(this.mMenu, this);
        this.mPopup.setAdapter(this.mAdapter);
        this.mPopup.setModal(true);
        let anchor:View = this.mAnchorView;
        if (anchor != null) {
            const addGlobalListener:boolean = this.mTreeObserver == null;
            // Refresh to latest
            this.mTreeObserver = anchor.getViewTreeObserver();
            if (addGlobalListener) {
                this.mTreeObserver.addOnGlobalLayoutListener(this);
            }
            this.mPopup.setAnchorView(anchor);
        } else {
            return false;
        }
        this.mPopup.setContentWidth(Math.min(this.measureContentWidth(this.mAdapter), this.mPopupMaxWidth));
        this.mPopup.setInputMethodMode(PopupWindow.INPUT_METHOD_NOT_NEEDED);
        this.mPopup.show();
        this.mPopup.getListView().setOnKeyListener(this);
        return true;
    }

    dismiss():void  {
        if (this.isShowing()) {
            this.mPopup.dismiss();
        }
    }

    onDismiss():void  {
        this.mPopup = null;
        //this.mMenu.close();
        if (this.mTreeObserver != null) {
            if (!this.mTreeObserver.isAlive()) {
                this.mTreeObserver = this.mAnchorView.getViewTreeObserver();
            }
            this.mTreeObserver.removeGlobalOnLayoutListener(this);
            this.mTreeObserver = null;
        }
    }

    isShowing():boolean  {
        return this.mPopup != null && this.mPopup.isShowing();
    }

    onItemClick(parent:AdapterView<any>, view:View, position:number, id:number):void  {
        let adapter:MenuPopupHelper.MenuAdapter = this.mAdapter;
        let invoked:boolean = adapter.getItem(position).invoke();
        if(invoked) this.mPopup.dismiss();
        //adapter.mAdapterMenu.performItemAction(adapter.getItem(position), 0);
    }

    onKey(v:View, keyCode:number, event:KeyEvent):boolean  {
        if (event.getAction() == KeyEvent.ACTION_UP && keyCode == KeyEvent.KEYCODE_MENU) {
            this.dismiss();
            return true;
        }
        return false;
    }

    private measureContentWidth(adapter:ListAdapter):number  {
        // Menus don't tend to be long, so this is more sane than it looks.
        let width:number = 0;
        let itemView:View = null;
        let itemType:number = 0;
        const widthMeasureSpec:number = MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED);
        const heightMeasureSpec:number = MeasureSpec.makeMeasureSpec(0, MeasureSpec.UNSPECIFIED);
        const count:number = adapter.getCount();
        for (let i:number = 0; i < count; i++) {
            const positionType:number = adapter.getItemViewType(i);
            if (positionType != itemType) {
                itemType = positionType;
                itemView = null;
            }
            if (this.mMeasureParent == null) {
                this.mMeasureParent = new FrameLayout(this.mContext);
            }
            itemView = adapter.getView(i, itemView, this.mMeasureParent);
            itemView.measure(widthMeasureSpec, heightMeasureSpec);
            width = Math.max(width, itemView.getMeasuredWidth());
        }
        return width;
    }

    onGlobalLayout():void  {
        if (this.isShowing()) {
            const anchor:View = this.mAnchorView;
            if (anchor == null || !anchor.isShown()) {
                this.dismiss();
            } else if (this.isShowing()) {
                // Recompute window size and position
                this.mPopup.show();
            }
        }
    }

    //initForMenu(context:Context, menu:Menu):void  {
    //// Don't need to do anything; we added as a presenter in the constructor.
    //}
    //
    //getMenuView(root:ViewGroup):MenuView  {
    //    throw Error(`new UnsupportedOperationException("MenuPopupHelpers manage their own views")`);
    //}
    //
    //updateMenuView(cleared:boolean):void  {
    //    if (this.mAdapter != null) {
    //        this.mAdapter.notifyDataSetChanged();
    //    }
    //}
    //
    //setCallback(cb:Callback):void  {
    //    this.mPresenterCallback = cb;
    //}
    //
    //androidui: sub menu not support yet
    //onSubMenuSelected(subMenu:SubMenuBuilder):boolean  {
    //    if (subMenu.hasVisibleItems()) {
    //        let subPopup:MenuPopupHelper = new MenuPopupHelper(this.mContext, subMenu, this.mAnchorView, false);
    //        subPopup.setCallback(this.mPresenterCallback);
    //        let preserveIconSpacing:boolean = false;
    //        const count:number = subMenu.size();
    //        for (let i:number = 0; i < count; i++) {
    //            let childItem:MenuItem = subMenu.getItem(i);
    //            if (childItem.isVisible() && childItem.getIcon() != null) {
    //                preserveIconSpacing = true;
    //                break;
    //            }
    //        }
    //        subPopup.setForceShowIcon(preserveIconSpacing);
    //        if (subPopup.tryShow()) {
    //            if (this.mPresenterCallback != null) {
    //                this.mPresenterCallback.onOpenSubMenu(subMenu);
    //            }
    //            return true;
    //        }
    //    }
    //    return false;
    //}
    //
    //onCloseMenu(menu:Menu, allMenusAreClosing:boolean):void  {
    //    // Only care about the (sub)menu we're presenting.
    //    if (menu != this.mMenu) {
    //        return;
    //    }
    //    this.dismiss();
    //    if (this.mPresenterCallback != null) {
    //        this.mPresenterCallback.onCloseMenu(menu, allMenusAreClosing);
    //    }
    //}
    //
    //flagActionItems():boolean  {
    //    return false;
    //}
    //
    //expandItemActionView(menu:Menu, item:MenuItem):boolean  {
    //    return false;
    //}
    //
    //collapseItemActionView(menu:Menu, item:MenuItem):boolean  {
    //    return false;
    //}
    //
    //getId():number  {
    //    return 0;
    //}
    //
    //onSaveInstanceState():Parcelable  {
    //    return null;
    //}
    //
    //onRestoreInstanceState(state:Parcelable):void  {
    //}


}

export module MenuPopupHelper{
export class MenuAdapter extends BaseAdapter {
    _MenuPopupHelper_this:MenuPopupHelper;

    private mAdapterMenu:Menu;

    //private mExpandedIndex:number = -1;

    constructor(menu:Menu, arg:MenuPopupHelper){
        super();
        this._MenuPopupHelper_this = arg;
        this.mAdapterMenu = menu;
        //this.findExpandedIndex();
    }

    getCount():number  {
        let items:ArrayList<MenuItem> =
            //this._MenuPopupHelper_this.mOverflowOnly ? this.mAdapterMenu.getNonActionItems() :
                this.mAdapterMenu.getVisibleItems();
        //if (this.mExpandedIndex < 0) {
            return items.size();
        //}
        //return items.size() - 1;
    }

    getItem(position:number):MenuItem  {
        let items:ArrayList<MenuItem> =
            //this._MenuPopupHelper_this.mOverflowOnly ? this.mAdapterMenu.getNonActionItems() :
                this.mAdapterMenu.getVisibleItems();
        //if (this.mExpandedIndex >= 0 && position >= this.mExpandedIndex) {
        //    position++;
        //}
        return items.get(position);
    }

    getItemId(position:number):number  {
        // ID for the item in the AdapterView
        return position;
    }

    getView(position:number, convertView:View, parent:ViewGroup):View  {
        if (convertView == null) {
            convertView = this._MenuPopupHelper_this.mInflater.inflate(MenuPopupHelper.ITEM_LAYOUT, parent, false);
        }
        let itemData = this.getItem(position);
        convertView.setVisibility(itemData.isVisible() ? View.VISIBLE : View.GONE);

        //setTitle
        let titleView = <TextView>convertView.findViewById('title');
        titleView.setText(itemData.getTitle());

        //set short cut (summary)
        //no short cut api yet

        //set icon
        let iconView = <ImageView>convertView.findViewById('icon');
        let icon = itemData.getIcon();
        iconView.setImageDrawable(icon);
        if (icon != null) {
            iconView.setImageDrawable(icon);
            iconView.setVisibility(View.VISIBLE);
        } else {
            iconView.setVisibility(View.GONE);
        }

        //set enable
        convertView.setEnabled(itemData.isEnabled());

        //let itemView:MenuView.ItemView = <MenuView.ItemView> convertView;
        //if (this._MenuPopupHelper_this.mForceShowIcon) {
        //    (<ListMenuItemView> convertView).setForceShowIcon(true);
        //}
        //itemView.initialize(this.getItem(position), 0);
        return convertView;
    }

    //findExpandedIndex():void  {
    //    const expandedItem:MenuItem = this._MenuPopupHelper_this.mMenu.getExpandedItem();
    //    if (expandedItem != null) {
    //        const items:ArrayList<MenuItem> = this._MenuPopupHelper_this.mMenu.getNonActionItems();
    //        const count:number = items.size();
    //        for (let i:number = 0; i < count; i++) {
    //            const item:MenuItem = items.get(i);
    //            if (item == expandedItem) {
    //                this.mExpandedIndex = i;
    //                return;
    //            }
    //        }
    //    }
    //    this.mExpandedIndex = -1;
    //}

    notifyDataSetChanged():void  {
        //this.findExpandedIndex();
        super.notifyDataSetChanged();
    }
}
}

}