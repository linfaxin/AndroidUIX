/*
 * Copyright (C) 2008 The Android Open Source Project
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

///<reference path="../../android/app/Activity.ts"/>
///<reference path="../../android/content/Intent.ts"/>
///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/view/Menu.ts"/>
///<reference path="../../android/view/View.ts"/>

module android.view {
import Activity = android.app.Activity;
import Intent = android.content.Intent;
import Drawable = android.graphics.drawable.Drawable;
import Menu = android.view.Menu;
import View = android.view.View;
/**
 * Interface for direct access to a previously created menu item.
 * <p>
 * An Item is returned by calling one of the {@link android.view.Menu#add}
 * methods.
 * <p>
 * For a feature set of specific menu types, see {@link Menu}.
 *
 * <div class="special reference">
 * <h3>Developer Guides</h3>
 * <p>For information about creating menus, read the
 * <a href="{@docRoot}guide/topics/ui/menus.html">Menus</a> developer guide.</p>
 * </div>
 */
export class MenuItem {

    private mId:number = 0;

    private mGroup:number = 0;

    private mCategoryOrder:number = 0;

    private mOrdering:number = 0;

    private mTitle:string;

    private mIntent:Intent;

    private mIconDrawable:Drawable;

    private mVisible = true;

    private mEnable = true;

    private mClickListener:MenuItem.OnMenuItemClickListener;

    private mActionView:View;

    private mMenu:Menu;


    /**
     * Instantiates this menu item.
     *
     * @param group         Item ordering grouping control. The item will be added after all other
     *                      items whose order is <= this number, and before any that are larger than
     *                      it. This can also be used to define groups of items for batch state
     *                      changes. Normally use 0.
     * @param id            Unique item ID. Use 0 if you do not need a unique ID.
     * @param categoryOrder The ordering for this item.
     * @param title         The text to display for the item.
     */
    constructor(menu:Menu, group:number, id:number, categoryOrder:number, ordering:number, title:string) {
        this.mMenu = menu;
        this.mId = id;
        this.mGroup = group;
        this.mCategoryOrder = categoryOrder;
        this.mOrdering = ordering;
        this.mTitle = title;
    }

    /**
     * Return the identifier for this menu item.  The identifier can not
     * be changed after the menu is created.
     *
     * @return The menu item's identifier.
     */
    getItemId():number {
        return this.mId;
    }

    /**
     * Return the group identifier that this menu item is part of. The group
     * identifier can not be changed after the menu is created.
     * 
     * @return The menu item's group identifier.
     */
    getGroupId():number {
        return this.mGroup;
    }

    /**
     * Return the category and order within the category of this item. This
     * item will be shown before all items (within its category) that have
     * order greater than this value.
     * <p>
     * An order integer contains the item's category (the upper bits of the
     * integer; set by or/add the category with the order within the
     * category) and the ordering of the item within that category (the
     * lower bits). Example categories are {@link Menu#CATEGORY_SYSTEM},
     * {@link Menu#CATEGORY_SECONDARY}, {@link Menu#CATEGORY_ALTERNATIVE},
     * {@link Menu#CATEGORY_CONTAINER}. See {@link Menu} for a full list.
     * 
     * @return The order of this item.
     */
    getOrder():number {
        return this.mOrdering;
    }

    /**
     * Change the title associated with this item.
     *
     * @param title The new text to be displayed.
     * @return This Item so additional setters can be called.
     */
    setTitle(title:string):MenuItem {
        this.mTitle = title;
        return this;
    }

    ///**
    // * Change the title associated with this item.
    // * <p>
    // * Some menu types do not sufficient space to show the full title, and
    // * instead a condensed title is preferred. See {@link Menu} for more
    // * information.
    // *
    // * @param title The resource id of the new text to be displayed.
    // * @return This Item so additional setters can be called.
    // * @see #setTitleCondensed(CharSequence)
    // */
    //setTitle(title:number):MenuItem ;

