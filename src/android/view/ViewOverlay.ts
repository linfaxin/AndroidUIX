/*
 * Copyright (C) 2006 The Android Open Source Project
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

///<reference path="ViewGroup.ts"/>
///<reference path="ViewRootImpl.ts"/>
///<reference path="View.ts"/>
///<reference path="../graphics/drawable/Drawable.ts"/>

module android.view{
    import Drawable = android.graphics.drawable.Drawable;

    export class ViewOverlay{
        mOverlayViewGroup: ViewOverlay.OverlayViewGroup;
        constructor(hostView:View) {
            this.mOverlayViewGroup = new ViewOverlay.OverlayViewGroup(hostView);
        }
        getOverlayView():ViewGroup {
            return this.mOverlayViewGroup;
        }
        add(drawable:Drawable) {
            this.mOverlayViewGroup.add(drawable);
        }
        remove(drawable:Drawable) {
            //this.mOverlayViewGroup.remove(drawable);
        }
        clear() {
            this.mOverlayViewGroup.clear();
        }
        isEmpty() {
            return this.mOverlayViewGroup.isEmpty();
        }
    }
    export module ViewOverlay{
        export class OverlayViewGroup extends ViewGroup{
            mHostView:View;
            mDrawables:Set<Drawable>;

            constructor(hostView:View) {
                super(hostView.getContext());
                this.mHostView = hostView;
                this.mAttachInfo = hostView.mAttachInfo;
                this.mRight = hostView.getWidth();
                this.mBottom = hostView.getHeight();
            }

            private addDrawable(drawable:Drawable) {
                //if(!this.mDrawables) this.mDrawables = new Set<Drawable>();
                //
                //if (!this.mDrawables.has(drawable)) {
                //    // Make each drawable unique in the overlay; can't add it more than once
                //    this.mDrawables.add(drawable);
                //    this.invalidate(drawable.getBounds());
                //    drawable.setCallback(this);
                //}
            }
            addView(child:View) {
                //if (child.getParent() instanceof ViewGroup) {
                //    let parent = <ViewGroup>child.getParent();
                //    if (parent != mHostView && parent.getParent() != null &&
                //        parent.mAttachInfo != null) {
                //        // Moving to different container; figure out how to position child such that
                //        // it is in the same location on the screen
                //        let parentLocation = new int[2];
                //        let hostViewLocation = new int[2];
                //        parent.getLocationOnScreen(parentLocation);
                //        mHostView.getLocationOnScreen(hostViewLocation);
                //        child.offsetLeftAndRight(parentLocation[0] - hostViewLocation[0]);
                //        child.offsetTopAndBottom(parentLocation[1] - hostViewLocation[1]);
                //    }
                //    parent.removeView(child);
                //    // fail-safe if view is still attached for any reason
                //    if (child.getParent() != null) {
                //        child.mParent = null;
                //    }
                //}
                //super.addView(child);
            }
            add(drawable:Drawable);
            add(child:View);
            add(arg){
                if(arg instanceof Drawable) this.addDrawable(arg);
                else if(arg instanceof View) this.addView(arg);
            }


            //remove(drawable:Drawable);
            //remove(view:View);
            //remove(arg) {
            //    if(arg instanceof View){
            //        super.removeView(arg);
            //    }else if(arg instanceof Drawable){
            //        let drawable = arg;
            //        if (this.mDrawables != null) {
            //            this.mDrawables.remove(drawable);
            //            invalidate(drawable.getBounds());
            //            drawable.setCallback(null);
            //        }
            //    }
            //}
            clear() {
                //this.removeAllViews();
                //if (this.mDrawables != null) {
                //    this.mDrawables.clear();
                //}
            }
            isEmpty():boolean {
                return true;
                //if (this.getChildCount() == 0 &&
                //    (this.mDrawables == null || this.mDrawables.size() == 0)) {
                //    return true;
                //}
                //return false;
            }

            protected onLayout(changed:boolean, l:number, t:number, r:number, b:number) {

            }

            //TODO impl

        }
    }
}