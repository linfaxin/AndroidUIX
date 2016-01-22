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

///<reference path="../../android/graphics/drawable/Drawable.ts"/>
///<reference path="../../android/view/Gravity.ts"/>
///<reference path="../../android/view/View.ts"/>
///<reference path="../../android/view/ViewGroup.ts"/>
///<reference path="../../android/view/Window.ts"/>
///<reference path="../../android/widget/SpinnerAdapter.ts"/>
///<reference path="../../android/widget/FrameLayout.ts"/>
///<reference path="../../android/widget/TextView.ts"/>
///<reference path="../../android/app/Activity.ts"/>
///<reference path="../../android/app/Application.ts"/>
///<reference path="../../android/R/attr.ts"/>
///<reference path="../../android/R/layout.ts"/>

module android.app {
import Drawable = android.graphics.drawable.Drawable;
import Gravity = android.view.Gravity;
import View = android.view.View;
import ViewGroup = android.view.ViewGroup;
import MarginLayoutParams = android.view.ViewGroup.MarginLayoutParams;
import Window = android.view.Window;
import SpinnerAdapter = android.widget.SpinnerAdapter;
import FrameLayout = android.widget.FrameLayout;
import TextView = android.widget.TextView;
import Activity = android.app.Activity;
import Application = android.app.Application;
/**
 * A window feature at the top of the activity that may display the activity title, navigation
 * modes, and other interactive items.
 * <p>Beginning with Android 3.0 (API level 11), the action bar appears at the top of an
 * activity's window when the activity uses the system's {@link
 * android.R.style#Theme_Holo Holo} theme (or one of its descendant themes), which is the default.
 * You may otherwise add the action bar by calling {@link
 * android.view.Window#requestFeature requestFeature(FEATURE_ACTION_BAR)} or by declaring it in a
 * custom theme with the {@link android.R.styleable#Theme_windowActionBar windowActionBar} property.
 * <p>By default, the action bar shows the application icon on
 * the left, followed by the activity title. If your activity has an options menu, you can make
 * select items accessible directly from the action bar as "action items". You can also
 * modify various characteristics of the action bar or remove it completely.</p>
 * <p>From your activity, you can retrieve an instance of {@link ActionBar} by calling {@link
 * android.app.Activity#getActionBar getActionBar()}.</p>
 * <p>In some cases, the action bar may be overlayed by another bar that enables contextual actions,
 * using an {@link android.view.ActionMode}. For example, when the user selects one or more items in
 * your activity, you can enable an action mode that offers actions specific to the selected
 * items, with a UI that temporarily replaces the action bar. Although the UI may occupy the
 * same space, the {@link android.view.ActionMode} APIs are distinct and independent from those for
 * {@link ActionBar}.
 * <div class="special reference">
 * <h3>Developer Guides</h3>
 * <p>For information about how to use the action bar, including how to add action items, navigation
 * modes and more, read the <a href="{@docRoot}guide/topics/ui/actionbar.html">Action
 * Bar</a> developer guide.</p>
 * </div>
 *
 * AndroidUI:
 * NOTE: ActionBar‘s style was not same as Android, title was move to center. No logo support
 */
export class ActionBar extends FrameLayout {

    ///**
    // * Standard navigation mode. Consists of either a logo or icon
    // * and title text with an optional subtitle. Clicking any of these elements
    // * will dispatch onOptionsItemSelected to the host Activity with
    // * a MenuItem with item ID android.R.id.home.
    // */
    //static NAVIGATION_MODE_STANDARD:number = 0;
    //
    ///**
    // * List navigation mode. Instead of static title text this mode
    // * presents a list menu for navigation within the activity.
    // * e.g. this might be presented to the user as a dropdown list.
    // */
    //static NAVIGATION_MODE_LIST:number = 1;
    //
    ///**
    // * Tab navigation mode. Instead of static title text this mode
    // * presents a series of tabs for navigation within the activity.
    // */
    //static NAVIGATION_MODE_TABS:number = 2;
    //
    ///**
    // * Use logo instead of icon if available. This flag will cause appropriate
    // * navigation modes to use a wider logo in place of the standard icon.
    // *
    // * @see #setDisplayOptions(int)
    // * @see #setDisplayOptions(int, int)
    // */
    //static DISPLAY_USE_LOGO:number = 0x1;
    //
    ///**
    // * Show 'home' elements in this action bar, leaving more space for other
    // * navigation elements. This includes logo and icon.
    // *
    // * @see #setDisplayOptions(int)
    // * @see #setDisplayOptions(int, int)
    // */
    //static DISPLAY_SHOW_HOME:number = 0x2;
    //
    ///**
    // * Display the 'home' element such that it appears as an 'up' affordance.
    // * e.g. show an arrow to the left indicating the action that will be taken.
    // *
    // * Set this flag if selecting the 'home' button in the action bar to return
    // * up by a single level in your UI rather than back to the top level or front page.
    // *
    // * <p>Setting this option will implicitly enable interaction with the home/up
    // * button. See {@link #setHomeButtonEnabled(boolean)}.
    // *
    // * @see #setDisplayOptions(int)
    // * @see #setDisplayOptions(int, int)
    // */
    //static DISPLAY_HOME_AS_UP:number = 0x4;
    //
    ///**
    // * Show the activity title and subtitle, if present.
    // *
    // * @see #setTitle(CharSequence)
    // * @see #setTitle(int)
    // * @see #setSubtitle(CharSequence)
    // * @see #setSubtitle(int)
    // * @see #setDisplayOptions(int)
    // * @see #setDisplayOptions(int, int)
    // */
    //static DISPLAY_SHOW_TITLE:number = 0x8;
    //
    ///**
    // * Show the custom view if one has been set.
    // * @see #setCustomView(View)
    // * @see #setDisplayOptions(int)
    // * @see #setDisplayOptions(int, int)
    // */
    //static DISPLAY_SHOW_CUSTOM:number = 0x10;
    //
    ///**
    // * Allow the title to wrap onto multiple lines if space is available
    // * @hide pending API approval
    // */
    //static DISPLAY_TITLE_MULTIPLE_LINES:number = 0x20;

