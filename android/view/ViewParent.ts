/**
 * Created by linfaxin on 15/10/5.
 */
///<reference path="View.ts"/>
///<reference path="../graphics/Point.ts"/>
///<reference path="../graphics/Rect.ts"/>

module android.view{
    import View = android.view.View;
    import Rect = android.graphics.Rect;
    import Point = android.graphics.Point;
    /**
     * Defines the responsibilities for a class that will be a parent of a View.
     * This is the API that a view sees when it wants to interact with its parent.
     *
     */
    export interface ViewParent {
        /**
         * Called when something has changed which has invalidated the layout of a
         * child of this view parent. This will schedule a layout pass of the view
         * tree.
         */
        requestLayout()
        /**
         * Indicates whether layout was requested on this view parent.
         *
         * @return true if layout was requested, false otherwise
         */
        isLayoutRequested():boolean
        /**
         * Called when a child wants the view hierarchy to gather and report
         * transparent regions to the window compositor. Views that "punch" holes in
         * the view hierarchy, such as SurfaceView can use this API to improve
         * performance of the system. When no such a view is present in the
         * hierarchy, this optimization in unnecessary and might slightly reduce the
         * view hierarchy performance.
         *
         * @param child the view requesting the transparent region computation
         *
         */
        //requestTransparentRegion(child:View)
        /**
         * All or part of a child is dirty and needs to be redrawn.
         *
         * @param child The child which is dirty
         * @param r The area within the child that is invalid
         */
        invalidateChild(child:View, r:Rect)
        /**
         * All or part of a child is dirty and needs to be redrawn.
         *
         * <p>The location array is an array of two int values which respectively
         * define the left and the top position of the dirty child.</p>
         *
         * <p>This method must return the parent of this ViewParent if the specified
         * rectangle must be invalidated in the parent. If the specified rectangle
         * does not require invalidation in the parent or if the parent does not
         * exist, this method must return null.</p>
         *
         * <p>When this method returns a non-null value, the location array must
         * have been updated with the left and top coordinates of this ViewParent.</p>
         *
         * @param location An array of 2 ints containing the left and top
         * coordinates of the child to invalidate
         * @param r The area within the child that is invalid
         *
         * @return the parent of this ViewParent or null
         */
        invalidateChildInParent(location:Array<number>, r:Rect):ViewParent
        /**
         * Returns the parent if it exists, or null.
         *
         * @return a ViewParent or null if this ViewParent does not have a parent
         */
        getParent():ViewParent
        /**
         * Called when a child of this parent wants focus
         *
         * @param child The child of this ViewParent that wants focus. This view
         * will contain the focused view. It is not necessarily the view that
         * actually has focus.
         * @param focused The view that is a descendant of child that actually has
         * focus
         */
        requestChildFocus(child:View, focused:View)
        /**
         * Tell view hierarchy that the global view attributes need to be
         * re-evaluated.
         *
         * @param child View whose attributes have changed.
         */
        //recomputeViewAttributes(child:View)
        /**
         * Called when a child of this parent is giving up focus
         *
         * @param child The view that is giving up focus
         */
        clearChildFocus(child:View)
        /**
         * Compute the visible part of a rectangular region defined in terms of a child view's
         * coordinates.
         *
         * <p>Returns the clipped visible part of the rectangle <code>r</code>, defined in the
         * <code>child</code>'s local coordinate system. <code>r</code> is modified by this method to
         * contain the result, expressed in the global (root) coordinate system.</p>
         *
         * <p>The resulting rectangle is always axis aligned. If a rotation is applied to a node in the
         * View hierarchy, the result is the axis-aligned bounding box of the visible rectangle.</p>
         *
         * @param child A child View, whose rectangular visible region we want to compute
         * @param r The input rectangle, defined in the child coordinate system. Will be overwritten to
         * contain the resulting visible rectangle, expressed in global (root) coordinates
         * @param offset The input coordinates of a point, defined in the child coordinate system.
         * As with the <code>r</code> parameter, this will be overwritten to contain the global (root)
         * coordinates of that point.
         * A <code>null</code> value is valid (in case you are not interested in this result)
         * @return true if the resulting rectangle is not empty, false otherwise
         */
        getChildVisibleRect(child:View, r:Rect, offset:Point):boolean
        /**
         * Find the nearest view in the specified direction that wants to take focus
         *
         * @param v The view that currently has focus
         * @param direction One of FOCUS_UP, FOCUS_DOWN, FOCUS_LEFT, and FOCUS_RIGHT
         */
        focusSearch(v:View, direction:number):View
        /**
         * Change the z order of the child so it's on top of all other children.
         * This ordering change may affect layout, if this container
         * uses an order-dependent layout scheme (e.g., LinearLayout). Prior
         * to { android.os.Build.VERSION_CODES#KITKAT} this
         * method should be followed by calls to {@link #requestLayout()} and
         * {@link View#invalidate()} on this parent to force the parent to redraw
         * with the new child ordering.
         *
         * @param child The child to bring to the top of the z order
         */
        bringChildToFront(child:View)
        /**
         * Tells the parent that a new focusable view has become available. This is
         * to handle transitions from the case where there are no focusable views to
         * the case where the first focusable view appears.
         *
         * @param v The view that has become newly focusable
         */
        focusableViewAvailable(v:View)
        /**
         * This method is called on the parent when a child's drawable state
         * has changed.
         *
         * @param child The child whose drawable state has changed.
         */
        childDrawableStateChanged(child:View)
        /**
         * Called when a child does not want this parent and its ancestors to
         * intercept touch events with
         * {@link ViewGroup#onInterceptTouchEvent(MotionEvent)}.
         *
         * <p>This parent should pass this call onto its parents. This parent must obey
         * this request for the duration of the touch (that is, only clear the flag
         * after this parent has received an up or a cancel.</p>
         *
         * @param disallowIntercept True if the child does not want the parent to
         * intercept touch events.
         */
        requestDisallowInterceptTouchEvent(disallowIntercept:boolean)
        /**
         * Called when a child of this group wants a particular rectangle to be
         * positioned onto the screen. {@link ViewGroup}s overriding this can trust
         * that:
         * <ul>
         * <li>child will be a direct child of this group</li>
         * <li>rectangle will be in the child's coordinates</li>
         * </ul>
         *
         * <p>{@link ViewGroup}s overriding this should uphold the contract:</p>
         * <ul>
         * <li>nothing will change if the rectangle is already visible</li>
         * <li>the view port will be scrolled only just enough to make the
         * rectangle visible</li>
         * <ul>
         *
         * @param child The direct child making the request.
         * @param rectangle The rectangle in the child's coordinates the child
         * wishes to be on the screen.
         * @param immediate True to forbid animated or delayed scrolling,
         * false otherwise
         * @return Whether the group scrolled to handle the operation
         */
        //requestChildRectangleOnScreen(child:View, rectangle:Rect,
        //                                  immediate:boolean):boolean
        /**
         * Called when a child view now has or no longer is tracking transient state.
         *
         * <p>"Transient state" is any state that a View might hold that is not expected to
         * be reflected in the data model that the View currently presents. This state only
         * affects the presentation to the user within the View itself, such as the current
         * state of animations in progress or the state of a text selection operation.</p>
         *
         * <p>Transient state is useful for hinting to other components of the View system
         * that a particular view is tracking something complex but encapsulated.
         * A <code>ListView</code> for example may acknowledge that list item Views
         * with transient state should be preserved within their position or stable item ID
         * instead of treating that view as trivially replaceable by the backing adapter.
         * This allows adapter implementations to be simpler instead of needing to track
         * the state of item view animations in progress such that they could be restored
         * in the event of an unexpected recycling and rebinding of attached item views.</p>
         *
         * <p>This method is called on a parent view when a child view or a view within
         * its subtree begins or ends tracking of internal transient state.</p>
         *
         * @param child Child view whose state has changed
         * @param hasTransientState true if this child has transient state
         */
        childHasTransientStateChanged(child:View, hasTransientState:boolean)
        /**
         * Ask that a new dispatch of {@link View#fitSystemWindows(Rect)
* View.fitSystemWindows(Rect)} be performed.
         */
        //requestFitSystemWindows()
        /**
         * Tells if this view parent can resolve the layout direction.
         * See {@link View#setLayoutDirection(int)}
         *
         * @return True if this view parent can resolve the layout direction.
         */
        //canResolveLayoutDirection():boolean
        /**
         * Tells if this view parent layout direction is resolved.
         * See {@link View#setLayoutDirection(int)}
         *
         * @return True if this view parent layout direction is resolved.
         */
        //isLayoutDirectionResolved:boolean
        /**
         * Return this view parent layout direction. See {@link View#getLayoutDirection()}
         *
         * @return {@link View#LAYOUT_DIRECTION_RTL} if the layout direction is RTL or returns
         * {@link View#LAYOUT_DIRECTION_LTR} if the layout direction is not RTL.
         */
        //layoutDirection:number
        /**
         * Tells if this view parent can resolve the text direction.
         * See {@link View#setTextDirection(int)}
         *
         * @return True if this view parent can resolve the text direction.
         */
        //canResolveTextDirection():boolean
        /**
         * Tells if this view parent text direction is resolved.
         * See {@link View#setTextDirection(int)}
         *
         * @return True if this view parent text direction is resolved.
         */
        //isTextDirectionResolved:boolean
        /**
         * Return this view parent text direction. See {@link View#getTextDirection()}
         *
         * @return the resolved text direction. Returns one of:
         *
         * {@link View#TEXT_DIRECTION_FIRST_STRONG}
         * {@link View#TEXT_DIRECTION_ANY_RTL},
         * {@link View#TEXT_DIRECTION_LTR},
         * {@link View#TEXT_DIRECTION_RTL},
         * {@link View#TEXT_DIRECTION_LOCALE}
         */
        //textDirection:number
        /**
         * Tells if this view parent can resolve the text alignment.
         * See {@link View#setTextAlignment(int)}
         *
         * @return True if this view parent can resolve the text alignment.
         */
        //canResolveTextAlignment():boolean
        /**
         * Tells if this view parent text alignment is resolved.
         * See {@link View#setTextAlignment(int)}
         *
         * @return True if this view parent text alignment is resolved.
         */
        //isTextAlignmentResolved:boolean
        /**
         * Return this view parent text alignment. See {@link View#getTextAlignment()}
         *
         * @return the resolved text alignment. Returns one of:
         *
         * {@link View#TEXT_ALIGNMENT_GRAVITY},
         * {@link View#TEXT_ALIGNMENT_CENTER},
         * {@link View#TEXT_ALIGNMENT_TEXT_START},
         * {@link View#TEXT_ALIGNMENT_TEXT_END},
         * {@link View#TEXT_ALIGNMENT_VIEW_START},
         * {@link View#TEXT_ALIGNMENT_VIEW_END}
         */
        //textAlignment:number
    }
}