    /**
     * Retrieve the current title of the item.
     *
     * @return The title.
     */
    getTitle():string {
        return this.mTitle;
    }

    ///**
    // * Change the condensed title associated with this item. The condensed
    // * title is used in situations where the normal title may be too long to
    // * be displayed.
    // *
    // * @param title The new text to be displayed as the condensed title.
    // * @return This Item so additional setters can be called.
    // */
    //setTitleCondensed(title:string):MenuItem ;
    //
    ///**
    // * Retrieve the current condensed title of the item. If a condensed
    // * title was never set, it will return the normal title.
    // *
    // * @return The condensed title, if it exists.
    // *         Otherwise the normal title.
    // */
    //getTitleCondensed():string ;

    /**
     * Change the icon associated with this item. This icon will not always be
     * shown, so the title should be sufficient in describing this item. See
     * {@link Menu} for the menu types that support icons.
     * 
     * @param icon The new icon (as a Drawable) to be displayed.
     * @return This Item so additional setters can be called.
     */
    setIcon(icon:Drawable):MenuItem {
        this.mIconDrawable = icon;
        return this;
    }

    ///**
    // * Change the icon associated with this item. This icon will not always be
    // * shown, so the title should be sufficient in describing this item. See
    // * {@link Menu} for the menu types that support icons.
    // * <p>
    // * This method will set the resource ID of the icon which will be used to
    // * lazily get the Drawable when this item is being shown.
    // *
    // * @param iconRes The new icon (as a resource ID) to be displayed.
    // * @return This Item so additional setters can be called.
    // */
    //setIcon(iconRes:number):MenuItem ;

    /**
     * Returns the icon for this item as a Drawable (getting it from resources if it hasn't been
     * loaded before).
     * 
     * @return The icon as a Drawable.
     */
    getIcon():Drawable {
        return this.mIconDrawable;
    }

    /**
     * Change the Intent associated with this item.  By default there is no
     * Intent associated with a menu item.  If you set one, and nothing
     * else handles the item, then the default behavior will be to call
     * {@link android.content.Context#startActivity} with the given Intent.
     *
     * <p>Note that setIntent() can not be used with the versions of
     * {@link Menu#add} that take a Runnable, because {@link Runnable#run}
     * does not return a value so there is no way to tell if it handled the
     * item.  In this case it is assumed that the Runnable always handles
     * the item, and the intent will never be started.
     *
     * @see #getIntent
     * @param intent The Intent to associated with the item.  This Intent
     *               object is <em>not</em> copied, so be careful not to
     *               modify it later.
     * @return This Item so additional setters can be called.
     */
    setIntent(intent:Intent):MenuItem {
        this.mIntent = intent;
        return this;
    }