    private mCenterLayout:ViewGroup;
    private mCustomView:View;
    private mTitleView:TextView;
    private mSubTitleView:TextView;
    private mActionLeft:TextView;
    private mActionRight:TextView;

    constructor(context:android.content.Context, bindElement?:HTMLElement, defStyle:any=android.R.attr.actionBarStyle) {
        super(context, bindElement, defStyle);
        context.getLayoutInflater().inflate(android.R.layout.action_bar, this);
        this.mCenterLayout = <ViewGroup>this.findViewById('action_bar_center_layout');
        this.mTitleView = <TextView>this.findViewById('action_bar_title');
        this.mSubTitleView = <TextView>this.findViewById('action_bar_sub_title');
        this.mActionLeft = <TextView>this.findViewById('action_bar_left');
        this.mActionRight = <TextView>this.findViewById('action_bar_right');

    }

//    /**
//     * Set the action bar into custom navigation mode, supplying a view
//     * for custom navigation.
//     *
//     * Custom navigation views appear between the application icon and
//     * any action buttons and may use any space available there. Common
//     * use cases for custom navigation views might include an auto-suggesting
//     * address bar for a browser or other navigation mechanisms that do not
//     * translate well to provided navigation modes.
//     *
//     * @param view Custom navigation view to place in the ActionBar.
//     */
//    abstract setCustomView(view:View):void ;

    /**
     * Set the action bar into custom navigation mode, supplying a view
     * for custom navigation.
     * 
     * <p>Custom navigation views appear between the application icon and
     * any action buttons and may use any space available there. Common
     * use cases for custom navigation views might include an auto-suggesting
     * address bar for a browser or other navigation mechanisms that do not
     * translate well to provided navigation modes.</p>
     *
     * <p>The display option {@link #DISPLAY_SHOW_CUSTOM} must be set for
     * the custom view to be displayed.</p>
     * 
     * @param view Custom navigation view to place in the ActionBar.
     * @param layoutParams How this custom view should layout in the bar.
     *
     * @see #setDisplayOptions(int, int)
     */
    setCustomView(view:View, layoutParams?:ViewGroup.MarginLayoutParams):void{
        this.mCenterLayout.removeAllViews();
        this.mCustomView = view;
        if(layoutParams) this.mCenterLayout.addView(view, layoutParams);
        else this.mCenterLayout.addView(view);

    }

    ///**
    // * Set the action bar into custom navigation mode, supplying a view
    // * for custom navigation.
    // *
    // * <p>Custom navigation views appear between the application icon and
    // * any action buttons and may use any space available there. Common
    // * use cases for custom navigation views might include an auto-suggesting
    // * address bar for a browser or other navigation mechanisms that do not
    // * translate well to provided navigation modes.</p>
    // *
    // * <p>The display option {@link #DISPLAY_SHOW_CUSTOM} must be set for
    // * the custom view to be displayed.</p>
    // *
    // * @param resId Resource ID of a layout to inflate into the ActionBar.
    // *
    // * @see #setDisplayOptions(int, int)
    // */
    //setCustomView(resId:number):void ;

//    /**
//     * Set the icon to display in the 'home' section of the action bar.
//     * The action bar will use an icon specified by its style or the
//     * activity icon by default.
//     *
//     * Whether the home section shows an icon or logo is controlled
//     * by the display option {@link #DISPLAY_USE_LOGO}.
//     *
//     * @param resId Resource ID of a drawable to show as an icon.
//     *
//     * @see #setDisplayUseLogoEnabled(boolean)
//     * @see #setDisplayShowHomeEnabled(boolean)
//     */
//    abstract
//setIcon(resId:number):void ;

