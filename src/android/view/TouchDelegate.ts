/**
 * Created by linfaxin on 15/10/16.
 */
///<reference path="View.ts"/>
///<reference path="../graphics/Rect.ts"/>
///<reference path="ViewConfiguration.ts"/>


module android.view{
    import Rect = android.graphics.Rect;
    export class TouchDelegate{
        private mDelegateView:View;
        private mBounds:Rect;
        private mSlopBounds:Rect;
        private mDelegateTargeted = false;
        private mSlop = 0;

        constructor(bounds:Rect, delegateView:View) {
            this.mBounds = bounds;

            this.mSlop = ViewConfiguration.get().getScaledTouchSlop();
            this.mSlopBounds = new Rect(bounds);
            this.mSlopBounds.inset(-this.mSlop, -this.mSlop);
            this.mDelegateView = delegateView;
        }

        onTouchEvent(event:MotionEvent) {
            let x = event.getX();
            let y = event.getY();
            let sendToDelegate = false;
            let hit = true;
            let handled = false;

            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    let bounds = this.mBounds;

                    if (bounds.contains(x, y)) {
                        this.mDelegateTargeted = true;
                        sendToDelegate = true;
                    }
                    break;
                case MotionEvent.ACTION_UP:
                case MotionEvent.ACTION_MOVE:
                    sendToDelegate = this.mDelegateTargeted;
                    if (sendToDelegate) {
                        let slopBounds = this.mSlopBounds;
                        if (!slopBounds.contains(x, y)) {
                            hit = false;
                        }
                    }
                    break;
                case MotionEvent.ACTION_CANCEL:
                    sendToDelegate = this.mDelegateTargeted;
                    this.mDelegateTargeted = false;
                    break;
            }
            if (sendToDelegate) {
                let delegateView = this.mDelegateView;

                if (hit) {
                    // Offset event coordinates to be inside the target view
                    event.setLocation(delegateView.getWidth() / 2, delegateView.getHeight() / 2);
                } else {
                    // Offset event coordinates to be outside the target view (in case it does
                    // something like tracking pressed state)
                    let slop = this.mSlop;
                    event.setLocation(-(slop * 2), -(slop * 2));
                }
                handled = delegateView.dispatchTouchEvent(event);
            }
            return handled;
        }
    }
}