    /**
     * Return the Intent associated with this item.  This returns a
     * reference to the Intent which you can change as desired to modify
     * what the Item is holding.
     *
     * @see #setIntent
     * @return Returns the last value supplied to {@link #setIntent}, or
     *         null.
     */
    getIntent():Intent {
        return this.mIntent;
    }
    //
    ///**
    // * Change both the numeric and alphabetic shortcut associated with this
    // * item. Note that the shortcut will be triggered when the key that
    // * generates the given character is pressed alone or along with with the alt
    // * key. Also note that case is not significant and that alphabetic shortcut
    // * characters will be displayed in lower case.
    // * <p>
    // * See {@link Menu} for the menu types that support shortcuts.
    // *
    // * @param numericChar The numeric shortcut key. This is the shortcut when
    // *        using a numeric (e.g., 12-key) keyboard.
    // * @param alphaChar The alphabetic shortcut key. This is the shortcut when
    // *        using a keyboard with alphabetic keys.
    // * @return This Item so additional setters can be called.
    // */
    //setShortcut(numericChar:string, alphaChar:string):MenuItem ;
    //
    ///**
    // * Change the numeric shortcut associated with this item.
    // * <p>
    // * See {@link Menu} for the menu types that support shortcuts.
    // *
    // * @param numericChar The numeric shortcut key.  This is the shortcut when
    // *                 using a 12-key (numeric) keyboard.
    // * @return This Item so additional setters can be called.
    // */
    //setNumericShortcut(numericChar:string):MenuItem ;
    //
    ///**
    // * Return the char for this menu item's numeric (12-key) shortcut.
    // *
    // * @return Numeric character to use as a shortcut.
    // */
    //getNumericShortcut():string ;
    //
    ///**
    // * Change the alphabetic shortcut associated with this item. The shortcut
    // * will be triggered when the key that generates the given character is
    // * pressed alone or along with with the alt key. Case is not significant and
    // * shortcut characters will be displayed in lower case. Note that menu items
    // * with the characters '\b' or '\n' as shortcuts will get triggered by the
    // * Delete key or Carriage Return key, respectively.
    // * <p>
    // * See {@link Menu} for the menu types that support shortcuts.
    // *
    // * @param alphaChar The alphabetic shortcut key. This is the shortcut when
    // *        using a keyboard with alphabetic keys.
    // * @return This Item so additional setters can be called.
    // */
    //setAlphabeticShortcut(alphaChar:string):MenuItem ;
    //
    ///**
    // * Return the char for this menu item's alphabetic shortcut.
    // *
    // * @return Alphabetic character to use as a shortcut.
    // */
    //getAlphabeticShortcut():string ;
    //
    ///**
    // * Control whether this item can display a check mark. Setting this does
    // * not actually display a check mark (see {@link #setChecked} for that);
    // * rather, it ensures there is room in the item in which to display a
    // * check mark.
    // * <p>
    // * See {@link Menu} for the menu types that support check marks.
    // *
    // * @param checkable Set to true to allow a check mark, false to
    // *            disallow. The default is false.
    // * @see #setChecked
    // * @see #isCheckable
    // * @see Menu#setGroupCheckable
    // * @return This Item so additional setters can be called.
    // */
    //setCheckable(checkable:boolean):MenuItem ;
    //
    ///**
    // * Return whether the item can currently display a check mark.
    // *
    // * @return If a check mark can be displayed, returns true.
    // *
    // * @see #setCheckable
    // */
    //isCheckable():boolean ;
    //
    ///**
    // * Control whether this item is shown with a check mark.  Note that you
    // * must first have enabled checking with {@link #setCheckable} or else
    // * the check mark will not appear.  If this item is a member of a group that contains
    // * mutually-exclusive items (set via {@link Menu#setGroupCheckable(int, boolean, boolean)},
    // * the other items in the group will be unchecked.
    // * <p>
    // * See {@link Menu} for the menu types that support check marks.
    // *
    // * @see #setCheckable
    // * @see #isChecked
    // * @see Menu#setGroupCheckable
    // * @param checked Set to true to display a check mark, false to hide
    // *                it.  The default value is false.
    // * @return This Item so additional setters can be called.
    // */
    //setChecked(checked:boolean):MenuItem ;
    //
    ///**
    // * Return whether the item is currently displaying a check mark.
    // *
    // * @return If a check mark is displayed, returns true.
    // *
    // * @see #setChecked
    // */
    //isChecked():boolean ;

    /**
     * Sets the visibility of the menu item. Even if a menu item is not visible,
     * it may still be invoked via its shortcut (to completely disable an item,
     * set it to invisible and {@link #setEnabled(boolean) disabled}).
     * 
     * @param visible If true then the item will be visible; if false it is
     *        hidden.
     * @return This Item so additional setters can be called.
     */
    setVisible(visible:boolean):MenuItem {
        this.mVisible = visible;
        return this;
    }

    /**
     * Return the visibility of the menu item.
     *
     * @return If true the item is visible; else it is hidden.
     */
    isVisible():boolean {
        return this.mVisible;
    }