    /**
     * Set the icon to display in the 'home' section of the action bar.
     * The action bar will use an icon specified by its style or the
     * activity icon by default.
     *
     * Whether the home section shows an icon or logo is controlled
     * by the display option {@link #DISPLAY_USE_LOGO}.
     *
     * @param icon Drawable to show as an icon.
     *
     * @see #setDisplayUseLogoEnabled(boolean)
     * @see #setDisplayShowHomeEnabled(boolean)
     */
    setIcon(icon:Drawable):void{
        icon.setBounds(0, 0, icon.getIntrinsicWidth(), icon.getIntrinsicHeight());
        let drawables = this.mTitleView.getCompoundDrawables();
        this.mTitleView.setCompoundDrawables(icon, drawables[1], drawables[2], drawables[3]);
    }

//    /**
//     * Set the logo to display in the 'home' section of the action bar.
//     * The action bar will use a logo specified by its style or the
//     * activity logo by default.
//     *
//     * Whether the home section shows an icon or logo is controlled
//     * by the display option {@link #DISPLAY_USE_LOGO}.
//     *
//     * @param resId Resource ID of a drawable to show as a logo.
//     *
//     * @see #setDisplayUseLogoEnabled(boolean)
//     * @see #setDisplayShowHomeEnabled(boolean)
//     */
//    abstract
//setLogo(resId:number):void ;

    /**
     * Set the logo to display in the 'home' section of the action bar.
     * The action bar will use a logo specified by its style or the
     * activity logo by default.
     *
     * Whether the home section shows an icon or logo is controlled
     * by the display option {@link #DISPLAY_USE_LOGO}.
     *
     * @param logo Drawable to show as a logo.
     *
     * @see #setDisplayUseLogoEnabled(boolean)
     * @see #setDisplayShowHomeEnabled(boolean)
     */
    setLogo(logo:Drawable):void{
        this.setIcon(logo);
    }

//    /**
//     * Set the adapter and navigation callback for list navigation mode.
//     *
//     * The supplied adapter will provide views for the expanded list as well as
//     * the currently selected item. (These may be displayed differently.)
//     *
//     * The supplied OnNavigationListener will alert the application when the user
//     * changes the current list selection.
//     *
//     * @param adapter An adapter that will provide views both to display
//     *                the current navigation selection and populate views
//     *                within the dropdown navigation menu.
//     * @param callback An OnNavigationListener that will receive events when the user
//     *                 selects a navigation item.
//     */
//    abstract
//setListNavigationCallbacks(adapter:SpinnerAdapter, callback:ActionBar.OnNavigationListener):void ;
//
//    /**
//     * Set the selected navigation item in list or tabbed navigation modes.
//     *
//     * @param position Position of the item to select.
//     */
//    abstract
//setSelectedNavigationItem(position:number):void ;
//
//    /**
//     * Get the position of the selected navigation item in list or tabbed navigation modes.
//     *
//     * @return Position of the selected item.
//     */
//    abstract
//getSelectedNavigationIndex():number ;
//
//    /**
//     * Get the number of navigation items present in the current navigation mode.
//     *
//     * @return Number of navigation items.
//     */
//    abstract
//getNavigationItemCount():number ;

    /**
     * Set the action bar's title. This will only be displayed if
     * {@link #DISPLAY_SHOW_TITLE} is set.
     *
     * @param title Title to set
     *
     * @see #setTitle(int)
     * @see #setDisplayOptions(int, int)
     */
    setTitle(title:string):void{
        this.mTitleView.setText(title);
    }

//    /**
//     * Set the action bar's title. This will only be displayed if
//     * {@link #DISPLAY_SHOW_TITLE} is set.
//     *
//     * @param resId Resource ID of title string to set
//     *
//     * @see #setTitle(CharSequence)
//     * @see #setDisplayOptions(int, int)
//     */
//    abstract
//setTitle(resId:number):void ;

