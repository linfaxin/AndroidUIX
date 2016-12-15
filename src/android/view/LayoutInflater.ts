/*
 * Copyright (C) 2007 The Android Open Source Project
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

///<reference path="../content/Context.ts"/>
///<reference path="../../androidui/util/ClassFinder.ts"/>
///<reference path="../../androidui/widget/HtmlDataAdapter.ts"/>

module android.view{
    import Context = android.content.Context;
    import ClassFinder = androidui.util.ClassFinder;
    import HtmlDataAdapter = androidui.widget.HtmlDataAdapter;

    /**
     * Instantiates a layout XML file into its corresponding {@link android.view.View}
     * objects. It is never used directly. Instead, use
     * {@link android.app.Activity#getLayoutInflater()} or
     * {@link Context#getSystemService} to retrieve a standard LayoutInflater instance
     * that is already hooked up to the current context and correctly configured
     * for the device you are running on.  For example:
     *
     * <pre>LayoutInflater inflater = (LayoutInflater)context.getSystemService
     *      (Context.LAYOUT_INFLATER_SERVICE);</pre>
     *
     * <p>
     * To create a new LayoutInflater with an additional {@link Factory} for your
     * own views, you can use {@link #cloneInContext} to clone an existing
     * ViewFactory, and then call {@link #setFactory} on it to include your
     * Factory.
     *
     * <p>
     * For performance reasons, view inflation relies heavily on pre-processing of
     * XML files that is done at build time. Therefore, it is not currently possible
     * to use LayoutInflater with an XmlPullParser over a plain XML file at runtime;
     * it only works with an XmlPullParser returned from a compiled resource
     * (R.<em>something</em> file.)
     *
     * @see Context#getSystemService
     */
    export class LayoutInflater{
        //private static TAG_MERGE:string = "merge";
        //
        //private static TAG_INCLUDE:string = "include";
        //
        //private static TAG_1995:string = "blink";
        //
        //private static TAG_REQUEST_FOCUS:string = "requestFocus";

        protected mContext:Context;

        /**
         * Obtains the LayoutInflater from the given context.
         */
        static from(context:Context):LayoutInflater  {
            return context.getLayoutInflater();
        }

        constructor( context:Context) {
            this.mContext = context;
        }

        /**
         * Return the context we are running in, for access to resources, class
         * loader, etc.
         */
        getContext():Context  {
            return this.mContext;
        }


        /**
         * Inflate a new view hierarchy from the specified XML node. Throws
         * {@link InflateException} if there is an error.
         * <p>
         * <em><strong>Important</strong></em>&nbsp;&nbsp;&nbsp;For performance
         * reasons, view inflation relies heavily on pre-processing of XML files
         * that is done at build time. Therefore, it is not currently possible to
         * use LayoutInflater with an XmlPullParser over a plain XML file at runtime.
         *
         * @param layout XML dom node containing the description of the view
         *        hierarchy.
         * @param viewParent Optional view to be the parent of the generated hierarchy (if
         *        <em>attachToRoot</em> is true), or else simply an object that
         *        provides a set of LayoutParams values for root of the returned
         *        hierarchy (if <em>attachToRoot</em> is false.)
         * @param attachToRoot Whether the inflated hierarchy should be attached to
         *        the root parameter? If false, root is only used to create the
         *        correct subclass of LayoutParams for the root view in the XML.
         * @return The root View of the inflated hierarchy. If root was supplied and
         *         attachToRoot is true, this is root; otherwise it is the root of
         *         the inflated XML file.
         */
        inflate(layout:HTMLElement|string, viewParent?:ViewGroup, attachToRoot = (viewParent != null)):View  {
            let domtree:HTMLElement = layout instanceof HTMLElement ? layout : this.mContext.getResources().getLayout(<string>layout);
            if(!domtree){
                console.error('not find layout: '+layout);
                return null;
            }
            let className = domtree.tagName;
            if(className.startsWith('ANDROID-')){
                className = className.substring('ANDROID-'.length);
            }

            if(className === 'LAYOUT'){// android-layout defined in resources tag
                domtree = <HTMLElement>domtree.firstElementChild;
            }


            if(className === 'INCLUDE'){
                let refLayoutId = domtree.getAttribute('layout');//@layout/xxx
                if(!refLayoutId) return null;
                let refEle = this.mContext.getResources().getLayout(refLayoutId);
                //merge attr
                for(let attr of Array.from(domtree.attributes)){
                    let name = attr.name;
                    if(name === 'layout') continue;
                    refEle.setAttribute(name, attr.value);
                }
                return this.inflate(refEle, viewParent);

            }else if(className === 'MERGE'){
                if(!viewParent) throw Error('merge tag need ViewParent');
                Array.from(domtree.children).forEach((item)=>{
                    if(item instanceof HTMLElement){
                        this.inflate(item, viewParent);
                    }
                });
                return viewParent;

            }else if(className === 'VIEW'){
                let overrideClass = domtree.className || domtree.getAttribute('android:class');
                if(overrideClass) className = overrideClass;
            }

            let rootViewClass = ClassFinder.findViewClass(className);
            if(!rootViewClass){
                return null;
            }

            let children = Array.from(domtree.children);//children may change when new the view
            //parse default style
            let defStyle;
            let styleAttrValue = domtree.getAttribute('style');//@android:attr/textView
            if(styleAttrValue){
                defStyle = this.mContext.getResources().getDefStyle(styleAttrValue);
            }

            let rootView:View;
            if(defStyle) rootView = new rootViewClass(this.mContext, domtree, defStyle);
            else rootView = new rootViewClass(this.mContext, domtree);

            // androidui add: support for HtmlDataAdapter
            if(rootView['onInflateAdapter']){//inflate a adapter.
                (<HtmlDataAdapter><any>rootView).onInflateAdapter(domtree, this.mContext, viewParent);
                domtree.parentNode.removeChild(domtree);
            }
            if(!(rootView instanceof View)){//maybe a adapter
                return rootView;
            }

            let params;
            if(viewParent){
                params = viewParent.generateLayoutParamsFromAttr(domtree);
                rootView.setLayoutParams(params);
            }

            //parse children
            if(rootView instanceof ViewGroup){
                let parent = <ViewGroup><any>rootView;
                children.forEach((item)=>{
                    if(item instanceof HTMLElement){
                        this.inflate(item, parent);
                    }
                });
            }

            rootView.onFinishInflate();
            if(attachToRoot && viewParent) {
                if (params) {
                    viewParent.addView(rootView, params);
                } else {
                    viewParent.addView(rootView);
                }
            }

            return rootView;
        }


    }
}