    /**
     * Sets whether the menu item is enabled. Disabling a menu item will not
     * allow it to be invoked via its shortcut. The menu item will still be
     * visible.
     * 
     * @param enabled If true then the item will be invokable; if false it is
     *        won't be invokable.
     * @return This Item so additional setters can be called.
     */
    setEnabled(enabled:boolean):MenuItem {
        this.mEnable = enabled;
        return this;
    }

    /**
     * Return the enabled state of the menu item.
     *
     * @return If true the item is enabled and hence invokable; else it is not.
     */
    isEnabled():boolean {
        return this.mEnable;
    }

    ///**
    // * Check whether this item has an associated sub-menu.  I.e. it is a
    // * sub-menu of another menu.
    // *
    // * @return If true this item has a menu; else it is a
    // *         normal item.
    // */
    //hasSubMenu():boolean ;
    //
    ///**
    // * Get the sub-menu to be invoked when this item is selected, if it has
    // * one. See {@link #hasSubMenu()}.
    // *
    // * @return The associated menu if there is one, else null
    // */
    //getSubMenu():SubMenu ;

    /**
     * Set a custom listener for invocation of this menu item. In most
     * situations, it is more efficient and easier to use
     * {@link Activity#onOptionsItemSelected(MenuItem)} or
     * {@link Activity#onContextItemSelected(MenuItem)}.
     * 
     * @param menuItemClickListener The object to receive invokations.
     * @return This Item so additional setters can be called.
     * @see Activity#onOptionsItemSelected(MenuItem)
     * @see Activity#onContextItemSelected(MenuItem)
     */
    setOnMenuItemClickListener(menuItemClickListener:MenuItem.OnMenuItemClickListener):MenuItem {
        this.mClickListener = menuItemClickListener;
        return this;
    }


    /**
     * Set an action view for this menu item. An action view will be displayed in place
     * of an automatically generated menu item element in the UI when this item is shown
     * as an action within a parent.
     * <p>
     *   <strong>Note:</strong> Setting an action view overrides the action provider
     *           set via {@link #setActionProvider(ActionProvider)}.
     * </p>
     *
     * @param view View to use for presenting this item to the user.
     * @return This Item so additional setters can be called.
     *
     * @see #setShowAsAction(int)
     */
    setActionView(view:View):MenuItem {
        this.mActionView = view;
        return this;
    }

    /**
     * Returns the currently set action view for this menu item.
     *
     * @return This item's action view
     *
     * @see #setActionView(View)
     * @see #setShowAsAction(int)
     */
    getActionView():View {
        return this.mActionView;
    }


    /**
     * Invokes the item by calling various listeners or callbacks.
     *
     * @return true if the invocation was handled, false otherwise
     */
    invoke():boolean  {
        if (this.mClickListener != null && this.mClickListener.onMenuItemClick(this)) {
            return true;
        }
        if (this.mMenu.dispatchMenuItemSelected(this.mMenu.getRootMenu(), this)) {
            return true;
        }
        //if (this.mItemCallback != null) {
        //    this.mItemCallback.run();
        //    return true;
        //}
        if (this.mIntent != null) {
            try {
                (<android.app.Activity>this.mMenu.getContext()).startActivity(this.mIntent);
                return true;
            } catch (e){
                android.util.Log.e("MenuItem", "Can't find activity to handle intent; ignoring", e);
            }
        }
        //if (this.mActionProvider != null && this.mActionProvider.onPerformDefaultAction()) {
        //    return true;
        //}
        return false;
    }
}

export module MenuItem{
/**
     * Interface definition for a callback to be invoked when a menu item is
     * clicked.
     *
     * @see Activity#onContextItemSelected(MenuItem)
     * @see Activity#onOptionsItemSelected(MenuItem)
     */
export interface OnMenuItemClickListener {

    /**
         * Called when a menu item has been invoked.  This is the first code
         * that is executed; if it returns true, no other callbacks will be
         * executed.
         *
         * @param item The menu item that was invoked.
         *
         * @return Return true to consume this click and prevent others from
         *         executing.
         */
    onMenuItemClick(item:MenuItem):boolean ;
}
}

}