    /**
     * Set the action bar's subtitle. This will only be displayed if
     * {@link #DISPLAY_SHOW_TITLE} is set. Set to null to disable the
     * subtitle entirely.
     *
     * @param subtitle Subtitle to set
     *
     * @see #setSubtitle(int)
     * @see #setDisplayOptions(int, int)
     */
    setSubtitle(subtitle:string):void {
        this.mSubTitleView.setText(subtitle);
        let empty = subtitle == null || subtitle.length == 0;
        this.mSubTitleView.setVisibility(empty ? View.GONE : View.VISIBLE);
    }

//    /**
//     * Set the action bar's subtitle. This will only be displayed if
//     * {@link #DISPLAY_SHOW_TITLE} is set.
//     *
//     * @param resId Resource ID of subtitle string to set
//     *
//     * @see #setSubtitle(CharSequence)
//     * @see #setDisplayOptions(int, int)
//     */
//    abstract
//setSubtitle(resId:number):void ;
//
//    /**
//     * Set display options. This changes all display option bits at once. To change
//     * a limited subset of display options, see {@link #setDisplayOptions(int, int)}.
//     *
//     * @param options A combination of the bits defined by the DISPLAY_ constants
//     *                defined in ActionBar.
//     */
//    abstract
//setDisplayOptions(options:number):void ;
//
//    /**
//     * Set selected display options. Only the options specified by mask will be changed.
//     * To change all display option bits at once, see {@link #setDisplayOptions(int)}.
//     *
//     * <p>Example: setDisplayOptions(0, DISPLAY_SHOW_HOME) will disable the
//     * {@link #DISPLAY_SHOW_HOME} option.
//     * setDisplayOptions(DISPLAY_SHOW_HOME, DISPLAY_SHOW_HOME | DISPLAY_USE_LOGO)
//     * will enable {@link #DISPLAY_SHOW_HOME} and disable {@link #DISPLAY_USE_LOGO}.
//     *
//     * @param options A combination of the bits defined by the DISPLAY_ constants
//     *                defined in ActionBar.
//     * @param mask A bit mask declaring which display options should be changed.
//     */
//    abstract
//setDisplayOptions(options:number, mask:number):void ;
//
//    /**
//     * Set whether to display the activity logo rather than the activity icon.
//     * A logo is often a wider, more detailed image.
//     *
//     * <p>To set several display options at once, see the setDisplayOptions methods.
//     *
//     * @param useLogo true to use the activity logo, false to use the activity icon.
//     *
//     * @see #setDisplayOptions(int)
//     * @see #setDisplayOptions(int, int)
//     */
//    abstract
//setDisplayUseLogoEnabled(useLogo:boolean):void ;
//
//    /**
//     * Set whether to include the application home affordance in the action bar.
//     * Home is presented as either an activity icon or logo.
//     *
//     * <p>To set several display options at once, see the setDisplayOptions methods.
//     *
//     * @param showHome true to show home, false otherwise.
//     *
//     * @see #setDisplayOptions(int)
//     * @see #setDisplayOptions(int, int)
//     */
//    abstract
//setDisplayShowHomeEnabled(showHome:boolean):void ;
//
//    /**
//     * Set whether home should be displayed as an "up" affordance.
//     * Set this to true if selecting "home" returns up by a single level in your UI
//     * rather than back to the top level or front page.
//     *
//     * <p>To set several display options at once, see the setDisplayOptions methods.
//     *
//     * @param showHomeAsUp true to show the user that selecting home will return one
//     *                     level up rather than to the top level of the app.
//     *
//     * @see #setDisplayOptions(int)
//     * @see #setDisplayOptions(int, int)
//     */
//    abstract
//setDisplayHomeAsUpEnabled(showHomeAsUp:boolean):void ;
//
//    /**
//     * Set whether an activity title/subtitle should be displayed.
//     *
//     * <p>To set several display options at once, see the setDisplayOptions methods.
//     *
//     * @param showTitle true to display a title/subtitle if present.
//     *
//     * @see #setDisplayOptions(int)
//     * @see #setDisplayOptions(int, int)
//     */
//    abstract
//setDisplayShowTitleEnabled(showTitle:boolean):void ;
//
//    /**
//     * Set whether a custom view should be displayed, if set.
//     *
//     * <p>To set several display options at once, see the setDisplayOptions methods.
//     *
//     * @param showCustom true if the currently set custom view should be displayed, false otherwise.
//     *
//     * @see #setDisplayOptions(int)
//     * @see #setDisplayOptions(int, int)
//     */
//    abstract
//setDisplayShowCustomEnabled(showCustom:boolean):void ;
//
//    /**
//     * Set the ActionBar's background. This will be used for the primary
//     * action bar.
//     *
//     * @param d Background drawable
//     * @see #setStackedBackgroundDrawable(Drawable)
//     * @see #setSplitBackgroundDrawable(Drawable)
//     */
//    setBackgroundDrawable(d:Drawable):void ;
//
//    /**
//     * Set the ActionBar's stacked background. This will appear
//     * in the second row/stacked bar on some devices and configurations.
//     *
//     * @param d Background drawable for the stacked row
//     */
//    setStackedBackgroundDrawable(d:Drawable):void  {
//    }
//
//    /**
//     * Set the ActionBar's split background. This will appear in
//     * the split action bar containing menu-provided action buttons
//     * on some devices and configurations.
//     * <p>You can enable split action bar with {@link android.R.attr#uiOptions}
//     *
//     * @param d Background drawable for the split bar
//     */
//    setSplitBackgroundDrawable(d:Drawable):void  {
//    }

    /**
     * @return The current custom view.
     */
    getCustomView():View{
        return this.mCustomView;
    }

    /**
     * Returns the current ActionBar title in standard mode.
     * Returns null if {@link #getNavigationMode()} would not return
     * {@link #NAVIGATION_MODE_STANDARD}. 
     *
     * @return The current ActionBar title or null.
     */
    getTitle():string{
        return this.mTitleView.getText().toString();
    }

    /**
     * Returns the current ActionBar subtitle in standard mode.
     * Returns null if {@link #getNavigationMode()} would not return
     * {@link #NAVIGATION_MODE_STANDARD}. 
     *
     * @return The current ActionBar subtitle or null.
     */
    getSubtitle():string{
        return this.mSubTitleView.getText().toString();
    }

//    /**
//     * Returns the current navigation mode. The result will be one of:
//     * <ul>
//     * <li>{@link #NAVIGATION_MODE_STANDARD}</li>
//     * <li>{@link #NAVIGATION_MODE_LIST}</li>
//     * <li>{@link #NAVIGATION_MODE_TABS}</li>
//     * </ul>
//     *
//     * @return The current navigation mode.
//     */
//    abstract
//getNavigationMode():number ;
//
//    /**
//     * Set the current navigation mode.
//     *
//     * @param mode The new mode to set.
//     * @see #NAVIGATION_MODE_STANDARD
//     * @see #NAVIGATION_MODE_LIST
//     * @see #NAVIGATION_MODE_TABS
//     */
//    abstract
//setNavigationMode(mode:number):void ;
//
//    /**
//     * @return The current set of display options.
//     */
//    abstract
//getDisplayOptions():number ;
//
//    /**
//     * Create and return a new {@link Tab}.
//     * This tab will not be included in the action bar until it is added.
//     *
//     * <p>Very often tabs will be used to switch between {@link Fragment}
//     * objects.  Here is a typical implementation of such tabs:</p>
//     *
//     * {@sample development/samples/ApiDemos/src/com/example/android/apis/app/FragmentTabs.java
//     *      complete}
//     *
//     * @return A new Tab
//     *
//     * @see #addTab(Tab)
//     */
//    abstract
//newTab():ActionBar.Tab ;
//
//    /**
//     * Add a tab for use in tabbed navigation mode. The tab will be added at the end of the list.
//     * If this is the first tab to be added it will become the selected tab.
//     *
//     * @param tab Tab to add
//     */
//    abstract
//addTab(tab:ActionBar.Tab):void ;
//
//    /**
//     * Add a tab for use in tabbed navigation mode. The tab will be added at the end of the list.
//     *
//     * @param tab Tab to add
//     * @param setSelected True if the added tab should become the selected tab.
//     */
//    abstract
//addTab(tab:ActionBar.Tab, setSelected:boolean):void ;
//
//    /**
//     * Add a tab for use in tabbed navigation mode. The tab will be inserted at
//     * <code>position</code>. If this is the first tab to be added it will become
//     * the selected tab.
//     *
//     * @param tab The tab to add
//     * @param position The new position of the tab
//     */
//    abstract
//addTab(tab:ActionBar.Tab, position:number):void ;
//
//    /**
//     * Add a tab for use in tabbed navigation mode. The tab will be insterted at
//     * <code>position</code>.
//     *
//     * @param tab The tab to add
//     * @param position The new position of the tab
//     * @param setSelected True if the added tab should become the selected tab.
//     */
//    abstract
//addTab(tab:ActionBar.Tab, position:number, setSelected:boolean):void ;
//
//    /**
//     * Remove a tab from the action bar. If the removed tab was selected it will be deselected
//     * and another tab will be selected if present.
//     *
//     * @param tab The tab to remove
//     */
//    abstract
//removeTab(tab:ActionBar.Tab):void ;
//
//    /**
//     * Remove a tab from the action bar. If the removed tab was selected it will be deselected
//     * and another tab will be selected if present.
//     *
//     * @param position Position of the tab to remove
//     */
//    abstract
//removeTabAt(position:number):void ;
//
//    /**
//     * Remove all tabs from the action bar and deselect the current tab.
//     */
//    abstract
//removeAllTabs():void ;
//
//    /**
//     * Select the specified tab. If it is not a child of this action bar it will be added.
//     *
//     * <p>Note: If you want to select by index, use {@link #setSelectedNavigationItem(int)}.</p>
//     *
//     * @param tab Tab to select
//     */
//    abstract
//selectTab(tab:ActionBar.Tab):void ;
//
//    /**
//     * Returns the currently selected tab if in tabbed navigation mode and there is at least
//     * one tab present.
//     *
//     * @return The currently selected tab or null
//     */
//    abstract
//getSelectedTab():ActionBar.Tab ;
//
//    /**
//     * Returns the tab at the specified index.
//     *
//     * @param index Index value in the range 0-get
//     * @return
//     */
//    abstract
//getTabAt(index:number):ActionBar.Tab ;
//
//    /**
//     * Returns the number of tabs currently registered with the action bar.
//     * @return Tab count
//     */
//    abstract
//getTabCount():number ;
//
//    /**
//     * Retrieve the current height of the ActionBar.
//     *
//     * @return The ActionBar's height
//     */
//    abstract
//getHeight():number ;

    /**
     * Show the ActionBar if it is not currently showing.
     * If the window hosting the ActionBar does not have the feature
     * {@link Window#FEATURE_ACTION_BAR_OVERLAY} it will resize application
     * content to fit the new space available.
     *
     * <p>If you are hiding the ActionBar through
     * {@link View#SYSTEM_UI_FLAG_FULLSCREEN View.SYSTEM_UI_FLAG_FULLSCREEN},
     * you should not call this function directly.
     */
    show():void {
        this.setVisibility(View.VISIBLE);
    }

    /**
     * Hide the ActionBar if it is currently showing.
     * If the window hosting the ActionBar does not have the feature
     * {@link Window#FEATURE_ACTION_BAR_OVERLAY} it will resize application
     * content to fit the new space available.
     *
     * <p>Instead of calling this function directly, you can also cause an
     * ActionBar using the overlay feature to hide through
     * {@link View#SYSTEM_UI_FLAG_FULLSCREEN View.SYSTEM_UI_FLAG_FULLSCREEN}.
     * Hiding the ActionBar through this system UI flag allows you to more
     * seamlessly hide it in conjunction with other screen decorations.
     */
    hide():void {
        this.setVisibility(View.GONE);
    }

    /**
     * @return <code>true</code> if the ActionBar is showing, <code>false</code> otherwise.
     */
    isShowing():boolean{
        return this.isShown();
    }

//    /**
//     * Add a listener that will respond to menu visibility change events.
//     *
//     * @param listener The new listener to add
//     */
//    abstract
//addOnMenuVisibilityListener(listener:ActionBar.OnMenuVisibilityListener):void ;
//
//    /**
//     * Remove a menu visibility listener. This listener will no longer receive menu
//     * visibility change events.
//     *
//     * @param listener A listener to remove that was previously added
//     */
//    abstract
//removeOnMenuVisibilityListener(listener:ActionBar.OnMenuVisibilityListener):void ;
//
//    /**
//     * Enable or disable the "home" button in the corner of the action bar. (Note that this
//     * is the application home/up affordance on the action bar, not the systemwide home
//     * button.)
//     *
//     * <p>This defaults to true for packages targeting &lt; API 14. For packages targeting
//     * API 14 or greater, the application should call this method to enable interaction
//     * with the home/up affordance.
//     *
//     * <p>Setting the {@link #DISPLAY_HOME_AS_UP} display option will automatically enable
//     * the home button.
//     *
//     * @param enabled true to enable the home button, false to disable the home button.
//     */
//    setHomeButtonEnabled(enabled:boolean):void  {
//    }
//
//    /**
//     * Returns a {@link Context} with an appropriate theme for creating views that
//     * will appear in the action bar. If you are inflating or instantiating custom views
//     * that will appear in an action bar, you should use the Context returned by this method.
//     * (This includes adapters used for list navigation mode.)
//     * This will ensure that views contrast properly against the action bar.
//     *
//     * @return A themed Context for creating views
//     */
//    getThemedContext():Context  {
//        return null;
//    }
//
//    /**
//     * Returns true if the Title field has been truncated during layout for lack
//     * of available space.
//     *
//     * @return true if the Title field has been truncated
//     * @hide pending API approval
//     */
//    isTitleTruncated():boolean  {
//        return false;
//    }
//
//    /**
//     * Set an alternate drawable to display next to the icon/logo/title
//     * when {@link #DISPLAY_HOME_AS_UP} is enabled. This can be useful if you are using
//     * this mode to display an alternate selection for up navigation, such as a sliding drawer.
//     *
//     * <p>If you pass <code>null</code> to this method, the default drawable from the theme
//     * will be used.</p>
//     *
//     * <p>If you implement alternate or intermediate behavior around Up, you should also
//     * call {@link #setHomeActionContentDescription(int) setHomeActionContentDescription()}
//     * to provide a correct description of the action for accessibility support.</p>
//     *
//     * @param indicator A drawable to use for the up indicator, or null to use the theme's default
//     *
//     * @see #setDisplayOptions(int, int)
//     * @see #setDisplayHomeAsUpEnabled(boolean)
//     * @see #setHomeActionContentDescription(int)
//     */
//    setHomeAsUpIndicator(indicator:Drawable):void  {
//    }
//
//    /**
//     * Set an alternate drawable to display next to the icon/logo/title
//     * when {@link #DISPLAY_HOME_AS_UP} is enabled. This can be useful if you are using
//     * this mode to display an alternate selection for up navigation, such as a sliding drawer.
//     *
//     * <p>If you pass <code>0</code> to this method, the default drawable from the theme
//     * will be used.</p>
//     *
//     * <p>If you implement alternate or intermediate behavior around Up, you should also
//     * call {@link #setHomeActionContentDescription(int) setHomeActionContentDescription()}
//     * to provide a correct description of the action for accessibility support.</p>
//     *
//     * @param resId Resource ID of a drawable to use for the up indicator, or null
//     *              to use the theme's default
//     *
//     * @see #setDisplayOptions(int, int)
//     * @see #setDisplayHomeAsUpEnabled(boolean)
//     * @see #setHomeActionContentDescription(int)
//     */
//    setHomeAsUpIndicator(resId:number):void  {
//    }
//
//    /**
//     * Set an alternate description for the Home/Up action, when enabled.
//     *
//     * <p>This description is commonly used for accessibility/screen readers when
//     * the Home action is enabled. (See {@link #setDisplayHomeAsUpEnabled(boolean)}.)
//     * Examples of this are, "Navigate Home" or "Navigate Up" depending on the
//     * {@link #DISPLAY_HOME_AS_UP} display option. If you have changed the home-as-up
//     * indicator using {@link #setHomeAsUpIndicator(int)} to indicate more specific
//     * functionality such as a sliding drawer, you should also set this to accurately
//     * describe the action.</p>
//     *
//     * <p>Setting this to <code>null</code> will use the system default description.</p>
//     *
//     * @param description New description for the Home action when enabled
//     * @see #setHomeAsUpIndicator(int)
//     * @see #setHomeAsUpIndicator(android.graphics.drawable.Drawable)
//     */
//    setHomeActionContentDescription(description:string):void  {
//    }
//
//    /**
//     * Set an alternate description for the Home/Up action, when enabled.
//     *
//     * <p>This description is commonly used for accessibility/screen readers when
//     * the Home action is enabled. (See {@link #setDisplayHomeAsUpEnabled(boolean)}.)
//     * Examples of this are, "Navigate Home" or "Navigate Up" depending on the
//     * {@link #DISPLAY_HOME_AS_UP} display option. If you have changed the home-as-up
//     * indicator using {@link #setHomeAsUpIndicator(int)} to indicate more specific
//     * functionality such as a sliding drawer, you should also set this to accurately
//     * describe the action.</p>
//     *
//     * <p>Setting this to <code>0</code> will use the system default description.</p>
//     *
//     * @param resId Resource ID of a string to use as the new description
//     *              for the Home action when enabled
//     * @see #setHomeAsUpIndicator(int)
//     * @see #setHomeAsUpIndicator(android.graphics.drawable.Drawable)
//     */
//    setHomeActionContentDescription(resId:number):void  {
//    }

        //androidui add.
        setActionLeft(name:string, icon:Drawable, listener:View.OnClickListener):void {
            this.mActionLeft.setText(name);
            this.mActionLeft.setVisibility(View.VISIBLE);
            let drawables = this.mActionLeft.getCompoundDrawables();
            icon.setBounds(0, 0, icon.getIntrinsicWidth(), icon.getIntrinsicHeight());
            this.mActionLeft.setCompoundDrawables(icon, drawables[1], drawables[2], drawables[3]);
            this.mActionLeft.setOnClickListener(listener);
        }
        hideActionLeft():void {
            this.mActionLeft.setVisibility(View.GONE);
        }

        setActionRight(name:string, icon:Drawable, listener:View.OnClickListener):void {
            this.mActionRight.setText(name);
            this.mActionRight.setVisibility(View.VISIBLE);
            let drawables = this.mActionRight.getCompoundDrawables();
            icon.setBounds(0, 0, icon.getIntrinsicWidth(), icon.getIntrinsicHeight());
            this.mActionRight.setCompoundDrawables(drawables[0], drawables[1], icon, drawables[3]);
            this.mActionRight.setOnClickListener(listener);
        }
        hideActionRight():void {
            this.mActionRight.setVisibility(View.GONE);
        }
}

export module ActionBar{
///**
//     * Listener interface for ActionBar navigation events.
//     */
//export interface OnNavigationListener {
//
//    /**
//         * This method is called whenever a navigation item in your action bar
//         * is selected.
//         *
//         * @param itemPosition Position of the item clicked.
//         * @param itemId ID of the item clicked.
//         * @return True if the event was handled, false otherwise.
//         */
//    onNavigationItemSelected(itemPosition:number, itemId:number):boolean ;
//}
///**
//     * Listener for receiving events when action bar menus are shown or hidden.
//     */
//export interface OnMenuVisibilityListener {
//
//    /**
//         * Called when an action bar menu is shown or hidden. Applications may want to use
//         * this to tune auto-hiding behavior for the action bar or pause/resume video playback,
//         * gameplay, or other activity within the main content area.
//         *
//         * @param isVisible True if an action bar menu is now visible, false if no action bar
//         *                  menus are visible.
//         */
//    onMenuVisibilityChanged(isVisible:boolean):void ;
//}
///**
//     * A tab in the action bar.
//     *
//     * <p>Tabs manage the hiding and showing of {@link Fragment}s.
//     */
//export abstract
//
//class Tab {
//
//    /**
//         * An invalid position for a tab.
//         *
//         * @see #getPosition()
//         */
//    static INVALID_POSITION:number = -1;
//
//    /**
//         * Return the current position of this tab in the action bar.
//         *
//         * @return Current position, or {@link #INVALID_POSITION} if this tab is not currently in
//         *         the action bar.
//         */
//    abstract
//getPosition():number ;
//
//    /**
//         * Return the icon associated with this tab.
//         *
//         * @return The tab's icon
//         */
//    abstract
//getIcon():Drawable ;
//
//    /**
//         * Return the text of this tab.
//         *
//         * @return The tab's text
//         */
//    abstract
//getText():string ;
//
//    /**
//         * Set the icon displayed on this tab.
//         *
//         * @param icon The drawable to use as an icon
//         * @return The current instance for call chaining
//         */
//    abstract
//setIcon(icon:Drawable):Tab ;
//
//    /**
//         * Set the icon displayed on this tab.
//         *
//         * @param resId Resource ID referring to the drawable to use as an icon
//         * @return The current instance for call chaining
//         */
//    abstract
//setIcon(resId:number):Tab ;
//
//    /**
//         * Set the text displayed on this tab. Text may be truncated if there is not
//         * room to display the entire string.
//         *
//         * @param text The text to display
//         * @return The current instance for call chaining
//         */
//    abstract
//setText(text:string):Tab ;
//
//    /**
//         * Set the text displayed on this tab. Text may be truncated if there is not
//         * room to display the entire string.
//         *
//         * @param resId A resource ID referring to the text that should be displayed
//         * @return The current instance for call chaining
//         */
//    abstract
//setText(resId:number):Tab ;
//
//    /**
//         * Set a custom view to be used for this tab. This overrides values set by
//         * {@link #setText(CharSequence)} and {@link #setIcon(Drawable)}.
//         *
//         * @param view Custom view to be used as a tab.
//         * @return The current instance for call chaining
//         */
//    abstract
//setCustomView(view:View):Tab ;
//
//    /**
//         * Set a custom view to be used for this tab. This overrides values set by
//         * {@link #setText(CharSequence)} and {@link #setIcon(Drawable)}.
//         *
//         * @param layoutResId A layout resource to inflate and use as a custom tab view
//         * @return The current instance for call chaining
//         */
//    abstract
//setCustomView(layoutResId:number):Tab ;
//
//    /**
//         * Retrieve a previously set custom view for this tab.
//         *
//         * @return The custom view set by {@link #setCustomView(View)}.
//         */
//    abstract
//getCustomView():View ;
//
//    /**
//         * Give this Tab an arbitrary object to hold for later use.
//         *
//         * @param obj Object to store
//         * @return The current instance for call chaining
//         */
//    abstract
//setTag(obj:any):Tab ;
//
//    /**
//         * @return This Tab's tag object.
//         */
//    abstract
//getTag():any ;
//
//    /**
//         * Set the {@link TabListener} that will handle switching to and from this tab.
//         * All tabs must have a TabListener set before being added to the ActionBar.
//         *
//         * @param listener Listener to handle tab selection events
//         * @return The current instance for call chaining
//         */
//    abstract
//setTabListener(listener:ActionBar.TabListener):Tab ;
//
//    /**
//         * Select this tab. Only valid if the tab has been added to the action bar.
//         */
//    abstract
//select():void ;
//
//    /**
//         * Set a description of this tab's content for use in accessibility support.
//         * If no content description is provided the title will be used.
//         *
//         * @param resId A resource ID referring to the description text
//         * @return The current instance for call chaining
//         * @see #setContentDescription(CharSequence)
//         * @see #getContentDescription()
//         */
//    abstract
//setContentDescription(resId:number):Tab ;
//
//    /**
//         * Set a description of this tab's content for use in accessibility support.
//         * If no content description is provided the title will be used.
//         *
//         * @param contentDesc Description of this tab's content
//         * @return The current instance for call chaining
//         * @see #setContentDescription(int)
//         * @see #getContentDescription()
//         */
//    abstract
//setContentDescription(contentDesc:string):Tab ;
//
//    /**
//         * Gets a brief description of this tab's content for use in accessibility support.
//         *
//         * @return Description of this tab's content
//         * @see #setContentDescription(CharSequence)
//         * @see #setContentDescription(int)
//         */
//    abstract
//getContentDescription():string ;
//}
///**
//     * Callback interface invoked when a tab is focused, unfocused, added, or removed.
//     */
//export interface TabListener {
//
//    /**
//         * Called when a tab enters the selected state.
//         *
//         * @param tab The tab that was selected
//         * @param ft A {@link FragmentTransaction} for queuing fragment operations to execute
//         *        during a tab switch. The previous tab's unselect and this tab's select will be
//         *        executed in a single transaction. This FragmentTransaction does not support
//         *        being added to the back stack.
//         */
//    onTabSelected(tab:ActionBar.Tab, ft:FragmentTransaction):void ;
//
//    /**
//         * Called when a tab exits the selected state.
//         *
//         * @param tab The tab that was unselected
//         * @param ft A {@link FragmentTransaction} for queuing fragment operations to execute
//         *        during a tab switch. This tab's unselect and the newly selected tab's select
//         *        will be executed in a single transaction. This FragmentTransaction does not
//         *        support being added to the back stack.
//         */
//    onTabUnselected(tab:ActionBar.Tab, ft:FragmentTransaction):void ;
//
//    /**
//         * Called when a tab that is already selected is chosen again by the user.
//         * Some applications may use this action to return to the top level of a category.
//         *
//         * @param tab The tab that was reselected.
//         * @param ft A {@link FragmentTransaction} for queuing fragment operations to execute
//         *        once this method returns. This FragmentTransaction does not support
//         *        being added to the back stack.
//         */
//    onTabReselected(tab:ActionBar.Tab, ft:FragmentTransaction):void ;
//}
///**
//     * Per-child layout information associated with action bar custom views.
//     *
//     * @attr ref android.R.styleable#ActionBar_LayoutParams_layout_gravity
//     */
//export class LayoutParams extends MarginLayoutParams {
//
//    /**
//         * Gravity for the view associated with these LayoutParams.
//         *
//         * @see android.view.Gravity
//         */
//    gravity:number = Gravity.NO_GRAVITY;
//
//    //constructor( c:Context, attrs:AttributeSet) {
//    //    super(c, attrs);
//    //    let a:TypedArray = c.obtainStyledAttributes(attrs, com.android.internal.R.styleable.ActionBar_LayoutParams);
//    //    gravity = a.getInt(com.android.internal.R.styleable.ActionBar_LayoutParams_layout_gravity, Gravity.NO_GRAVITY);
//    //    a.recycle();
//    //}
//
//    constructor( width:number, height:number) {
//        super(width, height);
//        this.gravity = Gravity.CENTER_VERTICAL | Gravity.START;
//    }
//
//    constructor( width:number, height:number, gravity:number) {
//        super(width, height);
//        this.gravity = gravity;
//    }
//
//    constructor( gravity:number) {
//        this(WRAP_CONTENT, MATCH_PARENT, gravity);
//    }
//
//    constructor( source:LayoutParams) {
//        super(source);
//        this.gravity = source.gravity;
//    }
//
//    constructor( source:ViewGroup.LayoutParams) {
//        super(source);
//    }
//}
}

}